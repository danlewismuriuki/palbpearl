'use client';

import { useEffect, useState } from 'react';

export type DebugQueryFlags = {
  forceLoadError: boolean;
  forceFieldErrors: boolean;
};

export function useDebugQuery(): DebugQueryFlags {
  const [flags, setFlags] = useState<DebugQueryFlags>({
    forceLoadError: false,
    forceFieldErrors: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const debug = params.get('debug');
    setFlags({
      forceLoadError: debug === 'error',
      forceFieldErrors: debug === 'fields',
    });
  }, []);

  return flags;
}