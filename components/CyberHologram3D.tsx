'use client';

import { useEffect, useRef } from 'react';

export default function CyberHologram3D({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    // 3D Wireframe Icosahedron / Octahedron Nodes
    const vertices: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
      [0.7, 0.7, 0.7], [-0.7, 0.7, 0.7],
      [0.7, -0.7, 0.7], [-0.7, -0.7, 0.7],
      [0.7, 0.7, -0.7], [-0.7, 0.7, -0.7],
      [0.7, -0.7, -0.7], [-0.7, -0.7, -0.7]
    ];

    // Edges connecting nodes
    const edges: [number, number][] = [
      [0, 2], [2, 1], [1, 3], [3, 0],
      [0, 4], [2, 4], [1, 4], [3, 4],
      [0, 5], [2, 5], [1, 5], [3, 5],
      [6, 7], [7, 9], [9, 8], [8, 6],
      [10, 11], [11, 13], [13, 12], [12, 10],
      [6, 10], [7, 11], [8, 12], [9, 13]
    ];

    // Floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3,
      z: (Math.random() - 0.5) * 3,
      speed: 0.003 + Math.random() * 0.005,
    }));

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.32;

      angleX += 0.005;
      angleY += 0.008;
      angleZ += 0.003;

      // Projection function
      const project = (x: number, y: number, z: number): [number, number, number] => {
        // Rotation Y
        let x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
        let z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);

        // Rotation X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Rotation Z
        let x3 = x1 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
        let y3 = x1 * Math.sin(angleZ) + y2 * Math.cos(angleZ);

        const distance = 3.2;
        const fov = scale / (z2 + distance);
        return [x3 * fov + cx, y3 * fov + cy, z2];
      };

      // Draw Orbiting Particles
      ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -1.5) p.y = 1.5;
        const [px, py, pz] = project(p.x, p.y, p.z);
        const radius = Math.max(1, (pz + 2) * 1.2);
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Project vertices
      const projected = vertices.map(([x, y, z]) => project(x, y, z));

      // Draw wireframe edges
      ctx.lineWidth = 1.2;
      edges.forEach(([i, j]) => {
        const [x1, y1, z1] = projected[i];
        const [x2, y2, z2] = projected[j];
        const avgZ = (z1 + z2) / 2;
        const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 1.2) / 2.4));

        ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw node joints
      projected.forEach(([px, py, pz]) => {
        const nodeRadius = Math.max(2, (pz + 1.8) * 2.2);
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Outer HUD holographic reticle rings
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([12, 16]);
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Amber radial glow behind core */}
      <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}