import { useEffect, useState } from 'react';

export interface KeyboardViewportState {
  isKeyboardOpen: boolean;
  keyboardOffset: number;
  viewportHeight: number;
}

/**
 * Tracks mobile virtual keyboard open/close state via window.visualViewport
 * so persistent bottom exercise controls stay docked above the keyboard
 * without covering the active input or causing layout jumps.
 */
export function useKeyboardViewport(): KeyboardViewportState {
  const [state, setState] = useState<KeyboardViewportState>(() => ({
    isKeyboardOpen: false,
    keyboardOffset: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const layoutHeight = window.innerHeight;
      const visibleHeight = vv.height;
      const offsetTop = vv.offsetTop;
      const diff = Math.max(0, Math.round(layoutHeight - visibleHeight - offsetTop));
      const isOpen = diff > 120 && window.innerWidth < 1024;
      setState({
        isKeyboardOpen: isOpen,
        keyboardOffset: isOpen ? diff : 0,
        viewportHeight: Math.round(visibleHeight),
      });
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return state;
}

/**
 * Ensures the focused input remains comfortably visible above the mobile soft keyboard.
 */
export function scrollInputIntoSafeView(el: HTMLElement | null) {
  if (!el || typeof window === 'undefined') return;
  window.setTimeout(() => {
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } catch {
      // ignore on older browsers
    }
  }, 160);
}
