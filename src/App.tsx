import { useEffect, useState } from "react";
import { Celebration } from "./components/Celebration";
import { Grid } from "./components/Grid";
import { IntroPage } from "./components/IntroPage";
import { TimeUp } from "./components/TimeUp";
import { useLightsOut, MAX_LEVEL } from "./hooks/useLightsOut";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { useTimer } from "./hooks/useTimer";

export function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const {
    level,
    size,
    levelConfig,
    grid,
    moves,
    solved,
    bestScores,
    bestTimes,
    handleClick,
    startLevel,
    resetLevel,
    nextLevel,
    recordTime,
  } = useLightsOut(1);
  const { enabled, playing, start, toggleEnabled } = useBackgroundMusic();
  const timer = useTimer(levelConfig.timeLimit);

  // Reset timer when level changes
  useEffect(() => {
    timer.reset(levelConfig.timeLimit);
  }, [level, levelConfig.timeLimit]);

  // Start timer on first move
  useEffect(() => {
    if (moves === 1 && !timer.isRunning && !solved) {
      timer.start();
    }
  }, [moves, timer.isRunning, solved]);

  // Stop timer when solved and record time
  useEffect(() => {
    if (solved && timer.isRunning) {
      timer.stop();
      recordTime(timer.timeSpent);
    }
  }, [solved, timer.isRunning, timer.timeSpent, recordTime]);

  async function handleStart() {
    setHasStarted(true);
    startLevel(1);
    timer.reset(levelConfig.timeLimit);

    if (enabled) {
      await start();
    }
  }

  async function handleMusicToggle() {
    if (enabled && playing) {
      await toggleEnabled();
      return;
    }

    if (!enabled) {
      await toggleEnabled();
      await start();
      return;
    }

    await start();
  }

  function handleResetLevel() {
    timer.reset(levelConfig.timeLimit);
    resetLevel();
  }

  function handleNextLevel() {
    nextLevel();
    // Timer will be reset by the useEffect when level changes
  }

  function handleBackToIntro() {
    timer.reset(levelConfig.timeLimit);
    setHasStarted(false);
  }

  // Calculate timer color based on time remaining
  const getTimerColor = () => {
    if (timer.percentage > 50) return "text-emerald-400";
    if (timer.percentage > 25) return "text-amber-400";
    return "text-red-400";
  };

  const getTimerBg = () => {
    if (timer.percentage > 50) return "from-emerald-500/20 to-teal-500/20";
    if (timer.percentage > 25) return "from-amber-500/20 to-orange-500/20";
    return "from-red-500/20 to-rose-500/20";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_40%),radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.10),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.10),transparent_30%),linear-gradient(180deg,#050816_0%,#0a0f24_50%,#050816_100%)]" />
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[80px] animate-[drift_14s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] animate-[drift_18s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[60px] animate-[drift_20s_ease-in-out_infinite]" />
      </div>

      {/* Music Toggle - Always visible */}
      <button
        onClick={() => void handleMusicToggle()}
        className="absolute top-4 right-4 z-30 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10 flex items-center gap-2"
      >
        <span>{enabled && playing ? "🔊" : "🔇"}</span>
        {enabled && playing ? "Music On" : enabled ? "Play Music" : "Music Off"}
      </button>

      {!hasStarted ? (
        <IntroPage
          onStart={() => void handleStart()}
          onMusicToggle={() => void handleMusicToggle()}
          musicEnabled={enabled}
          musicPlaying={playing}
        />
      ) : (
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          <div className="flex w-full max-w-5xl flex-col items-center gap-8">
            {/* Header */}
            <div className="max-w-2xl space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className={`text-xs font-bold uppercase tracking-wider ${levelConfig.color}`}>
                  {levelConfig.difficulty}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">{levelConfig.title}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                Level {level}
                <span className="text-slate-500 text-2xl sm:text-3xl font-medium ml-2">
                  / {MAX_LEVEL}
                </span>
              </h1>
              <p className="text-sm leading-6 text-slate-400">
                {levelConfig.description}
              </p>
            </div>

            {/* Game Area */}
            <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              {/* Stats Panel */}
              <section className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
                {/* Timer - Prominent with countdown */}
                <div className={`bg-gradient-to-r ${getTimerBg()} p-6 border-b border-white/10 relative overflow-hidden`}>
                  {/* Timer progress bar background */}
                  <div className="absolute inset-0 bg-black/20" />
                  <div 
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ${
                      timer.percentage > 50 ? 'bg-emerald-500/20' : 
                      timer.percentage > 25 ? 'bg-amber-500/20' : 'bg-red-500/30'
                    }`}
                    style={{ width: `${timer.percentage}%` }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Time Left
                      </p>
                      {timer.percentage <= 25 && (
                        <span className="text-xs text-red-400 animate-pulse font-bold">
                          ⚠️ HURRY!
                        </span>
                      )}
                    </div>
                    <p className={`text-5xl font-mono font-black tracking-wider transition-colors duration-300 ${getTimerColor()} ${
                      timer.percentage <= 25 ? 'animate-pulse' : ''
                    }`}>
                      {timer.formatted}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-500">
                        Limit: {Math.floor(levelConfig.timeLimit / 60)}:{(levelConfig.timeLimit % 60).toString().padStart(2, '0')}
                      </p>
                      {bestTimes[level] !== undefined && (
                        <p className="text-xs text-amber-400">
                          Best: {Math.floor(bestTimes[level] / 60).toString().padStart(2, "0")}:
                          {(bestTimes[level] % 60).toString().padStart(2, "0")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Board
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">
                        {size}×{size}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Moves
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">{moves}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      Best Moves
                    </p>
                    <p className="mt-1 text-3xl font-black text-amber-400">
                      {bestScores[level] ?? "—"}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-2">
                      Progress
                    </p>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                        style={{ width: `${(level / MAX_LEVEL) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {level} of {MAX_LEVEL} levels
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleResetLevel}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98]"
                    >
                      🔄 Reset Level
                    </button>
                    <button
                      onClick={handleBackToIntro}
                      className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white active:scale-[0.98]"
                    >
                      ← Back To Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* Grid */}
              <section className="flex flex-col items-center gap-5">
                <Grid
                  grid={grid}
                  size={size}
                  onCellClick={handleClick}
                  solved={solved}
                />

                <p className="max-w-sm text-center text-xs leading-5 text-slate-500 sm:text-sm">
                  Click any light to toggle it and its adjacent neighbors.
                  Turn off all lights to complete the level before time runs out!
                </p>
              </section>
            </div>
          </div>
        </main>
      )}

      {/* Time's Up Modal */}
      {hasStarted && timer.isTimeUp && !solved && (
        <TimeUp
          levelConfig={levelConfig}
          moves={moves}
          onRetry={handleResetLevel}
          onBackToIntro={handleBackToIntro}
        />
      )}

      {/* Celebration Modal */}
      {hasStarted && solved && (
        <Celebration
          level={level}
          moves={moves}
          timeRemaining={timer.timeRemaining}
          timeSpent={timer.timeSpent}
          timeLimit={levelConfig.timeLimit}
          bestScore={bestScores[level]}
          bestTime={bestTimes[level]}
          levelConfig={levelConfig}
          onReplay={handleResetLevel}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  );
}
