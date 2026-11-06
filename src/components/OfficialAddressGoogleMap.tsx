import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Compass,
  Layers,
  Maximize2,
  Minimize2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Navigation,
  Copy,
  Check,
  ExternalLink,
  X,
  Plus,
  Minus,
  Eye,
  RotateCcw,
  Calendar,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { AUTO_POSTAL_CODE_LOOKUP } from '../data/koreanAddresses';

export type AddressType = 'R' | 'J';

interface KoreanAdminCoord {
  koreanName: string;
  khmerName: string;
  lat: number;
  lng: number;
}

const KOREAN_ADMIN_DIVISIONS: KoreanAdminCoord[] = [
  { koreanName: '서울특별시', khmerName: 'សេអ៊ូល', lat: 37.5665, lng: 126.978 },
  { koreanName: '서울', khmerName: 'សេអ៊ូល', lat: 37.5665, lng: 126.978 },
  { koreanName: '부산광역시', khmerName: 'ប៊ូសាន', lat: 35.1796, lng: 129.0756 },
  { koreanName: '부산', khmerName: 'ប៊ូសាន', lat: 35.1796, lng: 129.0756 },
  { koreanName: '대구광역시', khmerName: 'ដែគូ', lat: 35.8714, lng: 128.6014 },
  { koreanName: '대구', khmerName: 'ដែគូ', lat: 35.8714, lng: 128.6014 },
  { koreanName: '인천광역시', khmerName: 'អ៊ីនឆុន', lat: 37.4563, lng: 126.7052 },
  { koreanName: '인천', khmerName: 'អ៊ីនឆុន', lat: 37.4563, lng: 126.7052 },
  { koreanName: '광주광역시', khmerName: 'ក្វាងជូ', lat: 35.1595, lng: 126.8526 },
  { koreanName: '광주', khmerName: 'ក្វាងជូ', lat: 35.1595, lng: 126.8526 },
  { koreanName: '대전광역시', khmerName: 'ដែជុន', lat: 36.3504, lng: 127.3845 },
  { koreanName: '대전', khmerName: 'ដែជុន', lat: 36.3504, lng: 127.3845 },
  { koreanName: '울산광역시', khmerName: 'អ៊ុលសាន', lat: 35.5384, lng: 129.3114 },
  { koreanName: '울산', khmerName: 'អ៊ុលសាន', lat: 35.5384, lng: 129.3114 },
  { koreanName: '세종특별자치시', khmerName: 'សេជុង', lat: 36.48, lng: 127.289 },
  { koreanName: '세종', khmerName: 'សេជុង', lat: 36.48, lng: 127.289 },
  { koreanName: '경기도', khmerName: 'ខេត្តក្យង់គី', lat: 37.4138, lng: 127.5183 },
  { koreanName: '경기', khmerName: 'ខេត្តក្យង់គី', lat: 37.4138, lng: 127.5183 },
  { koreanName: '강원특별자치도', khmerName: 'ខេត្តកាងវ៉ុន', lat: 37.8228, lng: 128.1555 },
  { koreanName: '강원도', khmerName: 'ខេត្តកាងវ៉ុន', lat: 37.8228, lng: 128.1555 },
  { koreanName: '강원', khmerName: 'ខេត្តកាងវ៉ុន', lat: 37.8228, lng: 128.1555 },
  { koreanName: '충청북도', khmerName: 'ឆុងឆង់ខាងជើង', lat: 36.6357, lng: 127.4912 },
  { koreanName: '충북', khmerName: 'ឆុងឆង់ខាងជើង', lat: 36.6357, lng: 127.4912 },
  { koreanName: '충청남도', khmerName: 'ឆុងឆង់ខាងត្បូង', lat: 36.5184, lng: 126.8 },
  { koreanName: '충남', khmerName: 'ឆុងឆង់ខាងត្បូង', lat: 36.5184, lng: 126.8 },
  { koreanName: '전라북도', khmerName: 'ចុលឡាខាងជើង', lat: 35.8202, lng: 127.1088 },
  { koreanName: '전북특별자치도', khmerName: 'ចុលឡាខាងជើង', lat: 35.8202, lng: 127.1088 },
  { koreanName: '전북', khmerName: 'ចុលឡាខាងជើង', lat: 35.8202, lng: 127.1088 },
  { koreanName: '전라남도', khmerName: 'ចុលឡាខាងត្បូង', lat: 34.8679, lng: 126.991 },
  { koreanName: '전남', khmerName: 'ចុលឡាខាងត្បូង', lat: 34.8679, lng: 126.991 },
  { koreanName: '경상북도', khmerName: 'ក្យង់សាំងខាងជើង', lat: 36.576, lng: 128.5056 },
  { koreanName: '경북', khmerName: 'ក្យង់សាំងខាងជើង', lat: 36.576, lng: 128.5056 },
  { koreanName: '경상남도', khmerName: 'ក្យង់សាំងខាងត្បូង', lat: 35.4606, lng: 128.2132 },
  { koreanName: '경남', khmerName: 'ក្យង់សាំងខាងត្បូង', lat: 35.4606, lng: 128.2132 },
  { koreanName: '제주특별자치도', khmerName: 'កោះជេជូ', lat: 33.4996, lng: 126.5312 },
  { koreanName: '제주도', khmerName: 'កោះជេជូ', lat: 33.4996, lng: 126.5312 },
  { koreanName: '제주', khmerName: 'កោះជេជូ', lat: 33.4996, lng: 126.5312 }
];

