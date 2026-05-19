import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export function useAnimeCountUp(target: number, duration = 900): number {
  const [displayed, setDisplayed] = useState(0);
  const obj = useRef({ val: 0 });

  useEffect(() => {
    obj.current.val = 0;
    setDisplayed(0);

    const anim = anime({
      targets: obj.current,
      val: target,
      duration,
      easing: 'easeOutQuart',
      onUpdate: () => {
        setDisplayed(Math.round(obj.current.val));
      },
      complete: () => {
        setDisplayed(target);
      },
    });

    return () => {
      anim.pause();
    };
  }, [target, duration]);

  return displayed;
}
