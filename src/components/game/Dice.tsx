import { useState } from 'react';
import { CategoryLetter, CATEGORY_INFO } from '@/types/game';

interface NumberDieProps {
  value: number | null;
  rolled: boolean;
  onRoll: () => void;
}

export function NumberDie({ value, rolled, onRoll }: NumberDieProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (rolled || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onRoll();
      setAnimating(false);
    }, 600);
  };

  const dots: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  };

  return (
    <button
      onClick={handleClick}
      disabled={rolled}
      className={`w-20 h-20 rounded-xl bg-card border-2 border-border shadow-lg flex items-center justify-center
        ${!rolled ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : 'opacity-90'}
        ${animating ? 'animate-dice-roll' : ''}`}
    >
      {rolled && value ? (
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-12 h-12">
          {[0, 1, 2].map(r =>
            [0, 1, 2].map(c => (
              <div key={`${r}-${c}`} className="flex items-center justify-center">
                {dots[value]?.some(([dr, dc]) => dr === r && dc === c) && (
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <span className="text-2xl font-bold text-muted-foreground">?</span>
      )}
    </button>
  );
}

interface LetterDieProps {
  value: CategoryLetter | null;
  rolled: boolean;
  onRoll: () => void;
}

export function LetterDie({ value, rolled, onRoll }: LetterDieProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (rolled || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onRoll();
      setAnimating(false);
    }, 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={rolled}
      className={`w-20 h-20 rounded-xl bg-card border-2 border-border shadow-lg flex flex-col items-center justify-center
        ${!rolled ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : 'opacity-90'}
        ${animating ? 'animate-dice-roll' : ''}`}
    >
      {rolled && value ? (
        <>
          <span className="text-2xl font-black text-primary">{value}</span>
          <span className="text-[8px] leading-tight font-semibold text-muted-foreground text-center px-1 truncate max-w-full">{CATEGORY_INFO[value].name}</span>
        </>
      ) : (
        <span className="text-2xl font-bold text-muted-foreground">?</span>
      )}
    </button>
  );
}
