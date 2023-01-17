import { useEffect } from 'react';

// whenever the user scrolls to the bottom of the page, the callback function is called
export const useScroll = (callback: () => void) => {
  useEffect(() => {
    const handleScroll = () => {
      window.event?.preventDefault();
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
};
