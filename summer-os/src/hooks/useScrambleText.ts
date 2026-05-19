import { useEffect, RefObject } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

export function useScrambleText(
  ref: RefObject<HTMLElement | null>,
  text: string,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const totalFrames = 22;

    const id = setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / totalFrames) * text.length);
      el.textContent = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < resolved) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      if (frame >= totalFrames) {
        el.textContent = text;
        clearInterval(id);
      }
    }, 28);

    return () => clearInterval(id);
  }, [text, enabled]);
}
