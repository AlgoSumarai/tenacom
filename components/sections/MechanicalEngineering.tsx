import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui';
import Reveal from '@/components/motion/Reveal';
import ImageReveal from '@/components/motion/ImageReveal';
import MechanicalStages from './MechanicalStages';
export default function MechanicalEngineering() {
  return (
    <section className="mechanical-section section">
      <div className="container mechanical-grid">
        <ImageReveal className="engineering-drawing">
          <svg
            viewBox="0 0 560 420"
            role="img"
            aria-label="Exploded concept drawing of an enclosure, circuit board and mounting plate"
          >
            <defs>
              <pattern id="cad-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#cdd8e3" strokeWidth=".5" />
              </pattern>
            </defs>
            <rect width="560" height="420" fill="url(#cad-grid)" />
            <g fill="none" stroke="#2c5d84" strokeWidth="1.4">
              <path d="m130 259 175-65 127 61-176 72Z m0 0v26l126 64 176-70v-24 M256 327v22" />
              <path d="m157 214 148-56 100 47-149 58Z m-99-49v13l99 50 149-59v-12" fill="#e0e9f0" />
              <path d="m169 151 136-51 88 43-137 53Z m-87-45v25l87 45 137-53v-25" fill="#f5f8fc" />
              <path
                d="m135 105 170-64 119 57-171 68Z m-118-61v22l118 61 171-70V98"
                fill="#ecf2f7"
              />
              <path d="m253 166v22" />
              <path d="M145 115v168M413 109v165M260 182v158" strokeDasharray="4 5" />
              <path d="m222 161 52-19 37 17-52 20Z m91-25 31-11 21 10-31 12Z" fill="#bfd7ea" />
              <path
                d="m106 294 143 73 199-78M105 287v15M449 282v15M89 133v150M81 133h16M81 283h16"
                stroke="#7591a9"
              />
              {[
                [157, 103],
                [301, 50],
                [404, 100],
                [256, 148],
                [180, 216],
                [305, 171],
                [380, 207],
                [258, 249],
              ].map(([x, y]) => (
                <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="5" ry="2" />
              ))}
            </g>
            <g fill="#52738f" fontSize="9" fontFamily="monospace" letterSpacing="1.5">
              <text x="352" y="51">
                01 / ENCLOSURE
              </text>
              <text x="364" y="182">
                02 / ELECTRONICS
              </text>
              <text x="345" y="335">
                03 / MOUNTING
              </text>
              <text x="58" y="215" transform="rotate(-90 58 215)">
                FIT. FORM. FUNCTION.
              </text>
              <text x="29" y="389">
                CONCEPT STUDY — EXPLODED ASSEMBLY
              </text>
            </g>
          </svg>
          <span className="drawing-caption">
            MECHANICAL × ELECTRONIC INTEGRATION <span>FIG. 02</span>
          </span>
        </ImageReveal>
        <Reveal>
          <Eyebrow>Grounded in real engineering</Eyebrow>
          <h2>Software is only useful if the physical system works.</h2>
          <p>
            Enclosures that fit. Mountings that hold. Components that work together. We consider the
            physical details from the very first design decision.
          </p>
          <p>From CAD to something you can hold — and test.</p>
          <MechanicalStages />
          <Link className="text-link" href="/capabilities#capability-1">
            Explore mechanical engineering <ArrowUpRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
