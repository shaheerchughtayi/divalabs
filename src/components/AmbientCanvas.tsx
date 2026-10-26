import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const PARTICLE_COUNT = 48;
    const colors = [
      '#e4c896', // Light champagne gold
      '#dfb776', // Rich bronze gold
      '#c59b57', // Classic bronze
      '#ffd700', // Deep gold spark
    ];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.2 - Math.random() * 0.45, // Gentle upward drift
      radius: 0.8 + Math.random() * 2.2,
      baseAlpha: 0.15 + Math.random() * 0.65,
      pulseSpeed: 0.015 + Math.random() * 0.03,
      pulsePhase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(step + i) * 0.15;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = Math.max(0.08, Math.min(0.9, p.baseAlpha + Math.sin(p.pulsePhase) * 0.35));

        // Draw particle with gentle glow
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.globalAlpha = currentAlpha;
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Obsidian gradient background */}
      <div className="absolute inset-0 bg-[#08080a]" />

      {/* Luxury flowing waves SVG layer matching the screenshots */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-100,200 C300,50 800,450 1600,150 L1600,900 L-100,900 Z"
          fill="url(#wave-grad-1)"
          opacity="0.25"
        />
        <path
          d="M-50,450 C400,200 950,750 1550,400"
          stroke="url(#line-bronze-1)"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M-100,520 C350,280 1000,820 1600,480"
          stroke="url(#line-bronze-2)"
          strokeWidth="0.8"
          opacity="0.25"
        />
        <path
          d="M-50,600 C500,400 900,850 1500,550"
          stroke="url(#line-bronze-1)"
          strokeWidth="0.6"
          opacity="0.2"
        />
        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a150e" />
            <stop offset="50%" stopColor="#251c10" />
            <stop offset="100%" stopColor="#08080a" />
          </linearGradient>
          <linearGradient id="line-bronze-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#8c6729" />
            <stop offset="60%" stopColor="#dfb776" />
            <stop offset="85%" stopColor="#8c6729" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="line-bronze-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="#c59b57" />
            <stop offset="70%" stopColor="#f3dfb2" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* HTML5 Canvas for Golden Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial vignette spotlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(197, 155, 87, 0.04) 0%, rgba(8, 8, 10, 0.6) 65%, #08080a 100%)',
        }}
      />
    </div>
  );
};
