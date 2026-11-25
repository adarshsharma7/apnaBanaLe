'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import SmartPhoto, {
  ADARSH_POLAROID_PHOTOS,
  MANSHIKA_POLAROID_PHOTOS,
} from './SmartPhoto';

const REVEAL_HEARTS = [
  { emoji: '💖', x: -165, y: -155, rotate: -22, delay: 0.04, duration: 1.9 },
  { emoji: '🌸', x: 165, y: -150, rotate: 24, delay: 0.08, duration: 2.0 },
  { emoji: '💕', x: -120, y: -195, rotate: -14, delay: 0.12, duration: 2.1 },
  { emoji: '✨', x: 120, y: -190, rotate: 18, delay: 0.1, duration: 1.85 },
  { emoji: '🤍', x: -195, y: -65, rotate: -28, delay: 0.15, duration: 2.2 },
  { emoji: '🦋', x: 195, y: -70, rotate: 20, delay: 0.16, duration: 2.15 },
  { emoji: '💖', x: -45, y: -215, rotate: -10, delay: 0.06, duration: 2.25 },
  { emoji: '🌸', x: 45, y: -210, rotate: 12, delay: 0.09, duration: 2.2 },
  { emoji: '💕', x: -155, y: 75, rotate: -18, delay: 0.18, duration: 2.0 },
  { emoji: '✨', x: 155, y: 70, rotate: 22, delay: 0.17, duration: 2.05 },
  { emoji: '🤍', x: -85, y: -135, rotate: -16, delay: 0.22, duration: 2.3 },
  { emoji: '💖', x: 85, y: -135, rotate: 16, delay: 0.2, duration: 2.3 },
  { emoji: '🌸', x: -20, y: -165, rotate: -8, delay: 0.24, duration: 2.35 },
  { emoji: '✨', x: 25, y: -170, rotate: 10, delay: 0.26, duration: 2.35 },
];

