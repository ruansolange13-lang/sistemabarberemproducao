import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqList } from '../data/barbeariaData';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full select-none text-left">
      {/* Header */}
      <div className="bg-zinc-900/95 px-4 py-3 rounded-t-2xl flex items-center gap-2.5 text-zinc-100 border border-zinc-800">
        <div className="w-6 h-6 rounded-lg bg-[#f8c105]/10 border border-[#f8c105]/30 flex items-center justify-center font-black text-xs shrink-0 select-none text-[#f8c105]">
          <HelpCircle size={13} className="stroke-[2.5]" />
        </div>
        <h2 className="font-display font-extrabold text-zinc-100 text-xs sm:text-sm tracking-wider uppercase">
          FAQ — PERGUNTAS FREQUENTES
        </h2>
      </div>

      {/* Accordion List */}
      <div className="border-x border-b border-zinc-800/90 rounded-b-2xl overflow-hidden bg-zinc-950/85 divide-y divide-zinc-850/80 shadow-xl">
        {faqList.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="transition-colors duration-200 hover:bg-zinc-900/40">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-4 text-left font-sans font-bold text-xs sm:text-sm text-zinc-200 hover:text-[#f8c105] transition-colors duration-200 select-none cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#f8c105] shrink-0 transition-transform duration-300 ml-2 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-gray-300 font-sans font-medium whitespace-pre-line">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
