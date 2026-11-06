import React, { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Download,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  QrCode as QrCodeIcon,
  Star,
  ExternalLink,
  ShieldCheck,
  Trash2,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Building,
  Home,
  AlertCircle,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { SavedCustomerAddress } from '../data/koreanAddresses';
import { Icon3DAddressBook, Icon3DQRCode } from './Icons3D';

interface CustomerAddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses: SavedCustomerAddress[];
  onLoadAddress: (addr: SavedCustomerAddress) => void;
  onOpenPrintForAddress: (addr: SavedCustomerAddress) => void;
  onOpenQRForAddress: (addr: SavedCustomerAddress) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  onNotify: (msg: string) => void;
}

type BookFilter = 'all' | 'printed' | 'unprinted' | 'scanned' | 'pending' | 'vip' | 'dormitory' | 'home';

const TAG_INFO: Record<SavedCustomerAddress['labelTag'], { label: string; badgeClass: string; icon: string }> = {
  vip: {
    label: 'VIP ប្រចាំ',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    icon: '⭐'
  },
  customer: {
    label: 'អតិថិជនទូទៅ',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: '👤'
  },
  dormitory: {
    label: 'រោងចក្រ / អន្តេវាសិកដ្ឋាន',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    icon: '🏭'
  },
  home: {
    label: 'ផ្ទះផ្ទាល់ខ្លួន',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: '🏠'
  }
};

