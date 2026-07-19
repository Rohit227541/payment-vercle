import SectionHeading from '../ui/SectionHeading';
import FeatureCard from '../ui/FeatureCard';
import { features } from '../../data/content';

export default function Features() {
  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="Features"
          title={<>Everything you need to <span className="gradient-text">accept payments</span></>}
          subtitle="A complete payments platform with every method, tool and integration your business needs to grow."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={(i % 4) * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
