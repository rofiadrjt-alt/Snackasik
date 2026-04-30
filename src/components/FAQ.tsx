import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { FAQ } from '../types';

interface FAQProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  return (
    <section id="faq" className="py-24 bg-bg-cream">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm text-primary-brown font-bold text-sm mb-4 border border-primary-yellow/20">
            <MessageCircleQuestion size={18} className="text-primary-yellow" /> Punya Pertanyaan?
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary-brown tracking-tighter">
            Masih <span className="text-primary-yellow">Penasaran?</span>
          </h2>
          <p className="text-lg text-primary-brown/70 font-medium">
            Segala hal yang perlu kamu tahu sebelum kalap borong Keripik Bawang Snack Asik.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className={`bg-white rounded-[32px] overflow-hidden border-2 transition-all duration-300 ${
                openId === faq.id ? 'border-primary-yellow shadow-lg' : 'border-transparent hover:border-primary-yellow/30 shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-8 py-7 flex items-center justify-between text-left group"
              >
                <span className={`text-lg md:text-xl font-bold pr-8 transition-colors ${openId === faq.id ? 'text-primary-yellow' : 'text-primary-brown group-hover:text-primary-yellow/80'}`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-colors ${openId === faq.id ? 'bg-primary-yellow/10' : 'bg-transparent group-hover:bg-gray-50'}`}>
                  <ChevronDown 
                    className={`text-primary-yellow transition-transform duration-300 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`} 
                    size={24} 
                  />
                </div>
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 text-primary-brown/80 text-lg leading-relaxed pt-2 font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
