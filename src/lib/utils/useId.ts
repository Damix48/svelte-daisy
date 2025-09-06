globalThis.idCounter ??= { current: 0 };

export function useId(prefix = "ciao") {
  globalThis.idCounter.current++;
  return `${prefix}-${globalThis.idCounter.current}`;
}
