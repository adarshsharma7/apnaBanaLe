'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartPhoto, {
  ADARSH_TRANSITION_PHOTOS,
  MANSHIKA_TRANSITION_PHOTOS,
} from './SmartPhoto';

const STAGE_CAPTIONS = {
  STORY: 'Chalo humari chhoti si kahani padhte hain... 🌸',
  VIBE_CHECK: 'Ab ek chhota sa cute vibe check... 😉✨',
  KEYSTROKE_LOCK: 'Bas ek chhota sa secret gate... 🔐💖',
  PROPOSAL: 'Ab dil ki sabse zaroori baat... 🥺🤍',
  SUCCESS: 'Hamesha ke liye saath... 💖🎉',
};

const SPARKLES = [
  { x: -115, y: -55, emoji: '🌸', delay: 0.14 },
  { x: 115, y: -55, emoji: '✨', delay: 0.18 },
  { x: -125, y: 25, emoji: '💖', delay: 0.22 },
  { x: 125, y: 25, emoji: '🤍', delay: 0.2 },
  { x: -70, y: -95, emoji: '✨', delay: 0.26 },
  { x: 70, y: -95, emoji: '🌸', delay: 0.24 },
  { x: -75, y: 75, emoji: '🤍', delay: 0.28 },
  { x: 75, y: 75, emoji: '💖', delay: 0.25 },
];

export default function StageTransition({ targetStage }) {
  const caption = targetStage ? STAGE_CAPTIONS[targetStage] || 'Aage chalte hain... ✨' : '';

  return (
    <AnimatePresence>
      {targetStage && (
        <motion.div
          key={targetStage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          aria-hidden="true"
          className="fixed inset-0 z-[70] pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff5f7]/95 via-[#ffe4ea]/95 to-[#f3e8ff]/95 backdrop-blur-md px-4"
        >
          {/* Radial sparkles & petals */}
          <div className="relative flex items-center justify-center">
            {SPARKLES.map((item, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0.85], scale: [0.4, 1.15, 1], x: item.x, y: item.y }}
                exit={{ opacity: 0, scale: 0.5, y: item.y - 30 }}
                transition={{ duration: 0.65, delay: item.delay, ease: 'easeOut' }}
                className="absolute text-xl sm:text-2xl select-none"
              >
                {item.emoji}
              </motion.span>
            ))}

            {/* Couple medallions gliding together from left & right */}
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ x: -95, y: 18, rotate: -14, scale: 0.72, opacity: 0 }}
                animate={{ x: 6, y: 0, rotate: -4, scale: 1, opacity: 1 }}
                exit={{ y: -36, scale: 1.06, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-white shadow-2xl bg-blush-100 relative z-10"
              >
                <SmartPhoto
                  sources={ADARSH_TRANSITION_PHOTOS}
                  alt="Adarsh"
                  className="object-cover object-[50%_35%] scale-[1.45] origin-[50%_26%]"
                  fallbackEmoji="😎"
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                exit={{ scale: 0.5, y: -36, opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: 'easeOut' }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-blush-200 shadow-xl flex items-center justify-center relative z-20 -mx-3"
              >
                <span className="text-xl sm:text-2xl">💖</span>
              </motion.div>

              <motion.div
                initial={{ x: 95, y: 18, rotate: 14, scale: 0.72, opacity: 0 }}
                animate={{ x: -6, y: 0, rotate: 4, scale: 1, opacity: 1 }}
                exit={{ y: -36, scale: 1.06, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[3px] border-white shadow-2xl bg-blush-100 relative z-10"
              >
                <SmartPhoto
                  sources={MANSHIKA_TRANSITION_PHOTOS}
                  alt="Manshika"
                  className="object-cover object-[49%_16%] scale-[1.45] origin-[49%_22%]"
                  fallbackEmoji="🌸"
                />
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mt-7 text-base sm:text-xl font-bold font-serif text-blush-600 text-center max-w-sm"
          >
            {caption}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
