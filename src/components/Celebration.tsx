import React, { useEffect, useRef } from "react";
import { MAX_LEVEL, LevelConfig } from "../hooks/useLightsOut";

interface CelebrationProps {
  level: number;
  moves: number;
  timeRemaining: number;
  timeSpent: number;
  timeLimit: number;
  bestScore: number | undefined;
  bestTime: number | undefined;
  levelConfig: LevelConfig;
  onReplay: () => void;
  onNextLevel: () => void;
}

// Simple confetti particle
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle" | "star";
  opacity: number;
}

const COLORS = [
  "#facc15",
  "#f97316",
  "#ef4444",
  "#a855f7",
  "#3b82f6",
  "#10b981",
  "#ec4899",
  "#06b6d4",
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const Celebration: React.FC<CelebrationProps> = ({
  level,
  moves,
  timeRemaining,
  timeSpent,
  timeLimit,
  bestScore,
  bestTime,
  levelConfig,
  onReplay,
  onNextLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const isNewBestScore = bestScore !== undefined && moves === bestScore;
  const isNewBestTime = bestTime !== undefined && timeSpent === bestTime;
  const isLastLevel = level >= MAX_LEVEL;
  
  // Calculate time bonus percentage
  const timeBonus = Math.round((timeRemaining / timeLimit) * 100);
  const timeBonusRating = timeBonus >= 75 ? "⚡ Lightning Fast!" : 
                          timeBonus >= 50 ? "🔥 Great Speed!" : 
                          timeBonus >= 25 ? "✓ Good Job!" : "😅 Just in Time!";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Spawn particles
    const particles: Particle[] = [];
    const particleCount = isNewBestScore || isNewBestTime ? 250 : 180;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: randomBetween(0.1 * W, 0.9 * W),
        y: randomBetween(-150, -10),
        vx: randomBetween(-4, 4),
        vy: randomBetween(4, 10),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: randomBetween(6, 16),
        rotation: randomBetween(0, Math.PI * 2),
        rotationSpeed: randomBetween(-0.2, 0.2),
        shape: Math.random() > 0.6 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
        opacity: 1,
      });
    }
    particlesRef.current = particles;

    const ctx = canvas.getContext("2d")!;

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      const spikes = 5;
      const outerRadius = size / 2;
      const innerRadius = size / 4;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(0, -outerRadius);

      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
        rot += step;
      }

      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        if (p.y > H * 0.65) {
          p.opacity -= 0.02;
        }

        if (p.opacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(ctx, p.size);
        }
        ctx.restore();
      }

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isNewBestScore, isNewBestTime]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Canvas confetti layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 px-6 sm:px-10 py-8 shadow-2xl text-center max-w-md w-full mx-4 animate-[bounceIn_0.5s_ease-out]">
        {/* Trophy / Star */}
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-[0_0_40px_12px_rgba(251,191,36,0.5)]">
            <span className="text-4xl select-none">
              {isLastLevel ? "👑" : "🏆"}
            </span>
          </div>
          {(isNewBestScore || isNewBestTime) && (
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-xs font-bold text-white shadow-lg animate-bounce">
              NEW BEST!
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isLastLevel ? "🎉 You Beat The Game! 🎉" : "Level Complete!"}
          </h2>
          <p className="text-slate-300 text-sm">
            {isLastLevel
              ? `You conquered all ${MAX_LEVEL} levels!`
              : `Level ${level} • ${levelConfig.difficulty}`}
          </p>
        </div>

        {/* Time Bonus Banner */}
        <div className={`w-full rounded-xl p-3 border ${
          timeBonus >= 50 
            ? "bg-emerald-500/20 border-emerald-500/40" 
            : "bg-amber-500/20 border-amber-500/40"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Time Remaining</span>
            <span className={`text-lg font-bold ${timeBonus >= 50 ? "text-emerald-400" : "text-amber-400"}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Time Bonus</span>
            <span className={`text-sm font-semibold ${timeBonus >= 50 ? "text-emerald-300" : "text-amber-300"}`}>
              {timeBonusRating}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white">{moves}</span>
            <span className="block text-xs text-slate-400 uppercase tracking-widest mt-0.5">
              Moves
            </span>
            {isNewBestScore && (
              <span className="text-xs text-emerald-400 font-semibold">
                ★ Record!
              </span>
            )}
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-2xl sm:text-3xl font-black text-white">{formatTime(timeSpent)}</span>
            <span className="block text-xs text-slate-400 uppercase tracking-widest mt-0.5">
              Time Used
            </span>
            {isNewBestTime && (
              <span className="text-xs text-emerald-400 font-semibold">
                ★ Record!
              </span>
            )}
          </div>
        </div>

        {/* Best scores */}
        {(bestScore !== undefined || bestTime !== undefined) && (
          <div className="flex gap-6 text-sm">
            {bestScore !== undefined && (
              <div className="text-center">
                <span className="text-amber-400 font-bold">{bestScore}</span>
                <span className="block text-slate-500 text-xs">Best Moves</span>
              </div>
            )}
            {bestTime !== undefined && (
              <div className="text-center">
                <span className="text-amber-400 font-bold">
                  {formatTime(bestTime)}
                </span>
                <span className="block text-slate-500 text-xs">Best Time</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
          <button
            onClick={onReplay}
            className="flex-1 px-5 py-3 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all active:scale-95"
          >
            Replay Level
          </button>
          {!isLastLevel && (
            <button
              onClick={onNextLevel}
              className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            >
              Next Level →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
