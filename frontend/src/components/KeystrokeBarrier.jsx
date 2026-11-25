'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Keyboard, Sparkles } from 'lucide-react';

const TARGET_WORDS = ['i', 'love', 'you', 'adarsh'];
const TARGET_COMPACT = TARGET_WORDS.join('');
const WORD_PILLS = ['I', 'LOVE', 'YOU', 'ADARSH'];

export default function KeystrokeBarrier({ onUnlock, updateCompanion }) {
  const [typedText, setTypedText] = useState('');
  const [matchLength, setMatchLength] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [tapMode, setTapMode] = useState(false);
  const [tappedWords, setTappedWords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    updateCompanion(
      '"I love you adarsh" type karo — space do ya na do, dono chalega! 👀💖',
      'shy'
    );
  }, []);

  useEffect(() => {
    let maxPrefixLen = 0;
    const cleanTyped = typedText.toLowerCase().replace(/\s+/g, '');

    for (let i = TARGET_COMPACT.length; i > 0; i--) {
      const prefix = TARGET_COMPACT.slice(0, i);
      if (cleanTyped.endsWith(prefix)) {
        maxPrefixLen = i;
        break;
      }
    }

    setMatchLength(maxPrefixLen);

    if (maxPrefixLen === TARGET_COMPACT.length && !isUnlocked) {
      triggerUnlock();
    }
  }, [typedText, isUnlocked]);

  const triggerUnlock = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setShowHearts(true);
    updateCompanion('Hehe padh liya maine! Dil khush ho gaya Bandrr ji... 🙈💖', 'love');
    inputRef.current?.blur();

    setTimeout(() => {
      onUnlock();
    }, 2200);
  };

  const handleWordTap = (word, index) => {
    if (isUnlocked) return;
    if (index === tappedWords.length) {
      const next = [...tappedWords, word];
      setTappedWords(next);
      setTypedText(next.join(' ').toLowerCase());
    } else if (index > tappedWords.length) {
      updateCompanion('Pehle order mein tap karo na Bandrr — ek ek word karke! 😜', 'teasing');
    }
  };

  let runningOffset = 0;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-3.5 pt-20 pb-44 sm:p-4 sm:py-20 relative z-10 overflow-hidden">
      {/* Burst particles on unlock */}
      <AnimatePresence>
        {showHearts && (
          <div className="fixed inset-0 pointer-events-none z-30">
            {Array.from({ length: 28 }).map((_, i) => {
              const angle = (i / 28) * Math.PI * 2;
              const distance = 110 + (i % 5) * 48;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 1.5, x, y, rotate: i * 25 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 text-2xl sm:text-3xl"
                >
                  {i % 2 === 0 ? '💖' : '🌸'}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl glass-strong p-5 sm:p-9 rounded-3xl border border-blush-200 text-center relative"
      >
        <div className="w-16 h-16 bg-blush-100 rounded-full flex items-center justify-center mb-5 shadow-inner mx-auto border border-blush-200">
          <Lock className="w-7 h-7 text-blush-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-blush-600 mb-3">
          Ek Chhota Sa Secret Gate 🛑
        </h2>

        <p className="text-gray-600 font-medium text-sm sm:text-base mb-5 leading-relaxed">
          Last screen par jaane ke liye type karo (space optional hai 😉):
          <br />
          <span className="inline-block mt-2.5 px-4 py-1.5 bg-blush-50 text-blush-600 font-bold rounded-xl border border-blush-200 font-mono tracking-wide">
            I love you adarsh
          </span>
        </p>

        {/* Letter Slots grouped by word so words never split mid-word on mobile */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2.5 max-w-md mx-auto mb-5">
          {TARGET_WORDS.map((word) => {
            const wordStart = runningOffset;
            runningOffset += word.length;
            return (
              <div key={`${word}-${wordStart}`} className="flex items-center gap-1 shrink-0">
                {word.split('').map((char, charIdx) => {
                  const globalIdx = wordStart + charIdx;
                  const isMatched = globalIdx < matchLength;
                  return (
                    <motion.div
                      key={globalIdx}
                      animate={isMatched ? { scale: [1, 1.18, 1] } : {}}
                      transition={{ duration: 0.25 }}
                      className={`w-7 h-9 sm:w-9 sm:h-11 flex items-center justify-center font-bold text-sm sm:text-lg rounded-xl border shadow-sm transition-colors ${
                        isMatched
                          ? 'border-blush-500 bg-blush-500 text-white'
                          : 'border-blush-100 bg-white text-gray-300'
                      }`}
                    >
                      {isMatched ? char.toUpperCase() : '?'}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Visible mobile-friendly input */}
        {!isUnlocked && (
          <div className="max-w-sm mx-auto mb-4">
            <input
              ref={inputRef}
              type="text"
              value={typedText}
              onChange={(e) => {
                if (!isUnlocked) setTypedText(e.target.value);
              }}
              aria-label="Type I love you adarsh"
              placeholder="Yahan type karo: I love you adarsh..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="done"
              className="w-full px-4 py-3 bg-white/90 border border-blush-200 rounded-2xl outline-none focus:border-blush-500 focus:ring-2 focus:ring-blush-200 transition-all font-medium text-base text-center text-gray-700 placeholder-gray-400"
            />
          </div>
        )}

        {/* Fallback Tap Mode for shy/quick tapping */}
        {!isUnlocked && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setTapMode((prev) => !prev)}
              className="text-xs font-semibold text-blush-500 hover:text-blush-600 inline-flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              {tapMode
                ? 'Tap mode chhupao'
                : 'Type nahi karna? 1-tap buttons use karo 🙈'}
            </button>

            <AnimatePresence>
              {tapMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3.5 flex flex-wrap justify-center gap-2 overflow-hidden"
                >
                  {WORD_PILLS.map((word, idx) => {
                    const done = idx < tappedWords.length;
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() => handleWordTap(word, idx)}
                        disabled={done}
                        className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                          done
                            ? 'bg-blush-500 text-white border-blush-500'
                            : 'bg-white text-blush-600 border-blush-200 hover:bg-blush-50'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {isUnlocked ? (
            <span className="text-blush-600 inline-flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4" /> Unlocked! Ab main sawaal aa raha hai 💖
            </span>
          ) : (
            <span>Box mein type karo ya 1-tap use karo ✨</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
