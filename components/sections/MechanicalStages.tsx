'use client';
import { useState } from 'react';
const stages = [
  ['CAD', 'Resolve geometry, clearances, materials and the interfaces between components.'],
  ['Prototype', 'Make the first physical parts to check assumptions early.'],
  ['Assembly', 'Check fit, wiring routes, connector access and serviceability together.'],
  [
    'Integrate',
    'Bring the enclosure, electronics and embedded behaviour into one working prototype.',
  ],
  [
    'Deploy',
    'Validate the installed system in its operating environment and document what matters.',
  ],
] as const;
export default function MechanicalStages() {
  const [active, setActive] = useState(0);
  return (
    <div className="mechanical-stages">
      <div className="build-stages" aria-label="Design-to-build stages">
        {stages.map(([name], i) => (
          <button key={name} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
            {name}
          </button>
        ))}
      </div>
      <p aria-live="polite">{stages[active][1]}</p>
    </div>
  );
}
