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

// Заглушка для banners
const banners = {
  banner: '/banner1.jpg',
  banner2: '/banner2.jpg'
};

const testBanners = [
  {
    banner_image_url: banners.banner,
    banner_url: undefined,
    button_title: undefined,
    button_url: undefined,
  },
  {
    banner_image_url: banners.banner2,
    banner_url: undefined,
    button_title: undefined,
    button_url: undefined,
  },
];

const AUTO_DELAY = 5000;

const BannerSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const sliderRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const start = Date.now();

    setProgress(0);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / AUTO_DELAY) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        sliderRef.current?.slickNext();
      }
    }, 50);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleChange = (_: number, next: number) => {
    setCurrentSlide(next);
    startAutoPlay();
  };

  const handleDotClick = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    beforeChange: handleChange,
  };

  return (
    <div className='relative mx-auto mb-4 w-full max-w-6xl overflow-hidden'>
      <Slider ref={sliderRef} {...settings}>
        {testBanners.map((banner, index) => (
          <div key={index} className='relative mx-auto'>
            <a
              href={banner.banner_url}
              className='block w-full overflow-hidden rounded-md'
            >
              <Base64Image
                src={banner.banner_image_url}
                alt={`Баннер ${index + 1}`}
                width={1400}
                height={500}
                className='w-full object-cover'
                style={{ aspectRatio: '8 / 2' }}
                priority={index === 0}
              />
            </a>
            {banner.button_title && banner.button_url && (
              <div className='animate-fade-in-up absolute bottom-2 right-2'>
                <a
                  href={banner.button_url}
                  className='glass rounded-md px-4 py-1 text-sm font-semibold text-white backdrop-blur-md'
                >
                  {banner.button_title}
                </a>
              </div>
            )}
          </div>
        ))}
      </Slider>

      <div className='absolute bottom-3 left-2 flex gap-2'>
        {testBanners.map((_, index) => (
          <div
            key={`indicator-${index}`}
            className={`transition-shape cursor-pointer ${
              currentSlide === index ? 'dot-active' : 'dot-inactive'
            }`}
            onClick={() => handleDotClick(index)}
          >
            {currentSlide === index && (
              <div
                style={{ width: `${progress}%` }}
                className='absolute left-0 top-0 h-full bg-purple-400 transition-all duration-[250ms]'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { BannerSlider };
