import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  TURRET_CONFIGS, 
  CITY_X_POSITIONS, 
  COLORS, 
  EXPLOSION_MAX_RADIUS, 
  EXPLOSION_SPEED, 
  PLAYER_MISSILE_SPEED, 
  SCORE_PER_KILL,
  WIN_SCORE,
  DIFFICULTY_SETTINGS
} from '../constants';
import { City, Turret, Missile, Explosion, Point, GameStatus, Difficulty } from '../types';

interface GameCanvasProps {
  status: GameStatus;
  difficulty: Difficulty;
  onScoreChange: (score: number) => void;
  onStatusChange: (status: GameStatus) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ status, difficulty, onScoreChange, onStatusChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  
  // Game State
  const [score, setScore] = useState(0);
  const citiesRef = useRef<City[]>([]);
  const turretsRef = useRef<Turret[]>([]);
  const playerMissilesRef = useRef<Missile[]>([]);
  const enemyMissilesRef = useRef<Missile[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const lastEnemySpawnTime = useRef<number>(0);
  const spawnInterval = useRef<number>(2000);

  const initGame = useCallback(() => {
    setScore(0);
    onScoreChange(0);
    
    citiesRef.current = CITY_X_POSITIONS.map((x, i) => ({
      id: `city-${i}`,
      x,
      y: GAME_HEIGHT - 20,
      alive: true
    }));

    turretsRef.current = TURRET_CONFIGS.map((config, i) => ({
      id: `turret-${i}`,
      x: config.x,
      y: GAME_HEIGHT - 30,
      alive: true
    }));

    playerMissilesRef.current = [];
    enemyMissilesRef.current = [];
    explosionsRef.current = [];
    lastEnemySpawnTime.current = performance.now();
    spawnInterval.current = DIFFICULTY_SETTINGS[difficulty].spawnInterval;
  }, [onScoreChange, difficulty]);

  useEffect(() => {
    if (status === 'PLAYING') {
      initGame();
    }
  }, [status, initGame]);

  const fireMissile = (target: Point) => {
    if (status !== 'PLAYING') return;

    // Find closest turret with ammo
    let bestTurret: Turret | null = null;
    let minDist = Infinity;

    turretsRef.current.forEach(t => {
      if (t.alive) {
        const dist = Math.abs(t.x - target.x);
        if (dist < minDist) {
          minDist = dist;
          bestTurret = t;
        }
      }
    });

    if (bestTurret) {
      playerMissilesRef.current.push({
        id: Math.random().toString(),
        startX: bestTurret.x,
        startY: bestTurret.y,
        x: bestTurret.x,
        y: bestTurret.y,
        targetX: target.x,
        targetY: target.y,
        progress: 0,
        speed: PLAYER_MISSILE_SPEED,
        color: COLORS.playerMissile
      });
    }
  };

  const spawnEnemy = (time: number) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (time - lastEnemySpawnTime.current > spawnInterval.current) {
      const startX = Math.random() * GAME_WIDTH;
      const targets = [...citiesRef.current.filter(c => c.alive), ...turretsRef.current.filter(t => t.alive)];
      
      if (targets.length === 0) return;
      
      const target = targets[Math.floor(Math.random() * targets.length)];
      
      enemyMissilesRef.current.push({
        id: Math.random().toString(),
        startX,
        startY: 0,
        x: startX,
        y: 0,
        targetX: target.x,
        targetY: target.y,
        progress: 0,
        speed: settings.enemySpeedMin + Math.random() * (settings.enemySpeedMax - settings.enemySpeedMin),
        color: COLORS.enemyMissile
      });

      lastEnemySpawnTime.current = time;
      // Gradually increase difficulty
      spawnInterval.current = Math.max(500, spawnInterval.current * settings.difficultyMultiplier);
    }
  };

