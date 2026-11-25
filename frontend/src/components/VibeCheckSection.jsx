'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

const QUESTIONS = [
  {
    key: 'chatVibe',
    badge: 'Q1 • Fri 20 Nov • 10:10 Se Aaj Tak',
    question: '20 November (10:10 wale reply) ke baad humari Instagram chats kaisi lag rahi hain?',
    options: [
      {
        label: 'Bahut cute & comfortable 🌸',
        reply: 'Arey wah! Comfortable feel hona hi sabse important hai 🌸🤍',
        mood: 'love',
      },
      {
        label: 'Thoda aur talk karne ka mann karta hai 😉',
        reply: 'Haha same here! Instagram notification aate hi smile aa jaati hai 😉✨',
        mood: 'excited',
      },
      {
        label: 'Haan theek hai... (introvert mode ON) 🤫',
        reply: 'Hehe introvert mode bhi cute lagta hai tumhara, Bandrr! 🤫🐒',
        mood: 'teasing',
      },
    ],
  },
  {
    key: 'firstDate',
    badge: 'Q2 • Introvert-Approved Plan',
    question: 'Chat se aage badhne ka pehla step kaunsa best rahega? (Introvert-approved!)',
    options: [
      {
        label: 'Pehle chhoti si Voice Note / Call 🎧',
        reply: 'Haan yaar! Abhi tak aawaz bhi nahi suni hai — pehli baar sunne ka wait rahega 🎧✨',
        mood: 'love',
      },
      {
        label: 'Peaceful Coffee / Chai + Pehli Mulakat ☕',
        reply: 'Perfect! 12th ki padhai se ek study-break coffee aur pehli real mulakat ☕✨',
        mood: 'cute',
      },
      {
        label: 'Momos + Shaam Ki Walk 🥟',
        reply: 'Momos aur shaam ki walk — plus unlimited lame jokes free! unbeatable combo 🥟😂',
        mood: 'excited',
      },
      {
        label: 'Tum choose karo Adarsh 🙈',
        reply: 'Done! Fir toh ekdum chill & introvert-friendly step main hi plan karunga 🙈💖',
        mood: 'shy',
      },
    ],
  },
];

export default function VibeCheckSection({ onComplete, updateCompanion }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    updateCompanion('Chhota sa 2-question game! Bas jo dil kare wo tap kar do 🌸', 'cute');
  }, []);

  const current = QUESTIONS[step];

  const handleSelect = (opt) => {
    if (selectedOption) return;
    setSelectedOption(opt.label);
    const updated = { ...answers, [current.key]: opt.label };
    setAnswers(updated);
    updateCompanion(opt.reply, opt.mood);

    setTimeout(() => {
      setSelectedOption(null);
      if (step + 1 < QUESTIONS.length) {
        setStep((prev) => prev + 1);
      } else {
        onComplete(updated);
      }
    }, 900);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-3.5 pt-20 pb-44 sm:p-4 sm:py-20 relative z-10">
      <div className="w-full max-w-lg">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blush-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Cute Vibe Check
          </span>
          <span className="text-xs font-bold text-gray-500">
            {step + 1} / {QUESTIONS.length}
          </span>
        </div>

        <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden mb-5 border border-blush-100">
          <motion.div
            animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.35 }}
            className="h-full bg-gradient-to-r from-blush-400 to-blush-600 rounded-full"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="glass-strong p-5 sm:p-8 rounded-3xl border border-blush-200"
          >
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blush-600 bg-blush-50 px-3 py-1 rounded-full border border-blush-200 mb-3">
              {current.badge}
            </span>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-800 mb-6 leading-snug">
              {current.question}
            </h2>

            <div className="space-y-3">
              {current.options.map((opt) => {
                const isPicked = selectedOption === opt.label;
                return (
                  <motion.button
                    key={opt.label}
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelect(opt)}
                    disabled={Boolean(selectedOption)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border font-semibold text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isPicked
                        ? 'bg-gradient-to-r from-blush-500 to-blush-600 text-white border-blush-500 shadow-md'
                        : 'bg-white/85 text-gray-700 border-blush-100 hover:border-blush-300 hover:bg-blush-50/50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isPicked && <Check className="w-4 h-4 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
