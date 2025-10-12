'use client';

import { useEffect, useState } from 'react';

// Используем типы из global.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TwaWebApp = any;

let webAppCache: TwaWebApp | null = null;
let initialized = false;
let pendingResolvers: ((sdk: TwaWebApp) => void)[] = [];

function loadWebApp(): Promise<TwaWebApp> {
  if (webAppCache) return Promise.resolve(webAppCache);
  if (initialized) {
    return new Promise((resolve) => {
      pendingResolvers.push(resolve);
    });
  }

  initialized = true;

  return import('@twa-dev/sdk')
    .then((mod) => {
      webAppCache = mod.default;
      pendingResolvers.forEach((r) => r(webAppCache!));
      pendingResolvers = [];
      return webAppCache!;
    })
    .catch((err) => {
      console.error('Ошибка при загрузке Telegram WebApp SDK:', err);
      throw err;
    });
}

export function useWebApp(): TwaWebApp | null {
  const [webApp, setWebApp] = useState<TwaWebApp | null>(webAppCache);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (webAppCache) {
      setWebApp(webAppCache);
      return;
    }

    loadWebApp()
      .then(setWebApp)
      .catch(() => setWebApp(null));
  }, []);

  return webApp;
}
