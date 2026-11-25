'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Sparkles, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

import FloatingAmbient from '../components/FloatingAmbient';
import HeartbeatWidget from '../components/HeartbeatWidget';
import CompanionBubble from '../components/CompanionBubble';
import LoginScreen from '../components/LoginScreen';
import StorySection from '../components/StorySection';
import VibeCheckSection from '../components/VibeCheckSection';
import KeystrokeBarrier from '../components/KeystrokeBarrier';
import ProposalSection from '../components/ProposalSection';
import LetterSection from '../components/LetterSection';
import { useBGM } from '../context/BGMContext';

const STAGES = ['LOGIN', 'STORY', 'VIBE_CHECK', 'KEYSTROKE_LOCK', 'PROPOSAL', 'SUCCESS'];
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5006';

export default function Home() {
  const [screenState, setScreenState] = useState('LOGIN');
  const [loginName, setLoginName] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [responseId, setResponseId] = useState(null);
  const [showLetter, setShowLetter] = useState(false);
  const [letterSent, setLetterSent] = useState(false);
  const [ambientPaused, setAmbientPaused] = useState(false);
  const [companionState, setCompanionState] = useState({
    text: 'Arey Manshika ji! Aaiye aaiye... hint dhyan se dekhna aur sahi jaanwar chuno! 😉🌸',
    mood: 'cute',
  });

  const { isMuted, toggleMute: toggleBGM } = useBGM();

  const updateCompanion = useCallback((text, mood = 'cute') => {
    setCompanionState({ text, mood });
  }, []);

  useEffect(() => {
    if (screenState !== 'SUCCESS') return;

    const timer = setTimeout(() => {
      setShowLetter(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [screenState]);

  const handleMusicToggle = () => {
    toggleBGM();
    updateCompanion(
      isMuted
        ? 'Music on ho gaya! Ab thoda soft romantic vibe ban rahi hai... 🎶✨'
        : 'Music pause kar diya! Jab mann kare wapas on kar lena 🎧',
      isMuted ? 'love' : 'cute'
    );
  };

  const fireCelebration = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.65 },
    });
  };

  const currentStageIndex = STAGES.indexOf(screenState);

  return (
    <main className="flex-1 flex flex-col min-h-[100dvh] relative overflow-hidden">
      <FloatingAmbient isPaused={ambientPaused} />

      {/* Top HUD */}
      <header className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex items-center justify-between pointer-events-none">
        {/* Left: Ambient pause toggle (accessibility control) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAmbientPaused((p) => !p)}
            aria-label={ambientPaused ? 'Play background petals' : 'Pause background petals'}
            title={ambientPaused ? 'Play background animation' : 'Pause background animation'}
            className="glass px-2.5 sm:px-3 py-2 rounded-full border border-blush-200 text-blush-600 hover:bg-white/85 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            {ambientPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{ambientPaused ? 'Play BG' : 'Pause BG'}</span>
          </button>
        </div>

        {/* Center: Subtle 6-dot progress */}
        <div
          aria-label={`Step ${currentStageIndex + 1} of ${STAGES.length}`}
          className="glass px-2.5 sm:px-3 py-1.5 rounded-full border border-blush-200 flex items-center gap-1 sm:gap-1.5"
        >
          {STAGES.map((stage, idx) => (
            <span
              key={stage}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                idx === currentStageIndex
                  ? 'w-4 sm:w-5 bg-blush-500'
                  : idx < currentStageIndex
                  ? 'w-1.5 sm:w-2 bg-blush-300'
                  : 'w-1.5 sm:w-2 bg-blush-100'
              }`}
            />
          ))}
        </div>

        {/* Right: Heartbeat + Vinyl Music Toggle */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <HeartbeatWidget isBeatingFast={['PROPOSAL', 'SUCCESS'].includes(screenState)} />

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleMusicToggle}
            aria-label={isMuted ? 'Play background music' : 'Mute background music'}
            className={`px-3.5 py-2 rounded-full flex items-center gap-2 shadow-md border cursor-pointer transition-all text-xs font-bold ${
              isMuted
                ? 'bg-white/85 border-blush-200 text-gray-500 hover:text-blush-600'
                : 'bg-gradient-to-r from-blush-500 to-blush-600 border-blush-500 text-white'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Music Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
                  <span className="w-0.5 h-3 bg-white rounded-full anim-eq-bar" />
                  <span
                    className="w-0.5 h-2 bg-white rounded-full anim-eq-bar"
                    style={{ animationDelay: '0.25s' }}
                  />
                  <span
                    className="w-0.5 h-3 bg-white rounded-full anim-eq-bar"
                    style={{ animationDelay: '0.45s' }}
                  />
                </span>
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* Live Companion Bubble */}
      <CompanionBubble
        message={companionState.text}
        mood={companionState.mood}
        onPoke={(msg) => updateCompanion(msg, 'teasing')}
      />

      {/* Screen Router */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {screenState === 'LOGIN' && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <LoginScreen
                onLoginSuccess={(name) => {
                  setLoginName(name || '');
                  setScreenState('STORY');
                }}
                updateCompanion={updateCompanion}
              />
            </motion.div>
          )}

          {screenState === 'STORY' && (
            <motion.div
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <StorySection
                onProceed={() => setScreenState('VIBE_CHECK')}
                updateCompanion={updateCompanion}
              />
            </motion.div>
          )}

          {screenState === 'VIBE_CHECK' && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <VibeCheckSection
                onComplete={async (answers) => {
                  setQuizAnswers(answers);
                  setScreenState('KEYSTROKE_LOCK');
                  try {
                    const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/api/response`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: responseId,
                        response: 'Pending',
                        loginName,
                        quizAnswers: answers,
                        noAttempts: 0,
                      }),
                    });
                    if (res.ok) {
                      const json = await res.json();
                      if (json.data?._id) {
                        setResponseId(json.data._id);
                      }
                    }
                  } catch (err) {
                    console.error('Failed to pre-save quiz answers:', err);
                  }
                }}
                updateCompanion={updateCompanion}
              />
            </motion.div>
          )}

          {screenState === 'KEYSTROKE_LOCK' && (
            <motion.div
              key="keystroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <KeystrokeBarrier
                onUnlock={() => setScreenState('PROPOSAL')}
                updateCompanion={updateCompanion}
              />
            </motion.div>
          )}

          {screenState === 'PROPOSAL' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ProposalSection
                responseId={responseId}
                loginName={loginName}
                quizAnswers={quizAnswers}
                onResponseSaved={(id) => {
                  if (id) setResponseId(id);
                  setScreenState('SUCCESS');
                }}
                updateCompanion={updateCompanion}
              />
            </motion.div>
          )}

          {screenState === 'SUCCESS' && (
            <div className="max-w-5xl w-full mx-auto px-3.5 pt-20 pb-44 sm:px-4 sm:py-24 relative z-10 flex items-center justify-center min-h-[100dvh]">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-7 w-full">
                {/* Left Celebration Card */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className={`w-full ${
                    showLetter ? 'lg:w-1/2' : 'max-w-xl'
                  } glass-strong p-5 sm:p-9 rounded-3xl border border-blush-200 text-center relative overflow-hidden`}
                >
                  <div className="w-20 h-20 bg-blush-100 rounded-full flex items-center justify-center mb-4 shadow-inner mx-auto border border-blush-200">
                    <span className="text-4xl">🌸</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black font-serif text-blush-600 mb-3">
                    Yay! Official Ho Gaya! 😍🎉
                  </h1>

                  <p className="text-gray-700 font-semibold text-base leading-relaxed">
                    Friday 20 November ke pehle Instagram message se lekar aaj tak — bina mile aur bina aawaz sune hi yeh 5 din mere liye bahut special ban gaye, <strong>Manshika ji (Bandrr 🐒)</strong>!
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blush-50/90 to-white/90 border border-blush-200 text-left space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blush-500">
                      Ek Chhota Sa Wada 🤍
                    </p>
                    <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                      Ab se aapka khayal rakhna meri zimmedari hai — aur har sahi aur galat waqt mein aapka saath dena bhi meri hi zimmedari hai. Hamesha sirf aapke saath hu, Manshika! 🌸
                    </p>
                  </div>

                  {quizAnswers.firstDate && (
                    <div className="mt-5 p-4 rounded-2xl bg-blush-50/90 border border-blush-200 text-left">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blush-500 mb-1">
                        Next Step Locked ✨
                      </p>
                      <p className="text-sm font-bold text-gray-800">{quizAnswers.firstDate}</p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={fireCelebration}
                      className="px-4 py-2 rounded-xl bg-blush-50 hover:bg-blush-100 text-blush-600 font-bold text-xs border border-blush-200 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Celebrate Again 🎉
                    </button>
                    <Heart className="w-6 h-6 text-blush-500 fill-blush-500 anim-heart-pulse" />
                  </div>
                </motion.div>

                {/* Right Card: Optional Note */}
                <AnimatePresence>
                  {showLetter && (
                    <motion.div
                      initial={{ opacity: 0, x: 36, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 36, scale: 0.96 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="w-full lg:w-1/2"
                    >
                      {letterSent ? (
                        <div className="glass-strong p-8 rounded-3xl border border-blush-200 text-center flex flex-col items-center justify-center min-h-[300px]">
                          <span className="text-5xl mb-3">💌</span>
                          <h3 className="text-2xl font-bold font-serif text-blush-600 mb-2">
                            Done &amp; Saved! 💖
                          </h3>
                          <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed max-w-sm">
                            {letterSent && 'Chalo ab aaram se Instagram par milte hain, Manshika ji! Ekdum happy wala din bana diya aapne aaj! 🥰✨'}
                          </p>
                        </div>
                      ) : (
                        <LetterSection
                          responseId={responseId}
                          loginName={loginName}
                          quizAnswers={quizAnswers}
                          onMessageSent={() => setLetterSent(true)}
                          updateCompanion={updateCompanion}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