// Global declaration for KakaoMap's official WebGL 360° Roadview Engine (panorama.js)
declare global {
  interface Window {
    mvp?: {
      version: string;
      supportWebGL: boolean;
      render: (instance: KakaoPanoramaInstance, timestamp?: number) => void;
      Panorama: new (
        container: string | HTMLElement,
        options?: {
          panoId?: number | null;
          pan?: number;
          tilt?: number;
          zoom?: number;
        }
      ) => KakaoPanoramaInstance;
    };
  }
}

interface KakaoPanoramaInstance {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  setPanoId: (
    panoId: number,
    wgsx?: number | null,
    wgsy?: number | null,
    immediate?: boolean
  ) => void;
  getViewpoint: () => {
    pan: number;
    tilt: number;
    zoom: number;
    panoId?: number;
  };
  setViewpoint: (options: {
    pan?: number;
    tilt?: number;
    zoom?: number;
  }) => void;
  relayout: () => void;
  destroy?: () => void;
}

interface KakaoRoadviewNodeInfo {
  id: number;
  wgsx: number;
  wgsy: number;
  addr?: string;
  st_name?: string;
  shot_date?: string;
  formattedDate?: string;
  angle?: number;
  history?: KakaoHistoricalShot[];
}

interface KakaoHistoricalShot {
  id: number;
  shot_date: string;
  label: string;
  wgsx: number;
  wgsy: number;
}

interface ResolvedMapPlace {
  displayName: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  latestShotDate?: string;
}

// Default Showcase Coordinate: Seoul Central Post Office (우체국)
const DEFAULT_SHOWCASE_COORDS = {
  lat: 37.561578,
  lng: 126.982239
};

function formatKakaoDate(rawDate?: string): string {
  if (!rawDate) return '2025.12';
  const clean = rawDate.replace(/[^0-9]/g, '');
  if (clean.length >= 6) {
    return `${clean.slice(0, 4)}.${clean.slice(4, 6)}`;
  }
  return rawDate;
}

