export const px = (value: number): string => `${value}px`;

export const useAnimationFrame = (func: () => void): (() => void) => {
  let ticking = false;
  return () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      func();
    });
  };
};
