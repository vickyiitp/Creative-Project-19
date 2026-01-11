import React, { useRef, useEffect, useCallback } from 'react';
import { Block, BlockType, FloatingText, GameStatus } from '../types';
import { COLORS, CONSTANTS } from '../constants';

interface GameCanvasProps {
  status: GameStatus;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameOver: (finalScore: number) => void;
}

// Extended FloatingText interface to support rotation and scaling for better visuals
interface EnhancedFloatingText extends FloatingText {
  rotation: number;
  rotationSpeed: number;
  scale: number;
}

const generateHash = (length: number = 16) => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
  status, 
  onScoreUpdate, 
  onLivesUpdate, 
  onGameOver 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const gameState = useRef({
    blocks: [] as Block[],
    particles: [] as EnhancedFloatingText[],
    lastTime: 0,
    spawnTimer: 0,
    speed: CONSTANTS.INITIAL_SPEED,
    score: 0,
    lives: CONSTANTS.STARTING_LIVES,
    isFrozen: false,
    freezeTimer: 0,
    columnWidth: 0,
    columns: 0,
    backgroundOffset: 0, // For scrolling grid
    globalTime: 0 // For pulse effects
  });

  const requestRef = useRef<number>();

  const initGame = useCallback(() => {
    gameState.current = {
      blocks: [],
      particles: [],
      lastTime: performance.now(),
      spawnTimer: 0,
      speed: CONSTANTS.INITIAL_SPEED,
      score: 0,
      lives: CONSTANTS.STARTING_LIVES,
      isFrozen: false,
      freezeTimer: 0,
      columnWidth: 0,
      columns: 0,
      backgroundOffset: 0,
      globalTime: 0
    };
    onScoreUpdate(0);
    onLivesUpdate(CONSTANTS.STARTING_LIVES);
    handleResize();
  }, [onScoreUpdate, onLivesUpdate]);

  const handleResize = useCallback(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      
      const colCount = Math.floor(width / 180); 
      gameState.current.columns = Math.max(1, colCount);
      gameState.current.columnWidth = width / Math.max(1, colCount);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Main Loop Controller
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      initGame();
    } else if (status === GameStatus.MENU) {
      gameState.current.blocks = [];
      gameState.current.particles = [];
      gameState.current.speed = CONSTANTS.INITIAL_SPEED * 0.5;
    }

    gameState.current.lastTime = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, initGame]);

  const gameLoop = (time: number) => {
    const state = gameState.current;
    const deltaTime = (time - state.lastTime) / 1000;
    state.lastTime = time;
    state.globalTime += deltaTime;

    update(deltaTime);
    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
    
    if (status === GameStatus.PLAYING && state.lives <= 0) {
      onGameOver(state.score);
    }
  };

  const spawnBlock = () => {
    const state = gameState.current;
    if (!canvasRef.current || state.columns === 0) return;

    const colIndex = Math.floor(Math.random() * state.columns);
    const x = colIndex * state.columnWidth + (state.columnWidth / 2);
    
    const rand = Math.random();
    let type = BlockType.INVALID;
    let hash = generateHash();
    let speedMult = 1;

    // Adjusted spawn rates
    if (rand < 0.15) {
      type = BlockType.VALID;
      hash = '0000' + generateHash(12);
      speedMult = 1.0;
    } else if (rand < 0.17) {
      type = BlockType.POWERUP_FREEZE;
      hash = 'TIME_FREEZE_INIT';
      speedMult = 1.2;
    } else if (rand < 0.18) {
      type = BlockType.POWERUP_BONUS;
      hash = 'ETH_BONUS_BLOCK';
      speedMult = 1.5;
    }

    const block: Block = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: -50,
      hash,
      type,
      width: state.columnWidth - 20,
      height: CONSTANTS.BLOCK_HEIGHT,
      speedMultiplier: speedMult,
      alpha: 1,
      isMined: false,
      column: colIndex
    };

    const lastInCol = state.blocks.filter(b => b.column === colIndex).sort((a,b) => b.y - a.y)[0];
    if (!lastInCol || lastInCol.y > 50) {
       state.blocks.push(block);
    }
  };

  const update = (dt: number) => {
    const state = gameState.current;
    if (!canvasRef.current) return;
    const height = canvasRef.current.height / (window.devicePixelRatio || 1);

    // Speed increase logic
    if (status === GameStatus.PLAYING) {
      if (!state.isFrozen) {
        state.speed += CONSTANTS.SPEED_INCREMENT * dt;
      } else {
        state.freezeTimer -= dt * 1000;
        if (state.freezeTimer <= 0) state.isFrozen = false;
      }
    } else {
      state.speed = CONSTANTS.INITIAL_SPEED * 0.5;
    }
    
    // Background scroll update
    state.backgroundOffset += state.speed * 0.5 * dt;
    if (state.backgroundOffset > height) state.backgroundOffset = 0;

    // Spawn logic
    state.spawnTimer += dt;
    const currentSpawnRate = Math.max(0.1, 0.8 - (state.speed / 1000)); 
    
    const shouldSpawn = status === GameStatus.PLAYING 
      ? state.spawnTimer > currentSpawnRate
      : state.spawnTimer > currentSpawnRate * 1.5;

    if (shouldSpawn) {
      spawnBlock();
      state.spawnTimer = 0;
    }

    // Move blocks
    const effectiveSpeed = state.isFrozen ? state.speed * 0.2 : state.speed;
    state.blocks.forEach(block => {
      block.y += effectiveSpeed * block.speedMultiplier * dt;
    });

    state.blocks = state.blocks.filter(b => b.y < height + 50 && !b.isMined);

    // Update Particles
    state.particles.forEach(p => {
      p.y -= p.velocity * dt;
      p.life -= dt;
      p.rotation += p.rotationSpeed * dt; // Rotate particle
      p.scale += dt * 0.5; // Grow particle slightly
    });
    state.particles = state.particles.filter(p => p.life > 0);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    // Clear with semi-transparent black to let the background show through but provide contrast
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Optional: Draw a subtle darkening layer to ensure text readability
    ctx.fillStyle = 'rgba(5, 5, 10, 0.7)'; // Slight tint to darken the vivid background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const state = gameState.current;

    // --- DRAW MATRIX GRID ---
    // Make grid lighter to contrast with new background
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)'; 
    ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetY = state.backgroundOffset % gridSize;
    
    // Horizontal lines scrolling down
    for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    // Vertical perspective lines
    const centerX = width / 2;
    for (let i = -10; i <= 10; i++) {
        const x = centerX + i * 100;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo((x - centerX) * 5 + centerX, height); // Fake perspective
        ctx.stroke();
    }
    ctx.restore();

    // Fade effect for Menu / Game Over
    if (status !== GameStatus.PLAYING) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0,0, width, height);
    }

    // --- DRAW COLUMNS ---
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < state.columns; i++) {
        const x = i * state.columnWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // --- DRAW BLOCKS ---
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${CONSTANTS.FONT_SIZE}px 'Fira Code', monospace`;

    state.blocks.forEach(block => {
      let color = COLORS.GREEN;
      let shadowColor = 'transparent';
      let shadowBlur = 0;
      let scale = 1;

      if (block.type === BlockType.VALID) {
        color = COLORS.GOLD;
        shadowColor = COLORS.GOLD;
        shadowBlur = 10;
        // Pulse effect for valid blocks
        scale = 1 + Math.sin(state.globalTime * 5) * 0.1; 
      } else if (block.type === BlockType.POWERUP_FREEZE) {
        color = COLORS.CYAN;
        shadowColor = COLORS.CYAN;
        shadowBlur = 15;
      } else if (block.type === BlockType.POWERUP_BONUS) {
        color = COLORS.PURPLE;
        shadowColor = COLORS.PURPLE;
        shadowBlur = 15;
      } else {
        // Normal matrix rain
        ctx.globalAlpha = (status !== GameStatus.PLAYING) ? 0.4 : 0.7;
      }

      ctx.save();
      ctx.translate(block.x, block.y);
      ctx.scale(scale, scale);
      
      ctx.fillStyle = color;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.fillText(block.hash, 0, 0);

      ctx.restore();

      // Reset global alpha
      ctx.globalAlpha = 1.0;
    });

    // --- DRAW PARTICLES ---
    state.particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);
      
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = Math.max(0, p.life);
      
      ctx.font = `bold 20px 'Fira Code', monospace`;
      ctx.fillText(p.text, 0, 0);
      
      ctx.restore();
    });

    // --- FROZEN OVERLAY ---
    if (state.isFrozen) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = COLORS.CYAN;
      ctx.font = '20px monospace';
      ctx.fillText(`SYSTEM FROZEN: ${(state.freezeTimer/1000).toFixed(1)}s`, state.columnWidth, 30);
    }

    ctx.restore();
  };

  const handleInteraction = (clientX: number, clientY: number) => {
    if (status !== GameStatus.PLAYING || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const state = gameState.current;

    const hitWidth = 180; 
    const hitHeight = 60; // Slightly more forgiving
    
    for (let i = state.blocks.length - 1; i >= 0; i--) {
      const block = state.blocks[i];
      if (block.isMined) continue;

      const dx = Math.abs(x - block.x);
      const dy = Math.abs(y - block.y);

      if (dx < hitWidth / 2 && dy < hitHeight / 2) {
        block.isMined = true;
        
        if (block.type === BlockType.VALID) {
          const points = 0.001; 
          state.score += points;
          onScoreUpdate(state.score);
          spawnParticle(block.x, block.y, `+${points} ETH`, COLORS.GOLD);
        } else if (block.type === BlockType.POWERUP_FREEZE) {
          state.isFrozen = true;
          state.freezeTimer = CONSTANTS.FREEZE_DURATION;
          spawnParticle(block.x, block.y, `FREEZE!`, COLORS.CYAN);
        } else if (block.type === BlockType.POWERUP_BONUS) {
          const points = 0.05;
          state.score += points;
          onScoreUpdate(state.score);
          spawnParticle(block.x, block.y, `JACKPOT!`, COLORS.PURPLE);
        } else {
          state.lives -= 1;
          onLivesUpdate(state.lives);
          spawnParticle(block.x, block.y, `INVALID`, COLORS.RED);
          if (containerRef.current) {
            containerRef.current.classList.add('animate-shake');
            setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 500);
          }
        }
        state.blocks.splice(i, 1);
        break; 
      }
    }
  };

  const spawnParticle = (x: number, y: number, text: string, color: string) => {
    gameState.current.particles.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      life: 1.0,
      velocity: 50,
      rotation: (Math.random() - 0.5) * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: 1
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full cursor-crosshair overflow-hidden touch-none select-none"
      style={{ backgroundColor: 'rgba(5, 5, 5, 0.4)' }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        handleInteraction(touch.clientX, touch.clientY);
      }}
      onMouseDown={(e) => handleInteraction(e.clientX, e.clientY)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};