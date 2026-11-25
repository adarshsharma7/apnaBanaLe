'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, RefreshCw, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5006';

export default function SecretInboxPage() {
  const [passphrase, setPassphrase] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [storageMode, setStorageMode] = useState('');

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/api/response`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setItems(json.data || []);
      setStorageMode(json.storage || '');
    } catch (err) {
      setError('Backend se data load nahi ho paya — check karo port 5006 chal raha hai ya nahi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    const clean = passphrase.trim().toLowerCase();
    if (!['adarsh', 'insta20', 'instagram20'].includes(clean)) {
      setError('Galat passphrase! Try "adarsh" or "insta20".');
      return;
    }
    setError('');
    setUnlocked(true);
    fetchResponses();
  };

  return (
    <main className="min-h-screen p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blush-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </Link>
        {unlocked && (
          <button
            type="button"
            onClick={fetchResponses}
            disabled={loading}
            className="glass px-3.5 py-2 rounded-xl border border-blush-200 text-xs font-bold text-blush-600 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      {!unlocked ? (
        <div className="glass-strong p-8 rounded-3xl border border-blush-200 max-w-md mx-auto mt-16 text-center">
          <div className="w-12 h-12 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-blush-600" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-blush-600 mb-2">
            Adarsh&apos;s Secret Inbox 💌
          </h1>
          <p className="text-xs text-gray-500 mb-5">
            Manshika ke responses aur cute note dekhne ke liye passphrase daalo.
          </p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Passphrase..."
              className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-blush-200 outline-none focus:border-blush-500 text-sm font-medium"
            />
            {error && <p className="text-xs font-semibold text-blush-600">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-bold text-sm cursor-pointer"
            >
              Open Inbox
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-serif text-blush-600">
              Saved Responses ({items.length})
            </h1>
            {storageMode && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-blush-200 text-gray-500 uppercase">
                storage: {storageMode}
              </span>
            )}
          </div>

          {error && <p className="text-sm font-semibold text-blush-600">{error}</p>}

          {items.length === 0 && !loading ? (
            <div className="glass-strong p-8 rounded-3xl border border-blush-200 text-center text-gray-500 text-sm">
              Abhi tak koi response save nahi hua hai.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="glass-strong p-6 rounded-3xl border border-blush-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blush-500 text-white text-xs font-bold">
                      Response: {item.response}
                    </span>
                    {item.loginName && (
                      <span className="px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-blush-600 text-xs font-bold">
                        Name: {item.loginName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-gray-600 font-semibold">
                  &lsquo;No&rsquo; dodge attempts: <span className="text-blush-600">{item.noAttempts || 0}</span>
                </div>

                {item.quizAnswers && Object.keys(item.quizAnswers).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(item.quizAnswers)
                      .filter(([, val]) => Boolean(val))
                      .map(([key, val]) => {
                        const labels = {
                          chatVibe: 'Chat Vibe',
                          firstDate: 'Next Step / Outing',
                          yashikaAward: 'Yashika Award',
                        };
                        return (
                          <div key={key} className="p-2.5 rounded-xl bg-blush-50 border border-blush-100">
                            <div className="text-gray-400 font-bold mb-0.5">
                              {labels[key] || key}
                            </div>
                            <div className="font-semibold text-gray-700">{val}</div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {item.message && (
                  <div className="p-4 rounded-2xl bg-white/85 border border-blush-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blush-500 mb-1">
                      Her Note 💌
                    </div>
                    <p className="text-sm text-gray-800 font-medium whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
