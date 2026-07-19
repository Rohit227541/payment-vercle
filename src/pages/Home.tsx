import Hero from '../components/sections/Hero';
import TrustedBy from '../components/sections/TrustedBy';
import Features from '../components/sections/Features';
import Products from '../components/sections/Products';
import Solutions from '../components/sections/Solutions';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import DashboardPreview from '../components/sections/DashboardPreview';
import Stats from '../components/sections/Stats';
import Pricing from '../components/sections/Pricing';
import ApiPreview from '../components/sections/ApiPreview';
import Security from '../components/sections/Security';
import PaymentMethods from '../components/sections/PaymentMethods';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <Products />
      <Solutions />
      <WhyChooseUs />
      <DashboardPreview />
      <Stats />
      <Pricing />
      <ApiPreview />
      <Security />
      <PaymentMethods />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
