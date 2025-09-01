export function debounce<T extends unknown[]>(
  fn: (...args: T) => unknown,
  delay: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | undefined;

  const debounced = (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(...args), delay);
  };
  return debounced;
}
