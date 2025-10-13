/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/jsx-no-comment-textnodes */
'use client';

import React, { useEffect, useRef, useState } from 'react';

// Временные заглушки для модулей
const Slider = ({ children, ...props }: any) => {
const [currentSlide, setCurrentSlide] = useState(0);
const sliderRef = useRef<any>(null);
  
const settings = {
    ...props,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
      if (props.beforeChange) props.beforeChange(oldIndex, newIndex);
    },
ref: (ref: any) => {
      sliderRef.current = ref;
      if (props.ref) props.ref(ref);
    }
  };
  
  return React.createElement('div', { className: 'slider-container' }, children);
};

// Заглушка для Base64Image
const Base64Image = ({ src, alt, className, ...props }: any) => {
  return React.createElement('img', {
    src,
    alt,
    className,
    ...props
  });
};

// Импортируем тип Banner из global.d.ts
import { Banner } from '../../../types/global';

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    adaptiveHeight: true,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    },
    ref: (ref: any) => {
      sliderRef.current = ref;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const nextSlide = (currentSlide + 1) % banners.length;
        setCurrentSlide(nextSlide);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="relative mb-4 max-w-full select-none overflow-hidden rounded-2xl bg-[#121212] text-white shadow-lg">
      <Slider {...settings}>
        {banners.map((banner, index: number) => (
          <div key={index}>
            <div className="flex max-h-36 min-h-[100px]">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-black via-[#1a1a1a] to-[#2a2a2a] px-2">
                <Base64Image
                  src={banner.icon || ''}
                  alt={banner.title || 'Banner'}
                  className="h-16 w-16"
                />
              </div>
              <div className="flex w-3/4 flex-col justify-center px-4 py-2">
                <h3 className="text-xs leading-snug">{banner.title || 'Заголовок'}</h3>
                {banner.bodyText && (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.open) {
                        window.open(banner.bodyLink || '#', '_blank');
                      }
                    }}
                    className="mt-1 text-left text-xs font-semibold text-white hover:text-purple-300"
                    type="button"
                  >
                    {banner.bodyText}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.open) {
                      window.open(banner.ctaLink || '#', '_blank');
                    }
                  }}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-purple-400 transition-colors duration-200 hover:text-purple-300"
                  type="button"
                >
                  <span className="leading-none">{banner.ctaText || 'Подробнее'}</span>
                  <svg
                    className="ml-1 h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <span className="absolute bottom-2 right-4 font-mono text-xs text-purple-400">
        {currentSlide + 1}/{banners.length}
      </span>
    </section>
  );
}