function FadeInCard({ children, onVisible, borderClass = 'bg-blush-400' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px -80px 0px' });

  useEffect(() => {
    if (isInView && onVisible) {
      onVisible();
    }
  }, [isInView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="glass-strong p-5 sm:p-9 rounded-3xl border border-blush-200 max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${borderClass}`} />
      {children}
    </motion.section>
  );
}

const TRAIT_CARDS = [
  {
    id: 'introvert',
    frontEmoji: '🤫',
    title: 'Thodi Introvert (Silent Mode)',
    subtitle: 'Tap to reveal ✨',
    backText:
      'Zyada shor-sharaba nahi, apne hi quiet world mein rehti ho — par Instagram chats mein hi samajh aa gaya ki aapka calm aur genuine nature sabse pyaara hai. Zero pressure, hamesha aapke pace par!',
    companion: 'Introvert log sabse genuine hote hain — aur aap toh uski best example ho 🤫🤍',
  },
  {
    id: 'heart',
    frontEmoji: '🤍',
    title: 'Dil Ki Bahut Acchi',
    subtitle: 'Tap to reveal ✨',
    backText:
      'Aajkal log bas dikhawa karte hain, par 6 din ki chats mein hi samajh aa gaya ki aapka dil kitna saaf aur caring hai. Itni simplicity aur warmth aajkal bahut kam logon mein milti hai yaar.',
    companion: 'Sach me yaar, itne saaf dil wale log aajkal kahan milte hain 🤍✨',
  },
  {
    id: 'sundar',
    frontEmoji: '🐒',
    title: 'Bahut Sundar (+ Certified Bandrr)',
    subtitle: 'Tap to reveal ✨',
    backText:
      'Abhi toh sirf photo mein dekha hai, par sach mein aap bahut zyada sundar ho! Real mein milenge aur aawaz sunenge toh pata nahi kya hoga — par harkatein aur vibe full Bandrr wali hain, toh yeh title permanent hai 🐒😜',
    companion: 'Blush mat karna ab... photo mein hi itni cute ho Bandrr ji! 🙈💖',
  },
  {
    id: 'oct15',
    frontEmoji: '🎂',
    title: '15 October VIP + 12th Star',
    subtitle: 'Tap to reveal ✨',
    backText:
      'Calendar mein 15 October ko pehle hi "Official Bandrr Day" mark kar diya hai — next birthday par cake aur treat pending samjho! Aur 12th class ki padhai mein full cheerleader banne ke liye bhi main ready hu 📚✨',
    companion: '15 October VIP date lock ho gayi hai, aur 12th class mein full support bhi! 🎂📚',
  },
];

const TERMS_CLAUSES = [
  {
    emoji: '👑',
    featured: true,
    title: 'Maalkin Supremacy Clause (Rule #1)',
    desc: 'Aakhir aap meri Maalkin ho — toh aapka har hukum sir-aankhon par! Aapki saari baatein bina behas maanna mera param kartavya hai (bas thoda sa chhedne ka haq hamesha rakhunga 😂🙇‍♂️).',
  },
  {
    emoji: '📚',
    title: '12th Boards Priority Clause',
    desc: 'Padhai aur 12th class ke boards hamesha first priority — par study breaks mein hassane aur stress bhagane ki 100% guarantee meri (lame jokes & Bandrr teasing 24×7 free).',
  },
  {
    emoji: '🎂',
    title: '15 October VIP Clause',
    desc: '15 October ko officially calendar mein lock kar diya hai — agle birthday par special wish, cake aur cute surprise meri taraf se pakka!',
  },
  {
    emoji: '🤫',
    title: 'Introvert Comfort Clause',
    desc: 'Jab mann kare silent/introvert mode ON rakh sakti ho — zero pressure, poora patience, aur hamesha aapke comfort par.',
  },
  {
    emoji: '😄',
    title: 'Daily Smile Clause',
    desc: 'Din kaisa bhi gaya ho, aapke chehre par ek badi si smile laane ki koshish hamesha rahegi — chahe uske liye mujhe khud ka mazaak kyun na banana pade!',
  },
];

export default function StorySection({ onProceed, updateCompanion }) {
  const [revealedIds, setRevealedIds] = useState([]);
  const [wahWahDone, setWahWahDone] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);

  const handleFlip = (card) => {
    setRevealedIds((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
    updateCompanion(card.companion, 'love');
  };

  return (
    <div className="min-h-screen pt-10 pb-36 sm:pb-24 px-3.5 sm:px-4 relative z-10">
      {/* Hero */}
      <div className="min-h-[78dvh] pt-16 sm:pt-12 flex flex-col justify-center items-center text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blush-200 text-blush-600 text-xs font-bold shadow-sm mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Friday, 20 Nov • 09:59 → 10:10 • Instagram
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-3xl sm:text-6xl font-extrabold font-serif text-blush-600 tracking-tight"
        >
          Hii Manshika ji... 🌸
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs sm:text-sm font-bold text-blush-500 mt-2"
        >
          (ya pyaar se Riya / Bandrr ji 🐒✨)
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-base sm:text-xl font-medium text-gray-600 mt-5 max-w-lg leading-relaxed"
        >
          Promise karta hu yeh 12th class ke boring notes se bahut zyada interesting hai! Thodi hasi-mazaak, ek chhoti si dil ki baat, aur aapke chehre par smile laane ki full koshish — neeche scroll karo? 🙈😂👇
        </motion.p>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-14 text-blush-500 flex flex-col items-center gap-1 text-sm font-semibold"
        >
          <span>Neeche scroll karo</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Story Cards */}
      <div className="space-y-12 pb-16">
        {/* Card 1: Yashika Shoutout & First Instagram DM */}
        <FadeInCard
          borderClass="bg-amber-400"
          onVisible={() =>
            updateCompanion(
              'Woh 11 minute main phone ghoor raha tha ki reply aayega ya seen-zone ho jaunga! 😂🙌',
              'excited'
            )
          }
        >
          <span className="text-3xl">🙌</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-2">
            Thank You Yashika! (Best Matchmaker Award 🏆)
          </h2>
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            Jab meri behen <strong>Yashika</strong> ne hum dono ko connect karwaya, toh <strong>Friday, 20 November</strong> ko shaam <strong>09:59</strong> par maine apna pehla message bheja — aur un 11 minute tak main phone ki screen aise ghoor raha tha jaise exam ka result aane wala ho! 😂 Finally <strong>10:10</strong> par aapka pehla reply aaya aur jaan mein jaan aayi!
          </p>
          <div className="mt-3.5 inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs font-bold text-amber-800">
            <span>Instagram DM</span>
            <span>•</span>
            <span>Fri 20 Nov</span>
            <span>•</span>
            <span>09:59 Adarsh → 10:10 Manshika 💬</span>
          </div>
        </FadeInCard>

        {/* Card 1.5: Beginner Shayari Card */}
        <FadeInCard
          borderClass="bg-pink-400"
          onVisible={() =>
            updateCompanion(
              'Oye hasna mat haan... pehli baar shayari try ki hai aapke liye! 🙈🎤',
              'shy'
            )
          }
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-3xl">🎤</span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blush-50 text-blush-600 border border-blush-200">
              Shayar Mode: Beginner 😅
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-2">
            Ek Shayari Meri Taraf Se...
          </h2>

          <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed mb-4">
            Dekho hasna mat mujh par Manshika — main koi shayar nahi hu, bas aapke liye try kiya hai! 🙈 To arz kiya hai...
          </p>

          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blush-50/90 via-white/90 to-purple-50/80 border border-blush-200 text-center space-y-1.5 font-serif italic text-base sm:text-lg text-gray-800 leading-relaxed shadow-inner">
            <p>Na mili ho abhi, na suni hai aawaz tumhari,</p>
            <p>Phir bhi har chat mein lagti ho sabse pyaari.</p>
            <p>Saadgi mein bhi itni kamaal lagti ho Riya,</p>
            <p>Bas ek smile se hi ban jaati hai shaam humari. 🌸</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500 italic">
              (Thodi si tareef kar dena, warna mera shayari career yahin khatam ho jayega! 😂🐒)
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setWahWahDone(true);
                updateCompanion(
                  'Arey wah-wah mil gaya!! Ab toh agla shayar main hi hu 😂🎤💖',
                  'excited'
                );
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                wahWahDone
                  ? 'bg-blush-500 text-white border-blush-500 shadow-sm'
                  : 'bg-white text-blush-600 border-blush-200 hover:bg-blush-50'
              }`}
            >
              {wahWahDone ? 'Shukriya Ji! 🙇‍♂️✨' : 'Wah-Wah! 👏'}
            </motion.button>
          </div>
        </FadeInCard>

        {/* Card 2: Funny 6-Day Wi-Fi Connection */}
        <FadeInCard
          borderClass="bg-blush-400"
          onVisible={() =>
            updateCompanion(
              'Na mile hain abhi tak, na aawaz suni hai — poora connection Wi-Fi aur emojis par chal raha hai! 📶😂',
              'teasing'
            )
          }
        >
          <span className="text-3xl">📶</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-2">
            Sirf 6 Din... Full Wi-Fi Connection! 😂✨
          </h2>
          <p className="text-gray-700 font-medium text-base leading-relaxed">
            Dekho, main yeh filmy dialogue bilkul nahi bolunga ki{' '}
            <span className="italic">&ldquo;janmo-janmo ka saath hai&rdquo;</span> — 6 din mein itni filmy over-acting karunga toh aap khud hass-hass ke bologi &ldquo;thoda slow chalo hero!&rdquo; 🤣
          </p>
          <p className="text-gray-700 font-medium text-base leading-relaxed mt-3">
            Abhi tak hum ek-doosre se real mein mile bhi nahi hain, aur na hi maine aapki aawaz suni hai — sirf photo dekhi hai aur Instagram DMs mein baatein hui hain. Matlab humara poora bond abhi pure Wi-Fi, memes aur emojis par chal raha hai... aur phir bhi itni smile aur apna sa feel hona kamaal toh hai na? 😄💛
          </p>
          <div className="mt-4 inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-2xl bg-blush-50/90 border border-blush-200 text-xs font-bold text-blush-600">
            <span>Met IRL: 0</span>
            <span>•</span>
            <span>Voice Heard: 0</span>
            <span>•</span>
            <span>Smile Count: 1000+ 😄</span>
          </div>
        </FadeInCard>

        {/* Card 2.5: Tap-to-Reveal 2-Polaroid Card */}
        <FadeInCard
          borderClass="bg-rose-400"
          onVisible={() =>
            updateCompanion(
              'Beech wale Tap to Reveal button par click karke dekho... ek chhota sa surprise hai! 🙈📸',
              'shy'
            )
          }
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-3xl">📸</span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blush-50 text-blush-600 border border-blush-200">
              Just Us • Polaroid Corner ✨
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-1.5">
            Abhi Mile Nahi, Par Photo Hi Kaafi Hai 📸✨
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
            Real mulakat abhi baaki hai — tab tak dekho kiski photo dekh kar hi smile aa jaati hai!
          </p>

          <div className="relative max-w-lg mx-auto mt-6">
            {/* Bursting floating hearts & petals from behind on reveal */}
            {photoRevealed && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible"
              >
                {REVEAL_HEARTS.map((item, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.3, x: 0, y: 12, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.4, 1.3, 1.1, 0.8],
                      x: item.x,
                      y: item.y,
                      rotate: item.rotate,
                    }}
                    transition={{
                      duration: item.duration,
                      delay: item.delay,
                      ease: 'easeOut',
                    }}
                    className="absolute text-xl sm:text-2xl select-none drop-shadow-sm"
                  >
                    {item.emoji}
                  </motion.span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {/* Left Polaroid: Adarsh */}
              <motion.div
                animate={
                  photoRevealed
                    ? { scale: [0.96, 1.03, 1], y: [6, -4, 0] }
                    : {}
                }
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="bg-white p-3 pb-4 rounded-2xl border border-blush-100 shadow-md sm:-rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-blush-50 relative">
                  <div
                    className={`w-full h-full transition-all duration-700 ${
                      photoRevealed ? 'blur-0 scale-100' : 'blur-md scale-105'
                    }`}
                  >
                    <SmartPhoto
                      sources={ADARSH_POLAROID_PHOTOS}
                      alt="Adarsh"
                      className="object-cover object-[52%_34%] scale-[1.24] origin-[52%_36%] brightness-[0.97] contrast-[0.96]"
                      fallbackEmoji="😎"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs font-bold text-gray-700 text-center">
                  {photoRevealed
                    ? 'Aapki ek smile ke liye hamesha ready 🤍'
                    : 'Tap karke dekho kaun wait kar raha hai 👀'}
                </p>
              </motion.div>

              {/* Right Polaroid: Manshika */}
              <motion.div
                animate={
                  photoRevealed
                    ? { scale: [0.96, 1.03, 1], y: [6, -4, 0] }
                    : {}
                }
                transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
                className="bg-white p-3 pb-4 rounded-2xl border border-blush-200 shadow-md sm:rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-blush-50 relative">
                  <div
                    className={`w-full h-full transition-all duration-700 ${
                      photoRevealed ? 'blur-0 scale-100' : 'blur-md scale-105'
                    }`}
                  >
                    <SmartPhoto
                      sources={MANSHIKA_POLAROID_PHOTOS}
                      alt="Manshika"
                      className="object-cover object-[42%_50%]"
                      fallbackEmoji="🌸"
                    />
                  </div>

                  {photoRevealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 }}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 text-blush-600 text-[10px] font-bold shadow border border-blush-200"
                    >
                      ✨ Cute!
                    </motion.div>
                  )}
                </div>
                <p className="mt-3 text-xs font-bold text-blush-600 text-center">
                  {photoRevealed
                    ? 'Saadgi aur khoobsurti ka best combination 🌸💖'
                    : 'Meri sabse favourite photo 🙈✨'}
                </p>
              </motion.div>
            </div>

            {/* Glowing center heart connecting both Polaroids once revealed */}
            <AnimatePresence>
              {photoRevealed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{ scale: [0, 1.3, 1], opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border-2 border-blush-200 shadow-xl flex items-center justify-center"
                >
                  <span className="text-xl anim-heart-pulse">💖</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!photoRevealed && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.18 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-[2px]"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      setPhotoRevealed(true);
                      confetti({
                        particleCount: 55,
                        spread: 75,
                        origin: { y: 0.58 },
                        colors: ['#f43f72', '#fb7195', '#fecdd8', '#c084fc', '#fff5f7'],
                      });
                      updateCompanion(
                        'Hayee! Photo mein hi itni sundar ho Manshika ji — nazar na lage 🧿✨💖',
                        'love'
                      );
                    }}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-bold text-sm shadow-xl border-2 border-white cursor-pointer flex items-center gap-2"
                  >
                    Tap to Reveal ✨📸
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeInCard>

        {/* Card 3: 4 Interactive Flip Cards (2x2 Grid) */}
        <FadeInCard
          borderClass="bg-purple-400"
          onVisible={() =>
            updateCompanion(
              'In chaaron cards par tap karke dekho — 4 cheezein jo maine notice ki 👀🦋',
              'shy'
            )
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-2xl">🦋</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-purple-700 mt-1">
                4 Cheezein Jo Notice Ki
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
              {revealedIds.length} / {TRAIT_CARDS.length} revealed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TRAIT_CARDS.map((card) => {
              const isRevealed = revealedIds.includes(card.id);
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleFlip(card)}
                  aria-expanded={isRevealed}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer min-h-[168px] flex flex-col justify-between ${
                    isRevealed
                      ? 'bg-gradient-to-br from-blush-50 to-purple-50 border-blush-300 shadow-md'
                      : 'bg-white/85 border-blush-100 hover:border-blush-300 shadow-sm'
                  }`}
                >
                  {!isRevealed ? (
                    <div className="flex flex-col items-center justify-center text-center h-full my-auto py-4">
                      <span className="text-3xl mb-2">{card.frontEmoji}</span>
                      <span className="font-bold text-gray-800 text-sm">{card.title}</span>
                      <span className="text-[11px] font-semibold text-blush-500 mt-2 bg-blush-50 px-2.5 py-0.5 rounded-full">
                        {card.subtitle}
                      </span>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-lg">{card.frontEmoji}</span>
                        <span className="font-bold text-blush-600 text-xs uppercase tracking-wide">
                          {card.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {card.backText}
                      </p>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </FadeInCard>

        {/* Card 4: Emotional Centerpiece */}
        <FadeInCard
          borderClass="bg-blush-500"
          onVisible={() =>
            updateCompanion(
              'Yeh wala card thoda dil se likha hai... bina kisi mazaak ke padhna 🤍',
              'love'
            )
          }
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-3xl">💌</span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blush-50 text-blush-600 border border-blush-200">
              Thoda Serious • Dil Se 🤍
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-3">
            Chalo, 30 Second Ke Liye Ek Sach Bolu?
          </h2>
          <div className="space-y-3 text-gray-700 font-medium text-base leading-relaxed">
            <p>
              Manshika, ek sach yeh hai ki <strong>mera past kuch aisa raha hai jiski wajah se mere liye kisi par bhi trust karna bilkul aasaan nahi hai.</strong> Main jaldi kisi par bharosa nahi kar paaunga, aur khud ko open karne mein bahut sochta hu — aur mujhe pata hai ki aapka past bhi kuch aisa hi raha hai, isliye main aapki feelings ko aur bhi zyada samajh sakta hu.
            </p>
            <p>
              Par pata nahi kyun, sirf 6 din mein aapki baatein, aapki simplicity, aur aapka saaf dil dekh kar woh dar thoda kam lagne laga. <strong>Main sach mein aap par trust kar raha hu</strong> — aur mere jaise insaan ke liye yeh bolna bahut badi baat hai.
            </p>
            <p>
              Mujhe yeh bhi pata hai ki aap thodi introvert ho aur aapko bhi time lagta hai, isliye main aapko kabhi rush nahi karunga. Bas aap jaise ho waise hi rehna — calm, genuine, aur thodi si Bandrr 🐒.
            </p>
            <p>
              Aur ek baat bilkul seedhe dil se bolna chahta hu — <strong>agar aap mere ho, toh main poora 100% aapka hu.</strong> Mujh par, mere har decision par, meri har activity aur meri har cheez par aapka poora haq hoga — bilkul utna hi jitna mera hai. Aur main bhi wahi pyaara sa haq aap par chahunga, kyunki uske baad mere liye hum dono alag nahi honge... 🤍
            </p>
            <div className="p-3.5 rounded-2xl bg-blush-50/80 border-l-4 border-blush-400 text-blush-600 text-sm font-semibold">
              &ldquo;Past jaisa bhi raha ho, aaj aap par bharosa karne ka mann khud kar raha hai — if you are mine, I am 100% yours, aur bas hamesha aise hi rahna.&rdquo; 🤍🌸
            </div>
          </div>
        </FadeInCard>

        {/* Card 5: Funny 12th Class & 15 Oct Terms & Conditions */}
        <FadeInCard
          borderClass="bg-emerald-400"
          onVisible={() =>
            updateCompanion(
              'Emotional moment khatam! Ab wapas full comedy mode — aur Rule #1 zaroor padhna Maalkin ji! 👑😂',
              'excited'
            )
          }
        >
          <span className="text-3xl">📜</span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-blush-600 mt-3 mb-1">
            Official Terms &amp; Conditions (12th Class Special 😂)
          </h2>
          <p className="text-xs text-gray-500 font-medium mb-4">
            Aage badhne se pehle yeh 5 cute rules padh lena, Manshika (Maalkin) ji 👑:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TERMS_CLAUSES.map((clause) => (
              <div
                key={clause.title}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  clause.featured
                    ? 'sm:col-span-2 bg-gradient-to-r from-amber-50/90 via-blush-50/90 to-white border-amber-200 shadow-sm'
                    : 'bg-white/80 border-blush-100 hover:border-blush-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{clause.emoji}</span>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-blush-600">
                    {clause.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {clause.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-blush-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 font-semibold">
            <span>— Tumhara Adarsh (Full-time Entertainer, Part-time Serious Guy)</span>
            <span>🐒✨</span>
          </div>
        </FadeInCard>

        {/* Proceed CTA */}
        <div className="text-center pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              updateCompanion(
                'Chalo ab 10 second ka ek cute sa vibe check quiz khelte hain — 12th ke exam se bahut easy hai! 😜',
                'teasing'
              );
              onProceed();
            }}
            className="px-7 py-4 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all text-base inline-flex items-center gap-2 cursor-pointer"
          >
            Aage 10-second ka cute vibe check hai <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
