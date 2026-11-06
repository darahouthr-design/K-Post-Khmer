import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'saved_addresses.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed data if file does not exist
if (!fs.existsSync(DATA_FILE)) {
  const seedAddresses = [
    {
      id: 'saved-1',
      recipientName: 'សុខា វណ្ណា (Sokha Vanna)',
      phone: '010-4829-1920',
      zonecode: '15380',
      roadAddress: '경기도 안산시 단원구 다문화길 24',
      jibunAddress: '경기도 안산시 단원구 원곡동 785-1',
      detailAddress: '한마음빌라 201호',
      buildingName: '한마음빌라',
      bname: '원곡동',
      deliveryMemo: '문 앞에 놓아주세요 (공동현관: #1234*)',
      entranceCode: '#1234*',
      labelTag: 'vip',
      isFavorite: true,
      useCount: 14,
      lastUsedAt: '2026-10-17',
      noteKhmer: 'អតិថិជនប្រចាំ កម្ម៉ង់គ្រឿងទេសខ្មែររៀងរាល់ថ្ងៃសៅរ៍',
      qrScanCount: 3,
      lastQrScannedAt: '2026-10-17 14:22',
      driverStatus: 'scanned',
      isPrinted: true,
      printCount: 2,
      lastPrintedAt: '2026-10-17 14:30',
      printWidthMm: 70,
      printedDevice: 'Bluetooth POS-70'
    },
    {
      id: 'saved-2',
      recipientName: 'ចាន់ ធារ៉ា (Chan Theara)',
      phone: '010-8371-5504',
      zonecode: '18592',
      roadAddress: '경기도 화성시 향남읍 발안공단로 92-12',
      jibunAddress: '경기도 화성시 향남읍 구문천리 925-3',
      detailAddress: '발안테크노밸리 기숙사 A동 305호',
      buildingName: '발안테크노밸리 기숙사',
      bname: '향남읍',
      deliveryMemo: '기숙사 관리실(수위실)에 맡겨주세요',
      entranceCode: '자유출입',
      labelTag: 'dormitory',
      isFavorite: true,
      useCount: 8,
      lastUsedAt: '2026-10-15',
      noteKhmer: 'ធ្វើការវេនថ្ងៃ សូមដាក់នៅបន្ទប់គ្រប់គ្រងអន្តេវាសិកដ្ឋាន',
      qrScanCount: 1,
      lastQrScannedAt: '2026-10-15 09:40',
      driverStatus: 'scanned',
      isPrinted: true,
      printCount: 1,
      lastPrintedAt: '2026-10-15 09:42',
      printWidthMm: 80,
      printedDevice: 'Thermal Printer 80mm'
    },
    {
      id: 'saved-3',
      recipientName: 'ម៉ៅ ស្រីពៅ (Mao Sreypov)',
      phone: '010-2940-7781',
      zonecode: '50918',
      roadAddress: '경상남도 김해시 분성로335번길 12',
      jibunAddress: '경상남도 김해시 서상동 82-4',
      detailAddress: '금강빌라 3층 302호',
      buildingName: '금강빌라',
      bname: '서상동',
      deliveryMemo: '냉동/신선식품입니다. 빠른 배송 부탁드립니다',
      entranceCode: '종 2580',
      labelTag: 'customer',
      isFavorite: false,
      useCount: 5,
      lastUsedAt: '2026-10-12',
      noteKhmer: 'ផ្ញើម្ហូបក្លាសេទៅគីមហេ',
      qrScanCount: 0,
      driverStatus: 'pending',
      isPrinted: false,
      printCount: 0
    }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(seedAddresses, null, 2), 'utf-8');
}

function readAddresses(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content) || [];
    }
  } catch (err) {
    console.error('Error reading address database:', err);
  }
  return [];
}

