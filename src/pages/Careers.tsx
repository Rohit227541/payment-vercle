import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight, Heart, Coffee, Rocket, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import CTA from '../components/sections/CTA';

const openings = [
  { role: 'Senior Frontend Engineer', team: 'Engineering', location: 'Bengaluru / Remote', type: 'Full-time' },
  { role: 'Backend Engineer, Payments', team: 'Engineering', location: 'Bengaluru', type: 'Full-time' },
  { role: 'Product Designer', team: 'Design', location: 'Remote', type: 'Full-time' },
  { role: 'Developer Advocate', team: 'Developer Relations', location: 'Remote', type: 'Full-time' },
  { role: 'Account Executive', team: 'Sales', location: 'Mumbai', type: 'Full-time' },
  { role: 'Risk & Fraud Analyst', team: 'Risk', location: 'Bengaluru', type: 'Full-time' },
  { role: 'Customer Success Manager', team: 'Support', location: 'Remote', type: 'Full-time' },
  { role: 'Site Reliability Engineer', team: 'Infrastructure', location: 'Bengaluru', type: 'Full-time' },
];

const perks = [
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health, dental and vision coverage for you and your family.' },
  { icon: Coffee, title: 'Flexible Work', desc: 'Remote-friendly culture with flexible hours and generous PTO.' },
  { icon: Rocket, title: 'Growth', desc: 'Learning budget, conference passes and internal mobility.' },
  { icon: Globe, title: 'Global Team', desc: 'Work with talented people across 12+ countries.' },
  { icon: Zap, title: 'Equity', desc: 'Meaningful equity so you share in our success.' },
  { icon: Briefcase, title: 'Parental Leave', desc: 'Generous parental leave for all new parents.' },
];

export default function Careers() {
  return (
    <>
      <PageHero eyebrow="Careers" title={<>Build the future of <span className="gradient-text">payments</span></>} subtitle="Join a team obsessed with making payments effortless for every business." />

      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Perks & Benefits" title={<>We take care of <span className="gradient-text">our people</span></>} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-6 card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><p.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900 dark:text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/40 dark:bg-ink-900/30">
        <div className="container-px">
          <SectionHeading eyebrow="Open Roles" title={<>Find your <span className="gradient-text">next role</span></>} subtitle="We're hiring across engineering, design, sales and more." />
          <div className="mx-auto mt-12 max-w-4xl space-y-3">
            {openings.map((o, i) => (
              <motion.div key={o.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} className="glass-card group flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between card-hover">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">{o.role}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500 dark:text-ink-400">
                    <span>{o.team}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.location}</span>
                    <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {o.type}</span>
                  </div>
                </div>
                <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-300">Apply <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
