import { useState } from "react";

export function useConfirmDialog<T>() {
  const [target, setTarget] = useState<T | null>(null);

  return {
    target,
    isOpen: target !== null,
    open: (value: T) => setTarget(value),
    close: () => setTarget(null),
  };
}