function writeAddresses(addresses: any[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(addresses, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing address database:', err);
    return false;
  }
}

// SSE Connected Client Pool for Multi-Device Realtime Sync
const sseClients = new Set<Response>();

function broadcastRealtime(event: {
  type: 'INIT' | 'SAVED' | 'DELETED' | 'PRINTED' | 'SCANNED' | 'FAVORITED';
  addresses?: any[];
  address?: any;
  id?: string;
  timestamp: string;
  deviceOrigin?: string;
}) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', clientsConnected: sseClients.size, timestamp: new Date().toISOString() });
  });

  // Get all addresses
  app.get('/api/addresses', (_req: Request, res: Response) => {
    const list = readAddresses();
    res.json(list);
  });

  // Real-time Server-Sent Events (SSE) Stream
  app.get('/api/addresses/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Register client in pool
    sseClients.add(res);

    // Send initial addresses on connection
    const currentAddresses = readAddresses();
    res.write(
      `data: ${JSON.stringify({
        type: 'INIT',
        addresses: currentAddresses,
        timestamp: new Date().toISOString()
      })}\n\n`
    );

    // Heartbeat ping every 25 seconds to keep connection alive
    const heartbeat = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // Save / update address (Real-time Broadcasts to ALL devices)
  app.post('/api/addresses', (req: Request, res: Response) => {
    const newAddress = req.body;
    if (!newAddress || !newAddress.recipientName) {
      return res.status(400).json({ error: 'Invalid address data' });
    }

    const list = readAddresses();
    const existingIdx = list.findIndex((a) => a.id === newAddress.id);
    let updatedList: any[];

    if (existingIdx >= 0) {
      updatedList = [...list];
      updatedList[existingIdx] = { ...updatedList[existingIdx], ...newAddress };
    } else {
      const entry = {
        ...newAddress,
        id: newAddress.id || `saved-${Date.now()}`
      };
      updatedList = [entry, ...list];
    }

    writeAddresses(updatedList);

    // Realtime Broadcast to every phone, computer, and tablet connected!
    broadcastRealtime({
      type: 'SAVED',
      address: newAddress,
      addresses: updatedList,
      timestamp: new Date().toISOString(),
      deviceOrigin: newAddress.deviceOrigin
    });

    res.json(updatedList);
  });

  // Delete address (Real-time Broadcasts to ALL devices)
  app.delete('/api/addresses/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const list = readAddresses();
    const updatedList = list.filter((a) => a.id !== id);

    writeAddresses(updatedList);

    broadcastRealtime({
      type: 'DELETED',
      id,
      addresses: updatedList,
      timestamp: new Date().toISOString()
    });

    res.json(updatedList);
  });

  // Mark address as Printed (Real-time Broadcasts "Printing complete" to ALL devices)
  app.put('/api/addresses/:id/print', (req: Request, res: Response) => {
    const { id } = req.params;
    const info = req.body || {};
    const nowTime = info.printedAt || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const list = readAddresses();
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isPrinted: true,
          printCount: (item.printCount || 0) + 1,
          lastPrintedAt: nowTime,
          printWidthMm: info.widthMm || item.printWidthMm || 70,
          printedDevice: info.printerName || item.printedDevice || 'Bluetooth Thermal Printer'
        };
      }
      return item;
    });

    writeAddresses(updatedList);

    broadcastRealtime({
      type: 'PRINTED',
      id,
      addresses: updatedList,
      timestamp: nowTime
    });

    res.json(updatedList);
  });

  // Mark address as Scanned by driver (Real-time Broadcasts to ALL devices)
  app.put('/api/addresses/:id/scan', (req: Request, res: Response) => {
    const { id } = req.params;
    const info = req.body || {};
    const nowTime = info.timestamp || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const list = readAddresses();
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          qrScanCount: (item.qrScanCount || 0) + 1,
          lastQrScannedAt: nowTime,
          driverStatus: 'scanned'
        };
      }
      return item;
    });

    writeAddresses(updatedList);

    broadcastRealtime({
      type: 'SCANNED',
      id,
      addresses: updatedList,
      timestamp: nowTime
    });

    res.json(updatedList);
  });

  // Toggle favorite (Real-time Broadcasts to ALL devices)
  app.put('/api/addresses/:id/favorite', (req: Request, res: Response) => {
    const { id } = req.params;
    const list = readAddresses();
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });

    writeAddresses(updatedList);

    broadcastRealtime({
      type: 'FAVORITED',
      id,
      addresses: updatedList,
      timestamp: new Date().toISOString()
    });

    res.json(updatedList);
  });

  // Mount Vite development middleware
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 K-Post Khmer Full-Stack Realtime Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
