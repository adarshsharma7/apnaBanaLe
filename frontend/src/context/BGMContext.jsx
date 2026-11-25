'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const BGMContext = createContext();

// Warm romantic lo-fi chord progression (Cmaj7 -> Am7 -> Fmaj7 -> G6)
const CHORDS = [
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 293.66, 329.63],
];

export function BGMProvider({ children }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const synthCtxRef = useRef(null);
  const synthLoopRef = useRef(null);
  const synthMasterGainRef = useRef(null);
  const chordStepRef = useRef(0);
  const mp3AvailableRef = useRef(true);
  const userPausedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const cleanupGestureListenersRef = useRef(null);

  const stopSynth = useCallback(() => {
    if (synthLoopRef.current) {
      clearInterval(synthLoopRef.current);
      synthLoopRef.current = null;
    }
    if (synthMasterGainRef.current && synthCtxRef.current) {
      try {
        const now = synthCtxRef.current.currentTime;
        synthMasterGainRef.current.gain.setTargetAtTime(0.0001, now, 0.25);
      } catch {}
    }
  }, []);

  const triggerChord = useCallback((ctx, masterGain) => {
    const freqs = CHORDS[chordStepRef.current % CHORDS.length];
    chordStepRef.current += 1;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.connect(masterGain);

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const startOffset = idx * 0.08;
      noteGain.gain.setValueAtTime(0.0001, now + startOffset);
      noteGain.gain.linearRampToValueAtTime(0.18 / freqs.length, now + startOffset + 0.45);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

      osc.connect(noteGain);
      noteGain.connect(filter);

      osc.start(now + startOffset);
      osc.stop(now + 3.5);
    });
  }, []);

  const startSynth = useCallback(() => {
    if (typeof window === 'undefined' || userPausedRef.current) return false;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    if (!synthCtxRef.current) {
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.connect(ctx.destination);
      synthCtxRef.current = ctx;
      synthMasterGainRef.current = master;
    }

    const ctx = synthCtxRef.current;
    const master = synthMasterGainRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.9);

    if (synthLoopRef.current) {
      clearInterval(synthLoopRef.current);
    }

    triggerChord(ctx, master);
    synthLoopRef.current = setInterval(() => {
      if (synthCtxRef.current && synthMasterGainRef.current) {
        triggerChord(synthCtxRef.current, synthMasterGainRef.current);
      }
    }, 3200);

    isPlayingRef.current = true;
    setUsingFallback(true);
    setIsPlaying(true);
    setIsMuted(false);
    cleanupGestureListenersRef.current?.();
    return true;
  }, [triggerChord]);

  const fadeInAudio = useCallback((audio) => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    audio.volume = 0;
    const duration = 3500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const targetVolume = 0.25;
    const stepSize = targetVolume / steps;
    let currentStep = 0;

    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current || userPausedRef.current) {
        clearInterval(fadeTimerRef.current);
        return;
      }
      currentStep += 1;
      audio.volume = Math.min(targetVolume, audio.volume + stepSize);
      if (currentStep >= steps || audio.volume >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(fadeTimerRef.current);
      }
    }, intervalTime);
  }, []);

  const attemptPlay = useCallback(
    (allowSynthFallback = true) => {
      if (userPausedRef.current || isPlayingRef.current) return;

      const audio = audioRef.current;
      if (audio && mp3AvailableRef.current) {
        audio
          .play()
          .then(() => {
            if (userPausedRef.current) {
              audio.pause();
              return;
            }
            isPlayingRef.current = true;
            setUsingFallback(false);
            setIsPlaying(true);
            setIsMuted(false);
            fadeInAudio(audio);
            cleanupGestureListenersRef.current?.();
          })
          .catch((err) => {
            // Browser autoplay policy blocked unmuted playback before first tap; keep mp3 enabled for gesture unlock
            if (err?.name === 'NotAllowedError') {
              return;
            }
            mp3AvailableRef.current = false;
            if (allowSynthFallback) {
              startSynth();
            }
          });
        return;
      }

      if (allowSynthFallback) {
        startSynth();
      }
    },
    [fadeInAudio, startSynth]
  );

  useEffect(() => {
    const audio = new Audio('/audio/bgm.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.volume = 0;
    audioRef.current = audio;

    const handleError = () => {
      mp3AvailableRef.current = false;
      setUsingFallback(true);
    };
    audio.addEventListener('error', handleError);

    const handleFirstGesture = (event) => {
      if (event.target instanceof Element && event.target.closest('[data-bgm-toggle="true"]')) {
        return;
      }
      attemptPlay(true);
    };

    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture, true);
      window.removeEventListener('touchstart', handleFirstGesture, true);
      window.removeEventListener('click', handleFirstGesture, true);
      window.removeEventListener('keydown', handleFirstGesture, true);
    };
    cleanupGestureListenersRef.current = removeGestureListeners;

    window.addEventListener('pointerdown', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { capture: true });
    window.addEventListener('keydown', handleFirstGesture, { capture: true });

    // Try playing immediately on page load; if autoplay is blocked, first tap anywhere unlocks it
    attemptPlay(false);

    return () => {
      removeGestureListeners();
      cleanupGestureListenersRef.current = null;
      audio.removeEventListener('error', handleError);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopSynth();
      if (synthCtxRef.current) {
        synthCtxRef.current.close().catch(() => {});
        synthCtxRef.current = null;
      }
    };
  }, [attemptPlay, stopSynth]);

  const playBGM = useCallback(() => {
    if (userPausedRef.current || isPlayingRef.current) return;
    attemptPlay(true);
  }, [attemptPlay]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;

    if (isMuted) {
      userPausedRef.current = false;
      cleanupGestureListenersRef.current?.();

      if (audio && mp3AvailableRef.current && !usingFallback) {
        audio.volume = 0.25;
        audio
          .play()
          .then(() => {
            isPlayingRef.current = true;
            setIsMuted(false);
            setIsPlaying(true);
          })
          .catch((err) => {
            if (err?.name !== 'NotAllowedError') {
              mp3AvailableRef.current = false;
              startSynth();
            }
          });
      } else {
        startSynth();
      }
    } else {
      userPausedRef.current = true;
      isPlayingRef.current = false;
      cleanupGestureListenersRef.current?.();
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      if (audio) audio.pause();
      stopSynth();
      setIsMuted(true);
      setIsPlaying(false);
    }
  }, [isMuted, startSynth, stopSynth, usingFallback]);

  return (
    <BGMContext.Provider value={{ isMuted, isPlaying, usingFallback, playBGM, toggleMute }}>
      {children}
    </BGMContext.Provider>
  );
}

export function useBGM() {
  return useContext(BGMContext);
}
