
import React, { useEffect, useRef, useState } from 'react';
import { WHEEL_COLORS } from '../constants';

interface WheelProps {
  names: string[];
  isSpinning: boolean;
  onSpinEnd: (winner: string) => void;
}

const Wheel: React.FC<WheelProps> = ({ names, isSpinning, onSpinEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>();

  const drawWheel = (currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const segments = names.length || 1;
    const angleStep = (2 * Math.PI) / segments;

    ctx.clearRect(0, 0, size, size);

    // Draw shadow
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * angleStep + currentRotation;
      const endAngle = (i + 1) * angleStep + currentRotation;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = names.length > 0 ? WHEEL_COLORS[i % WHEEL_COLORS.length] : '#E2E8F0';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      if (names.length > 0) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Inter, sans-serif';
        const text = names[i].length > 10 ? names[i].substring(0, 8) + '...' : names[i];
        ctx.fillText(text, radius - 30, 6);
        ctx.restore();
      }
    }

    // Outer border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center peg
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E293B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel(rotation);
  }, [names, rotation]);

  useEffect(() => {
    if (isSpinning) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds spin
      const baseSpins = 5 + Math.random() * 5; // 5-10 full spins
      const finalRotation = rotationRef.current + baseSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease out
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const currentRotation = rotationRef.current + (finalRotation - rotationRef.current) * easeOut(progress);
        
        setRotation(currentRotation);
        drawWheel(currentRotation);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          rotationRef.current = currentRotation;
          
          // Calculate winner
          // The arrow is at the top (angle -PI/2)
          const segments = names.length;
          const normalizedRotation = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          // 0 rad is at 3 o'clock, we need to know what segment is at 12 o'clock (-PI/2)
          // angle = startAngle + rotation. So segment i is [i*step + rot, (i+1)*step + rot]
          // At the top (-PI/2), we have: -PI/2 = angle
          // So segmentIndex = floor((-PI/2 - rot) / step) mod segments
          const angleStep = (2 * Math.PI) / segments;
          const winnerIndex = Math.floor(((1.5 * Math.PI - normalizedRotation) % (2 * Math.PI)) / angleStep);
          const safeIndex = (winnerIndex + segments) % segments;
          
          onSpinEnd(names[safeIndex]);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Indicator Arrow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-8 h-8 bg-slate-800 clip-triangle shadow-lg border-2 border-white" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={450} 
        className="max-w-full h-auto drop-shadow-2xl rounded-full"
      />
    </div>
  );
};

export default Wheel;
