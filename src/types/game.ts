export type CategoryLetter = 'A' | 'D' | 'L' | 'M' | 'O' | 'P';

export interface Player {
  name: string;
}

export interface Team {
  name: string;
  color: string;
  players: Player[];
  position: number;
}

export interface Card {
  A: string;
  D: string;
  L: string;
  M: string;
  O: string;
  P: string;
}

export type TurnPhase = 'waiting' | 'showing-card' | 'playing' | 'result';

export interface GameState {
  teams: Team[];
  boardSize: number;
  currentTeamIndex: number;
  roundNumber: number;
  turnPhase: TurnPhase;
  currentCardIndex: number;
  numberDie: number | null;
  letterDie: CategoryLetter | null;
  numberDieRolled: boolean;
  letterDieRolled: boolean;
  timerEndTime: number | null;
  winner: number | null;
  timedOut: boolean;
}

export const TEAM_COLORS: { name: string; color: string }[] = [
  { name: 'Vermelho', color: '#EF4444' },
  { name: 'Azul', color: '#3B82F6' },
  { name: 'Verde', color: '#22C55E' },
  { name: 'Roxo', color: '#A855F7' },
  { name: 'Laranja', color: '#F97316' },
  { name: 'Rosa', color: '#EC4899' },
  { name: 'Amarelo', color: '#EAB308' },
  { name: 'Ciano', color: '#06B6D4' },
];

export const CATEGORY_INFO: Record<CategoryLetter, { name: string; description: string }> = {
  A: { name: 'Ação', description: 'Verbos ou atividades (correr, dançar...)' },
  D: { name: 'Difícil', description: 'Termos mais desafiadores ou pouco óbvios' },
  L: { name: 'Lazer', description: 'Hobbies e tempo livre' },
  M: { name: 'Mix', description: 'Assuntos variados' },
  O: { name: 'Objeto', description: 'Coisas físicas ou inanimadas' },
  P: { name: 'Pessoa/Lugar/Animal', description: 'Pessoas, lugares ou animais' },
};

export const CATEGORIES: CategoryLetter[] = ['A', 'D', 'L', 'M', 'O', 'P'];

export function getAllTeamsCells(boardSize: number): number[] {
  const cells: number[] = [];
  for (let i = 5; i < boardSize; i += 5) {
    cells.push(i);
  }
  return cells;
}

export function isAllTeamsCell(position: number, boardSize: number): boolean {
  return getAllTeamsCells(boardSize).includes(position);
}
