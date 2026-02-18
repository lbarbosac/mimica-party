import { useState, useEffect, useCallback } from 'react';
import { GameState, Team, CategoryLetter, CATEGORIES } from '@/types/game';
import { CARDS } from '@/data/cards';
import { playAlertSound } from '@/utils/audio';

const STORAGE_KEY = 'mimica-game-state';
const TURN_DURATION = 60;

function loadState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useGameState() {
  const [state, setState] = useState<GameState | null>(loadState);
  const [now, setNow] = useState(Date.now());

  // Save on change
  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  // Timer tick
  useEffect(() => {
    if (!state?.timerEndTime) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [state?.timerEndTime]);

  const timeLeft = state?.timerEndTime
    ? Math.max(0, Math.ceil((state.timerEndTime - now) / 1000))
    : TURN_DURATION;

  // Auto time-up: if timer runs out during playing, it's an automatic miss
  useEffect(() => {
    if (state?.timerEndTime && timeLeft === 0 && state.turnPhase === 'playing') {
      playAlertSound();
      setState(prev => prev ? {
        ...prev,
        turnPhase: 'result',
        timerEndTime: null,
        timedOut: true,
      } : null);
    }
  }, [timeLeft, state?.timerEndTime, state?.turnPhase]);

  const initGame = useCallback((teams: Team[], boardSize: number) => {
    const newState: GameState = {
      teams,
      boardSize,
      currentTeamIndex: 0,
      roundNumber: 0,
      turnPhase: 'waiting',
      currentCardIndex: Math.floor(Math.random() * CARDS.length),
      numberDie: null,
      letterDie: null,
      numberDieRolled: false,
      letterDieRolled: false,
      timerEndTime: null,
      winner: null,
      timedOut: false,
    };
    saveState(newState);
    setState(newState);
  }, []);

  const startTurn = useCallback(() => {
    setState(prev => prev ? {
      ...prev,
      turnPhase: 'showing-card',
      currentCardIndex: Math.floor(Math.random() * CARDS.length),
      numberDie: null,
      letterDie: null,
      numberDieRolled: false,
      letterDieRolled: false,
      timerEndTime: null,
      timedOut: false,
    } : null);
  }, []);

  const proceedToPlay = useCallback(() => {
    setState(prev => prev ? { ...prev, turnPhase: 'playing' } : null);
  }, []);

  const changeCard = useCallback(() => {
    setState(prev => {
      if (!prev) return null;
      let newIdx = Math.floor(Math.random() * CARDS.length);
      while (newIdx === prev.currentCardIndex && CARDS.length > 1) {
        newIdx = Math.floor(Math.random() * CARDS.length);
      }
      return { ...prev, currentCardIndex: newIdx };
    });
  }, []);

  const rollNumberDie = useCallback(() => {
    setState(prev => {
      if (!prev || prev.numberDieRolled) return prev;
      const value = Math.floor(Math.random() * 6) + 1;
      const bothRolled = prev.letterDieRolled;
      return {
        ...prev,
        numberDie: value,
        numberDieRolled: true,
        timerEndTime: bothRolled ? Date.now() + TURN_DURATION * 1000 : prev.timerEndTime,
      };
    });
    setNow(Date.now());
  }, []);

  const rollLetterDie = useCallback(() => {
    setState(prev => {
      if (!prev || prev.letterDieRolled) return prev;
      const letter = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const bothRolled = prev.numberDieRolled;
      return {
        ...prev,
        letterDie: letter,
        letterDieRolled: true,
        timerEndTime: bothRolled ? Date.now() + TURN_DURATION * 1000 : prev.timerEndTime,
      };
    });
    setNow(Date.now());
  }, []);

  const guessedCorrectly = useCallback((winningTeamIndex?: number) => {
    setState(prev => {
      // Only allow if still playing and dice was rolled
      if (!prev || prev.numberDie === null || prev.turnPhase !== 'playing') return prev;
      const teamIdx = winningTeamIndex ?? prev.currentTeamIndex;
      const newTeams = prev.teams.map((t, i) => {
        if (i !== teamIdx) return t;
        const newPos = Math.min(t.position + prev.numberDie!, prev.boardSize - 1);
        return { ...t, position: newPos };
      });
      const winner = newTeams[teamIdx].position >= prev.boardSize - 1 ? teamIdx : null;
      return {
        ...prev,
        teams: newTeams,
        timerEndTime: null,
        turnPhase: 'result',
        winner,
        timedOut: false,
      };
    });
  }, []);

  const nextTurn = useCallback(() => {
    setState(prev => {
      if (!prev) return null;
      let nextTeam = (prev.currentTeamIndex + 1) % prev.teams.length;
      let nextRound = prev.roundNumber;
      if (nextTeam === 0) nextRound++;
      return {
        ...prev,
        currentTeamIndex: nextTeam,
        roundNumber: nextRound,
        turnPhase: 'waiting',
        currentCardIndex: Math.floor(Math.random() * CARDS.length),
        numberDie: null,
        letterDie: null,
        numberDieRolled: false,
        letterDieRolled: false,
        timerEndTime: null,
        timedOut: false,
      };
    });
  }, []);

  const resetGame = useCallback((keepTeams: boolean) => {
    if (keepTeams && state) {
      const resetTeams = state.teams.map(t => ({ ...t, position: 0 }));
      initGame(resetTeams, state.boardSize);
    } else {
      clearGameState();
      setState(null);
    }
  }, [state, initGame]);

  const getCurrentPlayer = useCallback(() => {
    if (!state) return null;
    const team = state.teams[state.currentTeamIndex];
    const playerIdx = state.roundNumber % team.players.length;
    return team.players[playerIdx];
  }, [state]);

  const currentCard = state ? CARDS[state.currentCardIndex] : null;

  return {
    state,
    timeLeft,
    currentCard,
    initGame,
    startTurn,
    proceedToPlay,
    changeCard,
    rollNumberDie,
    rollLetterDie,
    guessedCorrectly,
    nextTurn,
    resetGame,
    getCurrentPlayer,
  };
}
