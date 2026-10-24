import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  buildCssGradient,
  generatePalette,
  generateRandomAestheticColor,
} from '../utils/portfolioLogic';
import {
  FlaskConical,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CreativeLabSection: React.FC = () => {
  const { t, playSfx } = usePortfolio();

  // Active Lab Mode
  const [activeTab, setActiveTab] = useState<'gradient' | 'palette' | 'surface'>('gradient');

  // Gradient Generator State
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [color1, setColor1] = useState('#8b5cf6');
  const [color2, setColor2] = useState('#3b82f6');
  const [color3, setColor3] = useState('#06b6d4');
  const [copiedGradient, setCopiedGradient] = useState(false);

  // Palette State
  const [palette, setPalette] = useState<string[]>(() => [
    '#8b5cf6',
    '#38bdf8',
    '#10b981',
    '#f59e0b',
    '#ec4899',
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Mouse-driven Dynamic Surface State
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [surfaceMouse, setSurfaceMouse] = useState({ x: 50, y: 50 });

  const cssCode = buildCssGradient(gradientType, gradientAngle, color1, color2, color3);

  const handleCopyCss = () => {
    playSfx('success');
    navigator.clipboard.writeText(`background: ${cssCode};`);
    setCopiedGradient(true);
    setTimeout(() => setCopiedGradient(false), 2000);
  };

  const handleShuffleGradient = () => {
    playSfx('toggle');
    setColor1(generateRandomAestheticColor());
    setColor2(generateRandomAestheticColor());
    setColor3(generateRandomAestheticColor());
    setGradientAngle(Math.floor(Math.random() * 360));
  };

  const handleShufflePalette = () => {
    playSfx('toggle');
    const newPalette = generatePalette(5);
    setPalette(newPalette);
  };

  const handleCopyColor = (hex: string) => {
    playSfx('success');
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);

    // subtle celebratory confetti burst
    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.7 },
        colors: [hex, '#ffffff'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSurfaceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSurfaceMouse({ x, y });
  };

  return (
    <section
      id="lab"
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#090b14]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-mono uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{t.lab.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.lab.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl">
            {t.lab.subtitle}
          </p>

          {/* Lab Sub-tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => {
                playSfx('click');
                setActiveTab('gradient');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'gradient'
                  ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {t.lab.tabs.gradient}
            </button>
            <button
              onClick={() => {
                playSfx('click');
                setActiveTab('palette');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'palette'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {t.lab.tabs.palette}
            </button>
            <button
              onClick={() => {
                playSfx('click');
                setActiveTab('surface');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'surface'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {t.lab.interactiveBoxTitle}
            </button>
          </div>
        </div>

        {/* Tab 1: Live CSS Gradient Generator */}
        {activeTab === 'gradient' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d101e] border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-2xl">
            {/* Left: Preview Canvas */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div
                className="w-full h-72 sm:h-84 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 relative flex items-center justify-center overflow-hidden"
                style={{ background: cssCode }}
              >
                <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-medium">
                  CSS Preview Mode
                </div>
              </div>

              {/* Generated CSS Box & Copy Button */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <code className="text-xs font-mono text-cyan-300 truncate mr-3">
                  background: {cssCode};
                </code>
                <button
                  onClick={handleCopyCss}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  {copiedGradient ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{t.lab.cssCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.lab.copyCss}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-fuchsia-400" />
                  <span>Gradient Sozlamalari</span>
                </h3>
                <button
                  onClick={handleShuffleGradient}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.lab.randomGradient}</span>
                </button>
              </div>

              {/* Type Switcher */}
              <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.08]">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    gradientType === 'linear'
                      ? 'bg-fuchsia-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Linear (Chiziqli)
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    gradientType === 'radial'
                      ? 'bg-fuchsia-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Radial (Doiraviy)
                </button>
              </div>

              {/* Angle Slider if Linear */}
              {gradientType === 'linear' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>{t.lab.gradientAngle}</span>
                    <span className="text-cyan-400 font-bold">{gradientAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(parseInt(e.target.value, 10))}
                    className="w-full accent-fuchsia-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Color Pickers */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {t.lab.color1}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{color1}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {t.lab.color2}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{color2}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {t.lab.color3}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-400">{color3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Color Palette Generator */}
        {activeTab === 'palette' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d101e] border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Harmonik Ranglar Palitrasi</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">{t.lab.paletteHint}</p>
              </div>

              <button
                onClick={handleShufflePalette}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 hover:scale-105 transition-all self-start"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t.lab.randomPalette}</span>
              </button>
            </div>

            {/* 5-Color Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {palette.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleCopyColor(color)}
                  className="group relative h-44 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 shadow-lg overflow-hidden border border-white/10"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-md self-start">
                    0{index + 1}
                  </span>

                  <div className="w-full flex items-center justify-between p-2 rounded-xl bg-black/50 backdrop-blur-md text-white">
                    <span className="text-xs font-mono font-bold tracking-wider">
                      {color.toUpperCase()}
                    </span>
                    {copiedHex === color ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Mouse-driven Dynamic Lighting Surface */}
        {activeTab === 'surface' && (
          <div
            ref={surfaceRef}
            onMouseMove={handleSurfaceMouseMove}
            className="relative h-96 rounded-3xl p-8 border border-white/[0.1] bg-[#070913] overflow-hidden cursor-crosshair shadow-2xl flex flex-col justify-between"
            style={{
              backgroundImage: `radial-gradient(circle 350px at ${surfaceMouse.x}% ${surfaceMouse.y}%, rgba(139, 92, 246, 0.35), rgba(6, 182, 212, 0.15) 40%, transparent 80%)`,
            }}
          >
            {/* Tech grid mesh */}
            <div className="absolute inset-0 tech-grid-pattern opacity-50 pointer-events-none" />

            {/* Floating indicator */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-cyan-300">
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>
                  X: {surfaceMouse.x.toFixed(1)}% | Y: {surfaceMouse.y.toFixed(1)}%
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Sichqonchani maydon bo‘ylab harakatlantiring
              </span>
            </div>

            <div className="relative z-10 max-w-lg space-y-2 bg-black/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
              <h4 className="text-lg font-bold text-white">
                {t.lab.interactiveBoxTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                {t.lab.interactiveBoxDesc}. Kursorning tezligi va burchagiga qarab
                sathning yorug‘lik akslanishi dinamik hisoblanadi.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
