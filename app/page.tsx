import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Check } from 'lucide-react';
import { Button, Eyebrow, FinalCTA } from '@/components/ui';
import SystemScene from '@/components/sections/SystemScene';
import SystemFlow from '@/components/sections/SystemFlow';
import Capabilities from '@/components/sections/Capabilities';
import Reveal from '@/components/motion/Reveal';
import MechanicalEngineering from '@/components/sections/MechanicalEngineering';
import { process, solutions, industries } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Intelligent systems & product engineering',
  'Mechanical engineering, connected systems and software. Tenacom makes physical operations measurable, connected and intelligent.',
  '/',
);
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <Eyebrow>Intelligent systems & product engineering</Eyebrow>
          <h1>
            Engineering
            <br />
            intelligence into
            <br />
            the <span>physical world.</span>
          </h1>
          <p>
            We connect the physical world to software.
            <br />
            Mechanical engineering, connected systems and intelligent software — designed to work as
            one.
          </p>
          <div className="hero-actions">
            <Button>Discuss Your Project</Button>
            <Link className="quiet-link" href="/capabilities">
              Explore our capabilities <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="little-cross">+</span> Engineered in South Africa. Built around your
            problem.
          </div>
        </div>
        <SystemScene />
      </section>
      <div className="hero-strip container">
        <span>MECHANICAL ENGINEERING</span>
        <span>CONNECTED SYSTEMS</span>
        <span>SOFTWARE & INTELLIGENCE</span>
        <a href="#the-problem" aria-label="Explore the website">
          <ArrowDown size={17} />
        </a>
      </div>
      <section id="the-problem" className="section problem container">
        <Reveal>
          <Eyebrow>The opportunity</Eyebrow>
          <h2>
            Your operations generate information.
            <br />
            <span>Put it to work.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="lead">
            Equipment running without visibility. Problems found too late. Another round of manual
            checks.
          </p>
          <p>
            We engineer the connection between what happens on the ground and what your business can
            see, understand and control.
          </p>
          <div className="outcomes">
            <span>
              <Check size={16} /> See what is happening
            </span>
            <span>
              <Check size={16} /> Respond with confidence
            </span>
            <span>
              <Check size={16} /> Automate what comes next
            </span>
          </div>
        </Reveal>
      </section>
      <section className="dark-section section">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <Eyebrow>The connected system</Eyebrow>
                <h2>
                  From physical signals.
                  <br />
                  To meaningful action.
                </h2>
              </div>
              <p>
                A sensor is only the beginning.
                <br />
                The value is in what the whole system makes possible.
              </p>
            </div>
          </Reveal>
          <SystemFlow />
        </div>
      </section>
      <Capabilities />
      <MechanicalEngineering />
      <section className="section container">
        <Reveal>
          <div className="section-heading">
            <div>
              <Eyebrow>Example applications</Eyebrow>
              <h2>
                Real problems.
                <br />
                Practical possibilities.
              </h2>
            </div>
            <Link className="text-link" href="/solutions">
              What we can build <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
        <div className="solution-grid">
          {solutions.slice(0, 3).map((item, i) => (
            <Reveal key={item.title}>
              <Link className="solution-card" href={`/solutions#solution-${i + 1}`}>
                <div className={`solution-art art-${i}`} aria-hidden="true">
                  <span className="art-ring" />
                  <span className="art-line" />
                  <span className="art-value">{['42.8 °C', '3.2 bar', '68 % RH'][i]}</span>
                  <span className="art-label">
                    {['CONDITION / MONITOR', 'FLOW / CONTROL', 'ENVIRONMENT / SENSE'][i]}
                  </span>
                </div>
                <p className="eyebrow">{item.category}</p>
                <h3>
                  {item.title}
                  <ArrowUpRight size={20} />
                </h3>
                <p>{item.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="section-note">
          Illustrative applications, not completed client projects. Every system starts with your
          requirements.
        </p>
      </section>
      <section id="process" className="section process-section">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <Eyebrow>How we work</Eyebrow>
                <h2>
                  From problem
                  <br />
                  to working system.
                </h2>
              </div>
              <p>
                You don’t need to arrive with a specification. Understanding what to build is part
                of the engineering.
              </p>
            </div>
          </Reveal>
          <div className="process-grid">
            {process.map(([title, body], i) => (
              <Reveal key={title}>
                <span className="process-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section container industries-preview">
        <Reveal>
          <Eyebrow>Where we can create value</Eyebrow>
          <h2>
            Built around the challenge.
            <br />
            Across physical operations.
          </h2>
        </Reveal>
        <div className="industry-links">
          {industries.slice(0, 6).map(([name]) => (
            <Link key={name} href="/industries">
              {name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="container why-section">
        <Eyebrow>Why Tenacom</Eyebrow>
        <div>
          <h2>
            One system.
            <br />A wider perspective.
          </h2>
          <p>
            Mechanical engineering and software inform each other from the start. You work directly
            with the engineers connecting the pieces, from the first prototype through integration
            and testing.
          </p>
          <Link href="/about" className="text-link">
            Get to know Tenacom <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
