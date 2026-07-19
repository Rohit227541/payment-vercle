import PageHero from '../components/PageHero';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Pay only for what you <span className="gradient-text">process</span></>} subtitle="Transparent pricing with no setup fees, no hidden charges and no minimum commitments." />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
