import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  MapPinOff,
  RotateCw,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  X,
  Search
} from 'lucide-react';
import {
  AddressRecord,
  validateAndCorrectKoreanAddress,
  AddressValidationDiagnosis,
  extractDetailFromSearchQuery,
  extractBuildingOrCompanyName,
  deduplicateBuildingOrCompany
} from '../data/koreanAddresses';
import { DaumPostcodeData } from './OfficialPostcodeModal';
import { Icon3DClearReset } from './Icons3D';

interface DaumThemeConfig {
  bgColor?: string;
  searchBgColor?: string;
  contentBgColor?: string;
  pageBgColor?: string;
  textColor?: string;
  queryTextColor?: string;
  postcodeTextColor?: string;
  emphTextColor?: string;
  outlineColor?: string;
  [key: string]: string | undefined;
}

export interface OfficialAddressSelectionPayload {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  bname: string;
  roadName: string;
  jibunPart: string;
  buildingName: string;
  preservedDetail?: string;
  selectedType: 'R' | 'J';
  searchQuery?: string;
}

interface InlineOfficialPostcodeProps {
  isDarkMode?: boolean;
  addressType: 'R' | 'J';
  onSwitchAddressType: (type: 'R' | 'J') => void;
  onSelectOfficialAddress: (data: OfficialAddressSelectionPayload) => void;
  onSelectDirectoryRecord: (rec: AddressRecord, selectedType?: 'R' | 'J', typedQuery?: string) => void;
  externalSearchTrigger?: { query: string; detail?: string; timestamp: number } | null;
  resetTrigger?: number;
  mapLocationNotFound?: boolean;
  mapNotFoundQuery?: string;
  onDismissMapNotFound?: () => void;
  onOfficialSearchZeroResults?: (query: string) => void;
  onResetForm?: () => void;
}

const DARK_DAUM_THEME: DaumThemeConfig = {
  bgColor: '#0F172A',
  searchBgColor: '#1E293B',
  contentBgColor: '#131C31',
  pageBgColor: '#0F172A',
  textColor: '#F8FAFC',
  queryTextColor: '#F8FAFC',
  postcodeTextColor: '#F87171',
  emphTextColor: '#60A5FA',
  outlineColor: '#334155'
};

