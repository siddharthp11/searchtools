export function debounce<T>(
  fn: (...args: T[]) => void,
  delay: number
): (...args: T[]) => void {
  let timeout: NodeJS.Timeout;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(...args), delay);
  };
}
