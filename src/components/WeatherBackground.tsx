"use client";

interface WeatherBackgroundProps {
  weatherId: number;
  isDaytime: boolean;
}

// ── SVG path components ────────────────────────────────────────────

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`absolute ${className}`} fill="none">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow */}
      <circle cx="100" cy="100" r="90" fill="url(#sunGlow)" className="animate-pulse" />
      {/* Rays */}
      <g className="origin-center animate-[spin_20s_linear_infinite]">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="100" y1="25" x2="100" y2="12"
            stroke="#FDE047"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 100)`}
            opacity="0.6"
          />
        ))}
      </g>
      {/* Sun body */}
      <circle cx="100" cy="100" r="35" fill="#FEF08A" />
      <circle cx="100" cy="100" r="30" fill="#FDE047" />
    </svg>
  );
}

function Moon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={`absolute ${className}`} fill="none">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#94A3B8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="url(#moonGlow)" className="animate-pulse" />
      {/* Moon crescent */}
      <circle cx="80" cy="80" r="32" fill="#F1F5F9" />
      <circle cx="92" cy="75" r="28" fill="#CBD5E1" opacity="0.6" />
      {/* Craters */}
      <circle cx="72" cy="85" r="4" fill="#94A3B8" opacity="0.3" />
      <circle cx="80" cy="72" r="3" fill="#94A3B8" opacity="0.2" />
      <circle cx="78" cy="92" r="5" fill="#94A3B8" opacity="0.25" />
    </svg>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={`absolute ${className}`} fill="none">
      {[
        { x: 20, y: 30, size: 2, delay: 0 },
        { x: 60, y: 55, size: 2.5, delay: 1 },
        { x: 100, y: 20, size: 1.5, delay: 0.5 },
        { x: 140, y: 45, size: 2, delay: 2 },
        { x: 180, y: 15, size: 3, delay: 0.8 },
        { x: 220, y: 50, size: 1.5, delay: 1.5 },
        { x: 260, y: 30, size: 2, delay: 0.3 },
        { x: 40, y: 80, size: 1.5, delay: 2.5 },
        { x: 120, y: 70, size: 2, delay: 1.2 },
        { x: 200, y: 75, size: 1.5, delay: 0.7 },
        { x: 280, y: 65, size: 2.5, delay: 1.8 },
        { x: 80, y: 40, size: 1, delay: 3 },
        { x: 160, y: 60, size: 1.5, delay: 0.4 },
        { x: 240, y: 40, size: 1, delay: 2.2 },
        { x: 30, y: 100, size: 1.5, delay: 0.9 },
      ].map((star, i) => (
        <circle
          key={i}
          cx={star.x} cy={star.y} r={star.size}
          fill="#F1F5F9"
          opacity="0"
          className="animate-pulse"
          style={{ animationDelay: `${star.delay}s`, animationDuration: "2s" }}
        />
      ))}
    </svg>
  );
}

function Clouds({ className = "", count = 3, dark = false }: { className?: string; count?: number; dark?: boolean }) {
  const fill = dark ? "#475569" : "#F1F5F9";
  const positions = [
    { x: -20, y: 20, scale: 1, delay: "0s", dur: "25s" },
    { x: 80, y: 40, scale: 0.7, delay: "-5s", dur: "30s" },
    { x: 40, y: 10, scale: 0.85, delay: "-12s", dur: "28s" },
  ].slice(0, count);

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {positions.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 200 80"
          className="absolute"
          style={{
            width: `${p.scale * 120}%`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `slideCloud ${p.dur} linear infinite`,
            animationDelay: p.delay,
          }}
          fill="none"
        >
          <ellipse cx="60" cy="50" rx="50" ry="25" fill={fill} opacity="0.15" />
          <ellipse cx="100" cy="45" rx="60" ry="28" fill={fill} opacity="0.12" />
          <ellipse cx="140" cy="50" rx="45" ry="22" fill={fill} opacity="0.1" />
          <ellipse cx="80" cy="40" rx="40" ry="20" fill={fill} opacity="0.18" />
          <ellipse cx="120" cy="38" rx="35" ry="18" fill={fill} opacity="0.15" />
        </svg>
      ))}
    </div>
  );
}

function RainDrops({ className = "", heavy = false }: { className?: string; heavy?: boolean }) {
  const drops = heavy
    ? [
        { x: 10, delay: "0s", dur: "0.8s" }, { x: 25, delay: "0.3s", dur: "0.9s" },
        { x: 40, delay: "0.1s", dur: "0.7s" }, { x: 55, delay: "0.5s", dur: "0.85s" },
        { x: 70, delay: "0.2s", dur: "0.75s" }, { x: 85, delay: "0.4s", dur: "0.9s" },
        { x: 18, delay: "0.6s", dur: "0.8s" }, { x: 35, delay: "0.8s", dur: "0.7s" },
        { x: 50, delay: "0.15s", dur: "0.85s" }, { x: 65, delay: "0.7s", dur: "0.75s" },
        { x: 80, delay: "0.9s", dur: "0.9s" }, { x: 95, delay: "0.35s", dur: "0.8s" },
        { x: 15, delay: "0.45s", dur: "0.7s" }, { x: 45, delay: "0.55s", dur: "0.85s" },
        { x: 75, delay: "0.25s", dur: "0.9s" },
      ]
    : [
        { x: 15, delay: "0s", dur: "1s" }, { x: 35, delay: "0.4s", dur: "1.1s" },
        { x: 55, delay: "0.2s", dur: "0.9s" }, { x: 75, delay: "0.6s", dur: "1s" },
        { x: 25, delay: "0.8s", dur: "1.2s" }, { x: 45, delay: "0.1s", dur: "0.95s" },
        { x: 65, delay: "0.5s", dur: "1.05s" }, { x: 85, delay: "0.3s", dur: "1.1s" },
      ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {drops.map((drop, i) => (
        <div
          key={i}
          className="absolute w-0.5 rounded-full bg-blue-300/40"
          style={{
            left: `${drop.x}%`,
            top: "-10%",
            height: heavy ? "14px" : "10px",
            animation: `rainDrop ${drop.dur} linear infinite`,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  );
}

function Lightning({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 120" className={`absolute ${className}`} fill="none">
      <defs>
        <filter id="boltGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M35 0L15 55h18L10 110l40-65H32l18-45H35z"
        fill="#FBBF24"
        opacity="0.7"
        filter="url(#boltGlow)"
        className="animate-pulse"
        style={{ animationDelay: `${Math.random() * 3}s`, animationDuration: "3s", ...style }}
      />
    </svg>
  );
}

function Snowflakes({ className = "" }: { className?: string }) {
  const flakes = [
    { x: 10, size: 8, delay: "0s", dur: "4s" }, { x: 25, size: 6, delay: "1s", dur: "5s" },
    { x: 40, size: 10, delay: "0.5s", dur: "4.5s" }, { x: 55, size: 7, delay: "2s", dur: "5.5s" },
    { x: 70, size: 9, delay: "0.8s", dur: "4s" }, { x: 85, size: 6, delay: "1.5s", dur: "5s" },
    { x: 20, size: 7, delay: "3s", dur: "4.8s" }, { x: 50, size: 8, delay: "0.3s", dur: "4.2s" },
    { x: 65, size: 6, delay: "1.8s", dur: "5.2s" }, { x: 90, size: 9, delay: "0.7s", dur: "4.6s" },
    { x: 35, size: 5, delay: "2.5s", dur: "5s" }, { x: 75, size: 7, delay: "1.2s", dur: "4.3s" },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${f.x}%`,
            width: f.size,
            height: f.size,
            opacity: 0.6,
            top: "-10%",
            animation: `snowFall ${f.dur} linear infinite, snowWobble ${parseFloat(f.dur) * 0.7}s ease-in-out infinite`,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}

