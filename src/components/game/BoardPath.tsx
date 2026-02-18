import { Team, getAllTeamsCells } from '@/types/game';
import { Flag, Trophy, Star, Users } from 'lucide-react';

interface BoardPathProps {
  boardSize: number;
  teams: Team[];
}

const CELLS_PER_ROW = 6;

export function BoardPath({ boardSize, teams }: BoardPathProps) {
  const allTeamsCells = new Set(getAllTeamsCells(boardSize));
  const numRows = Math.ceil(boardSize / CELLS_PER_ROW);

  const rows: number[][] = [];
  for (let row = 0; row < numRows; row++) {
    const start = row * CELLS_PER_ROW;
    const end = Math.min(start + CELLS_PER_ROW, boardSize);
    const cells: number[] = [];
    for (let i = start; i < end; i++) cells.push(i);
    if (row % 2 === 1) cells.reverse();
    rows.push(cells);
  }

  return (
    <div className="board-gradient rounded-2xl p-4 shadow-2xl border-2 border-game-start/30">
      {/* Board title */}
      <div className="text-center mb-2">
        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Tabuleiro</span>
      </div>
      <div className="space-y-1">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 justify-center items-center">
            {row.map(cellIdx => {
              const isStart = cellIdx === 0;
              const isEnd = cellIdx === boardSize - 1;
              const isSpecial = allTeamsCells.has(cellIdx);
              const teamsHere = teams.filter(t => t.position === cellIdx);

              return (
                <div
                  key={cellIdx}
                  className={`relative w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-xl flex flex-col items-center justify-center
                    transition-all duration-300 border
                    ${isStart
                      ? 'bg-game-start border-game-start/50 shadow-[0_0_12px_2px_hsl(var(--game-cell-start)/0.4)] ring-2 ring-game-start/30'
                      : isEnd
                        ? 'bg-game-end border-game-end/50 shadow-[0_0_12px_2px_hsl(var(--game-cell-end)/0.4)] ring-2 ring-game-end/30'
                        : isSpecial
                          ? 'bg-game-special border-game-special/50 shadow-[0_0_10px_1px_hsl(var(--game-cell-special)/0.3)] ring-1 ring-game-special/20'
                          : 'bg-game-cell border-white/10 shadow-inner'
                    }`}
                  style={{
                    boxShadow: isStart || isEnd || isSpecial
                      ? undefined
                      : 'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(255,255,255,0.1)',
                  }}
                >
                  {isStart ? (
                    <Flag size={16} className="text-white drop-shadow" />
                  ) : isEnd ? (
                    <Trophy size={16} className="text-white drop-shadow" />
                  ) : isSpecial ? (
                    <div className="flex flex-col items-center">
                      <Users size={12} className="text-white/90" />
                      <span className="text-[6px] font-black text-white/80 leading-none mt-0.5">TODOS</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-foreground/40 leading-none">
                      {cellIdx + 1}
                    </span>
                  )}

                  {/* Team pieces */}
                  {teamsHere.length > 0 && (
                    <div className="absolute -top-2 -right-1 flex gap-0.5">
                      {teamsHere.map((team, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border-[2.5px] border-white shadow-lg animate-piece-bounce"
                          style={{
                            backgroundColor: team.color,
                            animationDelay: `${i * 0.1}s`,
                            boxShadow: `0 2px 6px ${team.color}88, 0 0 0 1px rgba(0,0,0,0.1)`,
                          }}
                          title={team.name}
                        >
                          <div className="w-full h-full rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Pad incomplete last row */}
            {row.length < CELLS_PER_ROW &&
              Array.from({ length: CELLS_PER_ROW - row.length }).map((_, i) => (
                <div key={`pad-${i}`} className="w-11 h-11 sm:w-[52px] sm:h-[52px]" />
              ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-game-start" />
          <span className="text-[9px] text-white/60 font-bold">Início</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-game-end" />
          <span className="text-[9px] text-white/60 font-bold">Fim</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-game-special" />
          <span className="text-[9px] text-white/60 font-bold">Todos Jogam</span>
        </div>
      </div>
    </div>
  );
}
