'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  type: 'spore' | 'ring' | 'dot';
  color: string;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitCenterX: number;
  orbitCenterY: number;
  useOrbit: boolean;
}

const COLORS = [
  'hsl(39, 53%, 62%)',   // primary gold
  'hsl(185, 41%, 55%)',  // teal
  'hsl(167, 40%, 50%)',  // green-teal
  'hsl(39, 70%, 75%)',   // light gold
];

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (w: number, h: number): Particle => {
      const type = Math.random() < 0.5 ? 'spore' : Math.random() < 0.6 ? 'ring' : 'dot';
      const useOrbit = Math.random() < 0.3;
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      return {
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.08,
        radius: type === 'spore' ? 2 + Math.random() * 4 : type === 'ring' ? 4 + Math.random() * 8 : 1 + Math.random() * 2,
        opacity: 0.04 + Math.random() * 0.18,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        type,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.003,
        orbitRadius: 30 + Math.random() * 80,
        orbitCenterX: cx,
        orbitCenterY: cy,
        useOrbit,
      };
    };

    const initParticles = () => {
      // Drastically reduced particle count for better performance (from 110 down to max 45)
      const count = Math.min(45, Math.floor((canvas.width * canvas.height) / 25000));
      particles = Array.from({ length: count }, () => createParticle(canvas.width, canvas.height));
    };

    const drawSpore = (p: Particle, pulse: number) => {
      if (!ctx) return;
      const r = p.radius * (0.85 + 0.15 * pulse);

      // outer glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      grad.addColorStop(0, p.color.replace(')', `, ${p.opacity * 0.9})`).replace('hsl', 'hsla'));
      grad.addColorStop(1, p.color.replace(')', `, 0)`).replace('hsl', 'hsla'));
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `, ${p.opacity * 2})`).replace('hsl', 'hsla');
      ctx.fill();
    };

    const drawRing = (p: Particle, pulse: number) => {
      if (!ctx) return;
      const r = p.radius * (0.9 + 0.1 * pulse);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = p.color.replace(')', `, ${p.opacity})`).replace('hsl', 'hsla');
      ctx.lineWidth = 0.8;
      ctx.stroke();
      // inner ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = p.color.replace(')', `, ${p.opacity * 0.5})`).replace('hsl', 'hsla');
      ctx.lineWidth = 0.4;
      ctx.stroke();
    };

    const drawDot = (p: Particle, pulse: number) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `, ${p.opacity * 1.5})`).replace('hsl', 'hsla');
      ctx.fill();
    };

    // Draw faint mycelium-like connection lines between close particles
    const drawConnections = () => {
      if (!ctx) return;
      const maxDist = 160;
      const maxDistSq = maxDist * maxDist;
      
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          // Quick bounding box check before expensive math
          if (Math.abs(dx) > maxDist) continue;
          
          const dy = p1.y - p2.y;
          if (Math.abs(dy) > maxDist) continue;
          
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * 0.045;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(39, 53%, 62%, ${alpha})`;
            ctx.stroke();
          }
        }
      }
    };

    let frame = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      particles.forEach((p) => {
        // Update position
        if (p.useOrbit) {
          p.orbitAngle += p.orbitSpeed;
          p.x = p.orbitCenterX + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = p.orbitCenterY + Math.sin(p.orbitAngle) * p.orbitRadius;
          // drift center slowly
          p.orbitCenterX += p.vx * 0.4;
          p.orbitCenterY += p.vy * 0.4;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase);

        // Wrap around edges
        if (p.x < -50) { p.x = canvas.width + 50; p.orbitCenterX = p.x; }
        if (p.x > canvas.width + 50) { p.x = -50; p.orbitCenterX = p.x; }
        if (p.y < -50) { p.y = canvas.height + 50; p.orbitCenterY = p.y; }
        if (p.y > canvas.height + 50) { p.y = -50; p.orbitCenterY = p.y; }

        if (p.type === 'spore') drawSpore(p, pulse);
        else if (p.type === 'ring') drawRing(p, pulse);
        else drawDot(p, pulse);
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
