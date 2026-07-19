import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CTA from '../components/sections/CTA';

const posts = [
  { tag: 'Engineering', title: 'How we achieved 99.99% uptime with multi-region active-active', excerpt: 'A deep dive into the architecture that keeps PayFlow available around the clock.', date: 'Jul 2, 2025', read: '8 min' },
  { tag: 'Product', title: 'Introducing Smart Routing: AI-driven payment optimization', excerpt: 'How our routing engine pushes success rates above 99%.', date: 'Jun 24, 2025', read: '6 min' },
  { tag: 'Security', title: 'Inside our PCI DSS Level 1 compliance journey', excerpt: 'What it takes to build and maintain the highest level of payment security.', date: 'Jun 12, 2025', read: '10 min' },
  { tag: 'Developers', title: '5 tips for a faster checkout integration', excerpt: 'Practical advice to reduce drop-offs and improve conversion.', date: 'May 30, 2025', read: '5 min' },
  { tag: 'Business', title: 'Reducing involuntary churn with smart dunning', excerpt: 'Recover failed payments and keep your subscribers happy.', date: 'May 18, 2025', read: '7 min' },
  { tag: 'Case Study', title: 'How ShopKart increased success rates by 4.2%', excerpt: 'A look at the integration that moved the needle for a top merchant.', date: 'May 4, 2025', read: '6 min' },
];

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Insights from the <span className="gradient-text">PayFlow team</span></>} subtitle="Product updates, engineering deep dives and stories from our merchants." />

      <section className="section">
        <div className="container-px">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <motion.article key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="group glass-card overflow-hidden card-hover">
                <div className="relative h-44 bg-gradient-to-br from-brand-500/20 via-accent-500/15 to-brand-600/20">
                  <div className="absolute inset-0 bg-grid-light bg-[size:28px_28px] opacity-50 dark:bg-grid-dark" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/80 dark:bg-ink-900/80 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300 backdrop-blur">{p.tag}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-400">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.read}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-900 dark:text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{p.excerpt}</p>
                  <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
