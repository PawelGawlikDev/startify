/* eslint-disable @typescript-eslint/no-explicit-any */
export default function debounce<T extends (...args: any[]) => void>(
  callback: T,
  wait: number
) {
  let timeoutId: number | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
