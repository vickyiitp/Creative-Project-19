export enum BlockType {
  VALID = 'VALID', // Starts with 0000
  INVALID = 'INVALID', // Random junk
  POWERUP_FREEZE = 'POWERUP_FREEZE', // Freezes time
  POWERUP_BONUS = 'POWERUP_BONUS' // Extra points
}

export interface Block {
  id: string;
  x: number;
  y: number;
  hash: string;
  type: BlockType;
  width: number;
  height: number;
  speedMultiplier: number; // For parallax or variety
  alpha: number;
  isMined: boolean;
  column: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 0 to 1
  velocity: number;
}

export interface GameConfig {
  columnCount: number;
  baseSpeed: number;
  spawnRate: number; // ms
  difficultyMultiplier: number;
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}