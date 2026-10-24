import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { lang, selectedProject, setSelectedProject, t, playSfx } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'info' | 'interactive'>('info');

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProject]);

  useEffect(() => {
    if (selectedProject?.isPlayable) {
      setActiveTab('interactive');
    } else {
      setActiveTab('info');
    }
  }, [selectedProject]);

  if (!selectedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={() => setSelectedProject(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#0c0f1c] border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {t.projects.statusLabels[selectedProject.status]}
            </span>
            <h3
              id="modal-project-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {selectedProject.title}
            </h3>
          </div>

          <button
            onClick={() => {
              playSfx('click');
              setSelectedProject(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label={t.projects.closeModal}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher if playable */}
        {selectedProject.isPlayable && (
          <div className="flex border-b border-white/[0.08] bg-[#080a13]">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'interactive'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>{t.projects.playNow} (Brauzerda O‘ynash)</span>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'info'
                  ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.projects.viewDetails}</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'interactive' && selectedProject.id === 'neon-snake' ? (
            <PlayableSnakeGame />
          ) : activeTab === 'interactive' && selectedProject.id === 'geometry-dash-game' ? (
            <PlayableGeometryRunner />
          ) : (
            <div className="space-y-6">
              {/* Detailed narrative */}
              <div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {selectedProject.detailedDescription[lang] ||
                    selectedProject.description[lang]}
                </p>
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                {t.projects.demoNotice}
              </div>

              {/* Features list */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {t.projects.featuresTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.features[lang]?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                    >
                      <CheckCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {t.projects.techTitle}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Repozitoriy</span>
                  </a>
                )}

                {selectedProject.isPlayable && (
                  <button
                    onClick={() => setActiveTab('interactive')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    <span>{t.projects.playNow}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Playable Neon Snake Mini-Game Component
const PlayableSnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('neon_snake_hs') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mutable game state
  const gameState = useRef({
    gridSize: 20,
    tileCount: 20,
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    dx: 0,
    dy: 0,
    speed: 120,
    timer: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  const spawnFood = useCallback(() => {
    const gs = gameState.current;
    gs.food = {
      x: Math.floor(Math.random() * gs.tileCount),
      y: Math.floor(Math.random() * gs.tileCount),
    };
  }, []);

  const resetGame = () => {
    const gs = gameState.current;
    gs.snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    gs.dx = 0;
    gs.dy = -1;
    gs.particles = [];
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    spawnFood();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const gs = gameState.current;
      const { snake, food, gridSize, tileCount } = gs;

      // Clear Canvas
      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isPlaying && !gameOver) {
        // Move Snake
        const head = { x: snake[0].x + gs.dx, y: snake[0].y + gs.dy };

        // Wall collisions (Wrap-around or game over)
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y && (gs.dx !== 0 || gs.dy !== 0)) {
            setGameOver(true);
            setIsPlaying(false);
            return;
          }
        }

        snake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('neon_snake_hs', nextScore.toString());
            }
            return nextScore;
          });

          // Burst particles
          for (let p = 0; p < 12; p++) {
            gs.particles.push({
              x: food.x * gridSize + gridSize / 2,
              y: food.y * gridSize + gridSize / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1,
              color: '#06b6d4',
            });
          }

          spawnFood();
        } else {
          snake.pop();
        }
      }

      // Draw Food (Neon Glowing Orb)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake Body
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#8b5cf6';
      snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#c084fc' : '#8b5cf6';
        ctx.fillRect(
          part.x * gridSize + 1.5,
          part.y * gridSize + 1.5,
          gridSize - 3,
          gridSize - 3
        );
      });

      // Update & Draw Particles
      ctx.shadowBlur = 0;
      gs.particles = gs.particles.filter((p) => p.life > 0.05);
      gs.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.92;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = window.setTimeout(() => {
        requestAnimationFrame(gameLoop);
      }, gs.speed);
    };

    gameLoop();

    const handleKey = (e: KeyboardEvent) => {
      const gs = gameState.current;
      if (['ArrowUp', 'KeyW'].includes(e.code) && gs.dy !== 1) {
        gs.dx = 0;
        gs.dy = -1;
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && gs.dy !== -1) {
        gs.dx = 0;
        gs.dy = 1;
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && gs.dx !== 1) {
        gs.dx = -1;
        gs.dy = 0;
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && gs.dx !== -1) {
        gs.dx = 1;
        gs.dy = 0;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(animId);
    };
  }, [isPlaying, gameOver, spawnFood, highScore]);

  const handleDirection = (direction: 'up' | 'down' | 'left' | 'right') => {
    const gs = gameState.current;
    if (direction === 'up' && gs.dy !== 1) {
      gs.dx = 0;
      gs.dy = -1;
    } else if (direction === 'down' && gs.dy !== -1) {
      gs.dx = 0;
      gs.dy = 1;
    } else if (direction === 'left' && gs.dx !== 1) {
      gs.dx = -1;
      gs.dy = 0;
    } else if (direction === 'right' && gs.dx !== -1) {
      gs.dx = 1;
      gs.dy = 0;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* HUD Bar */}
      <div className="w-full max-w-sm flex items-center justify-between px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <span>Ochko:</span>
          <span className="font-bold text-sm text-white">{score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-300">
          <Trophy className="w-3.5 h-3.5" />
          <span>Rekord:</span>
          <span className="font-bold text-sm text-white">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="block max-w-full bg-[#060812]"
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h4 className="text-xl font-bold text-white">
              {gameOver ? 'O‘yin tugadi!' : 'Neon Snake Arcade'}
            </h4>
            <p className="text-xs text-slate-300 font-mono">
              {gameOver
                ? `To‘plangan ochko: ${score}`
                : 'Klaviatura strelkalari yoki tugmalar orqali boshqaring'}
            </p>
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{gameOver ? 'Qayta o‘ynash' : 'O‘yinni boshlash'}</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen touch D-Pad controls for mobile */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => handleDirection('up')}
          className="w-12 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white active:bg-cyan-500/30 flex items-center justify-center font-bold"
        >
          ▲
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => handleDirection('left')}
            className="w-12 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white active:bg-cyan-500/30 flex items-center justify-center font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => handleDirection('down')}
            className="w-12 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white active:bg-cyan-500/30 flex items-center justify-center font-bold"
          >
            ▼
          </button>
          <button
            onClick={() => handleDirection('right')}
            className="w-12 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white active:bg-cyan-500/30 flex items-center justify-center font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

// Playable Geometry Runner Mini-Demo Component
const PlayableGeometryRunner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [distance, setDistance] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [running, setRunning] = useState(false);

  const state = useRef({
    playerY: 180,
    velocity: 0,
    gravity: 0.8,
    jumpPower: -12,
    spikes: [320, 520, 720],
    speed: 4,
    distance: 0,
  });

  const jump = useCallback(() => {
    if (state.current.playerY >= 175) {
      state.current.velocity = state.current.jumpPower;
      setIsJumping(true);
    }
  }, []);

  const startDemo = () => {
    state.current = {
      playerY: 180,
      velocity: 0,
      gravity: 0.8,
      jumpPower: -12,
      spikes: [320, 520, 720],
      speed: 4,
      distance: 0,
    };
    setCrashed(false);
    setRunning(true);
    setDistance(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.fillStyle = '#0a0d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 210);
      ctx.lineTo(canvas.width, 210);
      ctx.stroke();

      const st = state.current;

      if (running && !crashed) {
        st.velocity += st.gravity;
        st.playerY += st.velocity;

        if (st.playerY >= 180) {
          st.playerY = 180;
          st.velocity = 0;
          setIsJumping(false);
        }

        st.distance += 1;
        setDistance(Math.floor(st.distance / 10));

        // Spikes movement
        for (let i = 0; i < st.spikes.length; i++) {
          st.spikes[i] -= st.speed;
          if (st.spikes[i] < -20) {
            st.spikes[i] = canvas.width + 100 + Math.random() * 150;
          }

          // AABB Collision check
          if (
            st.spikes[i] > 35 &&
            st.spikes[i] < 65 &&
            st.playerY > 165
          ) {
            setCrashed(true);
            setRunning(false);
          }
        }
      }

      // Draw Player Cube
      ctx.fillStyle = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f43f5e';
      ctx.fillRect(40, st.playerY, 26, 26);

      // Inner cube eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(52, st.playerY + 6, 8, 8);

      // Draw Spikes
      ctx.fillStyle = '#eab308';
      ctx.shadowColor = '#eab308';
      st.spikes.forEach((sx) => {
        ctx.beginPath();
        ctx.moveTo(sx, 210);
        ctx.lineTo(sx + 12, 185);
        ctx.lineTo(sx + 24, 210);
        ctx.closePath();
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(animId);
    };
  }, [running, crashed, jump]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-sm flex items-center justify-between px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
        <span className="text-cyan-300">Masofa: {distance}m</span>
        <span className="text-violet-400">Sakrash: Space / Bosish</span>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden border border-fuchsia-500/30 cursor-pointer"
        onClick={running ? jump : startDemo}
      >
        <canvas ref={canvasRef} width={360} height={240} className="block bg-[#0a0d1a]" />

        {(!running || crashed) && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h4 className="text-lg font-bold text-white">
              {crashed ? 'To‘qnashuv!' : 'Geometry Runner Demo'}
            </h4>
            <button
              onClick={startDemo}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-semibold text-xs shadow-lg"
            >
              {crashed ? 'Qaytadan urinish' : 'Boshlash'}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={jump}
        className="w-full max-w-sm py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600/30 to-violet-600/30 border border-fuchsia-500/50 text-white font-bold text-sm tracking-wide"
      >
        SAKRASH (TAP)
      </button>
    </div>
  );
};
