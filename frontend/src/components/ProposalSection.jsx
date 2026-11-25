'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5006';

const NO_LABELS = [
  'No 🙈',
  'Pakka? 🥺',
  'Bandrr pls 🐒',
  '12th exam se tough hai 😂',
  'No ka option hi nahi hai 😜',
  'Button nahi maan raha 😅',
];

const FUNNY_REMARKS = [
  'Arey! No kyun daba rahi ho Bandrr 🥺... lagta hai button khud bhaag gaya! 😅',
  'Kahan bhaag rahi ho Manshika ji? Yes wala button zyada cute hai 😉🌸',
  'Agar No dabaya toh 15 October ki birthday treat cancel kar dunga! 🎂😜',
  'Arey Bandrr, No pakadne ka competition chal raha hai kya? Yes daba do ab! 😂🐒',
  'Dekho button bhi chahta hai ki aap Yes bol do! 🙈💖',
  'Introvert log aise hi sharma ke No try karte hain kya? Hehe ab Yes daba do! 🥰',
];

export default function ProposalSection({
  responseId,
  loginName,
  quizAnswers,
  onResponseSaved,
  updateCompanion,
}) {
  const [noPosition, setNoPosition] = useState(null);
  const [noAttempts, setNoAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const noBtnRef = useRef(null);
  const lastDodgeRef = useRef(0);

  const handleNoDodge = () => {
    const now = Date.now();
    if (now - lastDodgeRef.current < 150) return;
    lastDodgeRef.current = now;

    const btnWidth = Math.min(noBtnRef.current?.offsetWidth || 190, window.innerWidth - 32);
    const btnHeight = noBtnRef.current?.offsetHeight || 48;
    const minX = 16;
    const maxX = Math.max(minX, window.innerWidth - btnWidth - 16);
    const minY = 80;
    const maxY = Math.max(minY, window.innerHeight - btnHeight - 190);

    const randomX = Math.floor(minX + Math.random() * (maxX - minX));
    const randomY = Math.floor(minY + Math.random() * (maxY - minY));

    setNoPosition({
      position: 'fixed',
      left: `${randomX}px`,
      top: `${randomY}px`,
      zIndex: 45,
      transition: 'left 0.22s cubic-bezier(0.22, 1, 0.36, 1), top 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
    });

    const next = noAttempts + 1;
    setNoAttempts(next);
    updateCompanion(FUNNY_REMARKS[next % FUNNY_REMARKS.length], 'teasing');
  };

  const handleYes = async () => {
    if (loading) return;
    setLoading(true);

    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
    });

    let savedId = responseId || null;
    try {
      const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/api/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: responseId,
          response: 'Yes',
          loginName,
          quizAnswers,
          noAttempts,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        savedId = json.data?._id || savedId;
      }
    } catch (err) {
      console.error('Failed to save response:', err);
    } finally {
      setLoading(false);
      updateCompanion('YAYYY! Official ho gaya!! Ab se main 100% aapka — aur coffee/momos pakka samjho 🥰🎉', 'love');
      onResponseSaved(savedId);
    }
  };

  const yesScale = Math.min(1.18, 1 + noAttempts * 0.04);
  const currentNoLabel = NO_LABELS[noAttempts % NO_LABELS.length];

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-3.5 pt-20 pb-44 sm:p-4 sm:py-20 relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg glass-strong p-5 sm:p-11 rounded-3xl border border-blush-200 text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-20 h-20 bg-blush-100 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto border border-blush-200"
        >
          <Heart className="w-11 h-11 text-blush-500 fill-blush-400" />
        </motion.div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-blush-600 mb-4 leading-tight">
          Ek Chhota Sa Sawaal, Manshika... 🥺🌸
        </h2>

        <p className="text-gray-700 font-semibold text-base sm:text-lg mb-3 leading-relaxed">
          Sirf 6 din hue hain, par aapse baat karke sach mein bahut accha lagta hai... Kya hum is pyaari si shuruwat ko official banayein?{' '}
          <span className="text-blush-600 font-bold">Will you be mine? 💖</span>
        </p>

        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-8">
          (Koi pressure nahi hai, har cheez aapke pace par hogi — bas neeche wala &lsquo;No&rsquo; button thoda ziddi hai 😉)
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[76px]">
          <motion.button
            type="button"
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale + 0.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            disabled={loading}
            className="w-44 py-4 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl anim-heart-pulse cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : 'YES! 💖'}
          </motion.button>

          <button
            ref={noBtnRef}
            type="button"
            onMouseEnter={handleNoDodge}
            onTouchStart={handleNoDodge}
            onClick={(e) => {
              e.preventDefault();
              handleNoDodge();
            }}
            style={noPosition || undefined}
            className={`relative px-5 py-3.5 font-bold text-sm rounded-2xl cursor-pointer max-w-[calc(100vw-32px)] text-center transition-colors ${
              noAttempts > 0
                ? 'bg-white/95 border-2 border-blush-400 text-gray-500 shadow-lg ring-4 ring-blush-200/80'
                : 'bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 shadow-sm'
            }`}
          >
            {noAttempts > 0 && (
              <>
                <motion.span
                  key={`ring-${noAttempts}`}
                  initial={{ scale: 0.92, opacity: 0.95 }}
                  animate={{ scale: 1.45, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-blush-400"
                />
                <motion.span
                  key={`spark-l-${noAttempts}`}
                  initial={{ scale: 0.4, opacity: 1, x: 0, y: 0 }}
                  animate={{ scale: 1.15, opacity: 0, x: -10, y: -12 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 -left-2 text-xs"
                >
                  ✨
                </motion.span>
                <motion.span
                  key={`spark-r-${noAttempts}`}
                  initial={{ scale: 0.4, opacity: 1, x: 0, y: 0 }}
                  animate={{ scale: 1.15, opacity: 0, x: 10, y: 12 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2 -right-2 text-xs"
                >
                  ✨
                </motion.span>
              </>
            )}
            <span className="relative z-10">{currentNoLabel}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
