/**
 * Core game state types and persistence logic
 */

export type Phase = {
  description: string;
  requirements: Requirement[];
};

export type Requirement = {
  type: 'set' | 'run' | 'color';
  count?: number;
  size?: number;
};

export type Player = {
  id: string;
  name: string;
  currentPhaseIndex: number; // 0-9 representing phases 1-10
  totalScore: number;
};

export type HandResult = {
  handNumber: number;
  playerScores: Record<string, number>; // playerId -> penalty points for this hand
  completedPhases: Record<string, number>; // playerId -> phase index completed (or -1 if none)
};

export type GameState = {
  players: Player[];
  currentHand: number;
  handResults: HandResult[];
  currentPhaseIndex: number; // which phase are we currently in (0-9)
  phases: Phase[]; // selected phases for this game
  phaseSetType: 'classic' | 'random'; // which type of phase set was selected
};

const STORAGE_KEY = 'phase10-web.state';
const STORAGE_VERSION = 2;

interface StorageData {
  version: number;
  gameState: GameState;
}

export function saveGameState(gameState: GameState): void {
  const data: StorageData = {
    version: STORAGE_VERSION,
    gameState,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadGameState(): GameState | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const data: StorageData = JSON.parse(stored);
    // Version check for future schema migrations
    if (data.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch: ${data.version} !== ${STORAGE_VERSION}`);
      return null;
    }
    return data.gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
