/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
'use client';

import React from 'react';

// Временные заглушки для модулей
const useSWR = (url: string, fetcher: any) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    fetcher(url)
      .then(setData)
      .catch(setError);
  }, [url, fetcher]);
  
  return { data, error };
};

const Image = ({ src, alt, width, height, className, unoptimized }: any) =>
  React.createElement('img', {
    src,
    alt,
    width,
    height,
    className,
    unoptimized
  });

const ArrowDownRight = (props: any) => React.createElement('svg', props);
const ArrowUpRight = (props: any) => React.createElement('svg', props);

// Импортируем тип из global.d.ts (не используется, но оставляем для будущего)
// import { CryptoCurrency } from '../../types/global';

export default function CryptoTicker() {
  const { data: cryptocurrencies, error } = useSWR('/api/crypto', (url: string) => 
    fetch(url).then(res => res.json())
  );

  if (error) {
    return null;
  }

  if (!cryptocurrencies || !Array.isArray(cryptocurrencies)) {
    return null;
  }

  return (
    <div className="mb-4 w-full max-w-md overflow-hidden rounded-lg border border-zinc-700/50 bg-gradient-to-br from-black/50 via-black/40 to-black/50 p-4 shadow-[0_0_10px_rgba(139,92,246,0.2)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Криптовалюты</h3>
        <div className="flex space-x-2">
          {cryptocurrencies.slice(0, 3).map((crypto: any, index: number) => (
            <div key={index} className="flex items-center space-x-1">
              <Image
                src={crypto.image || ''}
                alt={crypto.name || 'Crypto'}
                width={16}
                height={16}
                className="rounded-full"
                unoptimized
              />
              <span className="text-xs text-white">{crypto.symbol || 'BTC'}</span>
              <span className={`text-xs ${(crypto.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}{(crypto.price_change_percentage_24h || 0).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}