import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';

type Section = { heading: string; body: string };

export default function LegalPage({ title, eyebrow, updated, sections }: { title: string; eyebrow: string; updated: string; sections: Section[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={`Last updated: ${updated}`} />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-3xl space-y-8">
            {sections.map((s, i) => (
              <motion.div key={s.heading} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}>
                <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">{s.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
