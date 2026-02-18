import { useNavigate } from 'react-router-dom';
import { Gamepad2, BookOpen, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const hasSavedGame = !!localStorage.getItem('mimica-game-state');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center animate-fade-in max-w-md w-full">
        <Gamepad2 size={64} className="mx-auto mb-4 text-primary" />
        <h1 className="text-5xl font-black text-game-title mb-2">Mímica Party</h1>
        <p className="text-lg text-muted-foreground font-semibold mb-10">
          O jogo de mímica mais divertido para jogar com amigos e família!
        </p>

        <div className="space-y-4">
          {hasSavedGame && (
            <button
              onClick={() => navigate('/play')}
              className="w-full py-4 rounded-2xl font-black text-xl text-primary-foreground game-gradient
                hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Play size={22} /> Continuar Jogo
            </button>
          )}
          <button
            onClick={() => navigate('/setup')}
            className="w-full py-4 rounded-2xl font-black text-xl text-primary-foreground
              bg-secondary hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <Gamepad2 size={22} /> {hasSavedGame ? 'Novo Jogo' : 'Jogar'}
          </button>
          <button
            onClick={() => navigate('/how-to-play')}
            className="w-full py-3 rounded-2xl font-bold text-base bg-muted text-foreground
              hover:bg-muted/80 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={18} /> Como Jogar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
