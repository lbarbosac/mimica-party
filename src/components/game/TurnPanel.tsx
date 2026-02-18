import React from 'react';
import { GameState, CATEGORY_INFO, isAllTeamsCell } from '@/types/game';
import { Card } from '@/types/game';
import { NumberDie, LetterDie } from './Dice';
import { Hourglass } from './Hourglass';
import { WordCard } from './WordCard';
import { Play, Lock, RefreshCw, Check, ArrowRight, Star, Clock, Target, MousePointerClick, Eye } from 'lucide-react';

interface TurnPanelProps {
  state: GameState;
  currentCard: Card | null;
  timeLeft: number;
  currentPlayerName: string;
  onStartTurn: () => void;
  onProceedToPlay: () => void;
  onChangeCard: () => void;
  onRollNumber: () => void;
  onRollLetter: () => void;
  onGuessedCorrectly: (teamIdx?: number) => void;
  onNextTurn: () => void;
}

export function TurnPanel({
  state,
  currentCard,
  timeLeft,
  currentPlayerName,
  onStartTurn,
  onProceedToPlay,
  onChangeCard,
  onRollNumber,
  onRollLetter,
  onGuessedCorrectly,
  onNextTurn,
}: TurnPanelProps) {
  const [showLastCard, setShowLastCard] = React.useState(false);
  const currentTeam = state.teams[state.currentTeamIndex];
  const isAllTeams = isAllTeamsCell(currentTeam.position, state.boardSize);
  const bothDiceRolled = state.numberDieRolled && state.letterDieRolled;
  const didNotGuess = state.turnPhase === 'result' && state.timedOut && state.winner === null;

  // Reset showLastCard when phase changes
  React.useEffect(() => {
    if (state.turnPhase !== 'result') setShowLastCard(false);
  }, [state.turnPhase]);

  // WAITING PHASE
  if (state.turnPhase === 'waiting') {
    return (
      <div className="flex flex-col items-center gap-6 p-6 animate-fade-in">
        <div className="text-center">
          <p className="text-lg text-muted-foreground font-semibold">Vez de</p>
          <p className="text-2xl font-black" style={{ color: currentTeam.color }}>
            {currentPlayerName}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTeam.color }} />
            <span className="font-bold text-muted-foreground">{currentTeam.name}</span>
          </div>
        </div>
        {isAllTeams && (
          <div className="bg-game-special/20 border-2 border-game-special rounded-xl px-4 py-2 text-center flex items-center gap-2">
            <Star size={16} className="text-game-special" />
            <span className="font-bold text-sm">TODAS AS EQUIPES jogam esta rodada!</span>
          </div>
        )}
        <button
          onClick={onStartTurn}
          className="w-full max-w-xs py-4 rounded-2xl font-black text-xl text-primary-foreground game-gradient
            hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
        >
          <Play size={22} />
          Começar Rodada
        </button>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Passe o celular para <strong>{currentPlayerName}</strong>. Apenas ele(a) deve ver a carta!
        </p>
      </div>
    );
  }

  // SHOWING CARD PHASE
  if (state.turnPhase === 'showing-card') {
    return (
      <div className="flex flex-col items-center gap-4 p-4 animate-fade-in">
        <p className="text-sm font-bold text-muted-foreground flex items-center gap-1">
          <Lock size={14} /> Só você deve ver esta carta!
        </p>
        {currentCard && <WordCard card={currentCard} />}
        <button
          onClick={onProceedToPlay}
          className="w-full max-w-sm py-3 rounded-xl font-bold text-primary-foreground game-gradient
            hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1"
        >
          <Check size={16} /> Pronto
        </button>
      </div>
    );
  }

  // PLAYING PHASE
  if (state.turnPhase === 'playing') {
    return (
      <div className="flex flex-col items-center gap-4 p-4 animate-fade-in">
        {/* Dice row */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-bold text-muted-foreground mb-1">Casas</p>
            <NumberDie value={state.numberDie} rolled={state.numberDieRolled} onRoll={onRollNumber} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-muted-foreground mb-1">Categoria</p>
            <LetterDie value={state.letterDie} rolled={state.letterDieRolled} onRoll={onRollLetter} />
          </div>
        </div>

        {!bothDiceRolled && (
          <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
            <MousePointerClick size={16} /> Clique nos dados para rolar!
          </p>
        )}

        {/* Card + Category */}
        {currentCard && (
          <WordCard card={currentCard} highlightCategory={state.letterDie} />
        )}

        {/* Change card button - only after both dice rolled */}
        {bothDiceRolled && (
          <button
            onClick={onChangeCard}
            className="py-2 px-4 rounded-lg text-sm font-bold bg-muted text-foreground
              hover:bg-muted/80 active:scale-95 transition-all flex items-center gap-1"
          >
            <RefreshCw size={14} /> Trocar Carta
          </button>
        )}

        {/* Timer + word info */}
        {bothDiceRolled && (
          <div className="flex items-end gap-6 w-full justify-center">
            <div className="text-center">
              {state.letterDie && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground font-bold">Diga em voz alta:</p>
                  <p className="text-lg font-black text-primary">
                    {CATEGORY_INFO[state.letterDie].name}
                  </p>
                </div>
              )}
              {state.numberDie && (
                <p className="text-xs text-muted-foreground">
                  Vale <strong className="text-primary">{state.numberDie}</strong> casa{state.numberDie > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <Hourglass timeLeft={timeLeft} />
          </div>
        )}

        {/* ACERTOU buttons */}
        {bothDiceRolled && (
          <div className="w-full max-w-sm space-y-2">
            {isAllTeams ? (
              <>
                <p className="text-center text-sm font-bold text-muted-foreground flex items-center justify-center gap-1">
                  <Star size={14} /> Qual equipe acertou?
                </p>
                {state.teams.map((team, idx) => (
                  <button
                    key={idx}
                    onClick={() => onGuessedCorrectly(idx)}
                    className="w-full py-3 rounded-xl font-bold text-white
                      hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                    style={{ backgroundColor: team.color }}
                  >
                    <Check size={18} /> {team.name} acertou!
                  </button>
                ))}
              </>
            ) : (
              <button
                onClick={() => onGuessedCorrectly()}
                className="w-full py-4 rounded-2xl font-black text-xl bg-secondary text-secondary-foreground
                  hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Check size={22} /> ACERTOU!
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

// RESULT PHASE
  if (state.turnPhase === 'result') {
    return (
      <div className="flex flex-col items-center gap-6 p-6 animate-fade-in">
        {didNotGuess ? (
          <>
            <Clock size={48} className="text-destructive" />
            <h3 className="text-2xl font-black text-destructive">Tempo esgotado!</h3>
            <p className="text-muted-foreground font-semibold">Ninguém avança nesta rodada.</p>
          </>
        ) : state.winner !== null ? null : (
          <>
            <Target size={48} className="text-secondary" />
            <h3 className="text-2xl font-black text-secondary">Acertou!</h3>
            <p className="text-muted-foreground font-semibold">
              Avançou <strong className="text-primary">{state.numberDie}</strong> casa{state.numberDie! > 1 ? 's' : ''}!
            </p>
          </>
        )}
        {state.winner === null && (
          <>
            <button
              onClick={onNextTurn}
              className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg text-primary-foreground game-gradient
                hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <ArrowRight size={20} /> Próxima Rodada
            </button>
            <button
              onClick={() => setShowLastCard(v => !v)}
              className="w-full max-w-xs py-3 rounded-xl font-bold text-sm bg-muted text-foreground
                hover:bg-muted/80 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Eye size={16} /> {showLastCard ? 'Ocultar Carta' : 'Última Carta'}
            </button>
            {showLastCard && currentCard && (
              <div className="animate-fade-in w-full max-w-sm">
                <WordCard card={currentCard} highlightCategory={state.letterDie} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}
