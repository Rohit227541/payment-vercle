import { motion } from 'framer-motion';
import { Terminal, Package, Webhook, Copy } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { apiSteps, apiSample, apiResponse } from '../../data/content';

const tabs = [
  { icon: Terminal, label: 'REST API' },
  { icon: Package, label: 'SDK' },
  { icon: Webhook, label: 'Webhook' },
];

export default function ApiPreview() {
  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="Developers"
          title={<>APIs that <span className="gradient-text">developers love</span></>}
          subtitle="Clean REST APIs, official SDKs, reliable webhooks and a sandbox that just works."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 px-4 py-3">
              {tabs.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 dark:bg-ink-800/60 px-2.5 py-1.5 text-xs font-medium text-ink-600 dark:text-ink-300">
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-400 dark:text-ink-500">
                <Copy className="h-3.5 w-3.5" /> Copy
              </span>
            </div>
            <pre className="overflow-x-auto bg-ink-950 p-5 text-sm leading-relaxed text-ink-100">
              <code className="font-mono">{apiSample}</code>
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 px-4 py-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                200 OK
              </span>
              <span className="text-xs text-ink-400 dark:text-ink-500">Response Example</span>
            </div>
            <pre className="overflow-x-auto bg-ink-950 p-5 text-sm leading-relaxed text-ink-100">
              <code className="font-mono">{apiResponse}</code>
            </pre>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apiSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card p-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 font-display text-sm font-bold text-white">
                {s.step}
              </span>
              <h4 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-white">{s.title}</h4>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
