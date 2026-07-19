import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import { stats } from '../data/content';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const values = [
  { icon: ShieldCheck, title: 'Security First', desc: 'We protect every transaction like our own money depends on it.' },
  { icon: Users, title: 'Customer Obsessed', desc: 'We build for our merchants and measure success by their success.' },
  { icon: TrendingUp, title: 'Bias for Action', desc: 'We ship fast, learn faster and never settle for the status quo.' },
  { icon: Heart, title: 'Ownership', desc: 'We take responsibility end-to-end and leave things better than we found them.' },
];

const milestones = [
  { year: '2019', title: 'PayFlow founded', desc: 'Started in Bengaluru with a mission to simplify payments.' },
  { year: '2021', title: '10,000 merchants', desc: 'Crossed 10K merchants and launched subscriptions and payouts.' },
  { year: '2023', title: 'Global expansion', desc: 'Expanded to 150+ countries with multi-currency support.' },
  { year: '2025', title: '50,000+ businesses', desc: 'Now processing 10M+ transactions with 99.99% uptime.' },
];

function StatItem({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animated = useCountUp(value, 1800, inView);
  const display = value % 1 !== 0 ? animated.toFixed(2) : Math.round(animated).toLocaleString();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay }} className="text-center">
      <p className="font-display text-3xl font-bold gradient-text sm:text-4xl">{display}{suffix}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</p>
    </motion.div>
  );
}

export default function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title={<>Payments, <span className="gradient-text">reimagined</span></>} subtitle="We're on a mission to make payments effortless for every business, everywhere." />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="eyebrow mb-4">Our Story</span>
            <h2 className="heading">From a small idea to a global payments platform</h2>
            <p className="subheading">PayFlow started in 2019 with a simple belief: accepting payments online should be easy, secure and accessible to every business — from solo founders to global enterprises.</p>
            <p className="mt-4 text-ink-600 dark:text-ink-300">Today, we power payments for 50,000+ businesses across 150+ countries, processing millions of transactions with 99.99% uptime. But we're just getting started.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass-card grid grid-cols-2 gap-6 p-8">
            {stats.map((s, i) => <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />)}
          </motion.div>
        </div>
      </section>

      <section className="section bg-white/40 dark:bg-ink-900/30">
        <div className="container-px">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: Target, title: 'Mission', desc: 'Democratize payments by making them simple, secure and accessible to every business on the planet.' },
              { icon: Eye, title: 'Vision', desc: 'A world where any business can accept any payment, from any customer, anywhere — without friction.' },
              { icon: Award, title: 'Promise', desc: 'Enterprise-grade infrastructure with developer-first experience and support that never sleeps.' },
            ].map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><c.icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Values" title={<>What we <span className="gradient-text">stand for</span></>} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-6 card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><v.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900 dark:text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/40 dark:bg-ink-900/30">
        <div className="container-px">
          <SectionHeading eyebrow="Journey" title={<>Our <span className="gradient-text">milestones</span></>} />
          <div className="mt-14 space-y-6">
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className={`glass-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:gap-6 ${i % 2 ? 'sm:flex-row-reverse' : ''}`}>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 font-display text-sm font-bold text-white">{m.year}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{m.title}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-300">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
