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
    if (typeof window === 'undefined') return false;
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

    setUsingFallback(true);
    setIsPlaying(true);
    setIsMuted(false);
    return true;
  }, [triggerChord]);

  useEffect(() => {
    const audio = new Audio('/audio/bgm.mp3');
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    const handleError = () => {
      mp3AvailableRef.current = false;
      setUsingFallback(true);
    };
    audio.addEventListener('error', handleError);

    return () => {
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
  }, [stopSynth]);

  const fadeInAudio = (audio) => {
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    audio.volume = 0;
    const duration = 3500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const targetVolume = 0.25;
    const stepSize = targetVolume / steps;
    let currentStep = 0;

    fadeTimerRef.current = setInterval(() => {
      if (!audioRef.current) {
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
  };

  const playBGM = useCallback(() => {
    if (isPlaying) return;

    const audio = audioRef.current;
    if (audio && mp3AvailableRef.current) {
      audio
        .play()
        .then(() => {
          setUsingFallback(false);
          setIsPlaying(true);
          setIsMuted(false);
          fadeInAudio(audio);
        })
        .catch(() => {
          mp3AvailableRef.current = false;
          startSynth();
        });
      return;
    }

    startSynth();
  }, [isPlaying, startSynth]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;

    if (isMuted) {
      if (audio && mp3AvailableRef.current && !usingFallback) {
        audio.volume = 0.25;
        audio
          .play()
          .then(() => {
            setIsMuted(false);
            setIsPlaying(true);
          })
          .catch(() => {
            startSynth();
          });
      } else {
        startSynth();
      }
    } else {
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
