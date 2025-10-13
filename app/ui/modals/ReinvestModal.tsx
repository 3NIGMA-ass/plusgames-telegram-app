'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DollarSign = (props: any) => <span {...props}>💲</span>;
import { Drawer } from 'vaul';
import { useState } from 'react';

import { useNotification } from '../../context/NotificContext';
import { reinvestDeposit } from '../../lib/actions';
import useGlobalStore from '../../store/useGlobalStore';
import clsx from 'clsx';
import {
  getReinvestmentsByTelegramId,
  getUserByTelegramId,
} from '../../lib/dataQuery';

export default function ReinvestModal() {
  const [input, setInput] = useState<string>('');
  const [isReinvesting, setIsReinvesting] = useState(false);
  const { showNotification } = useNotification();

  const { user, transactions, setUser, setReinvestments } = useGlobalStore();
  const balance = user?.balance || 0;

  const hasWithdrawalRequest = transactions.some(
    (tx) => tx.type === 'withdrawal' && tx.status === 'in_process',
  );

  const isRestricted = balance < 250 || hasWithdrawalRequest;

  const deposit = parseInt(input || '0', 10);
  const minDeposit = 250;
  const isTooSmall = deposit < minDeposit;
  const isTooLarge = deposit > balance;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) setInput(value);
  };

  const handleReinvest = async () => {
    if (!user) {
      showNotification('Ошибка', 'error', 'Данные пользователя недоступны');
      return;
    }
    if (isTooSmall) {
      showNotification(
        'Ошибка',
        'info',
        `Минимальная сумма вклада — ${minDeposit} ₽`,
      );
      return;
    }
    if (isTooLarge) {
      showNotification(
        'Ошибка',
        'info',
        `Сумма не может превышать баланс (${balance.toLocaleString('ru-RU')} ₽)`,
      );
      return;
    }
    if (balance < 250) {
      showNotification('Ошибка', 'info', 'Баланс должен быть не менее 250 ₽');
      return;
    }
    if (hasWithdrawalRequest) {
      showNotification(
        'Ошибка',
        'info',
        'Реинвестирование недоступно при наличии заявки на вывод',
      );
      return;
    }
    setIsReinvesting(true);
    try {
      await reinvestDeposit(user.telegram_id, deposit);
      const updated_user = await getUserByTelegramId(BigInt(user.telegram_id));
      const updated_reinvestments = await getReinvestmentsByTelegramId(
        BigInt(user.telegram_id),
      );
      if (updated_user) {
        setUser(updated_user);
      }
      setReinvestments(updated_reinvestments);
      showNotification('Успешно!', 'success', 'Ваш депозит обновлён');
      setInput('');
    } catch {
      showNotification('Ошибка', 'error', 'Попробуйте снова позже');
    } finally {
      setIsReinvesting(false);
    }
  };

  return (
    <Drawer.Root repositionInputs={false}>
      <Drawer.Trigger asChild>
        <button
          disabled={isRestricted}
          className={clsx(
            'relative w-full overflow-hidden rounded-xl border border-[#7c3aed] px-3 py-2 text-sm font-semibold text-[#c4b5fd] transition-all duration-300 active:text-white',
            isRestricted
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-purple-900/20',
          )}
        >
          <span className='relative z-10 flex items-center justify-center gap-1 text-xs sm:text-sm'>
            <DollarSign className='h-4 w-4 shrink-0' />
            <span className='truncate'>Реинвест</span>
          </span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
        <Drawer.Content
          aria-describedby={undefined}
          className='fixed bottom-0 left-0 right-0 z-50 h-[80vh] rounded-t-3xl bg-zinc-950 p-4 text-white'
        >
          <Drawer.Close
            className='absolute right-4 top-4 text-gray-400 hover:text-white active:scale-95'
            aria-label='Закрыть'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              className='h-6 w-6'
            >
              <path
                fill='currentColor'
                d='M18 6L6 18M6 6l12 12'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </Drawer.Close>
          <div className='mx-auto'>
            <Drawer.Title className='mb-6 text-center text-lg font-bold'>
              Реинвестирование
            </Drawer.Title>

            <div className='mb-8'>
              <input
                type='text'
                inputMode='numeric'
                value={input}
                onChange={handleChange}
                placeholder='Введите сумму'
                className='w-full border-none bg-transparent text-center text-4xl font-semibold text-white placeholder-gray-500 outline-none'
              />

              {isTooSmall ? (
                <p className='mt-2 text-center text-sm font-medium text-red-400'>
                  Минимальная сумма вклада — {minDeposit} ₽
                </p>
              ) : isTooLarge ? (
                <p className='mt-2 text-center text-sm font-medium text-red-400'>
                  Сумма не может превышать баланс (
                  {balance.toLocaleString('ru-RU')} ₽)
                </p>
              ) : (
                <p className='mt-2 text-center text-sm text-gray-400'>
                  Введите сумму от {minDeposit} ₽ до{' '}
                  {balance.toLocaleString('ru-RU')} ₽
                </p>
              )}
              {balance < 250 && (
                <p className='mt-2 text-center text-sm font-medium text-red-400'>
                  Баланс должен быть не менее 250 ₽
                </p>
              )}
              {hasWithdrawalRequest && (
                <p className='mt-2 text-center text-sm font-medium text-red-400'>
                  Реинвестирование недоступно при наличии заявки на вывод
                </p>
              )}
            </div>

            <button
              onClick={handleReinvest}
              disabled={
                isTooSmall || isTooLarge || isReinvesting || isRestricted
              }
              className={clsx(
                'mt-6 w-full rounded-lg border border-purple-700/50 bg-gradient-to-tr from-purple-900/50 via-black/30 to-black/40 px-6 py-3.5 text-sm font-semibold text-white outline-none focus:outline-none',
                isTooSmall || isTooLarge || isReinvesting || isRestricted
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-purple-900/70',
              )}
            >
              <div className='flex items-center justify-center'>
                {isReinvesting ? (
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 17 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='mr-2 h-5 w-5 animate-spin text-white'
                  >
                    <path
                      d='M8.5 0C10.0823 1.88681e-08 11.617 0.469192 12.9446 1.34824C14.2602 2.22728 15.2855 3.47672 15.891 4.93853C16.4965 6.40034 16.655 8.00887 16.3463 9.56072C16.0376 11.1126 15.2757 12.538 14.1569 13.6569C13.038 14.7757 11.6126 15.5376 10.0607 15.8463C8.50887 16.155 6.90034 15.9965 5.43853 15.391C3.97672 14.7855 2.72729 13.7602 1.84824 12.4446C0.969192 11.129 0.5 9.58225 0.5 8H2.5C2.5 9.18669 2.85189 10.3467 3.51118 11.3334C4.17047 12.3201 5.10754 13.0892 6.2039 13.5433C7.30026 13.9974 8.50666 14.1162 9.67054 13.8847C10.8344 13.6532 11.9035 13.0818 12.7426 12.2426C13.5818 11.4035 14.1532 10.3344 14.3847 9.17054C14.6162 8.00666 14.4974 6.80026 14.0433 5.7039C13.5892 4.60754 12.8201 3.67047 11.8334 3.01118C10.8467 2.35189 9.68669 2 8.5 2V0Z'
                      fill='currentColor'
                    />
                  </svg>
                ) : (
                  <DollarSign className='mr-2 h-5 w-5' />
                )}
                Реинвестировать
              </div>
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
