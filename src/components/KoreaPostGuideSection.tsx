import React from 'react';
import { motion } from 'motion/react';
import {
  Icon3DWaybillCheck,
  Icon3DMapSearch,
  Icon3DRecipient,
  Icon3DCourierMemo,
  Icon3DGuideBook
} from './Icons3D';

interface KoreaPostGuideSectionProps {
  onOpenUserGuide?: () => void;
}

export const KoreaPostGuideSection: React.FC<KoreaPostGuideSectionProps> = ({ onOpenUserGuide }) => {
  const steps = [
    {
      num: '01',
      title: 'ពិនិត្យលេខកូដប្រៃសណីយ៍ ៥ខ្ទង់ (우편번호 5자리)',
      koreanSub: '국가기초구역번호 (Zonecode)',
      desc: 'ប្រព័ន្ធប្រៃសណីយ៍កូរ៉េសម័យថ្មីប្រើលេខកូដ ៥ខ្ទង់ជំនួសឱ្យលេខ ៦ខ្ទង់ចាស់។ ការដាក់លេខ ៥ខ្ទង់ត្រឹមត្រូវជួយឱ្យម៉ាស៊ីនស្កេនរបស់ 우체국 បែងចែកកញ្ចប់ឥវ៉ាន់ទៅដល់សាខាខេត្ត/ក្រុងដោយស្វ័យប្រវត្តិ និងរហ័សបំផុត។',
      Icon3D: Icon3DWaybillCheck
    },
    {
      num: '02',
      title: 'ប្រើអាសយដ្ឋានឈ្មោះផ្លូវ (도로명주소) ឬភូមិ/សង្កាត់ (지번주소) ឱ្យត្រឹមត្រូវ',
      koreanSub: '시/도 + 시/군/구 + 도로명 / 지번',
      desc: 'ពិនិត្យឈ្មោះខេត្ត/ទីក្រុង និងឈ្មោះផ្លូវ (도로명주소) ឬឈ្មោះភូមិ/សង្កាត់ (지번주소) តាមតារាងផ្លូវការរបស់ 우체국 ដើម្បីឱ្យប្រព័ន្ធដឹកជញ្ជូនកំណត់ទីតាំងអគារបានត្រឹមត្រូវ ១០០%។',
      Icon3D: Icon3DMapSearch
    },
    {
      num: '03',
      title: 'បញ្ចូលលេខអគារ (동) និងលេខបន្ទប់ (호) ក្នុងប្រអប់ 상세주소',
      koreanSub: '상세주소 필수 입력 (동 · 층 · 호 · 기숙사명)',
      desc: 'មូលហេតុចម្បងដែលធ្វើឱ្យឥវ៉ាន់ត្រឡប់មកវិញ (반송) គឺការដាក់តែលេខផ្លូវ តែភ្លេចដាក់លេខបន្ទប់ ឬឈ្មោះក្រុមហ៊ុន/អន្តេវាសិកដ្ឋាន (기숙사)។ ប្រសិនបើជាផ្ទះដាច់ដោយឡែកគ្មានលេខបន្ទប់ សូមបញ្ជាក់ថា 단독주택 (ផ្ទះទោល)។',
      Icon3D: Icon3DRecipient
    },
    {
      num: '04',
      title: 'បញ្ជាក់លេខកូដទ្វារធំខាងក្រោម (공동현관 비밀번호) និងចំណាំ (배송메모)',
      koreanSub: '출입방법 및 배송메시지 기재',
      desc: 'វីឡា និងអាផាតមិននៅកូរ៉េភាគច្រើនមានទ្វារចាក់សោលេខកូដនៅជាន់ទី១។ ការបញ្ចូលលេខកូដទ្វារក្នុងប្រអប់ចំណាំ (배송메모) ជួយឱ្យអ្នកដឹកជញ្ជូនឡើងទៅដាក់ឥវ៉ាន់ដល់មុខបន្ទប់ដោយសុវត្ថិភាព។',
      Icon3D: Icon3DCourierMemo
    }
  ];

  return (
    <section id="guide-section" className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-red-700 dark:text-red-400 tracking-wide">
            គោលការណ៍ធានាប្រសិទ្ធភាពដឹកជញ្ជូន · ZERO-RETURN DELIVERY PROTOCOL
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            មគ្គុទ្ទេសក៍ផ្ញើឥវ៉ាន់តាមស្តង់ដារ 우체국 (ប្រៃសណីយ៍កូរ៉េ) ឱ្យរហ័ស និងមិនបាត់បង់
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
            អនុវត្តតាមគោលការណ៍ទាំង ៤ នេះ រាល់ពេលចម្លងអាសយដ្ឋានអតិថិជនយកទៅបិទលើប្រអប់ ឬបញ្ចូលក្នុងកម្មវិធីផ្ញើឥវ៉ាន់។
          </p>
          {onOpenUserGuide && (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onOpenUserGuide}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/40 dark:to-amber-950/40 hover:from-red-100 hover:to-amber-100 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs whitespace-nowrap"
            >
              <Icon3DGuideBook size={22} className="w-5 h-5" />
              <span>បើកសៀវភៅណែនាំ</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => {
          const StepIcon3D = step.Icon3D;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400 tabular-nums">
                    គោលការណ៍ទី {step.num} · {step.koreanSub}
                  </span>
                  <div className="shrink-0">
                    <StepIcon3D size={40} className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
