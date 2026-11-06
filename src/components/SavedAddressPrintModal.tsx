import React, { useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Clock, Printer } from 'lucide-react';
import { SavedCustomerAddress } from '../data/koreanAddresses';
import { BluetoothWaybillPrinter } from './BluetoothWaybillPrinter';

interface SavedAddressPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: SavedCustomerAddress | null;
  onNotify: (msg: string) => void;
  onMarkPrinted: (id: string, info?: { method: 'bluetooth' | 'browser' | 'test'; widthMm: number; printedAt: string }) => void;
}

export const SavedAddressPrintModal: React.FC<SavedAddressPrintModalProps> = ({
  isOpen,
  onClose,
  address,
  onNotify,
  onMarkPrinted,
}) => {
  const titleId = useId();

  if (!address) return null;

  const isPrinted = Boolean(address.isPrinted || (address.printCount && address.printCount > 0));

  const handlePrintComplete = (info: {
    method: 'bluetooth' | 'browser' | 'test';
    widthMm: number;
    printedAt: string;
    printerName?: string;
  }) => {
    onMarkPrinted(address.id, info);
  };

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
            className="relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 bg-white text-slate-800 z-10 my-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20 shadow-xs">
                  <Printer className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 id={titleId} className="font-bold text-base sm:text-lg flex items-center gap-2">
                    ព្រីនស្លាក Bluetooth ពីប្រវត្តិរក្សាទុក
                  </h3>
                  <p className="text-xs text-blue-100">
                    ម៉ាស៊ីនព្រីនកម្តៅ Bluetooth Thermal Printer (우체국 택배 송장 출력)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 transition-colors text-white/90 hover:text-white cursor-pointer"
                title="បិទ (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printing Status Banner (Printing Complete / Not Printed) */}
            <div className={`px-5 py-3 border-b flex items-center justify-between text-xs transition-colors ${
              isPrinted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                {isPrinted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="font-bold block truncate">
                    {isPrinted
                      ? '✅ Printing complete (បានព្រីនរួចរាល់ · 출력완료)'
                      : '⏳ មិនទាន់បានព្រីន (Not printed · 미출력)'}
                  </span>
                  <p className="text-[11px] opacity-80 truncate">
                    {isPrinted
                      ? `កាលបរិច្ឆេទព្រីន៖ ${address.lastPrintedAt || 'ទើបតែព្រីន'} ${address.printedDevice ? `(${address.printedDevice})` : ''}`
                      : 'ទម្រង់អាសយដ្ឋាននេះមិនទាន់ត្រូវបានបញ្ជូនទៅម៉ាស៊ីនព្រីននៅឡើយទេ'}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold shrink-0 ${
                isPrinted ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-900'
              }`}>
                {isPrinted ? `ព្រីនបាន ${address.printCount || 1} ដង` : '០ ដង'}
              </span>
            </div>

            {/* Recipient Overview Strip */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 text-xs text-slate-700">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200/60 font-semibold">
                <span className="text-slate-900">
                  អ្នកទទួល (받는분): <strong className="text-red-700 font-bold">{address.recipientName}</strong>
                </span>
                <span className="font-mono text-slate-600 tabular-nums">
                  {address.phone}
                </span>
              </div>
              <p className="mt-1.5 text-slate-800 leading-snug">
                <span className="font-mono font-bold text-red-700">[{address.zonecode}]</span>{' '}
                {address.roadAddress || address.jibunAddress}{' '}
                {address.detailAddress && <span className="font-semibold">{address.detailAddress}</span>}
                {address.bname && <span className="text-slate-500"> ({address.bname})</span>}
              </p>
              {address.deliveryMemo && (
                <p className="mt-1 text-slate-600 text-[11px] truncate">
                  <strong>ចំណាំដឹកជញ្ជូន (메모):</strong> {address.deliveryMemo}
                </p>
              )}
            </div>

            {/* Full-Fidelity Bluetooth Waybill Printer Embed (100% features) */}
            <div className="p-4 sm:p-5">
              <BluetoothWaybillPrinter
                addressType="R"
                recipientName={address.recipientName}
                phone={address.phone}
                zonecode={address.zonecode}
                primaryAddress={address.roadAddress || address.jibunAddress}
                secondaryReferenceAddress={
                  address.jibunAddress && address.jibunAddress !== address.roadAddress
                    ? `${address.jibunAddress} ${address.detailAddress}`.trim()
                    : undefined
                }
                detailAddress={address.detailAddress}
                bname={address.bname}
                deliveryMemo={address.deliveryMemo}
                onNotify={onNotify}
                onPrintComplete={handlePrintComplete}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
