import { motion } from 'framer-motion';
import { Search, BookOpen, LifeBuoy, Newspaper, Activity, MessageCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/sections/CTA';

const cards = [
  { icon: BookOpen, title: 'Documentation', desc: 'Guides, references and tutorials for every integration.' },
  { icon: LifeBuoy, title: 'Help Center', desc: 'Answers to the most common questions from merchants.' },
  { icon: Newspaper, title: 'Blog', desc: 'Product updates, deep dives and customer stories.' },
  { icon: Activity, title: 'Status', desc: 'Real-time system status and incident history.' },
  { icon: MessageCircle, title: 'Community', desc: 'Connect with fellow developers and merchants.' },
  { icon: Search, title: 'API Reference', desc: 'Full reference for every endpoint and webhook.' },
];

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title={<>Everything you need to <span className="gradient-text">succeed</span></>} subtitle="Docs, guides, status and community — all in one place." />
      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Explore" title={<>Browse our <span className="gradient-text">resources</span></>} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-6 card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><c.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