  const update = (time: number) => {
    if (status !== 'PLAYING') return;

    spawnEnemy(time);

    // Update Player Missiles
    playerMissilesRef.current = playerMissilesRef.current.filter(m => {
      m.progress += m.speed;
      m.x = m.startX + (m.targetX - m.startX) * m.progress;
      m.y = m.startY + (m.targetY - m.startY) * m.progress;

      if (m.progress >= 1) {
        explosionsRef.current.push({
          id: Math.random().toString(),
          x: m.targetX,
          y: m.targetY,
          radius: 0,
          maxRadius: EXPLOSION_MAX_RADIUS,
          expanding: true,
          life: 1
        });
        return false;
      }
      return true;
    });

    // Update Enemy Missiles
    enemyMissilesRef.current = enemyMissilesRef.current.filter(m => {
      m.progress += m.speed;
      m.x = m.startX + (m.targetX - m.startX) * m.progress;
      m.y = m.startY + (m.targetY - m.startY) * m.progress;

      // Check if hit by explosion
      const hitByExplosion = explosionsRef.current.some(e => {
        const dist = Math.sqrt((m.x - e.x) ** 2 + (m.y - e.y) ** 2);
        return dist < e.radius;
      });

      if (hitByExplosion) {
        setScore(prev => {
          const newScore = prev + SCORE_PER_KILL;
          onScoreChange(newScore);
          if (newScore >= WIN_SCORE) {
            onStatusChange('WON');
          }
          return newScore;
        });
        explosionsRef.current.push({
          id: Math.random().toString(),
          x: m.x,
          y: m.y,
          radius: 0,
          maxRadius: EXPLOSION_MAX_RADIUS * 0.5,
          expanding: true,
          life: 1
        });
        return false;
      }

      if (m.progress >= 1) {
        // Impact!
        explosionsRef.current.push({
          id: Math.random().toString(),
          x: m.targetX,
          y: m.targetY,
          radius: 0,
          maxRadius: EXPLOSION_MAX_RADIUS,
          expanding: true,
          life: 1
        });

        // Destroy target
        citiesRef.current.forEach(c => {
          if (Math.abs(c.x - m.targetX) < 5 && Math.abs(c.y - m.targetY) < 5) c.alive = false;
        });
        turretsRef.current.forEach(t => {
          if (Math.abs(t.x - m.targetX) < 5 && Math.abs(t.y - m.targetY) < 5) t.alive = false;
        });

        // Check loss condition
        if (turretsRef.current.every(t => !t.alive)) {
          onStatusChange('LOST');
        }

        return false;
      }
      return true;
    });

    // Update Explosions
    explosionsRef.current = explosionsRef.current.filter(e => {
      if (e.expanding) {
        e.radius += EXPLOSION_SPEED * e.maxRadius;
        if (e.radius >= e.maxRadius) {
          e.expanding = false;
        }
      } else {
        e.radius -= EXPLOSION_SPEED * e.maxRadius * 0.5;
      }
      return e.radius > 0;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Ground
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, GAME_HEIGHT - 10, GAME_WIDTH, 10);

    // Draw Cities
    citiesRef.current.forEach(c => {
      ctx.fillStyle = c.alive ? COLORS.city : COLORS.cityDestroyed;
      ctx.fillRect(c.x - 15, c.y - 10, 30, 10);
      if (c.alive) {
        ctx.fillRect(c.x - 10, c.y - 15, 5, 5);
        ctx.fillRect(c.x + 5, c.y - 18, 5, 8);
      }
    });

    // Draw Turrets
    turretsRef.current.forEach(t => {
      ctx.fillStyle = t.alive ? COLORS.turret : COLORS.turretDestroyed;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 20, Math.PI, 0);
      ctx.fill();
    });

    // Draw Player Missiles
    playerMissilesRef.current.forEach(m => {
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m.startX, m.startY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      // Draw target X
      ctx.strokeStyle = COLORS.target;
      ctx.beginPath();
      ctx.moveTo(m.targetX - 3, m.targetY - 3);
      ctx.lineTo(m.targetX + 3, m.targetY + 3);
      ctx.moveTo(m.targetX + 3, m.targetY - 3);
      ctx.lineTo(m.targetX - 3, m.targetY + 3);
      ctx.stroke();
    });

    // Draw Enemy Missiles
    enemyMissilesRef.current.forEach(m => {
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m.startX, m.startY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
    });

    // Draw Explosions
    explosionsRef.current.forEach(e => {
      const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.2, 'rgba(255, 200, 50, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();

      // Add some "sparkles" for the big firework feel
      if (e.radius > EXPLOSION_MAX_RADIUS * 0.5) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * e.radius;
          ctx.fillRect(e.x + Math.cos(angle) * dist, e.y + Math.sin(angle) * dist, 2, 2);
        }
      }
    });
  };

  const loop = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    update(time);
    draw(ctx);
    
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    fireMissile({ x, y });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        onClick={handleCanvasClick}
        className="max-w-full max-h-full object-contain cursor-crosshair border border-white/10 shadow-2xl"
      />
    </div>
  );
};

export default GameCanvas;
