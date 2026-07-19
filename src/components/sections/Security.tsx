import SectionHeading from '../ui/SectionHeading';
import FeatureCard from '../ui/FeatureCard';
import { security } from '../../data/content';

export default function Security() {
  return (
    <section className="section bg-white/40 dark:bg-ink-900/30">
      <div className="container-px">
        <SectionHeading
          eyebrow="Security"
          title={<>Security at the <span className="gradient-text">core</span></>}
          subtitle="Enterprise-grade security and compliance built into every layer of our platform."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {security.map((s, i) => (
            <FeatureCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} delay={(i % 4) * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
