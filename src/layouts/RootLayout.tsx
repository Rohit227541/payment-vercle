import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function RootLayout() {
  useScrollToTop();
  return (
    <div className="relative min-h-screen bg-aurora">
      <Navbar />
      <main className="pt-16 lg:pt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
