import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BoardPath } from '@/components/game/BoardPath';
import { TurnPanel } from '@/components/game/TurnPanel';
import { VictoryModal } from '@/components/game/VictoryModal';
import { Gamepad2, ChevronDown, ChevronUp, Map } from 'lucide-react';

const GamePlay = () => {
  const navigate = useNavigate();
  const [boardVisible, setBoardVisible] = useState(true);
  const {
    state,
    timeLeft,
    currentCard,
    startTurn,
    proceedToPlay,
    changeCard,
    rollNumberDie,
    rollLetterDie,
    guessedCorrectly,
    nextTurn,
    resetGame,
    getCurrentPlayer,
  } = useGameState();

  if (!state) {
    navigate('/setup');
    return null;
  }

  const currentPlayer = getCurrentPlayer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-black text-game-title flex items-center gap-1.5">
          <Gamepad2 size={20} /> Mímica Party
        </h1>
        <div className="flex items-center gap-3">
          {state.teams.map((team, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="text-xs font-bold">{team.position}/{state.boardSize - 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Board toggle + Board */}
      <div className="px-3 pt-2 shrink-0">
        <button
          onClick={() => setBoardVisible(v => !v)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-muted/60 text-muted-foreground text-xs font-bold
            hover:bg-muted active:scale-[0.98] transition-all mb-1"
        >
          <Map size={14} />
          {boardVisible ? 'Ocultar Tabuleiro' : 'Mostrar Tabuleiro'}
          {boardVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {boardVisible && (
          <div className="animate-fade-in">
            <BoardPath boardSize={state.boardSize} teams={state.teams} />
          </div>
        )}
      </div>

      {/* Turn Panel */}
      <div className="flex-1 flex flex-col justify-center">
        <TurnPanel
          state={state}
          currentCard={currentCard}
          timeLeft={timeLeft}
          currentPlayerName={currentPlayer?.name ?? ''}
          onStartTurn={startTurn}
          onProceedToPlay={proceedToPlay}
          onChangeCard={changeCard}
          onRollNumber={rollNumberDie}
          onRollLetter={rollLetterDie}
          onGuessedCorrectly={guessedCorrectly}
          onNextTurn={nextTurn}
        />
      </div>

      {/* Victory Modal */}
      {state.winner !== null && (
        <VictoryModal
          team={state.teams[state.winner]}
          onPlayAgain={() => resetGame(true)}
          onNewGame={() => {
            resetGame(false);
            navigate('/setup');
          }}
        />
      )}
    </div>
  );
};

export default GamePlay;
