import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <p className="font-display text-8xl font-bold gradient-text sm:text-9xl">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-white">Page not found</h1>
        <p className="mx-auto mt-2 max-w-md text-ink-500 dark:text-ink-400">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Back home</Link>
          <Link to="/contact" className="btn-outline"><ArrowLeft className="h-4 w-4" /> Contact support</Link>
        </div>
      </motion.div>
    </div>
  );
}
