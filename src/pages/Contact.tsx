import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import PageHero from '../components/PageHero';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let's <span className="gradient-text">talk</span></>} subtitle="Have a question or want a demo? Our team is here to help you 24×7." />

      <section className="section">
        <div className="container-px grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass-card p-7 sm:p-9">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-8 w-8" /></div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink-900 dark:text-white">Message sent!</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-outline mt-6">Send another</button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">Send us a message</h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Fill out the form and we'll respond within one business day.</p>
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Full Name</label><input required placeholder="Aarav Mehta" className="input" /></div>
                    <div><label className="label">Work Email</label><input required type="email" placeholder="you@company.com" className="input" /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Company</label><input placeholder="Acme Inc." className="input" /></div>
                    <div><label className="label">Phone</label><input placeholder="+91 90000 00000" className="input" /></div>
                  </div>
                  <div><label className="label">Subject</label>
                    <select className="input"><option>Sales enquiry</option><option>Technical support</option><option>Partnership</option><option>Other</option></select>
                  </div>
                  <div><label className="label">Message</label><textarea required rows={4} placeholder="Tell us how we can help…" className="input resize-none" /></div>
                  <button type="submit" className="btn-primary w-full"><Send className="h-4 w-4" /> Send Message</button>
                </form>
              </>
            )}
          </motion.div>

          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Visit Us', lines: ['Prestige Tech Park', 'Marathahalli, Bengaluru 560103, India'] },
              { icon: Mail, title: 'Email Us', lines: ['hello@payflow.io', 'sales@payflow.io'] },
              { icon: Phone, title: 'Call Us', lines: ['+91 80 0000 0000', '+1 800 555 0100'] },
              { icon: Clock, title: 'Support Hours', lines: ['24×7 live chat & email', 'Phone: Mon–Fri, 9am–6pm IST'] },
            ].map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="glass-card flex items-start gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white"><c.icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">{c.title}</h3>
                  {c.lines.map((l) => <p key={l} className="text-sm text-ink-500 dark:text-ink-400">{l}</p>)}
                </div>
              </motion.div>
            ))}
            <div className="glass-card overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-ink-200/60 dark:border-ink-800/60 px-5 py-3 text-sm font-medium text-ink-700 dark:text-ink-200"><MessageSquare className="h-4 w-4 text-brand-500" /> Find us on the map</div>
              <div className="relative h-48 bg-gradient-to-br from-brand-500/10 to-accent-500/10">
                <div className="absolute inset-0 bg-grid-light bg-[size:32px_32px] opacity-60 dark:bg-grid-dark" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex h-6 w-6"><span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-500" /><span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white"><MapPin className="h-3.5 w-3.5" /></span></span>
                </div>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-ink-500 dark:text-ink-400">Prestige Tech Park, Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
