import { useState } from 'react';

/**
 * Seconds since this component first rendered.
 * RN's useInitialState/useOnline family is untyped in this SDK, so we keep it
 * plain React: value refreshes on re-render (pull-to-refresh on tap).
 */
export function useStopwatch(): number {
  const [start] = useState(Date.now());
  return (Date.now() - start) / 1000;
}
