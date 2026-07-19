import PageHero from '../components/PageHero';
import Solutions from '../components/sections/Solutions';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import CTA from '../components/sections/CTA';

export default function SolutionsPage() {
  return (
    <>
      <PageHero eyebrow="Solutions" title={<>Solutions for <span className="gradient-text">every business</span></>} subtitle="Tailored payment solutions for your industry, scale and stage of growth." />
      <Solutions />
      <WhyChooseUs />
      <CTA />
    </>
  );
}