function computeBearing(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

/**
 * Queries KakaoMap's official Roadview Node API (`rv.map.kakao.com`) to retrieve
 * the NEWEST 2025/2026 360° Roadview panorama (`panoId` and `shot_date`) at `(lat, lng)`.
 */
async function fetchLatestKakaoRoadviewNode(
  lat: number,
  lng: number
): Promise<KakaoRoadviewNodeInfo | null> {
  const radii = [40, 90, 200, 500, 1000];

  for (const rad of radii) {
    try {
      const listUrl = `https://rv.map.kakao.com/roadview-search/v2/nodes?PX=${lng}&PY=${lat}&RAD=${rad}&PAGE_SIZE=15&INPUT=wgs&TYPE=w&SERVICE=glpano`;
      const res = await fetch(listUrl);
      if (!res.ok) continue;
      const data = await res.json();
      const streetList = data?.street_view?.streetList;
      if (!Array.isArray(streetList) || streetList.length === 0) continue;

      const sorted = [...streetList].sort((a, b) => {
        const dateA = String(a.shot_date || '');
        const dateB = String(b.shot_date || '');
        const ymA = dateA.slice(0, 7);
        const ymB = dateB.slice(0, 7);
        if (ymA !== ymB) {
          return ymB.localeCompare(ymA);
        }
        const distA = Math.hypot(Number(a.wgsy) - lat, Number(a.wgsx) - lng);
        const distB = Math.hypot(Number(b.wgsy) - lat, Number(b.wgsx) - lng);
        return distA - distB;
      });

      const best = sorted[0];
      const nodeId = Number(best.id);

      const detailRes = await fetch(
        `https://rv.map.kakao.com/roadview-search/v2/node/${nodeId}?SERVICE=glpano`
      );
      if (detailRes.ok) {
        const detailJson = await detailRes.json();
        const street = detailJson?.street_view?.street;
        if (street) {
          const allShots: KakaoHistoricalShot[] = [
            {
              id: Number(street.id),
              shot_date: String(street.shot_date || ''),
              label: formatKakaoDate(street.shot_date),
              wgsx: Number(street.wgsx),
              wgsy: Number(street.wgsy)
            }
          ];

          if (Array.isArray(street.past)) {
            for (const p of street.past) {
              if (p && p.id && p.shot_date) {
                allShots.push({
                  id: Number(p.id),
                  shot_date: String(p.shot_date),
                  label: formatKakaoDate(p.shot_date),
                  wgsx: Number(p.wgsx || street.wgsx),
                  wgsy: Number(p.wgsy || street.wgsy)
                });
              }
            }
          }

          allShots.sort((a, b) => b.shot_date.localeCompare(a.shot_date));
          const newest = allShots[0];

          return {
            id: newest.id,
            wgsx: newest.wgsx,
            wgsy: newest.wgsy,
            addr: String(street.addr || best.addr || ''),
            st_name: String(street.st_name || best.st_name || ''),
            shot_date: newest.shot_date,
            formattedDate: newest.label,
            angle: parseFloat(street.angle || best.angle || '0') || 0,
            history: allShots
          };
        }
      }

      return {
        id: nodeId,
        wgsx: Number(best.wgsx),
        wgsy: Number(best.wgsy),
        addr: String(best.addr || ''),
        st_name: String(best.st_name || ''),
        shot_date: String(best.shot_date || ''),
        formattedDate: formatKakaoDate(best.shot_date),
        angle: parseFloat(best.angle || '0') || 0,
        history: [
          {
            id: nodeId,
            shot_date: String(best.shot_date || ''),
            label: formatKakaoDate(best.shot_date),
            wgsx: Number(best.wgsx),
            wgsy: Number(best.wgsy)
          }
        ]
      };
    } catch {
      // Continue to next radius
    }
  }

  return null;
}

// Generates cleaned and normalized Korean address query variations
function generateKoreanAddressSearchVariations(raw: string): string[] {
  const list: string[] = [];
  const trimmed = raw.trim();
  if (!trimmed) return list;

  list.push(trimmed);

  // 1. Correct unofficial / colloquial divisions (e.g. "전남광주통합특별시" -> "광주광역시")
  const normalizedDivision = trimmed
    .replace(/전남광주통합특별시|광주통합특별시/g, '광주광역시')
    .replace(/서울특별\s/g, '서울특별시 ')
    .replace(/세종특별자치\s/g, '세종특별자치시 ');

  if (normalizedDivision !== trimmed) {
    list.push(normalizedDivision);
  }

  // 2. Strip detailed apartment / room numbers (동/층/호, e.g. 101동 203호, 2층, 301호)
  const noRoom = normalizedDivision
    .replace(/\s+\d+동(?:\s+\d+호)?/g, '')
    .replace(/\s+(?:지하\s*)?\d+층(?:\s+\d+호)?/g, '')
    .replace(/\s+\d+호/g, '')
    .trim();
  if (noRoom && noRoom !== normalizedDivision && !list.includes(noRoom)) {
    list.push(noRoom);
  }

  // 3. Strip parentheses notes like (옥동) or (부천동, 대우아파트)
  const noParens = noRoom.replace(/\s*\([^)]*\)/g, '').trim();
  if (noParens && !list.includes(noParens)) {
    list.push(noParens);
  }

  // 4. Try extract just Road Name or Dong + Number (e.g. "부일로 771-8" or "옥동 526-1")
  const coreMatch = noParens.match(/([가-힣]+(?:로|길|동|리|읍|면)\s+\d+(?:-\d+)?)/);
  if (coreMatch && coreMatch[1] && !list.includes(coreMatch[1])) {
    list.push(coreMatch[1]);
  }

  return list;
}

/**
 * Resilient multi-tier Korean geocoding without Google Maps API Key:
 * 1. OpenStreetMap Nominatim with clean query
 * 2. Kakao Roadview Node reverse search
 * 3. Local Korea Post administrative dictionary
 */
async function resolveKoreanAddressLocation(
  rawQuery: string
): Promise<{ lat: number; lng: number; displayName: string; formattedAddress: string } | null> {
  const variations = generateKoreanAddressSearchVariations(rawQuery);

  // Strategy 1: Nominatim OpenStreetMap for South Korea
  for (const q of variations) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&countrycodes=kr&limit=1&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'ko,en',
          'User-Agent': 'KPostKhmer-KakaoMap/1.0'
        }
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        if (!isNaN(lat) && !isNaN(lng) && lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132) {
          return {
            lat,
            lng,
            displayName: q,
            formattedAddress: String(item.display_name || q)
          };
        }
      }
    } catch {
      // Continue to next variation
    }
  }

  // Strategy 2: Local Korea Administrative Directory fallback
  for (const item of KOREAN_ADMIN_DIVISIONS) {
    if (rawQuery.includes(item.koreanName)) {
      return {
        lat: item.lat,
        lng: item.lng,
        displayName: item.koreanName,
        formattedAddress: `${item.koreanName} (${item.khmerName})`
      };
    }
  }

  // Strategy 3: Check Postal code directory (zonecode)
  const zoneMatch = rawQuery.match(/\b\d{5}\b/);
  if (zoneMatch) {
    const code = zoneMatch[0];
    const postEntry = AUTO_POSTAL_CODE_LOOKUP.find((p) => p.zonecode === code);
    if (postEntry) {
      const adminMatch = KOREAN_ADMIN_DIVISIONS.find((d) =>
        d.koreanName.includes(postEntry.sido)
      );
      if (adminMatch) {
        return {
          lat: adminMatch.lat,
          lng: adminMatch.lng,
          displayName: postEntry.sido,
          formattedAddress: `[${postEntry.zonecode}] ${postEntry.sido} (${postEntry.sigunguKhmer})`
        };
      }
    }
  }

  // Strategy 4: Pattern matching against AUTO_POSTAL_CODE_LOOKUP
  for (const item of AUTO_POSTAL_CODE_LOOKUP) {
    if (item.pattern.test(rawQuery)) {
      const adminMatch = KOREAN_ADMIN_DIVISIONS.find((d) =>
        d.koreanName.includes(item.sido)
      );
      if (adminMatch) {
        return {
          lat: adminMatch.lat,
          lng: adminMatch.lng,
          displayName: item.sido,
          formattedAddress: `[${item.zonecode}] ${item.sido} (${item.sigunguKhmer})`
        };
      }
    }
  }

  return null;
}

