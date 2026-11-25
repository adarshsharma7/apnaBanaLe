'use client';

import React, { useEffect, useState } from 'react';

const EMOJIS = ['🌸', '✨', '💖', '🦋', '🐒', '🤍', '🌷', '💫'];

export default function FloatingAmbient({ isPaused = false }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 22 }).map((_, i) => {
      const emoji = EMOJIS[i % EMOJIS.length];
      const left = (i * 4.6 + Math.random() * 3) % 94;
      const size = 16 + Math.random() * 16;
      const delay = Math.random() * 9;
      const speedClass =
        i % 3 === 0 ? 'anim-float-slow' : i % 3 === 1 ? 'anim-float-medium' : 'anim-float-fast';

      return {
        id: i,
        emoji,
        left: `${left}%`,
        size: `${size}px`,
        delay: `${delay}s`,
        speedClass,
      };
    });
    setItems(generated);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Soft radial pastel glow blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blush-200/35 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-60px] w-96 h-96 rounded-full bg-purple-200/35 blur-3xl" />

      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute bottom-[-80px] ${item.speedClass} ${isPaused ? 'anim-paused' : ''}`}
          style={{
            left: item.left,
            fontSize: item.size,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
