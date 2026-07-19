import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/60 dark:border-ink-800/60">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-light bg-[size:44px_44px] opacity-50 dark:bg-grid-dark" />
      <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="container-px py-16 text-center sm:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow mb-4">{eyebrow}</span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 dark:text-ink-300">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
