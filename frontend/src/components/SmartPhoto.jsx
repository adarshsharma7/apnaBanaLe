'use client';

import React, { useState, useEffect, useRef } from 'react';

export const ADARSH_PHOTOS = [
  '/images/adarsh.jpeg',
  '/images/adarsh.jpg',
  '/images/adarsh.png',
  '/images/adarsh.webp',
];

export const MANSHIKA_PHOTOS = [
  '/images/manshika.jpeg',
  '/images/manshika.jpg',
  '/images/manshika.png',
  '/images/manshika.webp',
];

export const ADARSH_POLAROID_PHOTOS = [
  '/images/adarsh1.jpeg',
  '/images/adarsh1.jpg',
  '/images/adarsh1.png',
  '/images/adarsh.jpeg',
];

export const ADARSH_TRANSITION_PHOTOS = [
  '/images/adarsh3.jpeg',
  '/images/adarsh3.jpg',
  '/images/adarsh3.png',
  '/images/adarsh.jpeg',
];

export const MANSHIKA_TRANSITION_PHOTOS = [
  '/images/manshika3.jpeg',
  '/images/manshika3.jpg',
  '/images/manshika3.png',
  '/images/manshika.jpeg',
];

export const MANSHIKA_POLAROID_PHOTOS = [
  '/images/manshika1.jpeg',
  '/images/manshika1.jpg',
  '/images/manshika1.png',
  '/images/manshika.jpeg',
];

export default function SmartPhoto({
  sources = [],
  alt,
  className = '',
  fallbackEmoji = '🌸',
  fallbackClassName = '',
}) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [idx]);

  const src = idx < sources.length ? sources[idx] : null;

  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`w-full h-full bg-gradient-to-br from-blush-100 via-blush-50 to-purple-100 flex items-center justify-center ${fallbackClassName}`}
      >
        <span className="text-3xl sm:text-4xl">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br from-blush-100 via-blush-50 to-purple-100 flex items-center justify-center ${fallbackClassName}`}
        >
          <span className="text-2xl sm:text-3xl">{fallbackEmoji}</span>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false);
          setIdx((prev) => prev + 1);
        }}
        className={`w-full h-full transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}