export const CustomerAddressBookModal: React.FC<CustomerAddressBookModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  onLoadAddress,
  onOpenPrintForAddress,
  onOpenQRForAddress,
  onToggleFavorite,
  onDeleteAddress,
  onNotify
}) => {
  const titleId = useId();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<BookFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedReportAll, setCopiedReportAll] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Filtered list
  const filteredAddresses = useMemo(() => {
    let list = [...savedAddresses];

    // Status filter
    if (activeFilter === 'printed') {
      list = list.filter((item) => Boolean(item.isPrinted || (item.printCount && item.printCount > 0)));
    } else if (activeFilter === 'unprinted') {
      list = list.filter((item) => !item.isPrinted && (!item.printCount || item.printCount === 0));
    } else if (activeFilter === 'scanned') {
      list = list.filter((item) => (item.qrScanCount || 0) > 0 || item.driverStatus === 'scanned');
    } else if (activeFilter === 'pending') {
      list = list.filter((item) => (!item.qrScanCount || item.qrScanCount === 0) && item.driverStatus !== 'scanned');
    } else if (activeFilter === 'vip') {
      list = list.filter((item) => item.labelTag === 'vip' || item.isFavorite);
    } else if (activeFilter === 'dormitory') {
      list = list.filter((item) => item.labelTag === 'dormitory');
    } else if (activeFilter === 'home') {
      list = list.filter((item) => item.labelTag === 'home');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.recipientName.toLowerCase().includes(q) ||
          item.phone.includes(q) ||
          item.zonecode.includes(q) ||
          item.roadAddress.toLowerCase().includes(q) ||
          item.jibunAddress.toLowerCase().includes(q) ||
          (item.detailAddress && item.detailAddress.toLowerCase().includes(q)) ||
          (item.buildingName && item.buildingName.toLowerCase().includes(q)) ||
          (item.deliveryMemo && item.deliveryMemo.toLowerCase().includes(q)) ||
          (item.noteKhmer && item.noteKhmer.toLowerCase().includes(q))
      );
    }

    return list;
  }, [savedAddresses, activeFilter, searchQuery]);

  // Executive Report Metrics
  const metrics = useMemo(() => {
    const total = savedAddresses.length;
    const printed = savedAddresses.filter((x) => Boolean(x.isPrinted || (x.printCount && x.printCount > 0))).length;
    const unprinted = total - printed;
    const scanned = savedAddresses.filter((x) => (x.qrScanCount || 0) > 0 || x.driverStatus === 'scanned').length;
    const vips = savedAddresses.filter((x) => x.labelTag === 'vip' || x.isFavorite).length;
    const printRate = total > 0 ? Math.round((printed / total) * 100) : 0;
    const scanRate = total > 0 ? Math.round((scanned / total) * 100) : 0;

    return { total, printed, unprinted, scanned, vips, printRate, scanRate };
  }, [savedAddresses]);

  // Copy full courier text for a single row
  const handleCopyRow = (item: SavedCustomerAddress) => {
    const ref = item.bname ? ` (${item.bname})` : '';
    const detail = item.detailAddress ? `, ${item.detailAddress}` : '';
    const text = [
      `[우체국 택배 배송지 정보]`,
      `• 받는분: ${item.recipientName}`,
      `• 연락처: ${item.phone}`,
      `• 우편번호: ${item.zonecode}`,
      `• 주소: ${item.roadAddress}${detail}${ref}`,
      item.deliveryMemo ? `• 배송메모: ${item.deliveryMemo}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    onNotify(`បានចម្លងអាសយដ្ឋានរបស់ ${item.recipientName}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export to Excel / CSV with UTF-8 BOM so Khmer and Korean characters open cleanly
  const handleExportCSV = () => {
    if (savedAddresses.length === 0) {
      onNotify('មិនមានទិន្នន័យសម្រាប់ទាញយកទេ');
      return;
    }

    const headers = [
      'លេខរៀង (No.)',
      'ឈ្មោះអ្នកទទួល (받는분)',
      'លេខទូរស័ព្ទ (연락처)',
      'កូដប្រៃសណីយ៍ (우편번호)',
      'អាសយដ្ឋានពេញ (도로명주소)',
      'អាសយដ្ឋានភូមិ/សង្កាត់ (지번주소)',
      'លេខបន្ទប់/អគារ (상세주소)',
      'ឈ្មោះអគារ/ក្រុមហ៊ុន (건물명)',
      'ចំណាំដឹកជញ្ជូន (배송메모)',
      'លេខកូដទ្វារ (공동현관)',
      'ប្រភេទអាសយដ្ឋាន (Tag)',
      'ស្ថានភាពព្រីន (Print Status)',
      'ចំនួនដងព្រីន (Print Count)',
      'ម៉ោងព្រីនចុងក្រោយ (Last Printed)',
      'ស្ថានភាពស្កេន (Driver Scan Status)',
      'ចំនួនស្កេន (Scan Count)',
      'ម៉ោងស្កេនចុងក្រោយ (Last Scanned)',
      'កាលបរិច្ឆេទប្រើ (Last Used)',
      'ចំណាំជាភាសាខ្មែរ (Note)'
    ];

    const rows = filteredAddresses.map((item, idx) => {
      const isPr = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));
      const isSc = Boolean((item.qrScanCount && item.qrScanCount > 0) || item.driverStatus === 'scanned');
      return [
        idx + 1,
        `"${(item.recipientName || '').replace(/"/g, '""')}"`,
        `"${item.phone || ''}"`,
        `"${item.zonecode || ''}"`,
        `"${(item.roadAddress || '').replace(/"/g, '""')}"`,
        `"${(item.jibunAddress || '').replace(/"/g, '""')}"`,
        `"${(item.detailAddress || '').replace(/"/g, '""')}"`,
        `"${(item.buildingName || '').replace(/"/g, '""')}"`,
        `"${(item.deliveryMemo || '').replace(/"/g, '""')}"`,
        `"${(item.entranceCode || '').replace(/"/g, '""')}"`,
        `"${TAG_INFO[item.labelTag]?.label || item.labelTag}"`,
        `"${isPr ? 'បានព្រីនរួច (출력완료)' : 'មិនទាន់ព្រីន (미출력)'}"`,
        item.printCount || 0,
        `"${item.lastPrintedAt || '-'}"`,
        `"${isSc ? 'ស្កេនរួច (기사확인)' : 'រង់ចាំស្កេន'}"`,
        item.qrScanCount || 0,
        `"${item.lastQrScannedAt || '-'}"`,
        `"${item.lastUsedAt || '-'}"`,
        `"${(item.noteKhmer || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `kpost_customer_address_book_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify('✓ បានទាញយករបាយការណ៍សៀវភៅអាសយដ្ឋាន (CSV / Excel) រួចរាល់!');
  };

  // Bulk copy formatted delivery text of all filtered rows
  const handleCopyAllReportText = () => {
    if (filteredAddresses.length === 0) {
      onNotify('មិនមានទិន្នន័យសម្រាប់ចម្លងទេ');
      return;
    }

    const todayStr = new Date().toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const header = [
      `📦 របាយការណ៍បញ្ជីអាសយដ្ឋានផ្ញើឥវ៉ាន់ប្រៃសណីយ៍កូរ៉េ (우체국 택배 배송대장)`,
      `កាលបរិច្ឆេទ៖ ${todayStr} · ចំនួនសរុប៖ ${filteredAddresses.length} អាសយដ្ឋាន`,
      `==========================================`
    ].join('\n');

    const body = filteredAddresses
      .map((item, idx) => {
        const isPr = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));
        const statusBadge = isPr ? '✓ [បានព្រីន]' : '⏳ [មិនទាន់ព្រីន]';
        const ref = item.bname ? ` (${item.bname})` : '';
        const detail = item.detailAddress ? `, ${item.detailAddress}` : '';

        return [
          `${idx + 1}. ${statusBadge} ${item.recipientName} (${item.phone})`,
          `   우편번호: [${item.zonecode}]`,
          `   주소: ${item.roadAddress}${detail}${ref}`,
          item.deliveryMemo ? `   배송메모: ${item.deliveryMemo}` : '',
          item.entranceCode ? `   공동현관: ${item.entranceCode}` : '',
          item.noteKhmer ? `   ចំណាំ: ${item.noteKhmer}` : ''
        ]
          .filter(Boolean)
          .join('\n');
      })
      .join('\n\n');

    const fullReport = `${header}\n\n${body}`;
    navigator.clipboard.writeText(fullReport);
    setCopiedReportAll(true);
    onNotify('✓ បានចម្លងរបាយការណ៍ដឹកជញ្ជូនទាំងអស់រួចរាល់!');
    setTimeout(() => setCopiedReportAll(false), 2500);
  };

  // Browser print of the address ledger summary
  const handlePrintLedger = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onNotify('សូមអនុញ្ញាត Popup នៅក្នុង Browser ដើម្បីព្រីនរបាយការណ៍');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const tableRows = filteredAddresses
      .map(
        (item, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
          <td style="padding: 8px; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; font-weight: bold;">${item.recipientName}<br/><span style="font-weight: normal; color: #475569;">${item.phone}</span></td>
          <td style="padding: 8px; text-align: center; font-family: monospace; font-weight: bold; color: #dc2626;">${item.zonecode}</td>
          <td style="padding: 8px;">${item.roadAddress} ${item.detailAddress ? `, <b>${item.detailAddress}</b>` : ''}</td>
          <td style="padding: 8px; color: #475569;">${item.deliveryMemo || '-'}</td>
          <td style="padding: 8px; text-align: center;">
            ${
              item.isPrinted || (item.printCount && item.printCount > 0)
                ? '<span style="color: #15803d; font-weight: bold;">✓ បានព្រីន</span>'
                : '<span style="color: #b45309;">⏳ មិនទាន់</span>'
            }
          </td>
          <td style="padding: 8px; text-align: center;">
            ${(item.qrScanCount && item.qrScanCount > 0) ? `<span style="color: #15803d;">ស្កេន ${item.qrScanCount}ដង</span>` : '<span style="color: #94a3b8;">-</span>'}
          </td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Customer Address Book Report - K-Post</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Kantumruy Pro", sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 20px; margin-bottom: 4px; color: #dc2626; }
            p { font-size: 12px; color: #64748b; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; padding: 10px 8px; font-size: 12px; text-align: left; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>របាយការណ៍រក្សាទុកក្នុងប្រវត្តិ (고객 주소록 대장)</h1>
          <p>ប្រព័ន្ធប្រៃសណីយ៍កូរ៉េ (우체국 택배) · កាលបរិច្ឆេទបោះពុម្ព៖ ${todayStr} · ចំនួនសរុប៖ ${filteredAddresses.length} នាក់</p>
          <table>
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">ល.រ</th>
                <th>អ្នកទទួល (받는분)</th>
                <th style="text-align: center;">កូដ</th>
                <th>អាសយដ្ឋាន (도로명주소 & 상세주소)</th>
                <th>ចំណាំដឹក (배송메모)</th>
                <th style="text-align: center;">ស្ថានភាពព្រីន</th>
                <th style="text-align: center;">ស្កេនអ្នកដឹក</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLoadAndScroll = (item: SavedCustomerAddress) => {
    onLoadAddress(item);
    onClose();
    setTimeout(() => {
      const target =
        document.getElementById('builder-workspace') ||
        document.getElementById('official-waybill-card');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ scale: 0.94, opacity: 0, y: 18 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 18 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 z-10 my-auto"
        >
          {/* Header Bar */}
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div
                whileHover={{ rotate: -6, scale: 1.1 }}
                className="shrink-0 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner"
              >
                <Icon3DAddressBook size={34} className="w-8 h-8 sm:w-9 sm:h-9" />
              </motion.div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 id={titleId} className="text-base sm:text-lg font-bold tracking-tight truncate flex items-center gap-2">
                    <span>រក្សាទុកក្នុងប្រវត្តិ</span>
                    <span className="hidden sm:inline text-xs font-normal opacity-80">(고객 주소록 대장)</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 border border-white/30 text-white">
                    {savedAddresses.length} អាសយដ្ឋាន
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-blue-100 truncate mt-0.5">
                  ផ្ទាំងពិនិត្យរបាយការណ៍ និងគ្រប់គ្រងអាសយដ្ឋានដែលបានរក្សាទុកដាច់ដោយឡែក (우체국 택배 배송대장)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="បិទផ្ទាំង"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Executive Analytics Metrics Dashboard */}
          <div className="p-3 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {/* Metric 1: Total */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                  អាសយដ្ឋានសរុប
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {metrics.total}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                    100%
                  </span>
                </div>
              </div>

              {/* Metric 2: Printed */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block truncate flex items-center gap-1">
                  <Printer className="w-3 h-3" />
                  <span>បានព្រីនរួច (출력)</span>
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {metrics.printed}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded font-mono">
                    {metrics.printRate}%
                  </span>
                </div>
              </div>

              {/* Metric 3: Pending Print */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
                <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 block truncate flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>មិនទាន់ព្រីន (미출력)</span>
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
                    {metrics.unprinted}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded font-mono">
                    {metrics.total > 0 ? 100 - metrics.printRate : 0}%
                  </span>
                </div>
              </div>

              {/* Metric 4: Driver Scanned */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 shadow-2xs">
                <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400 block truncate flex items-center gap-1">
                  <QrCodeIcon className="w-3 h-3" />
                  <span>អ្នកដឹកស្កេនរួច</span>
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-400">
                    {metrics.scanned}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded font-mono">
                    {metrics.scanRate}%
                  </span>
                </div>
              </div>

              {/* Metric 5: VIP Customers */}
              <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-2xs">
                <span className="text-[11px] font-medium text-purple-700 dark:text-purple-400 block truncate flex items-center gap-1">
                  <Star className="w-3 h-3 fill-purple-500 text-purple-500" />
                  <span>អតិថិជន VIP</span>
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-purple-700 dark:text-purple-400">
                    {metrics.vips}
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded font-mono">
                    VIP / ប្រចាំ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar: Search + Filter Tabs + Export Reports */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shrink-0">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, អាសយដ្ឋាន, កូដប្រៃសណីយ៍, ឬចំណាំ..."
                  className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    សម្អាត
                  </button>
                )}
              </div>

              {/* Export & Report Operations */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 shrink-0">
                {/* Download CSV / Excel */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
                  title="ទាញយករបាយការណ៍ជា Excel / CSV file"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>ទាញយក Excel / CSV</span>
                </motion.button>

                {/* Print Ledger */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handlePrintLedger}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
                  title="ព្រីនតារាងរបាយការណ៍តាមម៉ាស៊ីនព្រីន (Print Summary Ledger)"
                >
                  <Printer className="w-4 h-4" />
                  <span>ព្រីនតារាង</span>
                </motion.button>

                {/* Bulk Copy All */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleCopyAllReportText}
                  className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                  title="ចម្លងអត្ថបទរបាយការណ៍ទាំងអស់សម្រាប់ផ្ញើក្នុង Chat"
                >
                  {copiedReportAll ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>បានចម្លងរួចរាល់!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>ចម្លងរបាយការណ៍</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ទាំងអស់ ({savedAddresses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('printed')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'printed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>បានព្រីនរួច ({metrics.printed})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('unprinted')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'unprinted'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>មិនទាន់ព្រីន ({metrics.unprinted})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('scanned')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'scanned'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <QrCodeIcon className="w-3.5 h-3.5" />
                <span>អ្នកដឹកស្កេនរួច ({metrics.scanned})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('vip')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'vip'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>VIP ប្រចាំ ({metrics.vips})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('dormitory')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'dormitory'
                    ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>រោងចក្រ / អន្តេវាសិកដ្ឋាន</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('home')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'home'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>ផ្ទាល់ខ្លួន</span>
              </button>
            </div>
          </div>

          {/* Ledger Table & Cards View */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            {filteredAddresses.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Icon3DAddressBook size={48} className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  មិនមានទិន្នន័យអាសយដ្ឋានត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះស្វែងរក ឬជ្រើសរើសផ្ទាំងចម្រាញ់ «ទាំងអស់» ឡើងវិញ
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Desktop View Table (hidden on mobile, visible md and up) */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        <th className="py-3 px-3 text-center w-10">ល.រ</th>
                        <th className="py-3 px-3">អ្នកទទួល (받는분 & 연락처)</th>
                        <th className="py-3 px-3 text-center w-24">កូដប្រៃសណីយ៍</th>
                        <th className="py-3 px-3">អាសយដ្ឋានពេញ & បន្ទប់ (주소 & 상세주소)</th>
                        <th className="py-3 px-3">ចំណាំដឹកជញ្ជូន (배송메모)</th>
                        <th className="py-3 px-3 text-center w-28">ស្ថានភាពព្រីន</th>
                        <th className="py-3 px-3 text-center w-24">ស្កេនអ្នកដឹក</th>
                        <th className="py-3 px-3 text-center w-40">ប្រតិបត្តិការ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredAddresses.map((item, idx) => {
                        const isPr = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));
                        const isSc = Boolean((item.qrScanCount && item.qrScanCount > 0) || item.driverStatus === 'scanned');
                        const tag = TAG_INFO[item.labelTag];

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors ${
                              isPr ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono font-medium text-slate-400">
                              {idx + 1}
                            </td>

                            {/* Recipient */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onToggleFavorite(item.id)}
                                  className="text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                                  title="ដាក់ផ្កាយ VIP"
                                >
                                  <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                                </button>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {item.recipientName}
                                </span>
                              </div>
                              <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                                {item.phone}
                              </span>
                              <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded border ${tag?.badgeClass}`}>
                                {tag?.icon} {tag?.label}
                              </span>
                            </td>

                            {/* Postal Code */}
                            <td className="py-3 px-3 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 font-mono font-bold text-xs">
                                {item.zonecode}
                              </span>
                            </td>

                            {/* Address & Detail */}
                            <td className="py-3 px-3 max-w-xs">
                              <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                                {item.roadAddress}
                              </p>
                              {item.detailAddress && (
                                <p className="text-[11px] font-bold text-red-700 dark:text-red-400 mt-0.5">
                                  {item.detailAddress} {item.bname ? `(${item.bname})` : ''}
                                </p>
                              )}
                              {item.noteKhmer && (
                                <p className="text-[10px] text-slate-500 italic mt-0.5">
                                  ចំណាំ៖ {item.noteKhmer}
                                </p>
                              )}
                            </td>

                            {/* Memo */}
                            <td className="py-3 px-3 max-w-[180px]">
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                                {item.deliveryMemo || '-'}
                              </p>
                              {item.entranceCode && (
                                <span className="block text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                                  🔑 {item.entranceCode}
                                </span>
                              )}
                            </td>

                            {/* Print Status */}
                            <td className="py-3 px-3 text-center">
                              {isPr ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>បានព្រីន</span>
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                                    {item.printCount || 1} ដង
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>មិនទាន់</span>
                                </span>
                              )}
                            </td>

                            {/* Driver Scan Status */}
                            <td className="py-3 px-3 text-center">
                              {isSc ? (
                                <div className="inline-flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                                    <QrCodeIcon className="w-3 h-3 text-indigo-600" />
                                    <span>ស្កេនរួច</span>
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                                    {item.qrScanCount} ដង
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">-</span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {/* Bluetooth Print */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => onOpenPrintForAddress(item)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-600 border border-red-200 dark:border-red-900/60 transition-colors cursor-pointer"
                                  title="ព្រីនវិក្កយបត្រ Bluetooth"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </motion.button>

                                {/* Driver QR */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => onOpenQRForAddress(item)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-600 border border-amber-200 dark:border-amber-900/60 transition-colors cursor-pointer"
                                  title="មើល QR Code អ្នកដឹក"
                                >
                                  <QrCodeIcon className="w-3.5 h-3.5" />
                                </motion.button>

                                {/* Load to Form */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => handleLoadAndScroll(item)}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-600 border border-blue-200 dark:border-blue-900/60 transition-colors cursor-pointer"
                                  title="ទាញយកចូលក្នុង Form បង្កើត"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </motion.button>

                                {/* Copy Row */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => handleCopyRow(item)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-700 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                                  title="ចម្លងអាសយដ្ឋាន"
                                >
                                  {copiedId === item.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </motion.button>

                                {/* Delete */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`តើអ្នកប្រាកដជាចង់លុបអាសយដ្ឋានរបស់ ${item.recipientName} មែនទេ?`)) {
                                      onDeleteAddress(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="លុប"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards (visible on < md) */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {filteredAddresses.map((item, idx) => {
                    const isPr = Boolean(item.isPrinted || (item.printCount && item.printCount > 0));
                    const isSc = Boolean((item.qrScanCount && item.qrScanCount > 0) || item.driverStatus === 'scanned');
                    const tag = TAG_INFO[item.labelTag];

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isPr
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500 font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {item.recipientName}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${tag?.badgeClass} shrink-0`}>
                              {tag?.icon} {tag?.label}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 font-mono font-bold text-xs shrink-0">
                            {item.zonecode}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                          {item.phone}
                        </p>

                        <div className="mt-2 text-xs text-slate-800 dark:text-slate-200">
                          <p className="leading-snug">{item.roadAddress}</p>
                          {item.detailAddress && (
                            <p className="font-bold text-red-700 dark:text-red-400 mt-0.5">
                              {item.detailAddress} {item.bname ? `(${item.bname})` : ''}
                            </p>
                          )}
                        </div>

                        {item.deliveryMemo && (
                          <p className="mt-1.5 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                            {item.deliveryMemo}
                          </p>
                        )}

                        {/* Status indicators */}
                        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[10px] font-bold">
                          {isPr ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>បានព្រីន ({item.printCount || 1}ដង)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>មិនទាន់ព្រីន</span>
                            </span>
                          )}

                          {isSc && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
                              <QrCodeIcon className="w-3 h-3 text-indigo-600" />
                              <span>អ្នកដឹកស្កេនរួច ({item.qrScanCount}ដង)</span>
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenPrintForAddress(item)}
                            className="py-1.5 px-2 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-red-200 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>ព្រីន</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenQRForAddress(item)}
                            className="py-1.5 px-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-amber-200 cursor-pointer"
                          >
                            <QrCodeIcon className="w-3.5 h-3.5" />
                            <span>QR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLoadAndScroll(item)}
                            className="py-1.5 px-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center gap-1 border border-blue-200 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Form</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyRow(item)}
                            className="py-1.5 px-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>ចម្លង</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Sync សកម្ម · ទិន្នន័យត្រូវបានធ្វើបច្ចុប្បន្នភាពគ្រប់ឧបករណ៍</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
            >
              បិទផ្ទាំង
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
