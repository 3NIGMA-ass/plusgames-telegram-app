/* eslint-disable @typescript-eslint/no-explicit-any */
const DollarSign = (props: any) => <span {...props}>💲</span>;
const ShieldCheck = (props: any) => <span {...props}>🛡️</span>;

export function InfoBlock() {
  return (
    <div className='mb-4 w-full space-y-2'>
      <div className='flex flex-col'>
        <h3 className='mb-1 text-sm font-semibold text-white underline decoration-purple-400 decoration-2 underline-offset-2'>
          Выводы с комиссией 0%
        </h3>
        <p className='mb-2 max-w-[90%] text-[10px] text-zinc-400'>
          Все выводы обрабатываются в течение 24 часов. Минимальная сумма вывода 100₽
        </p>
      </div>

      <div className='flex items-center gap-2 rounded-lg bg-zinc-800/50 p-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20'>
          <DollarSign className='h-4 w-4 text-green-400' />
        </div>
        <div className='flex-1'>
          <p className='text-xs font-medium text-white'>Быстрые выводы</p>
          <p className='text-[10px] text-zinc-400'>Обработка до 1 часа</p>
        </div>
      </div>

      <div className='flex items-center gap-2 rounded-lg bg-zinc-800/50 p-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20'>
          <ShieldCheck className='h-4 w-4 text-blue-400' />
        </div>
        <div className='flex-1'>
          <p className='text-xs font-medium text-white'>Безопасность</p>
          <p className='text-[10px] text-zinc-400'>Все операции защищены</p>
        </div>
      </div>
    </div>
  );
}