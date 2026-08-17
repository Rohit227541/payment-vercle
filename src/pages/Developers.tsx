import { motion } from 'framer-motion';
import { Terminal, Package, Webhook, Code2, BookOpen, Boxes, GitBranch, Zap } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import ApiPreview from '../components/sections/ApiPreview';
import CTA from '../components/sections/CTA';

const sdks = [
  { name: 'Node.js', tag: 'npm' },
  { name: 'Python', tag: 'pip' },
  { name: 'Java', tag: 'maven' },
  { name: 'Go', tag: 'go get' },
  { name: 'Ruby', tag: 'gem' },
  { name: 'PHP', tag: 'composer' },
  { name: 'iOS', tag: 'Swift' },
  { name: 'Android', tag: 'Kotlin' },
];

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
      <PageHero eyebrow="Developers" title={<>Build with <span className="gradient-text">PayFlow</span></>} subtitle="Clean APIs, official SDKs, reliable webhooks and a sandbox that just works." />

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

      <section className="section bg-white/40 dark:bg-ink-900/30">
        <div className="container-px">
          <SectionHeading eyebrow="SDKs" title={<>Official <span className="gradient-text">SDKs</span></>} subtitle="Drop-in libraries for every major language and platform." />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sdks.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass-card flex flex-col items-center gap-2 p-6 card-hover">
                <Package className="h-7 w-7 text-brand-500" />
                <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">{s.name}</p>
                <span className="rounded-full bg-ink-100 dark:bg-ink-800 px-2 py-0.5 font-mono text-[11px] text-ink-500 dark:text-ink-400">{s.tag}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <div className="glass-card flex items-center gap-3 px-5 py-3 text-sm text-ink-600 dark:text-ink-300">
              <Zap className="h-4 w-4 text-amber-500" /> Sandbox with test cards — no live charges, no limits.
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
