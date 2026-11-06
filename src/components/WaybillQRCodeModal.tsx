import React, { useState, useEffect, useId } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  FileText, 
  ExternalLink, 
  Smartphone,
  Sun,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  QrCode as QrCodeIcon
} from 'lucide-react';
import { Icon3DQRCode } from './Icons3D';

interface WaybillQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  waybillText?: string;
  singleLineAddress?: string;
  recipientName: string;
  phone: string;
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  extraAddress?: string;
  fullCombinedMemo: string;
  isDarkMode: boolean;
  // Driver Tracking Props
  addressId?: string;
  qrScanCount?: number;
  lastQrScannedAt?: string;
  driverStatus?: 'pending' | 'scanned' | 'delivered';
  onRecordDriverScan?: (addressId?: string) => void;
  onResetDriverScan?: (addressId?: string) => void;
}

type QRMode = 'courier_text' | 'driver_verify' | 'kakaomap' | 'navermap' | 'call';

export const WaybillQRCodeModal: React.FC<WaybillQRCodeModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  phone,
  zonecode,
  roadAddress,
  jibunAddress,
  detailAddress,
  extraAddress,
  singleLineAddress,
  fullCombinedMemo,
  isDarkMode,
  addressId,
  qrScanCount = 0,
  lastQrScannedAt,
  onRecordDriverScan,
  onResetDriverScan,
}) => {
  const [activeMode, setActiveMode] = useState<QRMode>('courier_text');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [recordSuccess, setRecordSuccess] = useState<boolean>(false);
  const titleId = useId();

  // Compute full clean address
  const baseAddr = roadAddress || jibunAddress || '';
  const detail = detailAddress ? ` ${detailAddress}` : '';
  const extra = extraAddress ? ` ${extraAddress}` : '';
  const computedFallback = `${baseAddr}${detail}${extra}`.trim();
  const fullAddress = singleLineAddress || computedFallback;

  // Courier formatted text payload
  const courierTextPayload = [
    `[우체국택배 배송정보]`,
    `받는분: ${recipientName || '고객님'}`,
    `연락처: ${phone || '미기재'}`,
    `우편번호: ${zonecode || '미지정'}`,
    `주소: ${fullAddress || '주소 정보 없음'}`,
    fullCombinedMemo ? `배송메모: ${fullCombinedMemo}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  // Driver verification web portal link
  const driverVerifyPayload = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?driver_scan=${encodeURIComponent(addressId || 'current')}&phone=${encodeURIComponent(phone || '')}`
    : 'https://kpost.khmer.app';

  // KakaoMap search URL payload
  const kakaoMapPayload = baseAddr
    ? `https://map.kakao.com/link/search/${encodeURIComponent(fullAddress || baseAddr)}`
    : 'https://map.kakao.com';

  // Naver Map search URL payload
  const naverMapPayload = baseAddr
    ? `https://map.naver.com/v5/search/${encodeURIComponent(fullAddress || baseAddr)}`
    : 'https://map.naver.com';

  // Direct phone call payload
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const callPayload = cleanPhone ? `tel:${cleanPhone}` : 'tel:';

  // Get current payload based on activeMode
  const getPayload = () => {
    switch (activeMode) {
      case 'driver_verify':
        return driverVerifyPayload;
      case 'kakaomap':
        return kakaoMapPayload;
      case 'navermap':
        return naverMapPayload;
      case 'call':
        return callPayload;
      case 'courier_text':
      default:
        return courierTextPayload;
    }
  };

  const currentPayload = getPayload();

  // Generate QR Code data URL whenever mode or payload changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(currentPayload, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url: string) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err: unknown) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentPayload]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `kpost-waybill-qr-${zonecode || 'delivery'}.png`;
    link.href = qrDataUrl;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleTriggerRecordScan = () => {
    if (onRecordDriverScan) {
      onRecordDriverScan(addressId);
      setRecordSuccess(true);
      setTimeout(() => setRecordSuccess(false), 2200);
    }
  };

  const isScanned = (qrScanCount || 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border z-10 my-auto ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700/80 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon3DQRCode className="w-9 h-9" size={40} />
                <div>
                  <h3 id={titleId} className="font-bold text-base sm:text-lg flex items-center gap-2">
                    QR Code សម្រាប់អ្នកដឹកជញ្ជូន (택배 기사님용)
                  </h3>
                  <p className="text-xs text-red-100">
                    ស្កេនផ្ទាល់ពីអេក្រង់ និងផ្ទៀងផ្ទាត់ការទទួលស្កេនរបស់ឥវ៉ាន់
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition-colors text-white/90 hover:text-white cursor-pointer"
                title="បិទ (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className={`p-2.5 sm:p-3 border-b flex gap-1.5 overflow-x-auto text-xs font-semibold ${
              isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
            }`}>
              <button
                onClick={() => setActiveMode('courier_text')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeMode === 'courier_text'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ព័ត៌មានពេញលេញ (택배정보)</span>
              </button>

              <button
                onClick={() => setActiveMode('driver_verify')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeMode === 'driver_verify'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>តំណផ្ទៀងផ្ទាត់ (스캔인증)</span>
              </button>

              <button
                onClick={() => setActiveMode('kakaomap')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeMode === 'kakaomap'
                    ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>ផែនទី KakaoMap</span>
              </button>

              <button
                onClick={() => setActiveMode('navermap')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeMode === 'navermap'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ផែនទី Naver</span>
              </button>

              {phone && (
                <button
                  onClick={() => setActiveMode('call')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeMode === 'call'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>ទូរស័ព្ទ (전화)</span>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 flex flex-col items-center">
              {/* Screen brightness reminder tip */}
              <div className={`w-full mb-3 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 ${
                isDarkMode ? 'bg-amber-950/40 border border-amber-800/60 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}>
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>គន្លឹះ៖</strong> សូមបង្កើនពន្លឺអេក្រង់ទូរស័ព្ទឱ្យភ្លឺច្បាស់ ដើម្បីឱ្យអ្នកដឹកជញ្ជូនស្កេនបានលឿន និងត្រឹមត្រូវ។
                </span>
              </div>

              {/* QR Code Canvas Frame - High Contrast Box */}
              <div className="relative p-3.5 rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Waybill Delivery QR Code"
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center text-slate-400">
                    <span className="text-sm">កំពុងបង្កើត QR Code...</span>
                  </div>
                )}

                {/* Korea Post Logo Watermark Under QR */}
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-red-600 select-none">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span>우체국 택배 · KOREA POST READY</span>
                </div>
              </div>

              {/* Driver Scan Status & Timestamp Tracking Box */}
              <div className={`mt-3.5 w-full p-3.5 rounded-2xl border transition-all ${
                isScanned
                  ? isDarkMode
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isDarkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                  : 'bg-amber-50/70 border-amber-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-current/15">
                  <div className="flex items-center gap-2">
                    {isScanned ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>អ្នកដឹកបានស្កេនទទួលរួច (기사님 스캔확인)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs sm:text-sm">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>រង់ចាំអ្នកដឹកស្កេន (기사님 스캔 대기중)</span>
                      </div>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                    isScanned
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                  }`}>
                    ស្កេនបាន {qrScanCount || 0} ដង
                  </span>
                </div>

                <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="opacity-75">កាលបរិច្ឆេទ/ម៉ោងស្កេនចុងក្រោយ៖</span>{' '}
                    <strong className="font-mono">
                      {lastQrScannedAt || 'មិនទាន់មានកំណត់ត្រាស្កេននៅឡើយ'}
                    </strong>
                  </div>

                  {/* Manual / Direct Record Scan Action Button */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleTriggerRecordScan}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        recordSuccess
                          ? 'bg-emerald-600 text-white'
                          : isScanned
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                      title="ចុចដើម្បីកត់ត្រាការស្កេនរបស់អ្នកដឹកជញ្ជូន"
                    >
                      {recordSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>បានកត់ត្រា!</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isScanned ? 'កត់ត្រាថែម (+1)' : 'បញ្ជាក់ថាអ្នកដឹកបានស្កេន'}</span>
                        </>
                      )}
                    </motion.button>

                    {isScanned && onResetDriverScan && (
                      <button
                        type="button"
                        onClick={() => onResetDriverScan(addressId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        title="កំណត់ឡើងវិញនូវចំនួនស្កេន"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Recipient summary card */}
              <div className={`mt-3 w-full p-3 rounded-xl border text-xs text-left ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50 dark:border-slate-700">
                  <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeMode === 'courier_text' && 'ទិន្នន័យក្នុង QR: ព័ត៌មានដឹកជញ្ជូនស្តង់ដារ'}
                    {activeMode === 'driver_verify' && 'ទិន្នន័យក្នុង QR: តំណភ្ជាប់ស្កេនផ្ទៀងផ្ទាត់ (Web Portal)'}
                    {activeMode === 'kakaomap' && 'ទិន្នន័យក្នុង QR: តំណបើកផែនទី KakaoMap'}
                    {activeMode === 'navermap' && 'ទិន្នន័យក្នុង QR: តំណបើកផែនទី Naver Map'}
                    {activeMode === 'call' && 'ទិន្នន័យក្នុង QR: លេខទូរស័ព្ទហៅផ្ទាល់'}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {zonecode ? `우편번호 ${zonecode}` : ''}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="truncate">
                    <strong>អ្នកទទួល (받는분):</strong> {recipientName || 'មិនទាន់បញ្ចូល'} | <strong>លេខទូរស័ព្ទ:</strong> {phone || 'មិនទាន់បញ្ចូល'}
                  </p>
                  <p className="line-clamp-2">
                    <strong>អាសយដ្ឋាន (주소):</strong> {fullAddress || 'មិនទាន់ជ្រើសរើសអាសយដ្ឋាន'}
                  </p>
                  {fullCombinedMemo && (
                    <p className="truncate text-amber-600 dark:text-amber-400">
                      <strong>ចំណាំដឹកជញ្ជូន (메모):</strong> {fullCombinedMemo}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 w-full grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownload}
                  disabled={!qrDataUrl}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md cursor-pointer ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
                  }`}
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>បានទាញយក!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>ទាញយក QR (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 border cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>បានចម្លង!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>ចម្លងទិន្នន័យ QR</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Open Link if web / map mode */}
              {(activeMode === 'kakaomap' || activeMode === 'navermap' || activeMode === 'driver_verify') && (
                <a
                  href={activeMode === 'kakaomap' ? kakaoMapPayload : activeMode === 'navermap' ? naverMapPayload : driverVerifyPayload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  <span>សាកល្បងបើកតំណភ្ជាប់ក្នុងផ្ទាំងថ្មី (Test open link)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Footer with note */}
            <div className={`px-4 py-2.5 text-center text-[11px] border-t ${
              isDarkMode ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
            }`}>
              <span className="flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-red-500" />
                អ្នកដឹកជញ្ជូនគ្រាន់តែបើកកាមេរ៉ាទូរស័ព្ទ ឬកម្មវិធី 택배 ដើម្បីស្កេន និងបញ្ជាក់ការទទួល
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
