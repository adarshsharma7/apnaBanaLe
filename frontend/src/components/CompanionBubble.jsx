'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATAR_SOURCES = [
  '/images/adarsh.jpeg',
  '/images/adarsh.jpg',
  '/images/adarsh.png',
  '/images/adarsh.webp',
];

const MOOD_EMOJI = {
  cute: '🥰',
  teasing: '😜',
  shy: '🙈',
  excited: '🤩',
  love: '💖',
};

const POKE_REPLIES = [
  'Oye Bandrr, ungli kyun kar rahi ho! 🐒😜',
  '12th ki padhai se break leke mujhe poke karne aayi ho kya? 😂📚',
  'Haanji Manshika ji, bolo kya hua? 🥰',
  'Itna tap karogi toh main sharma jaunga... 🙈✨',
  '15 October wale birthday gift mein se ek chocolate kaat lunga agar aur tang kiya! 🍫😜',
  'Yashika ko complain kar dunga agar zyada tang kiya toh! 😂',
];

export default function CompanionBubble({ message, mood = 'cute', onPoke }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleMessage, setVisibleMessage] = useState(message);
  const [pokeIndex, setPokeIndex] = useState(0);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [showEmoji, setShowEmoji] = useState(true);

  const imgRef = useRef(null);
  const emojiTimerRef = useRef(null);

  const triggerReactionEmoji = () => {
    setShowEmoji(true);
    if (emojiTimerRef.current) clearTimeout(emojiTimerRef.current);
    emojiTimerRef.current = setTimeout(() => {
      setShowEmoji(false);
    }, 2200);
  };

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setPhotoLoaded(true);
    }
    return () => {
      if (emojiTimerRef.current) clearTimeout(emojiTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    setIsOpen(true);
    setIsTyping(true);
    triggerReactionEmoji();

    const timer = setTimeout(() => {
      setVisibleMessage(message);
      setIsTyping(false);
    }, 320);

    let autoCollapseTimer = null;
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      autoCollapseTimer = setTimeout(() => {
        setIsOpen(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timer);
      if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
    };
  }, [message, mood]);

  const handleAvatarClick = () => {
    triggerReactionEmoji();
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    const nextMsg = POKE_REPLIES[pokeIndex % POKE_REPLIES.length];
    setPokeIndex((prev) => prev + 1);
    if (onPoke) {
      onPoke(nextMsg);
    } else {
      setVisibleMessage(nextMsg);
    }
  };

  const currentAvatarSrc = avatarIdx < AVATAR_SOURCES.length ? AVATAR_SOURCES[avatarIdx] : null;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none max-w-[calc(100vw-24px)] sm:max-w-sm">
      <AnimatePresence mode="wait">
        {isOpen && (isTyping || visibleMessage) && (
          <motion.div
            key={isTyping ? 'typing' : visibleMessage}
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-2 sm:mb-3 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white/95 backdrop-blur-md text-gray-700 rounded-2xl shadow-xl border border-blush-200 relative pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blush-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Adarsh • live
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize companion message"
                className="text-sm text-gray-400 hover:text-blush-500 font-bold leading-none cursor-pointer p-1 -mr-1 -mt-0.5"
              >
                ×
              </button>
            </div>

            {isTyping ? (
              <div className="flex items-center gap-1.5 py-1 px-1" aria-label="Adarsh is typing">
                <span className="w-2 h-2 rounded-full bg-blush-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blush-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-2 h-2 rounded-full bg-blush-400 animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-700">{visibleMessage}</p>
            )}

            <div className="absolute -bottom-1.5 right-5 sm:right-6 w-3 h-3 bg-white border-r border-b border-blush-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleAvatarClick}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ y: { repeat: Infinity, duration: 3.6, ease: 'easeInOut' } }}
        aria-label="Adarsh companion avatar"
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blush-400 to-blush-600 shadow-lg border-2 border-white flex items-center justify-center pointer-events-auto cursor-pointer relative"
      >
        <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center">
          {currentAvatarSrc && (
            <img
              ref={imgRef}
              src={currentAvatarSrc}
              alt="Adarsh"
              onLoad={() => setPhotoLoaded(true)}
              onError={() => {
                setPhotoLoaded(false);
                setAvatarIdx((prev) => prev + 1);
              }}
              className="w-full h-full object-cover object-[50%_30%]"
            />
          )}

          <AnimatePresence>
            {(!photoLoaded || showEmoji) && (
              <motion.span
                key={`emoji-${mood}`}
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.65 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-gradient-to-tr from-blush-400 to-blush-600 flex items-center justify-center text-xl sm:text-[28px]"
              >
                {MOOD_EMOJI[mood] || '🥰'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blush-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
        </span>
      </motion.button>
    </div>
  );
}
