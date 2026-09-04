import { motion } from 'framer-motion';
import { Terminal, Package, Webhook, Code2, BookOpen, Boxes, GitBranch, Zap } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import ApiPreview from '../components/sections/ApiPreview';
import CTA from '../components/sections/CTA';



const resources = [
  { icon: BookOpen, title: 'Documentation', desc: 'Comprehensive guides and API references.' },
  { icon: Code2, title: 'Quickstart', desc: 'Accept your first payment in under 10 minutes.' },
  { icon: Webhook, title: 'Webhooks', desc: 'Subscribe to real-time payment events.' },
  { icon: GitBranch, title: 'Changelog', desc: 'Stay up to date with every release.' },
  { icon: Boxes, title: 'SDKs', desc: 'Official libraries for every major language.' },
  { icon: Terminal, title: 'CLI', desc: 'Manage your account from the terminal.' },
];

export default function Developers() {
  return (
    <>
      <PageHero eyebrow="Developers" title={<>Build with <span className="gradient-text">Trustgates</span></>} subtitle="Clean APIs, reliable webhooks and a sandbox that just works." />

      <section className="section">
        <div className="container-px">
          <SectionHeading eyebrow="Resources" title={<>Everything you need to <span className="gradient-text">ship fast</span></>} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card p-6 card-hover">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><r.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900 dark:text-white">{r.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ApiPreview />



      <CTA />
    </>
  );
}
