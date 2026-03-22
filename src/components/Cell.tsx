import React from "react";

interface CellProps {
  lit: boolean;
  onClick: () => void;
  size: number; // grid size, used to scale cell dimensions
  disabled?: boolean;
}

export const Cell: React.FC<CellProps> = ({ lit, onClick, size, disabled }) => {
  // Compute cell size class based on grid size
  const cellSize =
    size <= 3
      ? "w-20 h-20 sm:w-24 sm:h-24"
      : size === 4
      ? "w-16 h-16 sm:w-20 sm:h-20"
      : size === 5
      ? "w-13 h-13 sm:w-16 sm:h-16"
      : size === 6
      ? "w-11 h-11 sm:w-14 sm:h-14"
      : size === 7
      ? "w-9 h-9 sm:w-12 sm:h-12"
      : "w-8 h-8 sm:w-10 sm:h-10"; // 8x8 and above

  const gap =
    size <= 4 ? "m-1" : size <= 6 ? "m-0.5 sm:m-1" : "m-0.5";

  const borderRadius = size <= 5 ? "rounded-lg sm:rounded-xl" : "rounded-md sm:rounded-lg";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={lit}
      className={[
        cellSize,
        gap,
        borderRadius,
        "relative flex items-center justify-center",
        "transition-all duration-150 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2",
        "active:scale-95",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        lit
          ? [
              "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400",
              "shadow-[0_0_16px_4px_rgba(251,191,36,0.7),0_0_6px_2px_rgba(251,191,36,0.5)]",
              "border border-amber-300",
              "hover:brightness-110",
            ].join(" ")
          : [
              "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
              "shadow-inner shadow-black/40",
              "border border-slate-600",
              "hover:brightness-125",
            ].join(" "),
      ].join(" ")}
    >
      {/* Inner glow dot when lit */}
      {lit && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={[
              "rounded-full bg-white/70 blur-sm",
              size <= 5 ? "w-2 h-2 sm:w-3 sm:h-3" : "w-1.5 h-1.5 sm:w-2 sm:h-2",
            ].join(" ")}
          />
        </span>
      )}
    </button>
  );
};
