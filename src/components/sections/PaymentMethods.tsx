import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { paymentMethods } from '../../data/content';

export default function PaymentMethods() {
  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="Payment Methods"
          title={<>Accept <span className="gradient-text">every payment method</span></>}
          subtitle="Give your customers the freedom to pay the way they want, wherever they are."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {paymentMethods.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
              className="group glass-card flex flex-col items-center justify-center gap-2 p-6 card-hover"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500/20 transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </span>
              <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">{m.name}</p>
              <span className="text-xs text-ink-400 dark:text-ink-500">{m.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
