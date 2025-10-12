'use client';

// Временные заглушки для модулей
const useSWR = (url: string, fetcher: any, options?: any) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    fetcher(url)
      .then(setData)
      .catch(setError);
  }, [url]);
  
  return { data, error };
};

const Image = ({ src, alt, width, height, className, unoptimized }: any) => {
  return React.createElement('img', {
    src,
    alt,
    width,
    height,
    className,
    style: { width, height }
  });
};

const ArrowDownRight = ({ className }: any) => React.createElement('svg', {
  className,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}, React.createElement('path', { d: 'm7 7 10 10' }), React.createElement('path', { d: 'm17 7-10 10' }));

const ArrowUpRight = ({ className }: any) => React.createElement('svg', {
  className,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}, React.createElement('path', { d: 'M7 17 17 7' }), React.createElement('path', { d: 'M7 7h10v10' }));

import React from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CryptoTicker() {
  const { data, error } = useSWR(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&price_change_percentage=24h',
    fetcher,
    { refreshInterval: 15000, revalidateOnFocus: false },
  );

  if (error || !data) return null;

  return (
    <div className='mb-4 w-full text-white'>
      <h2 className='mb-4 text-lg font-semibold text-white sm:text-xl'>
        Популярные криптовалюты
      </h2>

      <div className='flex flex-col divide-y divide-zinc-800 rounded-xl border border-zinc-800'>
        {data.map((coin) => {
          const change = coin.price_change_percentage_24h_in_currency;
          const isUp = change >= 0;

          return (
            <div
              key={coin.id}
              className='flex items-center justify-between px-4 py-3'
            >
              <div className='flex items-center gap-3'>
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={28}
                  height={28}
                  className='rounded-full'
                  unoptimized
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium leading-tight'>
                    {coin.name}
                  </span>
                  <span className='text-xs uppercase text-gray-500'>USD</span>
                </div>
              </div>

              <div className='flex flex-col items-end text-right'>
                <span className='text-sm font-semibold leading-tight'>
                  $
                  {coin.current_price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isUp ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className='h-4 w-4' />
                  ) : (
                    <ArrowDownRight className='h-4 w-4' />
                  )}
                  {change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
