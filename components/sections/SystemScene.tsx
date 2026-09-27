'use client';
import { useState } from 'react';
import { ArrowUpRight, Play, Pause } from 'lucide-react';
export default function SystemScene() {
  const [running, setRunning] = useState(true);
  return (
    <div className={`system-scene ${running ? 'running' : 'paused'}`}>
      <div className="scene-top">
        <span>
          <i /> Connected pump system
        </span>
        <span>CONCEPT / 001</span>
      </div>
      <svg
        className="machine"
        viewBox="0 0 680 485"
        role="img"
        aria-labelledby="machine-title machine-desc"
      >
        <title id="machine-title">Connected pump concept</title>
        <desc id="machine-desc">
          A motor drives a pump. A temperature sensor sends data through a controller to software,
          which can command the motor to run or stop.
        </desc>
        <defs>
          <linearGradient id="metal" x1="0" y1="0" x2="0.9" y2="1">
            <stop stopColor="#ecf2f8" />
            <stop offset=".35" stopColor="#9eafc4" />
            <stop offset=".7" stopColor="#546b86" />
            <stop offset="1" stopColor="#d6e2ed" />
          </linearGradient>
          <linearGradient id="motor" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#8eabc7" />
            <stop offset=".45" stopColor="#3a526e" />
            <stop offset="1" stopColor="#162c46" />
          </linearGradient>
          <linearGradient id="blue">
            <stop stopColor="#015bd5" />
            <stop offset="1" stopColor="#06b4f4" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#233b54" strokeWidth=".6" />
          </pattern>
          <filter id="shadow">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <rect width="680" height="485" fill="url(#grid)" opacity=".42" />
        <ellipse
          cx="333"
          cy="366"
          rx="230"
          ry="35"
          fill="#000"
          opacity=".3"
          filter="url(#shadow)"
        />
        <g transform="translate(12 6)">
          <path d="M119 306 363 222 549 302 304 400Z" fill="#122940" stroke="#4b647e" />
          <path d="m119 306 185 78 245-82v14l-245 85-185-80Z" fill="#263d55" stroke="#4b647e" />
          <path
            d="m180 300 8-32 42 15-6 34m190 5 4-35 38-14 2 36"
            fill="url(#metal)"
            stroke="#93a8bc"
          />
          <path d="M259 215 359 183 440 218 337 254Z" fill="#8499ae" />
          <path d="m259 215 78 39v84l-78-37Z" fill="#334b65" />
          <path d="m337 254 103-36v79l-103 41Z" fill="#213a56" />
          <path
            d="M334 194 C340 164 369 151 394 164 L477 205 C502 217 505 252 482 266 L407 296 C372 308 333 276 334 247Z"
            fill="url(#motor)"
            stroke="#91a6b9"
            strokeWidth="1.5"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`M${351 + i * 8} ${178 + i * 3.8} q-20 33 -3 75`}
              fill="none"
              stroke={i % 2 ? '#8297aa' : '#263d55'}
              strokeWidth="4"
            />
          ))}
          <ellipse
            cx="466"
            cy="240"
            rx="30"
            ry="37"
            transform="rotate(-23 466 240)"
            fill="#263d55"
            stroke="#9fb2c4"
            strokeWidth="3"
          />
          <ellipse
            cx="466"
            cy="240"
            rx="20"
            ry="27"
            transform="rotate(-23 466 240)"
            fill="#142c44"
            stroke="#5e7a96"
          />
          <g className="rotor" style={{ transformOrigin: '466px 240px' }}>
            <path d="m450 226 32 29m-33-4 32-21m-14-15-1 51" stroke="#7c98b2" strokeWidth="3" />
          </g>
          <path d="m347 186 15-38 43-15 37 18-11 37-46 16Z" fill="#314d6b" stroke="#8ba6c0" />
          <path d="m362 148 38 19 42-16-37-18Z" fill="#8da5bc" />
          <circle cx="401" cy="173" r="4" fill="#06b4f4" />
          <path d="m292 251 53-18 17 21-56 19Z" fill="url(#metal)" />
          <path
            d="M201 211 C165 222 159 265 180 289 L226 315 C253 331 293 308 300 278 C309 243 289 219 264 213 L238 196Z"
            fill="url(#metal)"
            stroke="#b0c0d0"
            strokeWidth="2"
          />
          <ellipse
            cx="232"
            cy="267"
            rx="43"
            ry="48"
            transform="rotate(-22 232 267)"
            fill="#54718e"
            stroke="#9fb4c8"
            strokeWidth="5"
          />
          <ellipse
            cx="232"
            cy="267"
            rx="28"
            ry="32"
            transform="rotate(-22 232 267)"
            fill="#304d69"
            stroke="#19354f"
            strokeWidth="3"
          />
          <path d="m190 254-55-23-22 14v25l80 36 27-14v-25Z" fill="url(#metal)" stroke="#aebdcc" />
          <ellipse
            cx="129"
            cy="256"
            rx="17"
            ry="25"
            transform="rotate(-23 129 256)"
            fill="#1b334d"
            stroke="#819db7"
            strokeWidth="6"
          />
          <path d="m211 212 0-60 29-11 28 15v62l-27 14Z" fill="url(#metal)" stroke="#a0b3c7" />
          <path d="m200 153 40-17 41 17-40 18Z" fill="#b3c5d6" stroke="#dfebf4" />
          <path d="m200 153 41 18 40-18v12l-40 18-41-18Z" fill="#526f8c" />
          <ellipse cx="241" cy="154" rx="17" ry="7" fill="#122c46" />
          {[
            [206, 241],
            [245, 239],
            [257, 278],
            [220, 298],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" fill="#d8e4ee" />
          ))}
          <path d="m266 217 0-29 13-5 8 5v31" fill="#d4e1eb" stroke="#647f99" />
          <circle className="sensor-pulse" cx="278" cy="188" r="7" fill="#06b4f4" />
          <circle cx="278" cy="188" r="15" fill="none" stroke="#06b4f4" opacity=".4" />
        </g>
        <g fill="none" stroke="#06b4f4" strokeWidth="1.2">
          <path className="data-path" d="M290 194V97H413V150" strokeDasharray="5 6" />
          <path d="M166 329H90V378H55" stroke="#647f99" />
          <path d="M484 276H558V346H606" stroke="#647f99" />
        </g>
        <g fontFamily="monospace" fontSize="10" letterSpacing="1">
          <text x="60" y="401" fill="#91a8bf">
            01 / PHYSICAL SYSTEM
          </text>
          <text x="469" y="371" fill="#91a8bf">
            02 / DRIVE MOTOR
          </text>
          <text x="306" y="83" fill="#56cdfb">
            TEMPERATURE SENSOR
          </text>
        </g>
      </svg>
      <div className="telemetry">
        <div className="telemetry-label">
          <span className="live-dot" />
          Illustrative telemetry
          <ArrowUpRight size={14} />
        </div>
        <div className="readings">
          <div>
            <span>Temperature</span>
            <strong>
              {running ? '42.8' : '24.0'}
              <small>°C</small>
            </strong>
            <svg viewBox="0 0 100 22" aria-hidden="true">
              <path d="M0 17 12 15 20 18 29 9 37 12 44 5 55 9 62 6 73 11 82 4 91 6 100 2" />
            </svg>
          </div>
          <div>
            <span>Motor status</span>
            <strong className="status-reading">{running ? 'Running' : 'Stopped'}</strong>
            <span className="status-caption">
              {running ? 'Command acknowledged' : 'Control command applied'}
            </span>
          </div>
        </div>
      </div>
      <div className="scene-bottom">
        <span>PHYSICAL → DIGITAL → PHYSICAL</span>
        <button onClick={() => setRunning(!running)} aria-pressed={running}>
          {running ? <Pause size={13} /> : <Play size={13} />}{' '}
          {running ? 'Stop motor' : 'Start motor'}
        </button>
      </div>
    </div>
  );
}