export const InlineOfficialPostcode: React.FC<InlineOfficialPostcodeProps> = ({
  isDarkMode = false,
  addressType,
  onSwitchAddressType,
  onSelectOfficialAddress,
  onSelectDirectoryRecord,
  externalSearchTrigger,
  resetTrigger,
  mapLocationNotFound = false,
  mapNotFoundQuery = '',
  onDismissMapNotFound,
  onOfficialSearchZeroResults,
  onResetForm
}) => {
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const [pendingDetail, setPendingDetail] = useState<string>('');
  const [sdkLoaded, setSdkLoaded] = useState<boolean>(false);
  const [activeQueryLabel, setActiveQueryLabel] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<AddressValidationDiagnosis | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  // State tracking when an address searched in the official 우체국 table is not found
  const [isPostcodeNotFound, setIsPostcodeNotFound] = useState<boolean>(false);
  const [postcodeNotFoundQuery, setPostcodeNotFoundQuery] = useState<string>('');
  const [notFoundAnimKey, setNotFoundAnimKey] = useState<number>(0);

  const pendingDetailRef = useRef<string>('');
  useEffect(() => {
    pendingDetailRef.current = pendingDetail;
  }, [pendingDetail]);

  const activeQueryRef = useRef<string>('');
  useEffect(() => {
    activeQueryRef.current = activeQueryLabel;
  }, [activeQueryLabel]);

  // Keep latest callbacks in refs so parent re-renders never recreate or detach the embedded iframe
  const onSelectOfficialRef = useRef(onSelectOfficialAddress);
  useEffect(() => {
    onSelectOfficialRef.current = onSelectOfficialAddress;
  }, [onSelectOfficialAddress]);

  const onDismissMapNotFoundRef = useRef(onDismissMapNotFound);
  useEffect(() => {
    onDismissMapNotFoundRef.current = onDismissMapNotFound;
  }, [onDismissMapNotFound]);

  const onOfficialSearchZeroRef = useRef(onOfficialSearchZeroResults);
  useEffect(() => {
    onOfficialSearchZeroRef.current = onOfficialSearchZeroResults;
  }, [onOfficialSearchZeroResults]);

  const isDarkRef = useRef(isDarkMode);
  useEffect(() => {
    isDarkRef.current = isDarkMode;
  }, [isDarkMode]);

  const embedOfficialSearch = useCallback((queryText: string, forceDark?: boolean) => {
    if (!embedContainerRef.current) return;
    const trimmedQuery = queryText.trim();
    setActiveQueryLabel(trimmedQuery);
    activeQueryRef.current = trimmedQuery;

    const useDarkTheme = forceDark !== undefined ? forceDark : isDarkRef.current;

    if (window.daum && window.daum.Postcode) {
      try {
        embedContainerRef.current.innerHTML = '';
        const postcode = new window.daum.Postcode({
          width: '100%',
          height: '100%',
          theme: useDarkTheme ? DARK_DAUM_THEME : undefined,
          onsearch: (searchData: { q: string; count: number }) => {
            const q = (searchData?.q || '').trim();
            const count = typeof searchData?.count === 'number' ? searchData.count : 0;
            setActiveQueryLabel(q);
            activeQueryRef.current = q;

            // Extract unit details (dong/층/호, building/company) from user search input
            if (q) {
              const diag = validateAndCorrectKoreanAddress(q);
              if (diag.extractedDetail) {
                setPendingDetail(diag.extractedDetail);
                pendingDetailRef.current = diag.extractedDetail;
              }
            }

            if (count === 0 && q) {
              setIsPostcodeNotFound(true);
              setPostcodeNotFoundQuery(q);
              setNotFoundAnimKey((prev) => prev + 1);
              const diag = validateAndCorrectKoreanAddress(q);
              setDiagnosis(diag);
              onOfficialSearchZeroRef.current?.(q);
            } else {
              setIsPostcodeNotFound(false);
              setPostcodeNotFoundQuery('');
              onDismissMapNotFoundRef.current?.();
              if (q) {
                const diag = validateAndCorrectKoreanAddress(q);
                setDiagnosis(diag.hasIssue ? diag : null);
              } else {
                setDiagnosis(null);
              }
            }
          },
          oncomplete: (data: DaumPostcodeData) => {
            setIsPostcodeNotFound(false);
            setPostcodeNotFoundQuery('');
            onDismissMapNotFoundRef.current?.();

            const chosenType: 'R' | 'J' = data.userSelectedType === 'J' ? 'J' : 'R';
            const fullRoad = data.roadAddress || data.autoRoadAddress || data.address || '';
            const fullJibun = data.jibunAddress || data.autoJibunAddress || data.address || '';

            const roadPart = fullRoad
              .replace(data.sido, '')
              .replace(data.sigungu, '')
              .trim();

            const jibunPart = fullJibun
              .replace(data.sido, '')
              .replace(data.sigungu, '')
              .trim();

            const combinedBname = [data.bname1, data.bname2 || data.bname]
              .filter(Boolean)
              .join(' ')
              .trim();

            // Extract unit details (dong/층/호, building/company name) from user search query
            const rawQuery = (data.query || activeQueryRef.current || pendingDetailRef.current || '').trim();
            const extractedDetail = extractDetailFromSearchQuery(
              rawQuery,
              fullRoad,
              fullJibun,
              data.buildingName || ''
            );
            const rawFinal =
              extractedDetail || pendingDetailRef.current || data.buildingName || '';
            const finalDetail = deduplicateBuildingOrCompany(rawFinal, data.buildingName || '');
            const rawBName =
              data.buildingName || extractBuildingOrCompanyName(finalDetail) || '';
            const detectedBName = deduplicateBuildingOrCompany(rawBName);

            // Defer React state update until Daum's internal postMessage event handler completes
            setTimeout(() => {
              onSelectOfficialRef.current({
                zonecode: data.zonecode,
                roadAddress: fullRoad,
                jibunAddress: fullJibun,
                sido: data.sido,
                sigungu: data.sigungu,
                bname: combinedBname || data.bname,
                roadName: roadPart || data.roadname,
                jibunPart: jibunPart || combinedBname || data.bname,
                buildingName: detectedBName,
                preservedDetail: finalDetail || undefined,
                selectedType: chosenType,
                searchQuery: rawQuery
              });
            }, 0);
          }
        });
        postcode.embed(embedContainerRef.current, {
          q: trimmedQuery || undefined,
          autoClose: false
        });
        setSdkLoaded(true);
      } catch {
        setSdkLoaded(false);
      }
    } else {
      setSdkLoaded(false);
    }
  }, []);

  // Initial mount: embed the official Korea Post search once on page load
  useEffect(() => {
    let attempts = 0;
    let timerId: number | undefined;
    const tryInit = () => {
      if (window.daum && window.daum.Postcode && embedContainerRef.current) {
        embedOfficialSearch('', isDarkRef.current);
      } else if (attempts < 15) {
        attempts += 1;
        timerId = window.setTimeout(tryInit, 200);
      }
    };
    tryInit();
    return () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [embedOfficialSearch]);

  // Re-apply Daum Postcode theme when Dark Mode is toggled
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (sdkLoaded) {
      embedOfficialSearch(activeQueryRef.current, isDarkMode);
    }
  }, [isDarkMode, sdkLoaded, embedOfficialSearch]);

  // Listen to external search triggers (e.g. when user pastes customer message below)
  useEffect(() => {
    if (externalSearchTrigger && externalSearchTrigger.query) {
      if (externalSearchTrigger.detail !== undefined) {
        setPendingDetail(externalSearchTrigger.detail);
        pendingDetailRef.current = externalSearchTrigger.detail;
      }
      const diag = validateAndCorrectKoreanAddress(externalSearchTrigger.query);
      setDiagnosis(diag);
      if (diag.isUnrecognized && diag.matchedRecords.length === 0) {
        setIsPostcodeNotFound(true);
        setPostcodeNotFoundQuery(externalSearchTrigger.query);
        setNotFoundAnimKey((prev) => prev + 1);
      } else {
        setIsPostcodeNotFound(false);
        setPostcodeNotFoundQuery('');
      }
      embedOfficialSearch(diag.correctedQuery || externalSearchTrigger.query);
    }
  }, [externalSearchTrigger, embedOfficialSearch]);

  // Trigger animation key bump when map reports location not found
  useEffect(() => {
    if (mapLocationNotFound) {
      setNotFoundAnimKey((prev) => prev + 1);
    }
  }, [mapLocationNotFound, mapNotFoundQuery]);

  // Listen to resetTrigger to wipe all search state clean
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setPendingDetail('');
      pendingDetailRef.current = '';
      setActiveQueryLabel('');
      setDiagnosis(null);
      setIsPostcodeNotFound(false);
      setPostcodeNotFoundQuery('');
      onDismissMapNotFoundRef.current?.();
      embedOfficialSearch('');
    }
  }, [resetTrigger, embedOfficialSearch]);

  const handleDismissNotFound = () => {
    setIsPostcodeNotFound(false);
    setPostcodeNotFoundQuery('');
    onDismissMapNotFound?.();
  };

  const handleReloadTable = () => {
    setIsReloading(true);
    setDiagnosis(null);
    setActiveQueryLabel('');
    setIsPostcodeNotFound(false);
    setPostcodeNotFoundQuery('');
    onDismissMapNotFound?.();
    embedOfficialSearch('');
    setTimeout(() => setIsReloading(false), 450);
  };

  const isAddressNotFound =
    isPostcodeNotFound ||
    mapLocationNotFound ||
    Boolean(diagnosis?.isUnrecognized && diagnosis.matchedRecords.length === 0);

  const displayedNotFoundQuery =
    postcodeNotFoundQuery ||
    mapNotFoundQuery ||
    diagnosis?.originalInput ||
    activeQueryLabel;

  return (
    <motion.div
      id="official-postcode-table"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow duration-300"
    >
      {/* Top Header & UI Action Buttons Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block truncate">
              តារាងស្វែងរកអាសយដ្ឋាន 우체국 ផ្លូវការផ្ទាល់
            </span>
            {activeQueryLabel && (
              <span className="block text-[11px] font-medium text-red-700 truncate">
                កំពុងបង្ហាញលទ្ធផល៖ &ldquo;{activeQueryLabel}&rdquo;
              </span>
            )}
          </div>
        </div>

        {/* Interactive UI Buttons inside Official Table Header */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode Switcher Buttons (도로명 vs 지번) */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSwitchAddressType('R')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                addressType === 'R'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              도로명 (ឈ្មោះផ្លូវ)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onSwitchAddressType('J')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                addressType === 'J'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              지번 (ភូមិ/សង្កាត់)
            </motion.button>
          </div>

          {/* Expand / Collapse Table Height Button */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="min-h-[32px] px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title={isExpanded ? 'បង្រួមតារាង' : 'ពង្រីកតារាងឱ្យធំ'}
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
          </motion.button>

          {/* Reset / Clear All Form & Table Button (Same capability as in Section 02) */}
          {onResetForm && (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => {
                handleReloadTable();
                onResetForm();
              }}
              className="min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl border border-red-200 dark:border-red-900/60 bg-gradient-to-r from-red-50 via-white to-red-50/60 dark:from-red-950/40 dark:via-slate-800 dark:to-red-950/30 hover:border-red-400 dark:hover:border-red-700 text-red-800 dark:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs group"
              title="សម្អាតព័ត៌មានចាស់ទាំងអស់ និងបញ្ចូលថ្មី"
            >
              <motion.div
                whileHover={{ rotate: -180 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="shrink-0"
              >
                <Icon3DClearReset size={18} className="w-4 h-4 text-red-600 dark:text-red-400" />
              </motion.div>
              <span>សម្អាតបញ្ចូលថ្មី</span>
            </motion.button>
          )}

          {/* Reload / Reset Official Table Button */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleReloadTable}
            className="min-h-[32px] px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            title="ផ្ទុកតារាងស្វែងរកឡើងវិញ"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-red-700' : ''}`} />
            <span>ផ្ទុកឡើងវិញ</span>
          </motion.button>
        </div>
      </div>

      {/* Animated In-Form "Address Location Not Found" Banner directly inside "តារាងស្វែងរកអាសយដ្ឋាន 우체국 ផ្លូវការផ្ទាល់" */}
      <AnimatePresence mode="wait">
        {isAddressNotFound && (
          <motion.div
            key={`postcode-not-found-banner-${notFoundAnimKey}`}
            initial={{ opacity: 0, height: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, height: 'auto', y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, y: -8, scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 24
            }}
            role="alert"
            aria-live="assertive"
            className="relative overflow-hidden bg-gradient-to-r from-red-50 via-amber-50/90 to-red-50 border-b border-red-200"
          >
            {/* Animated Shimmer Accent Strip at Top of Alert */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent pointer-events-none"
            />

            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.45, delay: 0.08, ease: 'easeInOut' }}
              className="px-4 py-3.5 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Animated Pulsing MapPinOff Icon Badge */}
                <div className="relative shrink-0 mt-0.5">
                  <motion.span
                    animate={{ scale: [1, 1.45, 1], opacity: [0.45, 0, 0.45] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-xl bg-red-400 pointer-events-none"
                  />
                  <motion.div
                    animate={{ y: [0, -2, 0], rotate: [0, -6, 6, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm"
                  >
                    <MapPinOff className="w-4 h-4" />
                  </motion.div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-extrabold tracking-wide uppercase">
                      우체국 · ផែនទី
                    </span>
                    {displayedNotFoundQuery && (
                      <span className="px-2 py-0.5 rounded-md bg-white/90 border border-red-200 text-red-800 font-mono text-[11px] font-bold truncate max-w-[240px]">
                        &ldquo;{displayedNotFoundQuery}&rdquo;
                      </span>
                    )}
                  </div>

                  {/* Exact user-requested Khmer message with smooth text entrance */}
                  <motion.p
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-xs sm:text-sm font-bold text-red-950 leading-relaxed"
                  >
                    រកមិនឃើញទីតាំងអាសយដ្ឋាននេះនៅលើផែនទីទេ សូមពិនិត្យឈ្មោះផ្លូវ ឬភូមិ/សង្កាត់ម្តងទៀត។
                  </motion.p>

                  <p className="text-[11px] text-amber-900 font-medium">
                    ឧទាហរណ៍ត្រឹមត្រូវ៖ <span className="font-mono font-bold">경기 부천시 원미구 부천로 276번길 16-16</span> (도로명) ឬ{' '}
                    <span className="font-mono font-bold">약대동 168-14</span> (지번)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={handleReloadTable}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                  title="សម្អាត និងស្វែងរកអាសយដ្ឋានថ្មី"
                >
                  <Search className="w-3 h-3" />
                  <span className="hidden sm:inline">ស្វែងរកថ្មី</span>
                </motion.button>

                <button
                  type="button"
                  onClick={handleDismissNotFound}
                  className="w-7 h-7 rounded-lg text-red-700/70 hover:text-red-900 hover:bg-red-100/80 flex items-center justify-center transition-colors cursor-pointer"
                  title="បិទសារជូនដំណឹង"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Address Error Detection & Auto-Correction Banner */}
      <AnimatePresence mode="wait">
        {diagnosis && diagnosis.hasIssue && (
          <motion.div
            key="diagnosis-error-banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 bg-amber-50/90 border-b border-amber-200 space-y-2.5 overflow-hidden"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-amber-950">
                  បញ្ជាក់កំហុសអាសយដ្ឋាន និងការកែតម្រូវតាមស្តង់ដារ 우체국៖
                </p>
                <p className="text-amber-900">
                  អាសយដ្ឋានដែលបានស្វែងរក៖{' '}
                  <span className="font-mono line-through text-red-700 font-semibold">
                    {diagnosis.originalInput}
                  </span>
                </p>
                <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                  {diagnosis.issueMessagesKhmer.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
                {diagnosis.correctedQuery && !diagnosis.isUnrecognized && (
                  <p className="text-emerald-900 font-semibold pt-1">
                    អាសយដ្ឋានគោលដែលត្រឹមត្រូវសម្រាប់ស្វែងរក៖{' '}
                    <span className="font-mono font-bold underline">
                      {diagnosis.correctedQuery}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Quick Selectable Official Address Result Card Items */}
      <AnimatePresence>
        {diagnosis && diagnosis.matchedRecords.length > 0 && (
          <motion.div
            key="diagnosis-matched-records"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="p-3.5 bg-[#FAF9F6] border-b border-slate-200 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                អាសយដ្ឋានផ្លូវការដែលត្រឹមត្រូវ (សូមចុចជ្រើសរើសទម្រង់ 도로명 ឬ 지번)៖
              </span>
            </div>

            <div className="space-y-2">
              {diagnosis.matchedRecords.map((rec, idx) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-red-700 text-sm tabular-nums">
                        {rec.zonecode}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800">{rec.regionTagKhmer}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">{rec.buildingName}</span>
                    </div>
                  </div>

                  {/* Option 1: Select Road Name Address (도로명주소) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-xs sm:text-sm text-slate-900 min-w-0">
                      <span className="inline-block font-mono text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded mr-2">
                        도로명
                      </span>
                      <span className="font-semibold">{rec.roadAddress}</span>
                      <span className="text-slate-500 text-xs ml-1">({rec.bname})</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => {
                        handleDismissNotFound();
                        onSelectDirectoryRecord(
                          rec,
                          'R',
                          activeQueryRef.current || displayedNotFoundQuery
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        addressType === 'R'
                          ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      ជ្រើសរើស 도로명
                    </motion.button>
                  </div>

                  {/* Option 2: Select Jibun Address (지번주소) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="text-xs sm:text-sm text-slate-800 min-w-0">
                      <span className="inline-block font-mono text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mr-2">
                        지번
                      </span>
                      <span className="font-semibold">{rec.jibunAddress}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => {
                        handleDismissNotFound();
                        onSelectDirectoryRecord(
                          rec,
                          'J',
                          activeQueryRef.current || displayedNotFoundQuery
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        addressType === 'J'
                          ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                          : 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      ជ្រើសរើស 지번
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Embedded Korea Post / Daum Postcode Container */}
      <motion.div
        animate={{ height: isExpanded ? 560 : 420 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative w-full bg-slate-50"
      >
        <div ref={embedContainerRef} className="w-full h-full" />

        {/* Animated Floating Card Inside the Embedded 우체국 Search Viewport when Address is Not Found */}
        <AnimatePresence>
          {isAddressNotFound && (
            <motion.div
              key={`in-viewport-not-found-card-${notFoundAnimKey}`}
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 22
              }}
              className="absolute bottom-3.5 left-3.5 right-3.5 z-20 pointer-events-auto rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-red-500/50 shadow-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <motion.div
                    animate={{
                      scale: [1, 1.12, 1],
                      rotate: [0, -8, 8, -4, 4, 0]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-10 h-10 rounded-xl bg-red-600/25 border border-red-400/50 flex items-center justify-center shrink-0 text-red-400"
                  >
                    <MapPinOff className="w-5 h-5" />
                  </motion.div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-extrabold text-white">
                        រកមិនឃើញទីតាំងអាសយដ្ឋាន
                      </span>
                      {displayedNotFoundQuery && (
                        <span className="font-mono text-xs font-bold text-amber-300 truncate max-w-[220px]">
                          &ldquo;{displayedNotFoundQuery}&rdquo;
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      រកមិនឃើញទីតាំងអាសយដ្ឋាននេះនៅលើផែនទីទេ សូមពិនិត្យឈ្មោះផ្លូវ ឬភូមិ/សង្កាត់ម្តងទៀត។
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismissNotFound}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-600 text-slate-200 hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="បិទផ្ទាំងជូនដំណឹង"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!sdkLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <MapPin className="w-7 h-7 text-red-600 mb-2 animate-bounce" />
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              កំពុងផ្ទុកតារាងស្វែងរកអាសយដ្ឋាន 우체국 ផ្លូវការផ្ទាល់...
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