function FogLayers({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 h-12 rounded-full"
          style={{
            top: `${30 + i * 25}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(255,255,255,0.2), rgba(255,255,255,0.15), transparent)",
            animation: `fogDrift ${12 + i * 4}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function WeatherBackground({ weatherId, isDaytime }: WeatherBackgroundProps) {
  const isCloudy = weatherId >= 801 && weatherId < 900;

  return (
    <>


      {/* ── CLEAR DAY ── */}
      {weatherId === 800 && isDaytime && (
        <>
          <Sun className="top-[-30px] right-[-20px] w-56 h-56 opacity-70" />
          <div className="absolute top-[15%] left-[8%] w-3 h-3 rounded-full bg-yellow-300/20 animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-yellow-300/15 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "1s" }} />
        </>
      )}

      {/* ── CLEAR NIGHT ── */}
      {weatherId === 800 && !isDaytime && (
        <>
          <Moon className="top-[-10px] right-[-10px] w-44 h-44 opacity-60" />
          <Stars className="inset-0 w-full h-full opacity-50" />
        </>
      )}

      {/* ── FEW CLOUDS (DAY) ── */}
      {(weatherId === 801 || weatherId === 802) && isDaytime && (
        <>
          <Sun className="top-[5%] right-[10%] w-40 h-40 opacity-40" />
          <Clouds count={2} />
        </>
      )}

      {/* ── FEW CLOUDS (NIGHT) ── */}
      {(weatherId === 801 || weatherId === 802) && !isDaytime && (
        <>
          <Moon className="top-[5%] right-[5%] w-36 h-36 opacity-40" />
          <Stars className="inset-0 w-full h-full opacity-30" />
          <Clouds count={2} dark />
        </>
      )}

      {/* ── BROKEN / OVERCAST ── */}
      {(weatherId === 803 || weatherId === 804) && (
        <Clouds count={3} dark={!isDaytime} />
      )}

      {/* ── DRIZZLE ── */}
      {weatherId >= 300 && weatherId < 400 && (
        <>
          <Clouds count={2} dark />
          <RainDrops />
        </>
      )}

      {/* ── RAIN ── */}
      {weatherId >= 500 && weatherId < 600 && (
        <>
          <Clouds count={3} dark />
          <RainDrops heavy={weatherId >= 502} />
        </>
      )}

      {/* ── THUNDERSTORM ── */}
      {weatherId >= 200 && weatherId < 300 && (
        <>
          <Clouds count={3} dark />
          <RainDrops heavy />
          <Lightning className="top-[25%] left-[20%] w-12 h-24 opacity-50" />
          <Lightning className="top-[35%] right-[25%] w-10 h-20 opacity-40" style={{ animationDelay: "1.5s" }} />
        </>
      )}

      {/* ── SNOW ── */}
      {weatherId >= 600 && weatherId < 700 && (
        <>
          <Clouds count={2} dark />
          <Snowflakes />
        </>
      )}

      {/* ── FOG / MIST ── */}
      {weatherId >= 700 && weatherId < 800 && (
        <FogLayers />
      )}

      {/* ── DEFAULT for unhandled (e.g., night + clouds) ── */}
      {!isDaytime && isCloudy && <Stars className="inset-0 w-full h-full opacity-20" />}
    </>
  );
}
