import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Search,
  Copy,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import {
  Icon3DGuideBook,
  Icon3DMapSearch,
  Icon3DRecipient,
  Icon3DCourierMemo,
  Icon3DWaybillCheck,
  Icon3DShieldAlert
} from './Icons3D';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="user-guide-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 sm:py-6 overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
        >
          <motion.div
            key="user-guide-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Modal Header Ribbon */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
              {/* Subtle Ambient Glow */}
              <div
                className="absolute top-0 right-1/4 w-72 h-16 bg-red-600/20 blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3.5 min-w-0">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="shrink-0"
                >
                  <Icon3DGuideBook size={46} className="w-11 h-11" />
                </motion.div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-mono text-[11px] font-bold tracking-wider uppercase">
                      K-Post Khmer · 우체국 택배
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-amber-300 text-[11px] font-semibold hidden sm:inline">
                      មគ្គុទ្ទេសក៍ស្តង់ដារផ្លូវការ
                    </span>
                  </div>
                  <h2
                    id="guide-modal-title"
                    className="text-base sm:text-xl font-bold tracking-tight text-white truncate"
                  >
                    សៀវភៅណែនាំការប្រើប្រាស់វេបសាយ (User Manual)
                  </h2>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={onClose}
                aria-label="បិទផ្ទាំងសៀវភៅណែនាំ"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Quick Step Jump Tabs */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 sm:px-7 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:inline">
                ជំហានអនុវត្តទាំង ៤៖
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[
                  { step: 1, label: '១. ស្វែងរក Kakao', target: '#guide-step-1' },
                  { step: 2, label: '២. ព័ត៌មានអ្នកទទួល', target: '#guide-step-2' },
                  { step: 3, label: '៣. ចំណាំដឹកជញ្ជូន', target: '#guide-step-3' },
                  { step: 4, label: '៤. ពិនិត្យ & ចម្លង', target: '#guide-step-4' }
                ].map((tab) => (
                  <motion.button
                    key={tab.step}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => {
                      setActiveStepTab(tab.step);
                      const el = document.getElementById(`guide-step-${tab.step}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeStepTab === tab.step
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Scrollable Main Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              {/* Introduction Banner Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50/70 to-red-50/40 dark:from-red-950/30 dark:via-amber-950/20 dark:to-red-950/20 border border-red-200/90 dark:border-red-900/50 shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 pt-0.5">
                    <Icon3DShieldAlert size={44} className="w-10 h-10 sm:w-11 sm:h-11" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        គោលបំណងចម្បងនៃប្រព័ន្ធ · Core Purpose
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                        ការពារការបញ្ជូនត្រឡប់ក្រោយ (반송 방지)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      ទំព័រនេះគឺជា <strong className="text-slate-950 dark:text-white font-bold">K-Post Khmer (ប្រព័ន្ធស្វែងរក និងរៀបចំអាសយដ្ឋានផ្ញើឥវ៉ាន់កូរ៉េ - 우체국 택배)</strong> ដែលត្រូវបានបង្កើតឡើងដើម្បីជួយសម្រួលដល់ប្រជាពលរដ្ឋខ្មែរក្នុងការស្វែងរក រៀបចំ និងចម្លងទម្រង់អាសយដ្ឋានប្រៃសណីយ៍កូរ៉េឱ្យបានត្រឹមត្រូវតាមស្តង់ដារប្រៃសណីយ៍ផ្លូវការ (Korea Post) ជៀសវាងការខុសខាត ឬការបញ្ជូនឥវ៉ាន់ត្រឡប់ក្រោយ (반송)។
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Subtitle Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ការណែនាំការប្រើប្រាស់លម្អិត និងមានស្តង់ដារ សម្រាប់វេបសាយនេះ៖</span>
                </h3>
              </div>

              {/* STEP 1 */}
              <motion.section
                id="guide-step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.05 }}
                whileHover={{ y: -2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Icon3DMapSearch size={52} className="w-12 h-12 sm:w-13 sm:h-13" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[11px] font-extrabold uppercase font-mono text-red-600 dark:text-red-400">
                      Step 01
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      ជំហានទី ១៖ ការស្វែងរកអាសយដ្ឋានផ្លូវការ (Kakao Postcode Search)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      នៅផ្នែកខាងឆ្វេងនៃទំព័រ មានប្រអប់ស្វែងរកអាសយដ្ឋានផ្ទាល់ជាមួយផែនទី Kakao Postcode៖
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pl-0 sm:pl-16">
                  {/* Option explanation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                      <span>ជម្រើសក្នុងការស្វែងរក៖</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      លោកអ្នកអាចស្វែងរកតាម <strong className="text-blue-700 dark:text-blue-400 font-bold">도로명</strong> (ឈ្មោះផ្លូវ និងលេខអគារ) ឬ <strong className="text-amber-800 dark:text-amber-400 font-bold">지번</strong> (ភូមិ/សង្កាត់ និងលេខដីឡូត៍)។
                    </p>
                  </div>

                  {/* Tips with clean examples */}
                  <div className="space-y-2.5">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>គន្លឹះស្វែងរកឱ្យបានត្រឹមត្រូវ៖</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Example 1 */}
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm">
                        <span className="font-bold text-blue-900 dark:text-blue-300 block mb-0.5">
                          • ឈ្មោះផ្លូវ + លេខអគារ (도로명 + 건물번호)៖
                        </span>
                        <div className="text-slate-700 dark:text-slate-300">
                          ឧទាហរណ៍ <code className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">판교역로 166</code> ឬ <code className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">제주 첨단로 242</code>
                        </div>
                      </div>

                      {/* Example 2 */}
                      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-xs sm:text-sm">
                        <span className="font-bold text-amber-950 dark:text-amber-300 block mb-0.5">
                          • ឈ្មោះសង្កាត់/ឃុំ + លេខដីឡូត៍ (동/읍/면 + 지번)៖
                        </span>
                        <div className="text-slate-700 dark:text-slate-300">
                          ឧទាហរណ៍ <code className="font-mono font-bold text-amber-800 dark:text-amber-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">백현동 532</code> ឬ <code className="font-mono font-bold text-amber-800 dark:text-amber-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">제주 영평동 2181</code>
                        </div>
                      </div>

                      {/* Example 3 */}
                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs sm:text-sm">
                        <span className="font-bold text-emerald-950 dark:text-emerald-300 block mb-0.5">
                          • ឈ្មោះសង្កាត់ + ឈ្មោះអគារ/អាផាតមិន (동 + 건물명/아파트명)៖
                        </span>
                        <div className="text-slate-700 dark:text-slate-300">
                          ឧទាហរណ៍ <code className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">분당 주공</code> ឬ <code className="font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">연수동 주공3차</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* STEP 2 */}
              <motion.section
                id="guide-step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.1 }}
                whileHover={{ y: -2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Icon3DRecipient size={52} className="w-12 h-12 sm:w-13 sm:h-13" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[11px] font-extrabold uppercase font-mono text-blue-600 dark:text-blue-400">
                      Step 02
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      ជំហានទី ២៖ ការបំពេញ និងកែសម្រួលព័ត៌មានអ្នកទទួល (02. ព័ត៌មានអ្នកទទួល និងអាសយដ្ឋានលម្អិត)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      បន្ទាប់ពីជ្រើសរើសអាសយដ្ឋានពីតារាងលទ្ធផលរួច លោកអ្នកត្រូវបំពេញព័ត៌មានលម្អិតរបស់អ្នកទទួលនៅផ្នែកខាងស្តាំ៖
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-0 sm:pl-16">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Item 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
                        <span>ឈ្មោះអ្នកទទួល (받는분 성함)៖</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6.5">
                        បញ្ចូលឈ្មោះពេញរបស់អ្នកទទួលឥវ៉ាន់ជាភាសាកូរ៉េ ឬអង់គ្លេស។
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
                        <span>លេខទូរស័ព្ទ (연락처)៖</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6.5">
                        បញ្ចូលលេខទូរស័ព្ទនៅកូរ៉េឱ្យបានត្រឹមត្រូវ (ទ្រង់ទ្រាយ <code className="font-mono font-bold text-red-600 dark:text-red-400">010-XXXX-XXXX</code>)។
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
                        <span>កូដប្រៃសណីយ៍ (우편번호)៖</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6.5">
                        ប្រព័ន្ធនឹងដាក់បញ្ចូលកូដ ៥ ខ្ទង់ដោយស្វ័យប្រវត្តិពីការស្វែងរក។
                      </p>
                    </div>

                    {/* Item 4 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
                        <span>អាសយដ្ឋានលម្អិត (상세주소)៖</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-6.5">
                        ចាប់យកដោយស្វ័យប្រវត្តិពីការស្វែងរកនូវ លេខបន្ទប់ (<code className="font-mono font-bold text-slate-800 dark:text-slate-200">호</code>), ជាន់ (<code className="font-mono font-bold text-slate-800 dark:text-slate-200">층</code>), ប្លុក/អគារ (<code className="font-mono font-bold text-slate-800 dark:text-slate-200">동</code>), ឈ្មោះអគារ ឬឈ្មោះក្រុមហ៊ុន/រោងចក្រ — ដោយធានាលុបការជាន់ឈ្មោះគ្នា ឬស្ទួនឈ្មោះគ្នាដោយស្វ័យប្រវត្តិតែមួយគត់ (Zero Duplication) មិនឱ្យមានឈ្មោះស្ទួនគ្នារជាដាច់ខាត។
                      </p>
                    </div>
                  </div>

                  {/* Quick Unit Buttons Note */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300">គន្លឹះរហ័ស៖</span>
                    <span className="text-amber-800 dark:text-amber-200">
                      លោកអ្នកអាចប្រើប្រាស់ប៊ូតុងកូរ៉េរហ័សដូចជា <code className="font-mono font-bold bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-800">[+ 동]</code>, <code className="font-mono font-bold bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-800">[+ 층]</code>, <code className="font-mono font-bold bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-800">[+ 호]</code> ដើម្បីភាពងាយស្រួល។
                    </span>
                  </div>
                </div>
              </motion.section>

              {/* STEP 3 */}
              <motion.section
                id="guide-step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.15 }}
                whileHover={{ y: -2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Icon3DCourierMemo size={52} className="w-12 h-12 sm:w-13 sm:h-13" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[11px] font-extrabold uppercase font-mono text-amber-600 dark:text-amber-400">
                      Step 03
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      ជំហានទី ៣៖ ការកំណត់ចំណាំសម្រាប់អ្នកដឹកជញ្ជូន (03. មុខងារចំណាំសម្រាប់ការផ្ញើឥវ៉ាន់)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      ជ្រើសរើសពាក្យផ្តាំផ្ញើ ឬសារជូនដំណឹងទៅកាន់អ្នកដឹកជញ្ជូន (택배 기사님) ដែលមានស្រាប់ជាភាសាកូរ៉េ អមដោយការពន្យល់ជាភាសាខ្មែរ ដូចជា៖
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-0 sm:pl-16">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mb-1">
                        • សូមទុកឥវ៉ាន់នៅមុខទ្វារបន្ទប់
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                        (문 앞에 놓아주세요)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mb-1">
                        • បើមិននៅ សូមផ្ញើទុកនៅបន្ទប់សន្តិសុខ
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                        (부재 시 경비실에 맡겨주세요)
                      </span>
                    </div>
                  </div>

                  {/* Door Passcode Section */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 dark:from-blue-950/40 dark:to-slate-900/40 border border-blue-200/80 dark:border-blue-900/50 space-y-1.5">
                    <div className="font-bold text-xs sm:text-sm text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      <span>លេខកូដទ្វារធំខាងក្រោម (공동현관 비밀번호)៖</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      ប្រសិនបើអាផាតមិន ឬវីឡាមានកូដទ្វារចូល សូមវាយបញ្ចូលទីនេះ ដើម្បីឱ្យអ្នកដឹកជញ្ជូនអាចឡើងទៅដាក់ដល់មុខបន្ទប់បាន។
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* STEP 4 */}
              <motion.section
                id="guide-step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.2 }}
                whileHover={{ y: -2 }}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <Icon3DWaybillCheck size={52} className="w-12 h-12 sm:w-13 sm:h-13" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[11px] font-extrabold uppercase font-mono text-emerald-600 dark:text-emerald-400">
                      Step 04
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      ជំហានទី ៤៖ ការពិនិត្យ និងចម្លងទម្រង់យកទៅប្រើប្រាស់
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      មុននឹងយកទៅប្រើប្រាស់ សូមមើលផ្នែក <strong className="text-emerald-700 dark:text-emerald-400">ការត្រួតពិនិត្យប្រសិទ្ធភាពដឹកជញ្ជូន</strong> ដើម្បីប្រាកដថាទិន្នន័យត្រូវបានបំពេញគ្រប់គ្រាន់ (កូដប្រៃសណីយ៍ ៥ខ្ទង់, អាសយដ្ឋាន 도로명, លេខបន្ទប់ និងលេខទូរស័ព្ទ 010)។ បន្ទាប់មក លោកអ្នកអាចជ្រើសរើសយក៖
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-0 sm:pl-16">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Action 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-red-700 dark:text-red-400 block mb-1">
                          • ចម្លងទម្រង់ពេញលេញ (도로명)
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          សម្រាប់យកទៅបិទ ឬផ្ញើជូនសេវាដឹកជញ្ជូន។
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400 pt-1">
                        [우체국 택배 استاندارد]
                      </span>
                    </div>

                    {/* Action 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-blue-700 dark:text-blue-400 block mb-1">
                          • ចម្លងតាមប្រអប់នីមួយៗ
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          សម្រាប់យកទៅបិទបំពេញចូលក្នុងកម្មវិធីប្រៃសណីយ៍ ឬកម្មវិធីកុម្ម៉ង់ឥវ៉ាន់ដូចជា Coupang ជាដើម។
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400 pt-1">
                        [Coupang / Naver / App]
                      </span>
                    </div>

                    {/* Action 3 */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 block mb-1">
                          • រក្សាទុកអាសយដ្ឋាន
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          លោកអ្នកអាចចុចរក្សាទុកក្នុងប្រវត្តិអាសយដ្ឋានអតិថិជន (주소록 저장) ទុកប្រើប្រាស់សម្រាប់លើកក្រោយបានថែមទៀតផង។
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400 pt-1">
                        [주소록 저장]
                      </span>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Bottom Modal Footer with Action Buttons */}
            <div className="bg-slate-50 dark:bg-slate-800/90 px-5 sm:px-7 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ស្តង់ដារប្រៃសណីយ៍កូរ៉េផ្លូវការ (Korea Post Official Standard)</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  បិទផ្ទាំង (Close)
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('builder-workspace');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>យល់ព្រម និងចាប់ផ្តើមប្រើប្រាស់</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
