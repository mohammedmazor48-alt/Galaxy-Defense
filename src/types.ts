export type GameStatus = 'START' | 'PLAYING' | 'WON' | 'LOST';
export type Language = 'en' | 'zh';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface Point {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
}

export interface Missile extends Entity {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export interface Explosion extends Entity {
  radius: number;
  maxRadius: number;
  expanding: boolean;
  life: number; // 0 to 1
}

export interface City extends Entity {
  alive: boolean;
}

export interface Turret extends Entity {
  alive: boolean;
}
