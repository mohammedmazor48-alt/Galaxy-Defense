export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const EXPLOSION_MAX_RADIUS = 120;
export const EXPLOSION_SPEED = 0.02;

export const PLAYER_MISSILE_SPEED = 0.08;
export const ENEMY_MISSILE_SPEED_MIN = 0.0005;
export const ENEMY_MISSILE_SPEED_MAX = 0.0015;

export const SCORE_PER_KILL = 20;
export const WIN_SCORE = 1000;

export const DIFFICULTY_SETTINGS = {
  EASY: {
    enemySpeedMin: 0.0003,
    enemySpeedMax: 0.001,
    spawnInterval: 3000,
    difficultyMultiplier: 0.99,
  },
  NORMAL: {
    enemySpeedMin: 0.0005,
    enemySpeedMax: 0.0015,
    spawnInterval: 2000,
    difficultyMultiplier: 0.98,
  },
  HARD: {
    enemySpeedMin: 0.0008,
    enemySpeedMax: 0.0025,
    spawnInterval: 1500,
    difficultyMultiplier: 0.97,
  },
};

export const TURRET_CONFIGS = [
  { x: 100 },
  { x: 400 },
  { x: 700 },
];

export const CITY_X_POSITIONS = [200, 275, 350, 450, 525, 600];

export const COLORS = {
  bg: '#0a0a1a',
  city: '#4ade80',
  cityDestroyed: '#1f2937',
  turret: '#60a5fa',
  turretDestroyed: '#1f2937',
  playerMissile: '#ffffff',
  enemyMissile: '#f87171',
  explosion: 'rgba(255, 255, 255, 0.6)',
  target: '#fbbf24',
};

export const TRANSLATIONS = {
  en: {
    title: 'GALAXY DEFENSE',
    start: 'START GAME',
    restart: 'PLAY AGAIN',
    home: 'HOME',
    win: 'MISSION SUCCESS',
    loss: 'DEFENSE FAILED',
    score: 'SCORE',
    ammo: 'AMMO',
    difficulty: 'DIFFICULTY',
    easy: 'EASY',
    normal: 'NORMAL',
    hard: 'HARD',
    easyDesc: 'Slow rockets, fewer attacks.',
    normalDesc: 'Balanced speed and frequency.',
    hardDesc: 'Fast rockets, relentless waves.',
    objective: 'Protect cities and turrets from falling rockets.',
    controls: 'Click to fire interceptors. Aim ahead of targets!',
    winMsg: 'You reached 1000 points and saved the galaxy!',
    lossMsg: 'All turrets destroyed. The cities have fallen.',
  },
  zh: {
    title: '星系防御',
    start: '开始游戏',
    restart: '再玩一次',
    home: '返回主页',
    win: '任务成功',
    loss: '防御失败',
    score: '得分',
    ammo: '弹药',
    difficulty: '难度选择',
    easy: '简单',
    normal: '普通',
    hard: '困难',
    easyDesc: '火箭速度慢，攻击频率低。',
    normalDesc: '速度与频率平衡。',
    hardDesc: '火箭极快，攻势连绵不断。',
    objective: '保护城市和炮台免受火箭袭击。',
    controls: '点击发射拦截导弹。请预判敌方轨迹！',
    winMsg: '你达到了1000分，拯救了星系！',
    lossMsg: '所有炮台已被摧毁。城市沦陷了。',
  }
};
