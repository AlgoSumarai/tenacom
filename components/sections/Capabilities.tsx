import { Box, Radio, Layers, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { capabilities } from '@/data/content';
import { Eyebrow } from '@/components/ui';
import Reveal from '@/components/motion/Reveal';
const icons = [Box, Radio, Layers, Activity];
export default function Capabilities() {
  return (
    <section className="section container" id="capabilities">
      <Reveal>
        <div className="section-heading">
          <div>
            <Eyebrow>Our capabilities</Eyebrow>
            <h2>
              Different disciplines.
              <br />
              One engineered system.
            </h2>
          </div>
          <p>
            From mechanical design to intelligent software, we build the connections that make the
            whole system work.
          </p>
        </div>
      </Reveal>
      <div className="capability-grid">
        {capabilities.map((item, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={item.title}>
              <Link className="capability" href={`/capabilities#capability-${i + 1}`}>
                <div className="capability-top">
                  <Icon size={29} strokeWidth={1.3} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.short}</p>
                <span className="text-link">
                  Explore capability <ArrowUpRight size={17} />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
