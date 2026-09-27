'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Radio,
  ChartNoAxesCombined,
  SlidersHorizontal,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
const stages = [
  {
    name: 'Sense',
    icon: Activity,
    detail: 'Measure what matters.',
    body: 'Capture temperature, vibration, pressure, position and flow from the physical system.',
  },
  {
    name: 'Connect',
    icon: Radio,
    detail: 'Move information reliably.',
    body: 'Link sensors and controllers to software through embedded devices, gateways and networks.',
  },
  {
    name: 'Understand',
    icon: ChartNoAxesCombined,
    detail: 'Turn signals into insight.',
    body: 'Make operating conditions clear through interfaces, alerts and useful analysis.',
  },
  {
    name: 'Control',
    icon: SlidersHorizontal,
    detail: 'Put intelligence to work.',
    body: 'Send commands and apply defined rules to create appropriate physical responses.',
  },
  {
    name: 'Improve',
    icon: TrendingUp,
    detail: 'Make the next decision better.',
    body: 'Use measured results to refine maintenance, performance and operational decisions.',
  },
];
export default function SystemFlow() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  useEffect(() => {
    const el = section.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handle = () => {
      if (manual.current) return;
      const rect = el.getBoundingClientRect();
      const progress = (innerHeight * 0.85 - rect.top) / (innerHeight * 0.7);
      setActive(Math.max(0, Math.min(4, Math.floor(progress * 5))));
    };
    addEventListener('scroll', handle, { passive: true });
    return () => removeEventListener('scroll', handle);
  }, []);
  const current = stages[active];
  return (
    <div className="system-flow" ref={section}>
      <div className="flow-stages" role="tablist" aria-label="Connected system stages">
        {stages.map((stage, i) => (
          <button
            key={stage.name}
            id={`stage-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="stage-panel"
            tabIndex={active === i ? 0 : -1}
            className={i <= active ? 'is-active' : ''}
            onClick={() => {
              manual.current = true;
              setActive(i);
            }}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % 5;
              else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i + 4) % 5;
              else if (e.key === 'Home') next = 0;
              else if (e.key === 'End') next = 4;
              else return;
              e.preventDefault();
              manual.current = true;
              setActive(next);
              document.getElementById(`stage-${next}`)?.focus();
            }}
          >
            <span className="flow-icon">
              <stage.icon size={25} />
            </span>
            <small>0{i + 1}</small>
            <strong>{stage.name}</strong>
            <ArrowRight className="flow-arrow" size={18} />
          </button>
        ))}
      </div>
      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`stage-${active}`}
        tabIndex={0}
        className="flow-detail"
      >
        <h3>{current.detail}</h3>
        <p>{current.body}</p>
        <span>0{active + 1} / 05</span>
      </div>
      <p className="flow-loop">
        ↳ A complete feedback loop. Physical → Digital → Intelligence → Physical.
      </p>
    </div>
  );
}
