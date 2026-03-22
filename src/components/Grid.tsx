import React from "react";
import { Cell } from "./Cell";
import type { Grid as GridType } from "../hooks/useLightsOut";

interface GridProps {
  grid: GridType;
  size: number;
  onCellClick: (row: number, col: number) => void;
  solved: boolean;
}

export const Grid: React.FC<GridProps> = ({ grid, size, onCellClick, solved }) => {
  return (
    <div
      role="grid"
      aria-label="Lights Out puzzle grid"
      className={[
        "relative p-3 sm:p-4 rounded-2xl",
        "bg-slate-900/80 backdrop-blur",
        "border border-slate-700",
        "shadow-[0_0_40px_0px_rgba(0,0,0,0.6)]",
        solved ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
    >
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="flex">
          {row.map((lit, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              lit={lit}
              size={size}
              onClick={() => onCellClick(rIdx, cIdx)}
              disabled={solved}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