/* =========================================================================
   Interactive Leaflet Map Canvas (Supports smooth dragging & custom pin)
   ========================================================================= */
interface LeafletInteractiveViewProps {
  location: { lat: number; lng: number };
  displayTitle: string;
  subtitle: string;
  latestShotDate: string;
  onOpenRoadview: () => void;
  mapType: 'roadmap' | 'skyview';
}

const LeafletInteractiveView: React.FC<LeafletInteractiveViewProps> = ({
  location,
  displayTitle,
  subtitle,
  latestShotDate,
  onOpenRoadview,
  mapType
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [location.lat, location.lng],
        zoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Update tile layer based on mapType
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === 'skyview') {
      // High-resolution Satellite Imagery
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);
    } else {
      // High-resolution Korean OpenStreetMap / CartoDB Voyager tiles
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 20, subdomains: 'abcd' }
      ).addTo(map);
    }

    // Custom Kakao-Style Map Pin Icon
    const customIcon = L.divIcon({
      className: 'custom-kakao-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: #FEE500; border: 2.5px solid #1E293B; border-radius: 9999px; padding: 6px 10px; display: flex; align-items: center; gap: 5px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); font-family: sans-serif; font-weight: 800; font-size: 11px; color: #0F172A; white-space: nowrap;">
            <span style="background: #337CF6; color: white; border-radius: 4px; padding: 1px 4px; font-size: 9px;">Kakao</span>
            <span>${displayTitle.slice(0, 22)}</span>
          </div>
          <div style="width: 14px; height: 14px; background: #EF4444; border: 2px solid white; border-radius: 9999px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); margin-top: 3px;"></div>
          <div style="width: 2px; height: 10px; background: #EF4444;"></div>
        </div>
      `,
      iconSize: [0, 0]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([location.lat, location.lng], {
        icon: customIcon
      }).addTo(map);
    }

    map.setView([location.lat, location.lng], 17, { animate: true });

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => map.invalidateSize(), 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [location.lat, location.lng, displayTitle, mapType]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {/* Floating Kakao Address Card inside Interactive Leaflet View */}
      <div className="absolute top-3 left-3 z-[1000] max-w-[320px] bg-white/95 backdrop-blur-xs rounded-xl shadow-xl border border-slate-200/90 p-3 select-text">
        <div className="flex items-start justify-between gap-1.5">
          <div className="font-extrabold text-xs text-slate-900 leading-snug truncate">
            {displayTitle}
          </div>
          <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            🕒 {latestShotDate} 최신
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{subtitle}</p>
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onOpenRoadview}
            className="h-7 px-2.5 rounded-lg bg-[#337CF6] hover:bg-blue-600 text-white flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
          >
            <Camera className="w-3 h-3" />
            <span>로드뷰 ({latestShotDate})</span>
          </button>
          <a
            href={`https://map.kakao.com/?q=${encodeURIComponent(displayTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 px-2 rounded-lg bg-[#FEE500] hover:bg-[#FDD800] text-slate-900 flex items-center gap-1 text-[11px] font-extrabold transition-all shadow-2xs"
          >
            <span>KakaoMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Kakao Official 360° Roadview Modal & Viewer
   ========================================================================= */
interface KakaoRoadviewViewerProps {
  targetLocation: { lat: number; lng: number };
  addressTitle: string;
  onClose: () => void;
  isDarkMode?: boolean;
}

const KakaoRoadviewViewer: React.FC<KakaoRoadviewViewerProps> = ({
  targetLocation,
  addressTitle,
  onClose,
  isDarkMode
}) => {
  const kakaoContainerIdRef = useRef<string>(
    `kakao_rv_container_${Math.floor(Math.random() * 100000)}`
  );
  const kakaoContainerRef = useRef<HTMLDivElement | null>(null);
  const kakaoPanoRef = useRef<KakaoPanoramaInstance | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [panoAvailable, setPanoAvailable] = useState<boolean>(true);
  const [panoDate, setPanoDate] = useState<string>('2025.12');
  const [panoAddress, setPanoAddress] = useState<string>(addressTitle);
  const [panoStreetName, setPanoStreetName] = useState<string>('');
  const [historyShots, setHistoryShots] = useState<KakaoHistoricalShot[]>([]);
  const [activePanoId, setActivePanoId] = useState<number | null>(null);
  const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState<boolean>(false);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(0);
  const [isFacingTargetBuilding, setIsFacingTargetBuilding] = useState<boolean>(true);

  // Animation frame loop for Kakao's official WebGL Panorama
  useEffect(() => {
    let animId: number;
    const loop = (ts?: number) => {
      if (window.mvp && kakaoPanoRef.current) {
        try {
          window.mvp.render(kakaoPanoRef.current, ts || Date.now());
        } catch {
          // ignore render hiccups
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Initialize Kakao Roadview Node
  useEffect(() => {
    let isCancelled = false;

    async function initRoadview() {
      setIsLoading(true);
      setPanoAvailable(true);

      const kakaoNode = await fetchLatestKakaoRoadviewNode(
        targetLocation.lat,
        targetLocation.lng
      );

      if (isCancelled) return;

      if (kakaoNode && window.mvp && window.mvp.supportWebGL !== false) {
        const foundPos = { lat: kakaoNode.wgsy, lng: kakaoNode.wgsx };
        const calculatedBearing = computeBearing(foundPos, targetLocation);
        const initialPan =
          calculatedBearing !== 0
            ? calculatedBearing
            : kakaoNode.angle !== undefined
            ? kakaoNode.angle
            : 0;

        setPanoDate(kakaoNode.formattedDate || '2025.12');
        setPanoAddress(kakaoNode.addr || addressTitle);
        setPanoStreetName(kakaoNode.st_name || '');
        setHistoryShots(kakaoNode.history || []);
        setActivePanoId(kakaoNode.id);

        try {
          if (!kakaoPanoRef.current && kakaoContainerRef.current) {
            const instance = new window.mvp.Panorama(
              kakaoContainerIdRef.current,
              {
                panoId: kakaoNode.id,
                pan: initialPan,
                tilt: 2,
                zoom: 0
              }
            );

            instance.on('viewpoint_changed', () => {
              const vp = instance.getViewpoint();
              if (typeof vp?.zoom === 'number') {
                setCurrentZoomLevel(vp.zoom);
              }
            });

            instance.on('pano_changed', async () => {
              const vp = instance.getViewpoint();
              if (vp?.panoId) {
                setActivePanoId(vp.panoId);
                try {
                  const nodeRes = await fetch(
                    `https://rv.map.kakao.com/roadview-search/v2/node/${vp.panoId}?SERVICE=glpano`
                  );
                  if (nodeRes.ok) {
                    const nodeJson = await nodeRes.json();
                    const street = nodeJson?.street_view?.street;
                    if (street) {
                      setPanoDate(formatKakaoDate(street.shot_date));
                      if (street.addr) setPanoAddress(street.addr);
                      if (street.st_name) setPanoStreetName(street.st_name);
                    }
                  }
                } catch {
                  // ignore
                }
              }
            });

            kakaoPanoRef.current = instance;
            setIsLoading(false);
            setTimeout(() => {
              instance.relayout();
            }, 100);
          } else if (kakaoPanoRef.current) {
            kakaoPanoRef.current.setPanoId(kakaoNode.id);
            kakaoPanoRef.current.setViewpoint({
              pan: initialPan,
              tilt: 2,
              zoom: 0
            });
            kakaoPanoRef.current.relayout();
            setIsLoading(false);
          }
        } catch {
          setIsLoading(false);
        }
      } else {
        setPanoAvailable(false);
        setIsLoading(false);
      }
    }

    initRoadview();

    return () => {
      isCancelled = true;
    };
  }, [targetLocation.lat, targetLocation.lng, addressTitle]);

  const handleZoomIn = () => {
    if (kakaoPanoRef.current) {
      const vp = kakaoPanoRef.current.getViewpoint();
      const nextZoom = Math.min(3, (vp?.zoom ?? 0) + 1);
      kakaoPanoRef.current.setViewpoint({ zoom: nextZoom });
      setCurrentZoomLevel(nextZoom);
    }
  };

  const handleZoomOut = () => {
    if (kakaoPanoRef.current) {
      const vp = kakaoPanoRef.current.getViewpoint();
      const nextZoom = Math.max(-2, (vp?.zoom ?? 0) - 1);
      kakaoPanoRef.current.setViewpoint({ zoom: nextZoom });
      setCurrentZoomLevel(nextZoom);
    }
  };

  const handleSelectHistoricalShot = (shot: KakaoHistoricalShot) => {
    setIsHistoryDropdownOpen(false);
    setPanoDate(shot.label);
    if (kakaoPanoRef.current) {
      const vp = kakaoPanoRef.current.getViewpoint();
      kakaoPanoRef.current.setPanoId(shot.id);
      kakaoPanoRef.current.setViewpoint({
        pan: vp?.pan ?? 0,
        tilt: vp?.tilt ?? 0,
        zoom: vp?.zoom ?? 0
      });
    }
  };

  const handleResetBearing = () => {
    if (kakaoPanoRef.current) {
      const vp = kakaoPanoRef.current.getViewpoint();
      const calculated = computeBearing(
        { lat: targetLocation.lat - 0.0001, lng: targetLocation.lng - 0.0001 },
        targetLocation
      );
      kakaoPanoRef.current.setViewpoint({
        pan: calculated,
        tilt: 2,
        zoom: vp?.zoom ?? 0
      });
      setIsFacingTargetBuilding(true);
    }
  };

  const kakaoRoadviewUrl = activePanoId
    ? `https://map.kakao.com/?panoid=${activePanoId}&map_type=TYPE_MAP&map_attribute=ROADVIEW`
    : `https://map.kakao.com/link/roadview/${targetLocation.lat},${targetLocation.lng}`;

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden select-none">
      {/* Top Kakao Roadview Control Bar */}
      <div className="px-4 py-2.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#337CF6] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {panoAddress}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                🕒 {panoDate} 촬영 (최신)
              </span>
            </div>
            {panoStreetName && (
              <span className="text-[11px] text-slate-400 font-medium truncate block">
                🛣️ {panoStreetName}
              </span>
            )}
          </div>
        </div>

        {/* Timeline & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {historyShots.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHistoryDropdownOpen((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{panoDate}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isHistoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50 text-xs text-slate-200"
                  >
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                      កាលបរិច្ឆេទថត (로드뷰 연도)
                    </div>
                    {historyShots.map((shot) => (
                      <button
                        key={shot.id}
                        type="button"
                        onClick={() => handleSelectHistoricalShot(shot)}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                          shot.label === panoDate
                            ? 'text-blue-400 font-bold bg-blue-500/10'
                            : ''
                        }`}
                      >
                        <span>{shot.label}</span>
                        {shot.label === panoDate && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetBearing}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer border border-slate-700"
            title="បង្វិលកាមេរ៉ាសំដៅចំមុខផ្ទះ / អាសយដ្ឋានគោលដៅ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <a
            href={kakaoRoadviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-[#FEE500] hover:bg-[#FDD800] text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
            title="បើកមើលក្នុង KakaoMap ផ្លូវការ"
          >
            <span>KakaoMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="បិទ Roadview ត្រឡប់ទៅផែនទី"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 360° Panorama Viewport */}
      <div className="flex-1 w-full h-full relative">
        <div
          id={kakaoContainerIdRef.current}
          ref={kakaoContainerRef}
          className="w-full h-full"
          style={{
            display: panoAvailable ? 'block' : 'none',
            background: '#0B1120'
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white">
            <Loader2 className="w-8 h-8 text-[#337CF6] animate-spin" />
            <div className="text-xs font-bold text-slate-200">
              កំពុងផ្ទុករូបភាពផ្លូវ 360° Kakao Roadview ({panoDate})...
            </div>
          </div>
        )}

        {/* Fallback when no Roadview is available for this remote coordinates */}
        {!panoAvailable && !isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              រកមិនឃើញរូបភាពផ្លូវ 360° នៅចំណុចនេះទេ
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
              ទីតាំងនេះអាចស្ថិតក្នុងតំបន់ដាច់ស្រយាល ឬផ្លូវខាងក្នុងភូមិដែលរថយន្ត Kakao
              Roadview មិនទាន់បានចូលថត។ លោកអ្នកអាចមើលតាមរយៈផែនទីផ្កាយរណប Kakao
              Skyview ជំនួសវិញបាន។
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#337CF6] hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              ត្រឡប់ទៅមើលផែនទីផ្កាយរណប
            </button>
          </div>
        )}

        {/* Floating Zoom Controls (+ / -) */}
        {panoAvailable && (
          <div className="absolute right-4 bottom-6 z-20 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg border border-slate-700 transition-colors cursor-pointer"
              title="ពង្រីក (Zoom In)"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg border border-slate-700 transition-colors cursor-pointer"
              title="បង្រួម (Zoom Out)"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Badge facing target address */}
        {panoAvailable && isFacingTargetBuilding && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-xl border border-blue-400/50">
              <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
              <span>កាមេរ៉ាកំពុងសំដៅចំមុខផ្ទះ / អាសយដ្ឋាន</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   Main Official Address KakaoMap Component (Zero Google Maps API Key needed)
   ========================================================================= */
export interface OfficialAddressGoogleMapProps {
  isDarkMode?: boolean;
  addressType: AddressType;
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  buildingName: string;
  externalQuery?: string;
  onLocationNotFoundChange?: (notFound: boolean, query?: string) => void;
}

export const OfficialAddressGoogleMap: React.FC<OfficialAddressGoogleMapProps> = ({
  isDarkMode = false,
  addressType,
  zonecode,
  roadAddress,
  jibunAddress,
  detailAddress,
  buildingName,
  externalQuery = '',
  onLocationNotFoundChange
}) => {
  // Active View Modes:
  // 'kakao': Official Kakao Map Web Live Embed
  // 'roadview': Kakao 360° WebGL Panorama
  // 'interactive': Leaflet Interactive Korean Canvas
  const [activeTab, setActiveTab] = useState<'kakao' | 'roadview' | 'interactive'>('kakao');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'skyview'>('roadmap');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  // Search State
  const [manualSearchInput, setManualSearchInput] = useState<string>('');
  const [effectiveSearchQuery, setEffectiveSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedMapPlace | null>(null);
  const [latestKakaoShotDate, setLatestKakaoShotDate] = useState<string>('2025.12');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Determine Primary Display Titles
  const displayRoadTitle = useMemo(() => {
    if (roadAddress) return roadAddress;
    if (jibunAddress) return jibunAddress;
    if (externalQuery) return externalQuery;
    return '서울특별시 중구 소공로 70 (서울중앙우체국)';
  }, [roadAddress, jibunAddress, externalQuery]);

  const displayJibunSubtitle = useMemo(() => {
    if (jibunAddress && jibunAddress !== displayRoadTitle) return jibunAddress;
    return '';
  }, [jibunAddress, displayRoadTitle]);

  const displayZonecode = useMemo(() => {
    if (zonecode) return zonecode;
    return '04535';
  }, [zonecode]);

  // Sync external search query
  useEffect(() => {
    const raw = externalQuery || roadAddress || jibunAddress || '';
    if (raw.trim()) {
      setEffectiveSearchQuery(raw.trim());
      setManualSearchInput(raw.trim());
    }
  }, [externalQuery, roadAddress, jibunAddress]);

  // Geocode address when effectiveSearchQuery changes
  useEffect(() => {
    let isCancelled = false;

    async function lookup() {
      const q = effectiveSearchQuery.trim();
      if (!q) return;

      setIsLoading(true);
      setErrorMsg(null);

      try {
        const place = await resolveKoreanAddressLocation(q);

        if (isCancelled) return;

        if (place) {
          // Fetch newest Kakao Roadview capture date for this coordinate
          const rvNode = await fetchLatestKakaoRoadviewNode(place.lat, place.lng);
          const shotDate = rvNode?.formattedDate || '2025.12';

          setResolvedPlace({
            displayName: place.displayName,
            formattedAddress: place.formattedAddress,
            location: {
              lat: place.lat,
              lng: place.lng
            },
            latestShotDate: shotDate
          });
          setLatestKakaoShotDate(shotDate);
          setIsLoading(false);

          if (onLocationNotFoundChange) {
            onLocationNotFoundChange(false, q);
          }
        } else {
          // Location really not found (e.g. invalid query)
          setIsLoading(false);
          if (onLocationNotFoundChange) {
            onLocationNotFoundChange(true, q);
          }
        }
      } catch {
        if (!isCancelled) {
          setIsLoading(false);
          if (onLocationNotFoundChange) {
            onLocationNotFoundChange(true, q);
          }
        }
      }
    }

    lookup();

    return () => {
      isCancelled = true;
    };
  }, [effectiveSearchQuery, onLocationNotFoundChange]);

  const handleManualMapSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualSearchInput.trim();
    if (!trimmed) return;
    setEffectiveSearchQuery(trimmed);
  };

  const handleCopyAddress = async () => {
    const textToCopy = `${displayRoadTitle} ${detailAddress || buildingName}`.trim();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const currentCoords = resolvedPlace?.location || DEFAULT_SHOWCASE_COORDS;

  // Official Kakao Map Embed URLs
  const kakaoEmbedMapUrl = useMemo(() => {
    const cleanTitle = displayRoadTitle.replace(/[^\w\s가-힣0-9.-]/g, '').trim();
    return `https://map.kakao.com/link/map/${encodeURIComponent(
      cleanTitle
    )},${currentCoords.lat},${currentCoords.lng}`;
  }, [displayRoadTitle, currentCoords.lat, currentCoords.lng]);

  const kakaoSearchUrl = `https://map.kakao.com/?q=${encodeURIComponent(
    displayRoadTitle
  )}`;

  const kakaoDirectionsUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    displayRoadTitle
  )},${currentCoords.lat},${currentCoords.lng}`;

  const renderViewport = () => {
    if (activeTab === 'roadview') {
      return (
        <KakaoRoadviewViewer
          targetLocation={currentCoords}
          addressTitle={displayRoadTitle}
          onClose={() => setActiveTab('kakao')}
          isDarkMode={isDarkMode}
        />
      );
    }

    if (activeTab === 'interactive') {
      return (
        <LeafletInteractiveView
          location={currentCoords}
          displayTitle={displayRoadTitle}
          subtitle={displayJibunSubtitle || displayZonecode}
          latestShotDate={latestKakaoShotDate}
          onOpenRoadview={() => setActiveTab('roadview')}
          mapType={mapTypeId}
        />
      );
    }

    // Default: Official Kakao Map Live Embed
    return (
      <div className="relative w-full h-full bg-[#FAF9F6]">
        <iframe
          key={`${currentCoords.lat}-${currentCoords.lng}-${displayRoadTitle}`}
          src={kakaoEmbedMapUrl}
          title="KakaoMap Official Korean Address Map"
          className="w-full h-full border-0"
          loading="lazy"
          allow="geolocation"
        />

        {/* Floating Quick Action Overlay on top of Kakao Map */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setActiveTab('roadview')}
            className="px-3 py-1.5 rounded-xl bg-[#337CF6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
            title="បើកមើលទិដ្ឋភាពផ្លូវ និងមុខផ្ទះ 360° 로드뷰"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>로드뷰 ({latestKakaoShotDate} ថ្មីបំផុត)</span>
          </motion.button>

          <a
            href={kakaoSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD800] text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg"
            title="បើកមើលក្នុងវេបសាយ KakaoMap ផ្ទាល់"
          >
            <span>KakaoMap</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={kakaoDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-lg border border-slate-200"
            title="ស្វែងរកផ្លូវធ្វើដំណើរ (길찾기)"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>길찾기 (រកផ្លូវ)</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow duration-300"
      >
        {/* Top Header: KakaoMap Standard Korean Map Branding */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50/70 via-slate-50 to-blue-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#FEE500] text-slate-950 flex items-center justify-center shrink-0 shadow-xs border border-amber-300 font-extrabold text-xs">
              K
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="truncate font-extrabold">
                  ផែនទីស្តង់ដារជាក់ស្ដែង KakaoMap & 360° 로드뷰
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold font-mono border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{latestKakaoShotDate} 최신뷰 (ថ្មីបំផុត)</span>
                </span>
              </div>
              <span className="block text-[11px] font-medium text-slate-500 truncate">
                ដំណើរការដោយប្រព័ន្ធផែនទីផ្លូវការកូរ៉េ KakaoMap · ឥតគិតថ្លៃ & គ្មានដែនកំណត់
              </span>
            </div>
          </div>

          {/* Mode Switch Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('kakao')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeTab === 'kakao'
                    ? 'bg-[#FEE500] text-slate-950 shadow-xs font-extrabold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>카카오맵 (Kakao)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('roadview')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeTab === 'roadview'
                    ? 'bg-[#337CF6] text-white shadow-xs'
                    : 'text-blue-700 hover:text-blue-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>로드뷰 360°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('interactive');
                  setMapTypeId((prev) => (prev === 'roadmap' ? 'skyview' : 'roadmap'));
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  activeTab === 'interactive'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{mapTypeId === 'skyview' ? '스카이뷰' : 'អន្តរកម្ម'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="min-h-[32px] px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={isExpanded ? 'បង្រួមផែនទី' : 'ពង្រីកផែនទីឱ្យធំ'}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">បង្រួម</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">ពង្រីក</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Strip */}
        <form
          onSubmit={handleManualMapSearch}
          className="px-4 py-2.5 bg-[#FAF9F6] border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={manualSearchInput}
              onChange={(e) => setManualSearchInput(e.target.value)}
              placeholder="វាយអាសយដ្ឋានកូរ៉េ ឬជ្រើសរើសពីតារាង 우체국 ខាងលើ (ឧ. 전남광주통합특별시 광산구 옥동 526-1)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#337CF6] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isLoading || !manualSearchInput.trim()}
              className="min-h-[38px] px-3.5 py-2 rounded-xl bg-[#337CF6] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>កំពុងស្វែងរក...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>ស្វែងរកលើផែនទី</span>
                </>
              )}
            </motion.button>

            <a
              href={kakaoSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[38px] px-3 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FDD800] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              title="បើកអាសយដ្ឋាននេះនៅក្នុងវេបសាយ https://map.kakao.com ផ្ទាល់"
            >
              <span>KakaoMap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </form>

        {/* Error / Status Strip */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-900"
            >
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport Container */}
        <motion.div
          animate={{ height: isExpanded || activeTab === 'roadview' ? 540 : 430 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative w-full bg-[#FAF9F6]"
        >
          {!isFullscreenModal && renderViewport()}
        </motion.div>

        {/* Fullscreen Portal */}
        {typeof document !== 'undefined' &&
          isFullscreenModal &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold truncate">
                  <span className="px-2 py-0.5 rounded bg-[#FEE500] text-slate-950 text-[11px] font-extrabold">
                    카카오맵 · 로드뷰 360° ({latestKakaoShotDate})
                  </span>
                  <span className="truncate">{displayRoadTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullscreenModal(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>បិទពេញអេក្រង់</span>
                </button>
              </div>
              <div className="flex-1 w-full relative">{renderViewport()}</div>
            </div>,
            document.body
          )}

        {/* Bottom Details, Coordinates & Kakao Attribution Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold truncate">
              {displayZonecode ? `[${displayZonecode}] ` : ''}
              {displayRoadTitle}
            </span>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="ចម្លងអាសយដ្ឋាន"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveTab((prev) => (prev === 'roadview' ? 'kakao' : 'roadview'))
              }
              className="text-blue-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {activeTab === 'roadview'
                  ? 'ត្រឡប់ទៅផែនទី Kakao'
                  : `បើកមើលផ្លូវ 360° (${latestKakaoShotDate} ថ្មីបំផុត)`}
              </span>
            </button>
            <span className="font-mono text-[11px] text-slate-500 tabular-nums">
              {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
            </span>
            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              KakaoMap ផ្លូវការ
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Also export as OfficialAddressKakaoMap for semantic clarity
export const OfficialAddressKakaoMap = OfficialAddressGoogleMap;
export default OfficialAddressGoogleMap;
