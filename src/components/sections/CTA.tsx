import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="section">
      <div className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-accent-500 p-10 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-dark bg-[size:40px_40px] opacity-20" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Start accepting payments today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Go live in minutes. No setup fees, no minimum commitments. Just secure payments that scale with you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn bg-white px-6 py-3.5 font-semibold text-brand-700 hover:-translate-y-0.5 hover:shadow-xl">
                Create Merchant Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn border border-white/40 px-6 py-3.5 font-semibold text-white hover:bg-white/10">
                Talk to sales
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
