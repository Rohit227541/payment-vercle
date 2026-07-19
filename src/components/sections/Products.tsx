import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import { products } from '../../data/content';

export default function Products() {
  return (
    <section className="section bg-white/40 dark:bg-ink-900/30">
      <div className="container-px">
        <SectionHeading
          eyebrow="Products"
          title={<>One platform, <span className="gradient-text">every product</span></>}
          subtitle="From checkout to settlement, PayFlow gives you a unified suite of payment products."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group glass-card relative overflow-hidden p-6 card-hover"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{p.desc}</p>
              <Link to="/products" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300 opacity-0 transition-all group-hover:opacity-100">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
