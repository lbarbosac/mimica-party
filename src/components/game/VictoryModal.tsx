import { Team } from '@/types/game';
import { Trophy, RotateCcw, Settings } from 'lucide-react';

interface VictoryModalProps {
  team: Team;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function VictoryModal({ team, onPlayAgain, onNewGame }: VictoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
        <Trophy size={64} className="mx-auto mb-4 text-accent" />
        <h2 className="text-3xl font-black mb-2">Parabéns!</h2>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: team.color }}
          />
          <span className="text-2xl font-extrabold" style={{ color: team.color }}>
            {team.name}
          </span>
        </div>
        <p className="text-lg text-muted-foreground mb-8">venceu a partida!</p>
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 rounded-xl font-bold text-lg text-primary-foreground game-gradient
              hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> Jogar Novamente
          </button>
          <button
            onClick={onNewGame}
            className="w-full py-3 rounded-xl font-bold text-base bg-muted text-foreground
              hover:bg-muted/80 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Settings size={18} /> Nova Partida (Novas Equipes)
          </button>
        </div>
      </div>
    </div>
  );
}
