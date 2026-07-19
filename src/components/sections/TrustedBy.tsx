import { motion } from 'framer-motion';
import { companies } from '../../data/content';

export default function TrustedBy() {
  return (
    <section className="border-y border-ink-200/60 dark:border-ink-800/60 bg-white/40 dark:bg-ink-900/30 backdrop-blur-sm">
      <div className="container-px py-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400"
        >
          Trusted by 50,000+ Businesses
        </motion.p>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {companies.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="text-center font-display text-lg font-bold text-ink-400 dark:text-ink-500 transition-colors hover:text-ink-700 dark:hover:text-ink-200"
            >
              {c}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
