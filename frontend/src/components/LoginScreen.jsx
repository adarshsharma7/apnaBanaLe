'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, HelpCircle } from 'lucide-react';
import { useBGM } from '../context/BGMContext';

const NICKNAMES = [
  { id: 'bandrr', emoji: '🐒', label: 'Bandrr' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'billi', emoji: '🐱', label: 'Billi' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin' },
  { id: 'magarmach', emoji: '🐊', label: 'Magarmach' },
  { id: 'bhaalu', emoji: '🐻', label: 'Bhaalu' },
  { id: 'battak', emoji: '🦆', label: 'Battak' },
  { id: 'tota', emoji: '🦜', label: 'Tota' },
];

const NICKNAME_REPLIES = {
  bandrr: {
    text: 'Bingo! Asli Bandrr pakdi gayi! 🐒💖 Ab naam aur chhota sa riddle fill karke andar aao...',
    mood: 'excited',
  },
  panda: {
    text: 'Panda cute hota hai aur sota rehta hai, par mera nickname kuch aur hai! 🐼😜',
    mood: 'teasing',
  },
  billi: {
    text: 'Meow nahi yaar, thoda shararati wala jaanwar chuno! 🐱😂',
    mood: 'teasing',
  },
  penguin: {
    text: 'Penguin toh waddle karta hai, tum toh seedha dil me entry maar rahi ho... par ye nahi hai! 🐧✨',
    mood: 'cute',
  },
  magarmach: {
    text: 'Oye, tum itni shaant aur acchi ho, magarmach bilkul nahi! 🐊😅',
    mood: 'cute',
  },
  bhaalu: {
    text: 'Bhaalu nahi ji! Jo ped pe uchhalta rehta hai wo socho... 🐻🐒',
    mood: 'teasing',
  },
  battak: {
    text: 'Quack-quack! Cute try hai par yeh wala nickname nahi hai! 🦆😆',
    mood: 'teasing',
  },
  tota: {
    text: 'Tota toh bahut bolta hai, tum toh thodi introvert ho... dusra check karo! 🦜🤫',
    mood: 'shy',
  },
};

const VALID_USERS = [
  'manshika',
  'manshika sharma',
  'manshika ji',
  'manshikaji',
  'manshikasharma',
  'riya',
  'riya sharma',
  'riyasharma',
  'riya ji',
  'riyaji',
  'bandar',
  'bandarr',
  'bandr',
  'bandrr',
  'manku',
  'manshi',
];

const VALID_PASSWORDS = [
  'instagram20',
  'instagram20nov',
  'instagram20november',
  'insta20',
  'insta20nov',
  'insta20november',
  'ig20',
  'ig20nov',
  '20instagram',
  '20insta',
  '20nov',
  '20november',
  '20',
];

export default function LoginScreen({ onLoginSuccess, updateCompanion }) {
  const { playBGM } = useBGM();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedNickname, setSelectedNickname] = useState(null);
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [showRiddle, setShowRiddle] = useState(false);

  const triggerError = (msg, companionMsg, mood = 'teasing') => {
    setError(msg);
    setShakeKey((k) => k + 1);
    if (companionMsg) {
      updateCompanion(companionMsg, mood);
    }
  };

  const handleNicknameSelect = (id) => {
    setSelectedNickname(id);
    setError('');
    const reply = NICKNAME_REPLIES[id];
    if (reply) {
      updateCompanion(reply.text, reply.mood);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playBGM();

    const cleanUser = username.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanPass = password.trim().toLowerCase().replace(/\s+/g, '');

    if (!selectedNickname) {
      triggerError(
        'Pehle upar se choose toh karo ki main tumhe kya bulata hu! 😜',
        'Arey pehle apna cute animal nickname toh select karo, Bandrr ji! 🐒'
      );
      return;
    }

    if (selectedNickname !== 'bandrr') {
      triggerError(
        'Yeh galat nickname hai! Asli wala jaanwar chuno... 🙈',
        'Hint: Kela khane wala shararati jaanwar! 🍌🐒',
        'teasing'
      );
      return;
    }

    if (!VALID_USERS.includes(cleanUser)) {
      triggerError(
        'Naam check karo — "Manshika", "Riya" ya apna cute nickname likho 🌸',
        'Apna pyaara sa naam toh sahi likho pehle! 🥺',
        'cute'
      );
      return;
    }

    if (!VALID_PASSWORDS.includes(cleanPass)) {
      triggerError(
        'Riddle thoda miss ho gaya! "Hint Chahiye?" par click karke dekho 😉',
        'Arey simple hai — jis app par humari pehli baat hui thi + us din ki date! Thoda yaad karo Bandrr ji 😅💬',
        'shy'
      );
      return;
    }

    setError('');
    updateCompanion(
      'Yay! Swagat hai Manshika ji... ab aaram se bina kisi tension ke aage padhna 🌸✨',
      'love'
    );
    onLoginSuccess(username.trim());
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-3.5 pt-20 pb-44 sm:p-4 sm:py-20 relative z-10">
      <motion.div
        key={shakeKey}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={
          shakeKey > 0
            ? { opacity: 1, y: 0, scale: 1, x: [0, -8, 8, -6, 6, 0] }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-lg glass-strong p-5 sm:p-8 rounded-3xl border border-blush-200 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 bg-blush-100 rounded-full flex items-center justify-center mb-3 border border-blush-200 shadow-inner">
            <Sparkles className="w-7 h-7 text-blush-500" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-blush-500 bg-blush-50 px-3 py-1 rounded-full border border-blush-200 mb-2">
            20 Nov Special ✨
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-blush-600">
            Only For Manshika Ji 🌸
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-sm">
            Chhota sa fun security check — confirm karna padega ki asli Bandrr hi aayi hain! 🙈
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* 8-Animal Nickname Grid */}
          <div className="p-3 sm:p-4 bg-blush-50/70 rounded-2xl border border-blush-100">
            <p className="text-xs sm:text-sm font-bold text-blush-600 mb-3 text-center">
              Step 1: Main tumhe pyaar se kya bulata hu? 😜👇
            </p>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {NICKNAMES.map((nn) => {
                const isSelected = selectedNickname === nn.id;
                return (
                  <motion.button
                    key={nn.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleNicknameSelect(nn.id)}
                    aria-pressed={isSelected}
                    className={`py-2.5 px-1 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blush-500 border-blush-500 text-white shadow-md'
                        : 'bg-white/90 border-blush-100 text-gray-600 hover:border-blush-300'
                    }`}
                  >
                    <span className="text-xl leading-none">{nn.emoji}</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold truncate w-full text-center">
                      {nn.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="manshika-name" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Step 2: Aapka Shubh Naam? 🌸
            </label>
            <input
              id="manshika-name"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Manshika Sharma..."
              aria-invalid={Boolean(error)}
              className="w-full px-4 py-3 bg-white/85 border border-blush-200 rounded-2xl outline-none focus:border-blush-500 focus:ring-2 focus:ring-blush-200 transition-all font-medium text-base placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Secret Riddle Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label htmlFor="secret-riddle" className="text-sm font-semibold text-gray-700">
                Step 3: Secret Passcode 🔒
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowRiddle((prev) => !prev);
                  updateCompanion(
                    'Hint khul gaya! Socho kahan sabse pehle baat shuru hui thi aur us din kya tareekh thi 😉💬',
                    'shy'
                  );
                }}
                className="text-xs text-blush-600 hover:text-blush-500 font-bold flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Hint Chahiye?
              </button>
            </div>

            <AnimatePresence>
              {showRiddle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2.5 overflow-hidden"
                >
                  <div className="p-3 bg-blush-50 rounded-xl text-xs text-blush-600 border border-blush-200 font-medium leading-relaxed">
                    💡 <strong>Hint:</strong> Jis app par humne sabse pehle baat ki thi + us din ki date number (format example: <code className="bg-white px-1.5 py-0.5 rounded font-bold">app12</code>)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              id="secret-riddle"
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Answer yahan likho..."
              aria-invalid={Boolean(error)}
              className="w-full px-4 py-3 bg-white/85 border border-blush-200 rounded-2xl outline-none focus:border-blush-500 focus:ring-2 focus:ring-blush-200 transition-all font-medium text-base placeholder-gray-400 text-gray-700"
            />
          </div>

          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-blush-600 bg-blush-50 border border-blush-200 rounded-xl px-3 py-2 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" /> Chalo Andar Chalein ✨
          </button>
        </form>
      </motion.div>
    </div>
  );
}
