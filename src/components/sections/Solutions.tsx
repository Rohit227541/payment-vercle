import SectionHeading from '../ui/SectionHeading';
import FeatureCard from '../ui/FeatureCard';
import { solutions } from '../../data/content';

export default function Solutions() {
  return (
    <section className="section">
      <div className="container-px">
        <SectionHeading
          eyebrow="Solutions"
          title={<>Built for <span className="gradient-text">every business</span></>}
          subtitle="Tailored payment solutions for your industry, scale and stage of growth."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {solutions.map((s, i) => (
            <FeatureCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} delay={(i % 5) * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
