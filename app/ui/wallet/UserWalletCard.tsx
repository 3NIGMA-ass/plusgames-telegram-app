'use client';

// Заглушки для иконок
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CircleArrowDown = (props: any) => <div {...props}>⬇</div>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CircleArrowUp = (props: any) => <div {...props}>⬆</div>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Copy = (props: any) => <div {...props}>📋</div>;
import { useModal } from '../../context/ModalContext';
import { useNotification } from '../../context/NotificContext';
import useGlobalStore from '../../store/useGlobalStore';
import clsx from 'clsx';

export function UserCard({
  telegramId,
  balance,
}: {
  telegramId: string;
  balance: number;
}) {
  const { openModal } = useModal();
  const { showNotification } = useNotification();
  const { transactions } = useGlobalStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramId);
    showNotification('Успешно!', 'success', 'ID скопирован в буфер обмена');
  };

  const hasPendingDeposit = transactions.some(
    (tx) => tx.type === 'deposit' && tx.status === 'in_process',
  );
  const isDepositDisabled = hasPendingDeposit;

  const hasPendingWithdrawal = transactions.some(
    (tx) => tx.type === 'withdrawal' && tx.status === 'in_process',
  );
  const lastApprovedWithdrawal = transactions
    .filter((tx) => tx.type === 'withdrawal' && tx.status === 'approved')
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  const isWithin24Hours =
    lastApprovedWithdrawal &&
    new Date().getTime() -
      new Date(lastApprovedWithdrawal.created_at).getTime() <
      24 * 60 * 60 * 1000;
  const isWithdrawalDisabled =
    balance < 100 || hasPendingWithdrawal || isWithin24Hours;

  const handleDepositClick = () => {
    if (isDepositDisabled) {
      showNotification(
        'Пополнение недоступно',
        'info',
        'Есть необработанная заявка на пополнение',
      );
      return;
    }
    openModal('BottomSheet', { initialActiveTab: 'Депозит' });
  };

  const handleWithdrawalClick = () => {
    if (balance < 100) {
      console.log(balance);
      showNotification(
        'Вывод недоступен',
        'info',
        'Баланс должен быть не менее 100 ₽',
      );
      return;
    }
    if (hasPendingWithdrawal) {
      showNotification(
        'Вывод недоступен',
        'info',
        'Есть необработанная заявка на вывод',
      );
      return;
    }
    if (isWithin24Hours) {
      showNotification(
        'Вывод недоступен',
        'info',
        'Вывод возможен раз в 24 часа',
      );
      return;
    }
    openModal('BottomSheet', { initialActiveTab: 'Вывод' });
  };

  return (
    <div className='w-full rounded-2xl border border-white/10 bg-[#1a1a1a] p-2'>
      <div className='mb-6 flex justify-between'>
        <div>
          <p className='mb-1 text-sm text-white/50'>Баланс</p>
          <p className='text-xl font-bold text-white'>
            {balance.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <button
          onClick={handleCopy}
          className='mt-auto flex transform items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white transition-transform duration-300 active:scale-[0.95]'
        >
          <span className='max-w-[110px] truncate'>{telegramId}</span>
          <Copy className='h-4 w-4 opacity-80' />
        </button>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <button
          onClick={handleDepositClick}
          disabled={isDepositDisabled}
          className={clsx(
            'relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#321461] py-3 text-sm font-medium text-white shadow-md transition-transform',
            isDepositDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'active:scale-[1.02]',
          )}
        >
          Пополнить
          <CircleArrowDown className='absolute bottom-0 left-0 h-6 w-6 translate-x-[-10%] translate-y-[10%] rotate-45 opacity-20' />
        </button>
        <button
          onClick={handleWithdrawalClick}
          disabled={isWithdrawalDisabled}
          className={clsx(
            'relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#4C1D95] to-[#321461] py-3 text-sm font-medium text-white shadow-md transition-transform',
            isWithdrawalDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'active:scale-[1.02]',
          )}
        >
          Вывести
          <CircleArrowUp className='absolute bottom-0 left-0 h-6 w-6 translate-x-[-10%] translate-y-[10%] rotate-45 opacity-20' />
        </button>
      </div>
    </div>
  );
}
