import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { testimonials } from '../../data/content';

const avatars = ['from-brand-500 to-accent-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-rose-500 to-pink-500', 'from-violet-500 to-fuchsia-500', 'from-cyan-500 to-blue-500'];

export default function Testimonials() {
  return (
    <section className="section bg-white/40 dark:bg-ink-900/30">
      <div className="container-px">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by <span className="gradient-text">modern businesses</span></>}
          subtitle="Join 50,000+ merchants who trust PayFlow to power their payments."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass-card relative p-6 card-hover"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-500/15" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-200">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${avatars[i % avatars.length]} font-display text-sm font-bold text-white`}>
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
