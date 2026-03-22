import React, { useEffect, useState, useRef } from "react";
import { getLevelConfig, MAX_LEVEL } from "../hooks/useLightsOut";

interface IntroPageProps {
  onStart: () => void;
  onMusicToggle: () => void;
  musicEnabled: boolean;
  musicPlaying: boolean;
}

const FEATURES = [
  {
    icon: "🎯",
    title: "Simple Rules",
    desc: "Click a tile to toggle it and its neighbors. Turn all lights off to win.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: "📈",
    title: "25 Levels",
    desc: "Progress through increasingly complex puzzles from 3×3 to 8×8 grids.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: "⏱️",
    title: "Beat The Clock",
    desc: "Each level has a countdown timer. Solve it before time runs out!",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    icon: "🎵",
    title: "Ambient Audio",
    desc: "Optional procedural synth music to enhance your puzzle experience.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

const DIFFICULTY_COLORS = {
  Easy: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  Medium: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  Hard: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Expert: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  Master: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
  Legendary: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

// Animated particle component
const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute rounded-full bg-gradient-to-br from-amber-400/40 to-orange-500/40 blur-sm animate-float-particle"
    style={style}
  />
);

export const IntroPage: React.FC<IntroPageProps> = ({
  onStart,
  onMusicToggle,
  musicEnabled,
  musicPlaying,
}) => {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [animatedGrid, setAnimatedGrid] = useState<boolean[]>(
    Array(25).fill(false)
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePos({ x, y });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate the demo grid
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedGrid((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * 25);
        const row = Math.floor(idx / 5);
        const col = idx % 5;
        const toggles = [
          idx,
          row > 0 ? idx - 5 : -1,
          row < 4 ? idx + 5 : -1,
          col > 0 ? idx - 1 : -1,
          col < 4 ? idx + 1 : -1,
        ];
        toggles.forEach((t) => {
          if (t >= 0 && t < 25) next[t] = !next[t];
        });
        return next;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const previewLevels = [1, 5, 10, 15, 20, 25].map((l) => getLevelConfig(l));

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${8 + Math.random() * 16}px`,
    height: `${8 + Math.random() * 16}px`,
    animationDelay: `${i * 0.3}s`,
    animationDuration: `${5 + Math.random() * 5}s`,
  }));

  return (
    <main className="relative z-10 min-h-screen overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((style, i) => (
          <Particle key={i} style={style} />
        ))}
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 min-h-[80vh]"
      >
        {/* Animated glowing orbs with parallax */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-50 blur-[120px] transition-transform duration-300 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
            top: "10%",
            left: "50%",
            transform: `translate(-50%, 0) translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-40 blur-[80px] transition-transform duration-500 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)",
            top: "30%",
            right: "20%",
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-30 blur-[100px] transition-transform duration-700 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)",
            bottom: "20%",
            left: "10%",
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          }}
        />

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-amber-200/90">
              {MAX_LEVEL} Challenging Levels • Countdown Timer
            </span>
          </div>

          {/* Title */}
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter animate-fade-in-up animation-delay-100">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent blur-2xl opacity-50">
                Lights Out
              </span>
              <span className="relative bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]">
                Lights Out
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Master the classic puzzle of cascading toggles. 
            <span className="text-amber-300 font-medium"> Plan your moves wisely</span> and 
            <span className="text-amber-300 font-medium"> beat the clock</span> to plunge every light into darkness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up animation-delay-300">
            <button
              onClick={onStart}
              className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-xl font-black text-slate-900 shadow-[0_20px_60px_-15px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_30px_80px_-10px_rgba(251,191,36,0.6)] active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                🎮 Start Playing
                <svg
                  className="w-6 h-6 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>

            <button
              onClick={onMusicToggle}
              className={`px-8 py-5 rounded-xl border font-semibold backdrop-blur-sm transition-all flex items-center gap-3 ${
                musicEnabled && musicPlaying
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {musicEnabled && musicPlaying ? (
                <>
                  <span className="text-xl">🔊</span> Music On
                </>
              ) : (
                <>
                  <span className="text-xl">🔇</span> Music Off
                </>
              )}
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-8 animate-bounce">
            <svg className="w-6 h-6 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Demo Grid */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-purple-500/10 to-blue-500/20 rounded-[40px] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 rounded-[32px] p-10 shadow-2xl">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="grid grid-cols-5 gap-3 max-w-[280px] mx-auto mt-4">
                  {animatedGrid.map((lit, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded-xl border-2 transition-all duration-300 ${
                        lit
                          ? "border-amber-300/80 bg-gradient-to-br from-yellow-200 via-amber-400 to-orange-500 shadow-[0_0_25px_rgba(251,191,36,0.7)] scale-105"
                          : "border-slate-700 bg-slate-800/60 hover:bg-slate-700/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Demo Mode - Auto Playing
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-5 order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
                Why You'll <span className="text-amber-400">Love</span> It
              </h2>
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-gradient-to-r ${feature.gradient} border border-white/10 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group cursor-default`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{feature.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Level Preview */}
      <section className="relative px-6 py-20 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Progressive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Challenge</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From beginner-friendly 3×3 grids to mind-bending 8×8 challenges.
              Each level has its own time limit — how far can you go?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {previewLevels.map((config) => {
              const colors = DIFFICULTY_COLORS[config.difficulty];
              return (
                <div
                  key={config.level}
                  onMouseEnter={() => setHoveredLevel(config.level)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-default ${
                    hoveredLevel === config.level
                      ? `${colors.bg} ${colors.border} scale-105 shadow-2xl`
                      : "bg-slate-900/50 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 ${colors.bg} ${colors.text}`}>
                    {config.difficulty}
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    Lv. {config.level}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {config.size}×{config.size} grid
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {config.timeLimit}s limit
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Play</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Click a Light",
                desc: "Select any illuminated tile on the grid to begin your move.",
                gradient: "from-amber-400 to-orange-500",
                shadow: "shadow-amber-500/30",
              },
              {
                step: 2,
                title: "Watch the Ripple",
                desc: "The clicked tile and its 4 neighbors will toggle on or off.",
                gradient: "from-blue-400 to-indigo-500",
                shadow: "shadow-blue-500/30",
              },
              {
                step: 3,
                title: "Beat the Clock",
                desc: "Clear the grid before time runs out to advance to the next level!",
                gradient: "from-emerald-400 to-teal-500",
                shadow: "shadow-emerald-500/30",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl font-black text-white mx-auto mb-5 shadow-xl ${item.shadow} group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mb-8">
            <div className="px-6 py-2 rounded-full bg-slate-900 text-amber-300 font-semibold">
              🏆 25 Levels Await
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Test Your <span className="text-amber-400">Mind</span>?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Challenge yourself with increasingly difficult puzzles. 
            Track your best times and climb through all difficulty tiers.
          </p>
          <button
            onClick={onStart}
            className="group px-14 py-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-xl font-black text-slate-900 shadow-[0_25px_70px_-15px_rgba(251,191,36,0.5)] transition-all hover:scale-105 hover:shadow-[0_30px_80px_-10px_rgba(251,191,36,0.6)] active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              Begin Level 1
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <span className="text-amber-400">💡</span> Lights Out Puzzle Game
          </p>
          <p>Built with React, Vite & Tailwind CSS</p>
        </div>
      </footer>
    </main>
  );
};
