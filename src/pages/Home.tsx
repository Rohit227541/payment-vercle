import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import DashboardPreview from '../components/sections/DashboardPreview';
import Pricing from '../components/sections/Pricing';
import ApiPreview from '../components/sections/ApiPreview';
import Security from '../components/sections/Security';
import PaymentMethods from '../components/sections/PaymentMethods';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <DashboardPreview />
      <Pricing />
      <ApiPreview />
      <Security />
      <PaymentMethods />
      <FAQ />
      <CTA />
    </>
  );
}
