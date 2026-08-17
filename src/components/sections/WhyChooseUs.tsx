import SectionHeading from '../ui/SectionHeading';
import FeatureCard from '../ui/FeatureCard';
import { whyChooseUs } from '../../data/content';

export default function WhyChooseUs() {
  return (
    <section className="section bg-white/40 dark:bg-ink-900/30">
      <div className="container-px">
        <SectionHeading
          eyebrow="Why PayFlow"
          title={<>Why businesses <span className="gradient-text">choose us</span></>}
          subtitle="Enterprise-grade infrastructure, developer-first APIs and support that never sleeps."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((w, i) => (
            <FeatureCard key={w.title} icon={w.icon} title={w.title} desc={w.desc} delay={(i % 3) * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
