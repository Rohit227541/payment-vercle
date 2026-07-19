import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }: Props) {
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex max-w-3xl flex-col ${alignCls} ${className}`}
    >
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2 className="heading">{title}</h2>
      {subtitle && <p className="subheading">{subtitle}</p>}
    </motion.div>
  );
}
