'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeartbeatWidget({ isBeatingFast }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 24,
      rotateY: x * 24,
    });
  };

  const resetTilt = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <div
      onMouseMove={handlePointerMove}
      onMouseLeave={resetTilt}
      className="hidden sm:flex items-center gap-2.5 glass px-3.5 py-1.5 rounded-full border border-blush-200 shadow-sm select-none"
      style={{ perspective: 400 }}
    >
      <motion.div
        animate={{
          scale: isBeatingFast ? [1, 1.24, 1, 1.18, 1] : [1, 1.1, 1],
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: isBeatingFast ? 0.9 : 1.8,
            ease: 'easeInOut',
          },
          rotateX: { type: 'spring', stiffness: 220, damping: 18 },
          rotateY: { type: 'spring', stiffness: 220, damping: 18 },
        }}
        className="w-6 h-6 flex items-center justify-center drop-shadow-sm"
      >
        <svg viewBox="0 0 32 32" className="w-6 h-6" aria-hidden="true">
          <defs>
            <linearGradient id="crystalHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9ebb" />
              <stop offset="50%" stopColor="#f43f72" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
          <path
            d="M16 28.2C16 28.2 3.5 20.4 3.5 11.4C3.5 7.4 6.6 4.2 10.4 4.2C12.8 4.2 14.9 5.5 16 7.3C17.1 5.5 19.2 4.2 21.6 4.2C25.4 4.2 28.5 7.4 28.5 11.4C28.5 20.4 16 28.2 16 28.2Z"
            fill="url(#crystalHeartGrad)"
          />
          <ellipse cx="10.2" cy="10.2" rx="2.6" ry="1.4" transform="rotate(-30 10.2 10.2)" fill="rgba(255,255,255,0.55)" />
        </svg>
      </motion.div>
      <span className="text-[11px] font-bold text-blush-600 uppercase tracking-wider">
        {isBeatingFast ? 'Beating fast 💓' : 'My Heartbeat 💗'}
      </span>
    </div>
  );
}
