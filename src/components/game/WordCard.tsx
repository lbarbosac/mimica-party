import { Card, CategoryLetter, CATEGORY_INFO } from '@/types/game';
import { Zap, Brain, Gamepad2, Shuffle, Package, PawPrint } from 'lucide-react';

const CATEGORY_ICONS: Record<CategoryLetter, React.ReactNode> = {
  A: <Zap size={18} />,
  D: <Brain size={18} />,
  L: <Gamepad2 size={18} />,
  M: <Shuffle size={18} />,
  O: <Package size={18} />,
  P: <PawPrint size={18} />,
};

interface WordCardProps {
  card: Card;
  highlightCategory?: CategoryLetter | null;
}

export function WordCard({ card, highlightCategory }: WordCardProps) {
  const categories: CategoryLetter[] = ['A', 'D', 'L', 'M', 'O', 'P'];

  return (
    <div className="bg-card rounded-2xl shadow-xl border-2 border-border overflow-hidden w-full max-w-sm">
      <div className="game-gradient px-4 py-2 flex items-center justify-center gap-2">
        <h3 className="text-center text-primary-foreground font-extrabold text-lg">Carta</h3>
      </div>
      <div className="p-3 space-y-1.5">
        {categories.map(cat => {
          const info = CATEGORY_INFO[cat];
          const isHighlighted = highlightCategory === cat;
          return (
            <div
              key={cat}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${isHighlighted
                  ? 'bg-primary/15 ring-2 ring-primary scale-[1.02]'
                  : highlightCategory ? 'opacity-40' : 'bg-muted/50'
                }`}
            >
              <span className={`${isHighlighted ? 'text-primary' : 'text-muted-foreground'}`}>{CATEGORY_ICONS[cat]}</span>
              <span className="font-black text-sm text-primary w-6">{cat}</span>
              <span className={`font-bold text-base flex-1 ${isHighlighted ? 'text-primary' : 'text-foreground'}`}>
                {card[cat]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
