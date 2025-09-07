import type { Article } from '../database/words';

export type Answer = {
  index: number; // index in original words list
  chosen: Article;
  expected: Article;
  correct: boolean;
};

export type GameState = {
  order: number[]; // order of indices
  pointer: number; // current position in order
  answers: Answer[]; // given answers
  done: boolean; // finished?
};

const STORAGE_KEY = 'lidwoord-spel/state.v1';

/**
 * Load game state from localStorage
 * @returns GameState if found and valid, null otherwise
 */
export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as GameState;
    }
  } catch {
    // Invalid JSON or other error
  }
  return null;
}

/**
 * Save game state to localStorage
 * @param state - The game state to save
 */
export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Create a fresh game state with shuffled order
 * @param datasetLength - The length of the dataset to create order for
 * @returns A new GameState with shuffled order
 */
export function createFreshGameState(datasetLength: number): GameState {
  const order = shuffle(
    Array.from({ length: datasetLength }, (unused, i) => i),
  );
  return { order, pointer: 0, answers: [], done: false };
}

/**
 * Create a fresh game state with only specific indices (e.g., for wrong answers)
 * @param indices - The specific indices to include in the game
 * @returns A new GameState with shuffled order containing only the specified indices
 */
export function createGameStateFromIndices(indices: number[]): GameState {
  const order = shuffle([...indices]);
  return { order, pointer: 0, answers: [], done: false };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param input - Array to shuffle
 * @returns A new shuffled array
 */
function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i]!;
    a[i] = a[j]!;
    a[j] = temp;
  }
  return a;
}
