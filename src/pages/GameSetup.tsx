import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team, TEAM_COLORS } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { X, Plus, ArrowLeft, Rocket, Dice5, Users, Settings } from 'lucide-react';

const GameSetup = () => {
  const navigate = useNavigate();
  const { initGame } = useGameState();
  const [numTeams, setNumTeams] = useState(2);
  const [boardSize, setBoardSize] = useState(30);
  const [teams, setTeams] = useState<{ colorIdx: number; players: string[] }[]>([
    { colorIdx: 0, players: [''] },
    { colorIdx: 1, players: [''] },
  ]);

  const handleNumTeamsChange = (n: number) => {
    setNumTeams(n);
    setTeams(prev => {
      const next = [...prev];
      while (next.length < n) {
        const usedColors = next.map(t => t.colorIdx);
        const availableColor = TEAM_COLORS.findIndex((_, i) => !usedColors.includes(i));
        next.push({ colorIdx: availableColor >= 0 ? availableColor : next.length, players: [''] });
      }
      return next.slice(0, n);
    });
  };

  const addPlayer = (teamIdx: number) => {
    setTeams(prev => prev.map((t, i) =>
      i === teamIdx ? { ...t, players: [...t.players, ''] } : t
    ));
  };

  const removePlayer = (teamIdx: number, playerIdx: number) => {
    setTeams(prev => prev.map((t, i) =>
      i === teamIdx && t.players.length > 1
        ? { ...t, players: t.players.filter((_, pi) => pi !== playerIdx) }
        : t
    ));
  };

  const updatePlayer = (teamIdx: number, playerIdx: number, name: string) => {
    setTeams(prev => prev.map((t, i) =>
      i === teamIdx
        ? { ...t, players: t.players.map((p, pi) => pi === playerIdx ? name : p) }
        : t
    ));
  };

  const updateColor = (teamIdx: number, colorIdx: number) => {
    setTeams(prev => prev.map((t, i) =>
      i === teamIdx ? { ...t, colorIdx: colorIdx } : t
    ));
  };

  const canStart = teams.every(t => t.players.every(p => p.trim().length > 0));

  const handleStart = () => {
    const gameTeams: Team[] = teams.map((t, i) => ({
      name: TEAM_COLORS[t.colorIdx].name,
      color: TEAM_COLORS[t.colorIdx].color,
      players: t.players.map(name => ({ name: name.trim() })),
      position: 0,
    }));
    initGame(gameTeams, boardSize);
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-lg mx-auto animate-fade-in">
        <button onClick={() => navigate('/')} className="mb-4 text-sm font-bold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Voltar
        </button>
        <h1 className="text-3xl font-black text-game-title mb-6 flex items-center gap-2">
          <Settings size={28} /> Configurar Jogo
        </h1>

        {/* Board size */}
        <div className="bg-card rounded-2xl p-5 shadow-md border border-border mb-4">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Dice5 size={18} /> Tamanho do Tabuleiro</h2>
          <div className="flex gap-2">
            {[30, 40, 50].map(size => (
              <button
                key={size}
                onClick={() => setBoardSize(size)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all
                  ${boardSize === size
                    ? 'game-gradient text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
              >
                {size} casas
              </button>
            ))}
          </div>
        </div>

        {/* Num teams */}
        <div className="bg-card rounded-2xl p-5 shadow-md border border-border mb-4">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Users size={18} /> Número de Equipes</h2>
          <div className="flex gap-2">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => handleNumTeamsChange(n)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all
                  ${numTeams === n
                    ? 'game-gradient text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
              >
                {n} equipes
              </button>
            ))}
          </div>
        </div>

        {/* Teams */}
        {teams.map((team, teamIdx) => {
          const color = TEAM_COLORS[team.colorIdx];
          return (
            <div key={teamIdx} className="bg-card rounded-2xl p-5 shadow-md border border-border mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow" style={{ backgroundColor: color.color }} />
                <h2 className="font-bold flex-1">Equipe {teamIdx + 1}</h2>
                {/* Color picker */}
                <div className="flex gap-1">
                  {TEAM_COLORS.map((c, ci) => {
                    const usedByOther = teams.some((t, ti) => ti !== teamIdx && t.colorIdx === ci);
                    return (
                      <button
                        key={ci}
                        disabled={usedByOther}
                        onClick={() => updateColor(teamIdx, ci)}
                        className={`w-6 h-6 rounded-full border-2 transition-all
                          ${team.colorIdx === ci ? 'border-foreground scale-110' : 'border-transparent'}
                          ${usedByOther ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c.color }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Players */}
              <div className="space-y-2">
                {team.players.map((player, playerIdx) => (
                  <div key={playerIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={player}
                      onChange={e => updatePlayer(teamIdx, playerIdx, e.target.value)}
                      placeholder={`Jogador ${playerIdx + 1}`}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground
                        font-semibold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {team.players.length > 1 && (
                      <button
                        onClick={() => removePlayer(teamIdx, playerIdx)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-destructive/10
                          text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addPlayer(teamIdx)}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground
                    font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Adicionar Jogador
                </button>
              </div>
            </div>
          );
        })}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full py-4 rounded-2xl font-black text-xl text-primary-foreground shadow-xl
            transition-all active:scale-95 flex items-center justify-center gap-2
            ${canStart ? 'game-gradient hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
        >
          <Rocket size={22} /> Iniciar Jogo!
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
