import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { stats } from '../../data/content';
import { useCountUp } from '../../hooks/useCountUp';

function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const animated = useCountUp(value, 1800, inView);
  const display = value % 1 !== 0 ? animated.toFixed(2) : Math.round(animated).toLocaleString();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <p className="font-display text-4xl font-bold gradient-text sm:text-5xl">
        {display}{suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="section">
      <div className="container-px">
        <div className="glass-card grid grid-cols-2 gap-8 p-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
