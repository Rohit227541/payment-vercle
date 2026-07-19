import { motion } from 'framer-motion';
import { Handshake, TrendingUp, Users, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/sections/CTA';

const tiers = [
  { name: 'Referral Partner', desc: 'Refer clients and earn recurring commission.', perk: 'Up to 20% revenue share' },
  { name: 'Technology Partner', desc: 'Integrate PayFlow into your product or platform.', perk: 'Co-marketing & listing' },
  { name: 'Reseller Partner', desc: 'Resell PayFlow under your own brand.', perk: 'White-label option' },
];

const benefits = [
  { icon: TrendingUp, title: 'Recurring Revenue', desc: 'Earn ongoing commission for every merchant you refer.' },
  { icon: Users, title: 'Dedicated Manager', desc: 'A named partner manager to help you grow.' },
  { icon: Gift, title: 'Co-marketing', desc: 'Joint campaigns, events and lead sharing.' },
  { icon: Handshake, title: 'Priority Support', desc: 'Direct line to our partner support team.' },
];

export default function Partners() {
  return (
    <>
      <PageHero eyebrow="Partners" title={<>Grow with the <span className="gradient-text">PayFlow partner program</span></>} subtitle="Join 1,000+ partners earning recurring revenue by bringing PayFlow to their clients." />

      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Programs" title={<>Choose your <span className="gradient-text">partnership</span></>} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-card p-7 card-hover">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><Handshake className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900 dark:text-white">{t.name}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{t.desc}</p>
                <p className="mt-4 inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300">{t.perk}</p>
                <Link to="/contact" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">Apply now <ArrowRight className="h-3.5 w-3.5" /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/40 dark:bg-ink-900/30">
        <div className="container-px">
          <SectionHeading eyebrow="Benefits" title={<>Why <span className="gradient-text">partner with us</span></>} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-6 card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><b.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900 dark:text-white">{b.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
