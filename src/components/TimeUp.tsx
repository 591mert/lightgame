import { LevelConfig } from "../hooks/useLightsOut";

interface TimeUpProps {
  levelConfig: LevelConfig;
  moves: number;
  onRetry: () => void;
  onBackToIntro: () => void;
}

export function TimeUp({ levelConfig, moves, onRetry, onBackToIntro }: TimeUpProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-red-950/30 to-gray-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl shadow-red-500/20">
        {/* Time's Up Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border-2 border-red-500/50 animate-pulse">
            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-2">
          TIME'S UP!
        </h2>
        
        <p className="text-gray-400 mb-6">
          The clock ran out before you could solve the puzzle
        </p>

        {/* Stats */}
        <div className="bg-black/40 rounded-xl p-4 mb-6 border border-red-500/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Level</div>
              <div className="text-xl font-bold text-white">{levelConfig.level}</div>
              <div className={`text-xs ${levelConfig.color}`}>{levelConfig.difficulty}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Moves Made</div>
              <div className="text-xl font-bold text-white">{moves}</div>
              <div className="text-xs text-gray-500">{levelConfig.size}×{levelConfig.size} grid</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-500/10 rounded-xl p-4 mb-6 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-200/80 text-left">
              <strong className="text-amber-300">Tip:</strong> Try to work from one corner systematically. Each click affects adjacent cells, so plan your moves carefully!
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          
          <button
            onClick={onBackToIntro}
            className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
