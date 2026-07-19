import PageHero from '../components/PageHero';
import Security from '../components/sections/Security';
import Stats from '../components/sections/Stats';
import CTA from '../components/sections/CTA';

export default function SecurityPage() {
  return (
    <>
      <PageHero eyebrow="Security" title={<>Security is <span className="gradient-text">not optional</span></>} subtitle="Enterprise-grade security and compliance built into every layer of our platform." />
      <Security />
      <Stats />
      <CTA />
    </>
  );
}
