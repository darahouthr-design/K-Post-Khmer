import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Star,
  Copy,
  Check,
  Trash2,
  ArrowUpRight,
  BookmarkCheck,
  Plus,
  AlertTriangle,
  X,
  CheckCircle2,
  Clock,
  Printer,
  Bluetooth,
  QrCode as QrCodeIcon,
  ShieldCheck
} from 'lucide-react';
import { SavedCustomerAddress } from '../data/koreanAddresses';
import { Icon3DQRCode } from './Icons3D';

interface SavedAddressesSectionProps {
  savedAddresses: SavedCustomerAddress[];
  onLoadAddress: (addr: SavedCustomerAddress) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  onCopyFullFromHistory: (addr: SavedCustomerAddress) => void;
  onScrollToBuilder: () => void;
  onOpenQRForAddress?: (addr: SavedCustomerAddress) => void;
  onRecordDriverScanForAddress?: (id: string) => void;
  onOpenPrintForAddress?: (addr: SavedCustomerAddress) => void;
}

const TAG_LABELS: Record<SavedCustomerAddress['labelTag'], string> = {
  vip: 'អតិថិជនប្រចាំ (VIP)',
  customer: 'អតិថិជនទូទៅ',
  dormitory: 'អន្តេវាសិកដ្ឋាន / រោងចក្រ',
  home: 'អាសយដ្ឋានផ្ទាល់ខ្លួន'
};

type HistoryFilter = 'all' | 'printed' | 'unprinted' | 'scanned' | 'pending' | 'frequent' | 'favorite' | 'dormitory';

