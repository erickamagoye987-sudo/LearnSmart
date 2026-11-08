import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Sparkles, Pencil, Eraser } from 'lucide-react';
import { playSound } from '../utils/audio';
import { UserSettings } from '../types';

interface TracingCanvasProps {
  symbol: string;
  subText?: string;
  colorClass?: string;
  settings: UserSettings;
  onComplete?: () => void;
}

const INK_COLORS = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Gold', hex: '#f59e0b' }
];

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  symbol,
  subText,
  settings,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(INK_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState(14);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = Math.min(parent.clientWidth || 320, 360);
    const height = 300;
    canvas.width = width * 2; // high DPI
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [symbol]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = isEraser ? '#ffffff' : selectedColor;
    ctx.lineWidth = isEraser ? brushSize * 1.8 : brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    playSound('click', settings);
  };

  const handleCelebrate = () => {
    setShowCelebration(true);
    playSound('celebrate', settings);
    onComplete?.();
    setTimeout(() => {
      setShowCelebration(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-4 md:p-6 border border-blue-100 shadow-sm max-w-md w-full mx-auto">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5 font-heading">
            <Pencil className="w-4 h-4 text-blue-600" />
            Trace & Practice
          </h4>
          <p className="text-xs text-slate-500">
            {subText || `Trace the symbol ${symbol} with your finger!`}
          </p>
        </div>

        <button
          onClick={clearCanvas}
          className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Clear canvas"
          aria-label="Clear drawing canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Interactive Tracing Arena */}
      <div className="relative w-full flex items-center justify-center bg-slate-50/80 rounded-2xl border-2 border-dashed border-blue-200 overflow-hidden select-none touch-none">
        {/* Soft Background Letter Guide */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="text-[140px] font-bold text-blue-200/50 leading-none select-none font-heading tracking-tight">
            {symbol}
          </span>
        </div>

        {/* Tracing Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 cursor-crosshair touch-none"
          aria-label={`Drawing area for tracing ${symbol}`}
        />

        {showCelebration && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-blue-600/90 text-white rounded-2xl animate-fade-in p-4 text-center">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-bounce mb-2" />
            <span className="text-2xl font-bold font-heading">Wonderful Tracing!</span>
            <span className="text-sm text-blue-100 mt-1">You earned a golden star!</span>
          </div>
        )}
      </div>

      {/* Colors & Tools Toolbar */}
      <div className="flex items-center justify-between w-full mt-4 gap-2 flex-wrap">
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          {INK_COLORS.map(col => (
            <button
              key={col.name}
              onClick={() => {
                setSelectedColor(col.hex);
                setIsEraser(false);
                playSound('click', settings);
              }}
              style={{ backgroundColor: col.hex }}
              className={`w-7 h-7 rounded-full transition-transform ${
                !isEraser && selectedColor === col.hex
                  ? 'ring-4 ring-blue-300 scale-110 shadow-sm'
                  : 'hover:scale-105'
              }`}
              title={col.name}
              aria-label={`Select ${col.name} color`}
            />
          ))}

          <button
            onClick={() => {
              setIsEraser(!isEraser);
              playSound('click', settings);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isEraser
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Eraser"
            aria-label="Toggle eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Finish / Done Action */}
        <button
          onClick={handleCelebrate}
          disabled={!hasDrawn}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            hasDrawn
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>I Traced It!</span>
        </button>
      </div>
    </div>
  );
};
