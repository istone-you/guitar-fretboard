import { useState } from "react";

export function usePersistedSetting<T>(
  storageKey: string,
  readInitialValue: () => T,
  serialize: (value: T) => string = (value) => String(value),
): [T, (value: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(readInitialValue);

  const setPersistedValue = (nextValue: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved =
        typeof nextValue === "function" ? (nextValue as (current: T) => T)(current) : nextValue;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, serialize(resolved));
      }
      return resolved;
    });
  };

  return [value, setPersistedValue];
}
