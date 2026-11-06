import { SavedCustomerAddress, INITIAL_SAVED_ADDRESSES } from '../data/koreanAddresses';

const STORAGE_KEY = 'kpost_khmer_user_saved_only_v2';
const BROADCAST_CHANNEL_NAME = 'kpost_khmer_realtime_broadcast_v1';

export type RealtimeSyncStatus = 'connected' | 'connecting' | 'offline';

export interface RealtimeEventPayload {
  type: 'INIT' | 'SAVED' | 'DELETED' | 'PRINTED' | 'SCANNED' | 'FAVORITED';
  addresses?: SavedCustomerAddress[];
  address?: SavedCustomerAddress;
  id?: string;
  timestamp: string;
  deviceOrigin?: string;
}

class RealtimeAddressService {
  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(addresses: SavedCustomerAddress[], event?: RealtimeEventPayload) => void> = new Set();
  private statusListeners: Set<(status: RealtimeSyncStatus) => void> = new Set();
  private currentStatus: RealtimeSyncStatus = 'connecting';
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private localDeviceId: string;

  constructor() {
    this.localDeviceId = `dev-${Math.random().toString(36).slice(2, 9)}`;

    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
          this.broadcastChannel.onmessage = (event) => {
            if (event.data && event.data.deviceOrigin !== this.localDeviceId) {
              this.handleIncomingEvent(event.data);
            }
          };
        }
      } catch (err) {
        console.warn('BroadcastChannel not supported or error:', err);
      }

      // Also listen to storage events across tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) {
              this.notifyListeners(parsed, {
                type: 'SAVED',
                timestamp: new Date().toISOString(),
                addresses: parsed
              });
            }
          } catch {
            // ignore parse error
          }
        }
      });
    }
  }

  public init() {
    this.connectSSE();
  }

  private setStatus(status: RealtimeSyncStatus) {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach((listener) => listener(status));
    }
  }

  public onStatusChange(callback: (status: RealtimeSyncStatus) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.currentStatus);
    return () => this.statusListeners.delete(callback);
  }

  public subscribe(callback: (addresses: SavedCustomerAddress[], event?: RealtimeEventPayload) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(addresses: SavedCustomerAddress[], event?: RealtimeEventPayload) {
    // Save to local storage as local cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch {
      // ignore
    }
    this.listeners.forEach((listener) => listener(addresses, event));
  }

  private connectSSE() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {
        // ignore
      }
      this.eventSource = null;
    }

    this.setStatus('connecting');

    try {
      const sseUrl = `${window.location.origin}/api/addresses/stream`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.setStatus('connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: RealtimeEventPayload = JSON.parse(event.data);
          this.handleIncomingEvent(data);
        } catch {
          // ignore heartbeat / ping
        }
      };

      this.eventSource.onerror = () => {
        this.setStatus('offline');
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connectSSE();
          }, 4000);
        }
      };
    } catch {
      this.setStatus('offline');
    }
  }

  private handleIncomingEvent(data: RealtimeEventPayload) {
    if (data.addresses && Array.isArray(data.addresses)) {
      this.notifyListeners(data.addresses, data);
    }
  }

  public getCachedAddresses(): SavedCustomerAddress[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SAVED_ADDRESSES;
  }

  public async fetchAddresses(): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          this.notifyListeners(data, {
            type: 'INIT',
            addresses: data,
            timestamp: new Date().toISOString()
          });
          return data;
        }
      }
    } catch {
      // fallback to cached
    }
    return this.getCachedAddresses();
  }

  public async saveAddress(address: SavedCustomerAddress): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...address, deviceOrigin: this.localDeviceId })
      });
      if (res.ok) {
        const updatedList: SavedCustomerAddress[] = await res.json();
        this.broadcastLocally({
          type: 'SAVED',
          address,
          addresses: updatedList,
          timestamp: new Date().toISOString(),
          deviceOrigin: this.localDeviceId
        });
        this.notifyListeners(updatedList);
        return updatedList;
      }
    } catch (err) {
      console.warn('Network save failed, falling back to local storage:', err);
    }

    // Local fallback
    const current = this.getCachedAddresses();
    const existingIdx = current.findIndex((item) => item.id === address.id);
    let updated: SavedCustomerAddress[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = address;
    } else {
      updated = [address, ...current];
    }
    this.broadcastLocally({
      type: 'SAVED',
      address,
      addresses: updated,
      timestamp: new Date().toISOString(),
      deviceOrigin: this.localDeviceId
    });
    this.notifyListeners(updated);
    return updated;
  }

  public async deleteAddress(id: string): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch(`/api/addresses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const updatedList: SavedCustomerAddress[] = await res.json();
        this.broadcastLocally({
          type: 'DELETED',
          id,
          addresses: updatedList,
          timestamp: new Date().toISOString(),
          deviceOrigin: this.localDeviceId
        });
        this.notifyListeners(updatedList);
        return updatedList;
      }
    } catch (err) {
      console.warn('Network delete failed, falling back to local storage:', err);
    }

    const current = this.getCachedAddresses();
    const updated = current.filter((item) => item.id !== id);
    this.broadcastLocally({
      type: 'DELETED',
      id,
      addresses: updated,
      timestamp: new Date().toISOString(),
      deviceOrigin: this.localDeviceId
    });
    this.notifyListeners(updated);
    return updated;
  }

  public async markPrinted(
    id: string,
    info?: { method?: string; widthMm?: number; printedAt?: string; printerName?: string }
  ): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch(`/api/addresses/${encodeURIComponent(id)}/print`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info || {})
      });
      if (res.ok) {
        const updatedList: SavedCustomerAddress[] = await res.json();
        this.broadcastLocally({
          type: 'PRINTED',
          id,
          addresses: updatedList,
          timestamp: new Date().toISOString(),
          deviceOrigin: this.localDeviceId
        });
        this.notifyListeners(updatedList);
        return updatedList;
      }
    } catch {
      // Local fallback
    }

    const nowStr = info?.printedAt || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const current = this.getCachedAddresses();
    const updated = current.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isPrinted: true,
          printCount: (item.printCount || 0) + 1,
          lastPrintedAt: nowStr,
          printWidthMm: info?.widthMm || item.printWidthMm || 70,
          printedDevice: info?.printerName || item.printedDevice || 'Bluetooth Thermal Printer'
        };
      }
      return item;
    });

    this.broadcastLocally({
      type: 'PRINTED',
      id,
      addresses: updated,
      timestamp: new Date().toISOString(),
      deviceOrigin: this.localDeviceId
    });
    this.notifyListeners(updated);
    return updated;
  }

  public async markScanned(id: string, timestamp?: string): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch(`/api/addresses/${encodeURIComponent(id)}/scan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp })
      });
      if (res.ok) {
        const updatedList: SavedCustomerAddress[] = await res.json();
        this.broadcastLocally({
          type: 'SCANNED',
          id,
          addresses: updatedList,
          timestamp: new Date().toISOString(),
          deviceOrigin: this.localDeviceId
        });
        this.notifyListeners(updatedList);
        return updatedList;
      }
    } catch {
      // Local fallback
    }

    const scanTime = timestamp || new Date().toISOString().slice(0, 19).replace('T', ' ');
    const current = this.getCachedAddresses();
    const updated = current.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          qrScanCount: (item.qrScanCount || 0) + 1,
          lastQrScannedAt: scanTime,
          driverStatus: 'scanned' as const
        };
      }
      return item;
    });

    this.broadcastLocally({
      type: 'SCANNED',
      id,
      addresses: updated,
      timestamp: new Date().toISOString(),
      deviceOrigin: this.localDeviceId
    });
    this.notifyListeners(updated);
    return updated;
  }

  public async toggleFavorite(id: string): Promise<SavedCustomerAddress[]> {
    try {
      const res = await fetch(`/api/addresses/${encodeURIComponent(id)}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const updatedList: SavedCustomerAddress[] = await res.json();
        this.broadcastLocally({
          type: 'FAVORITED',
          id,
          addresses: updatedList,
          timestamp: new Date().toISOString(),
          deviceOrigin: this.localDeviceId
        });
        this.notifyListeners(updatedList);
        return updatedList;
      }
    } catch {
      // Local fallback
    }

    const current = this.getCachedAddresses();
    const updated = current.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    this.broadcastLocally({
      type: 'FAVORITED',
      id,
      addresses: updated,
      timestamp: new Date().toISOString(),
      deviceOrigin: this.localDeviceId
    });
    this.notifyListeners(updated);
    return updated;
  }

  private broadcastLocally(payload: RealtimeEventPayload) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch {
        // ignore
      }
    }
  }
}

export const realtimeAddressService = new RealtimeAddressService();
