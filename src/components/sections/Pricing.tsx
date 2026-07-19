import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import { pricingPlans } from '../../data/content';

export default function Pricing() {
  return (
    <section className="section bg-white/40 dark:bg-ink-900/30">
      <div className="container-px">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Simple, <span className="gradient-text">transparent pricing</span></>}
          subtitle="Pay only for what you process. No setup fees, no hidden charges, no minimum commitments."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative glass-card p-7 ${p.highlight ? 'ring-2 ring-brand-500 shadow-glow lg:-translate-y-3' : 'card-hover'}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-xs font-semibold text-white shadow-glow">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-ink-900 dark:text-white">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{p.desc}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-bold text-ink-900 dark:text-white">{p.price}</span>
                <span className="mb-1 text-sm text-ink-500 dark:text-ink-400">{p.sub}</span>
              </div>
              <Link
                to="/signup"
                className={`mt-6 btn w-full ${p.highlight ? 'btn-primary' : 'btn-outline'}`}
              >
                {p.cta}
              </Link>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
