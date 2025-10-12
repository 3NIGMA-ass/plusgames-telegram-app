'use client';

// Заглушки для иконок
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BookText = (props: any) => <div {...props}>📖</div>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ArrowRight = (props: any) => <div {...props}>→</div>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BookOpen = (props: any) => <div {...props}>📚</div>;
import { useWebApp } from '../lib/hooks/useWebApp';
import dynamic from 'next/dynamic';
import Footer from '../ui/layout/footer';
import FaqSection from '../ui/main/FaqSection';
import { motion } from 'framer-motion';
import useGlobalStore from '../store/useGlobalStore';

const CryptoTicker = dynamic(() => import('../ui/CryptoTicker'), {
  ssr: false,
});

const newsItems = [
  {
    title: 'Plus обновился. Добавлены новые валюты и тарифные планы в работу',
    date: '20.06.25',
  },
  {
    title:
      'Plus проведет конференцию о крипто-трейдинге с обсуждением всех важных тем',
    date: '15.06.25',
  },
  {
    title:
      'Открытие компании Plus. Первый рабочий день команды и лучшего продукта',
    date: '11.06.25',
  },
];

export default function TrainingPage() {
  const { appConfig } = useGlobalStore();
  const WebApp = useWebApp();

  const handleCtaAction = () => {
    if (typeof window !== 'undefined' && WebApp?.openLink) {
      WebApp.openLink('https://telegra.ph/Obuchenie-rabote-06-22-3');
    } else {
      console.log('Open link:', '#');
    }
  };

  return (
    <motion.div
      className='flex w-full flex-col items-center p-2'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Заголовок */}
      <div className='mb-4 w-full text-center'>
        <h1 className='text-xl font-semibold tracking-tight text-white'>
          Начни свой путь в мир криптовалют{' '}
          <span className='bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text font-semibold text-transparent underline decoration-violet-800'>
            в 3 шага
          </span>
        </h1>
      </div>

      {/* Контейнер с шагами */}
      <div className='w-full max-w-md border-t border-zinc-800'>
        <div className='relative flex items-center'>
          <div className='relative flex-1 py-2 text-center'>
            <span className='text-xs text-white'>Авторизация</span>
            <div className='absolute -top-0.5 left-0 right-0 h-0.5 bg-violet-700'></div>
          </div>
          <span className='flex-1 text-center text-xs text-white'>
            Пополнить
          </span>
          <span className='flex-1 text-center text-xs text-white'>
            Инвестировать
          </span>
        </div>
      </div>

      {/* Кнопка "Читать обучение" */}
      <div className='mb-4 w-full max-w-md py-2'>
        <button
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-purple-700/50 bg-gradient-to-tr from-purple-900/50 via-black/30 to-black/40 px-6 py-3.5 text-sm font-semibold text-white'
          onClick={handleCtaAction}
        >
          <BookOpen className='h-5 w-5' />
          <span className='relative z-10'>Читать обучение</span>
        </button>
      </div>

      {/* Второй слайд из баннера */}
      <div className='mb-4 w-full max-w-md rounded-2xl bg-[#121212]'>
        <div className='relative flex max-h-36 min-h-[100px]'>
          <div className='flex items-center justify-center rounded-2xl bg-gradient-to-tr from-black via-[#1a1a1a] to-[#2a2a2a] px-2'>
            <BookText
              className='h-16 w-16 stroke-[0.8] text-purple-400'
              aria-hidden
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </div>
          <div className='flex w-3/4 flex-col justify-center px-4 py-2'>
            <h3 className='text-xs leading-snug text-white'>
              Не получается пополнить с помощью банковской карты?
            </h3>
            <button
              onClick={() =>
                WebApp && appConfig.manager_link
                  ? WebApp.openTelegramLink(appConfig.manager_link)
                  : null
              }
              className='mt-1 text-left text-xs font-semibold text-white hover:text-purple-300'
              type='button'
            >
              P2P менеджер
            </button>
            <button
              onClick={() =>
                WebApp && appConfig.manager_link
                  ? WebApp.openTelegramLink(appConfig.manager_link)
                  : null
              }
              className='mt-3 inline-flex items-center text-xs font-semibold text-purple-400 transition-colors duration-200 hover:text-purple-300'
              type='button'
            >
              <span className='leading-none'>Подробнее</span>
              <ArrowRight className='ml-1 h-4 w-4 flex-shrink-0' aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <CryptoTicker />

      <FaqSection />

      {/* Список новостей */}
      <div className='mb-4 w-full max-w-md'>
        <p className='mb-3 text-[12px] font-semibold uppercase tracking-wide text-zinc-400'>
          Последние новости
        </p>
        <div className='divide-y divide-zinc-800'>
          <ul className='relative space-y-2'>
            {newsItems.map((news, index) => (
              <li
                key={index}
                className='border-t border-zinc-800/60 pt-3 text-[12px] text-zinc-400'
              >
                <p className='text-white'>{news.title}</p>
                <p className='mt-1 text-[10px] text-zinc-500'>{news.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
