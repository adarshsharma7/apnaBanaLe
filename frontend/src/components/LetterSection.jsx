'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5006';

const TYPING_REMARKS = [
  'Oho, kuch likha ja raha hai... main quietly wait kar raha hu 👀🙈',
  'Bandrr ji kya likh rahi hain? Padhne ka wait nahi ho raha! 🐒💌',
  'Dil se likhna haan, seedha mere paas save hoga! 🥰',
  'Itna pyaara message? Main abhi se smile kar raha hu! 😊✨',
];

export default function LetterSection({
  responseId,
  loginName,
  quizAnswers,
  onMessageSent,
  updateCompanion,
}) {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateCompanion('Kuch bolna ho toh yahan likh do Bandrr ji... direct mere paas aayega! 💌', 'cute');
  }, []);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setMessageText(val);

    if (val.length > 6 && val.length % 25 === 0) {
      const idx = Math.floor(val.length / 25) % TYPING_REMARKS.length;
      updateCompanion(TYPING_REMARKS[idx], 'shy');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || loading) return;

    setLoading(true);
    updateCompanion('Note save ho raha hai... 💌✨', 'excited');

    try {
      await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/api/response/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: responseId,
          message: messageText.trim(),
          loginName,
          quizAnswers,
        }),
      });
    } catch (err) {
      console.error('Failed to save letter message:', err);
    } finally {
      setLoading(false);
      updateCompanion('Mil gaya aapka pyaara sa note! 🥰💖', 'love');
      onMessageSent();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full glass-strong p-5 sm:p-8 rounded-3xl border border-blush-200 relative"
    >
      <div className="absolute top-4 right-4 px-2.5 py-1 border-2 border-dashed border-blush-300 rounded-lg text-blush-500 text-[10px] font-bold font-mono rotate-6 bg-blush-50">
        20 NOV
      </div>

      <div className="flex items-center gap-3 mb-5 pr-16">
        <div className="p-3 bg-blush-100 rounded-2xl text-blush-500 shadow-inner">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-blush-600">
            Kuch bolna hai Adarsh ko? 💌
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Chhota sa reply ya kuch bhi cute sa — seedha mere inbox me save hoga!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={messageText}
            onChange={handleTextChange}
            placeholder="Jo mann mein ho likh do... blush kar rahi ho ya daantna hai, sab chalega! 🙈😜"
            rows={5}
            disabled={loading}
            required
            className="w-full p-4 pb-8 bg-white/85 border border-blush-200 rounded-2xl outline-none focus:border-blush-500 focus:ring-2 focus:ring-blush-200 transition-all font-medium text-gray-700 placeholder-gray-400 text-base resize-none"
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-gray-400 font-semibold">
            {messageText.length} chars
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={loading || !messageText.trim()}
            className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-blush-500 to-blush-600 hover:from-blush-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <Send className="w-4 h-4" /> Send Note 💌
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              updateCompanion('Koi baat nahi ji, direct Instagram par baat karte hain! 😊💖', 'cute');
              onMessageSent();
            }}
            className="w-full sm:w-auto py-3.5 px-5 bg-white/90 hover:bg-blush-50 text-gray-600 font-semibold rounded-2xl border border-blush-200 transition-all text-xs cursor-pointer"
          >
            Abhi nahi, Instagram par bolungi 😊
          </button>
        </div>
      </form>
    </motion.div>
  );
}
