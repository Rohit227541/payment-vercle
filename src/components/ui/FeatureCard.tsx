import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon?: LucideIcon;
  title: string;
  desc?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
};

export default function FeatureCard({ icon: Icon, title, desc, children, className = '', delay = 0, hover = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card p-6 ${hover ? 'card-hover' : ''} ${className}`}
    >
      {Icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500/20">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
      {desc && <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-300">{desc}</p>}
      {children}
    </motion.div>
  );
}