export const SavedAddressesSection: React.FC<SavedAddressesSectionProps> = ({
  savedAddresses,
  onLoadAddress,
  onToggleFavorite,
  onDeleteAddress,
  onCopyFullFromHistory,
  onScrollToBuilder,
  onOpenQRForAddress,
  onRecordDriverScanForAddress,
  onOpenPrintForAddress
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<SavedCustomerAddress | null>(null);

  const printedCount = savedAddresses.filter((a) => Boolean(a.isPrinted || (a.printCount && a.printCount > 0))).length;
  const unprintedCount = savedAddresses.filter((a) => !a.isPrinted && (!a.printCount || a.printCount === 0)).length;
  const scannedCount = savedAddresses.filter((a) => (a.qrScanCount || 0) > 0).length;
  const pendingCount = savedAddresses.filter((a) => !a.qrScanCount || a.qrScanCount === 0).length;
  const favoriteCount = savedAddresses.filter((a) => a.isFavorite).length;

  const filteredList = savedAddresses
    .filter((item) => {
      const isItemPrinted = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));
      if (activeFilter === 'printed' && !isItemPrinted) return false;
      if (activeFilter === 'unprinted' && isItemPrinted) return false;
      if (activeFilter === 'scanned' && (!item.qrScanCount || item.qrScanCount === 0)) return false;
      if (activeFilter === 'pending' && item.qrScanCount && item.qrScanCount > 0) return false;
      if (activeFilter === 'favorite' && !item.isFavorite) return false;
      if (activeFilter === 'dormitory' && item.labelTag !== 'dormitory') return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.recipientName.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.zonecode.includes(q) ||
        item.roadAddress.toLowerCase().includes(q) ||
        item.detailAddress.toLowerCase().includes(q) ||
        (item.noteKhmer && item.noteKhmer.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (activeFilter === 'frequent') {
        return b.useCount - a.useCount;
      }
      if (activeFilter === 'printed') {
        return (b.printCount || 0) - (a.printCount || 0);
      }
      if (activeFilter === 'scanned') {
        return (b.qrScanCount || 0) - (a.qrScanCount || 0);
      }
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return b.useCount - a.useCount;
    });

  const handleQuickCopy = (addr: SavedCustomerAddress) => {
    onCopyFullFromHistory(addr);
    setCopiedId(addr.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const confirmPermanentDelete = () => {
    if (!pendingDeleteItem) return;
    onDeleteAddress(pendingDeleteItem.id);
    setPendingDeleteItem(null);
  };

  return (
    <section id="history-section" className="space-y-6">
      {/* Permanent Delete Confirmation Modal */}
      <AnimatePresence>
        {pendingDeleteItem && (
          <motion.div
            key="delete-confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPendingDeleteItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      បញ្ជាក់ការលុបអាសយដ្ឋានជាអចិន្ត្រៃយ៍
                    </h3>
                    <p className="text-xs text-red-700 font-medium">
                      ទិន្នន័យដែលលុបហើយមិនអាចត្រឡប់មកវិញបានទេ!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingDeleteItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-slate-900">{pendingDeleteItem.recipientName}</p>
                <p className="text-slate-600 font-mono">{pendingDeleteItem.phone}</p>
                <p className="text-slate-700 leading-snug">
                  [{pendingDeleteItem.zonecode}] {pendingDeleteItem.roadAddress} {pendingDeleteItem.detailAddress}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingDeleteItem(null)}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  បោះបង់
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={confirmPermanentDelete}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  បញ្ជាក់ការលុបជាអចិន្ត្រៃយ៍
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-red-700 tracking-wide">
            សៀវភៅអាសយដ្ឋានអតិថិជន · FREQUENT RECIPIENT HISTORY & REALTIME SYNC
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            ប្រវត្តិអាសយដ្ឋានដែលបានរក្សាទុក ({savedAddresses.length})
          </h2>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: `ទាំងអស់ (${savedAddresses.length})` },
            { id: 'printed', label: `🖨️ បានព្រីនរួច (${printedCount})` },
            { id: 'unprinted', label: `⏳ មិនទាន់ព្រីន (${unprintedCount})` },
            { id: 'scanned', label: `✅ ស្កេនរួច (${scannedCount})` },
            { id: 'pending', label: `📦 រង់ចាំស្កេន (${pendingCount})` },
            { id: 'favorite', label: `⭐ ចំណាំផ្កាយ (${favoriteCount})` },
            { id: 'frequent', label: '🔥 ប្រើញឹកញាប់' },
            { id: 'dormitory', label: '🏢 រោងចក្រ/អន្តេវាសិកដ្ឋាន' }
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Search Bar (only shown when there are saved addresses) */}
      {savedAddresses.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកក្នុងប្រវត្តិរក្សាទុក៖ ឈ្មោះអតិថិជន, លេខទូរស័ព្ទ (010), លេខកូដប្រៃសណីយ៍ ឬឈ្មោះផ្លូវ..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-red-600 shadow-2xs transition-all"
          />
        </div>
      )}

      {/* Animated Grid of Saved Address Card Items */}
      {filteredList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 text-center"
        >
          <BookmarkCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {savedAddresses.length === 0
              ? 'មិនទាន់មានអាសយដ្ឋានត្រូវបានរក្សាទុកនៅឡើយទេ'
              : 'មិនមានអាសយដ្ឋានត្រូវនឹងការស្វែងរកនេះទេ'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            {savedAddresses.length === 0
              ? 'អាសយដ្ឋាននឹងត្រូវបានរក្សាទុកនៅទីនេះ លុះត្រាតែលោកអ្នកបញ្ចូលព័ត៌មានរួចចុចប៊ូតុង «រក្សាទុកអាសយដ្ឋាននេះទុកប្រើលើកក្រោយ»។'
              : 'សូមសាកល្បងស្វែងរកដោយប្រើឈ្មោះ ឬលេខទូរស័ព្ទផ្សេង ឬប្តូរ Filter ខាងលើ។'}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={onScrollToBuilder}
            className="mt-4 min-h-[44px] px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            បញ្ចូល និងរក្សាទុកអាសយដ្ឋានអតិថិជនថ្មី
          </motion.button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredList.map((item, idx) => {
              const fullRoadLine = `[${item.zonecode}] ${item.roadAddress}${
                item.detailAddress ? `, ${item.detailAddress}` : ''
              }${item.bname ? ` (${item.bname})` : ''}`;

              const isItemScanned = (item.qrScanCount || 0) > 0;
              const isItemPrinted = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-red-300 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden"
                >
                  {/* Top Edge Accent Bar (Green if Printed, Amber if Unprinted) */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isItemPrinted ? 'bg-emerald-500' : 'bg-amber-400'
                  }`} />

                  <div>
                    {/* Metadata Line */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-red-700">{TAG_LABELS[item.labelTag]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">ប្រើ {item.useCount} ដង</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{item.lastUsedAt}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          type="button"
                          onClick={() => onToggleFavorite(item.id)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                          title={item.isFavorite ? 'ដកចេញពីចំណាំផ្កាយ' : 'ដាក់ជាចំណាំផ្កាយ'}
                        >
                          <Star
                            className={`w-4 h-4 transition-transform ${
                              item.isFavorite ? 'fill-amber-400 text-amber-500 scale-110' : 'text-slate-400'
                            }`}
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          type="button"
                          onClick={() => setPendingDeleteItem(item)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="លុបអាសយដ្ឋាននេះជាអចិន្ត្រៃយ៍"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Recipient & Phone */}
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">{item.recipientName}</h3>
                      <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums shrink-0">
                        {item.phone}
                      </span>
                    </div>

                    {/* Official Korea Post Address Block */}
                    <div className="mt-3 p-3 rounded-xl bg-[#FAF9F6] border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-700 tabular-nums">
                          우편번호 {item.zonecode}
                        </span>
                        {item.entranceCode && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-600 font-mono tabular-nums">
                              현관: {item.entranceCode}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug break-keep">
                        {fullRoadLine}
                      </p>
                      {item.jibunAddress && (
                        <p className="text-xs text-slate-500">지번: {item.jibunAddress}</p>
                      )}
                      {item.deliveryMemo && (
                        <p className="text-xs text-slate-700 pt-1 border-t border-slate-200/70 mt-1.5">
                          메모: {item.deliveryMemo}
                        </p>
                      )}
                    </div>

                    {item.noteKhmer && (
                      <p className="text-xs text-slate-500 mt-2.5">ចំណាំ៖ {item.noteKhmer}</p>
                    )}

                    {/* Prominent Printing Complete vs Not Printed Indicator Banner */}
                    <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                      isItemPrinted
                        ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-2xs'
                        : 'bg-amber-50/80 border-amber-200/90 text-amber-950'
                    }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {isItemPrinted ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-2xs">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-bold ${isItemPrinted ? 'text-emerald-800' : 'text-slate-800'}`}>
                              {isItemPrinted
                                ? '✅ Printing complete (បានព្រីនរួចរាល់ · 출력완료)'
                                : '⏳ មិនទាន់បានព្រីន (Not printed · 미출력)'}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                              isItemPrinted ? 'bg-emerald-600 text-white' : 'bg-amber-300 text-slate-900'
                            }`}>
                              {isItemPrinted ? `ព្រីន ${item.printCount || 1} ដង` : 'មិនទាន់ព្រីន'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {isItemPrinted ? (
                              <>
                                <span>កាលបរិច្ឆេទព្រីន៖ </span>
                                <strong className="font-mono text-emerald-800">{item.lastPrintedAt || 'ទើបតែព្រីន'}</strong>
                              </>
                            ) : (
                              <span>ត្រៀមសម្រាប់ព្រីនវិក្កយបត្រ Bluetooth ចេញម៉ាស៊ីន</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Driver QR Scan Verification Status */}
                    <div className={`mt-2 p-2 rounded-xl border flex items-center justify-between gap-2 text-[11px] transition-all ${
                      isItemScanned
                        ? 'bg-blue-50/70 border-blue-200/80 text-blue-950'
                        : 'bg-slate-50 border-slate-200/70 text-slate-600'
                    }`}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isItemScanned ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">
                          {isItemScanned
                            ? `អ្នកដឹកបានស្កេនរួច (${item.qrScanCount} ដង · ${item.lastQrScannedAt || ''})`
                            : 'រង់ចាំអ្នកដឹកស្កេន QR Code'}
                        </span>
                      </div>

                      {/* Quick scan record action button */}
                      {onRecordDriverScanForAddress && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => onRecordDriverScanForAddress(item.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer shrink-0"
                          title="កត់ត្រាការស្កេនរបស់អ្នកដឹកបន្ថែម"
                        >
                          +1 ស្កេន
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Animated Action Buttons Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-12 gap-1.5 items-center">
                    {/* Load to Builder Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => onLoadAddress(item)}
                      className="col-span-4 min-h-[38px] px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>យកប្រើ</span>
                    </motion.button>

                    {/* Bluetooth Thermal Print Button (100% Waybill Printer Fidelity) */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => onOpenPrintForAddress && onOpenPrintForAddress(item)}
                      className={`col-span-4 min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                        isItemPrinted
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title="ព្រីនស្លាកឥវ៉ាន់តាមម៉ាស៊ីនព្រីនកម្តៅ Bluetooth (58mm/70mm/80mm)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isItemPrinted ? 'ព្រីនម្តងទៀត' : 'ព្រីន Bluetooth'}</span>
                    </motion.button>

                    {/* QR Code Modal Button */}
                    {onOpenQRForAddress && (
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => onOpenQRForAddress(item)}
                        className="col-span-2 min-h-[38px] px-1.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                        title="បើក QR Code សម្រាប់អ្នកដឹកស្កេន"
                      >
                        <Icon3DQRCode className="w-3.5 h-3.5" size={14} />
                        <span className="hidden sm:inline">QR</span>
                      </motion.button>
                    )}

                    {/* Quick Copy Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => handleQuickCopy(item)}
                      className="col-span-2 min-h-[38px] px-1.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
                      title="ចម្លងទម្រង់ពេញលេញភ្លាមៗ"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
