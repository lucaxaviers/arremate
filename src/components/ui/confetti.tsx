"use client";

import { useEffect, useState } from "react";

export function Confetti() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; dx: string; dy: string; rot: string; color: string; size: number }[]
  >([]);

  useEffect(() => {
    // 40 partículas, cores âmbar, branco e cinza, dura até 800ms
    const colors = ["#F59E0B", "#B45309", "#FAFAF9", "#E7E5E4", "#0A0A0B"];
    const items = Array.from({ length: 40 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 220;
      return {
        id: i,
        x: 50,
        y: 50,
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance}px`,
        rot: `${Math.random() * 720 - 360}deg`,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 5,
      };
    });
    setParticles(items);

    const timer = setTimeout(() => setParticles([]), 850);
    return () => clearTimeout(timer);
  }, []);

  if (!particles.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "absolute",
              left: "50%",
              top: "40%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.id % 2 === 0 ? "50%" : "2px",
              "--dx": p.dx,
              "--dy": p.dy,
              "--rot": p.rot,
              animation: "confetti 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
