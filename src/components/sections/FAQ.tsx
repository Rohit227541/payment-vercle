import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { faqs } from '../../data/content';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Frequently asked <span className="gradient-text">questions</span></>}
          subtitle="Everything you need to know about PayFlow. Can't find an answer? Reach out to our team."
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-base font-semibold text-ink-900 dark:text-white">{f.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
