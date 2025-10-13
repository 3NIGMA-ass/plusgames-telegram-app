'use client';

import React from 'react';
import { tariffs } from '../lib/constants/tariffs';
import { TariffCard } from '../ui/cabinet/TariffCard';
import { ProfitChart } from '../ui/cabinet/ProfitChart';
import Footer from '../ui/layout/footer';
import { motion } from 'framer-motion';
import useGlobalStore from '../store/useGlobalStore';
import { DepositEarning } from '../lib/definition';

export default function InvestmentDashboard() {
  const {
    user,
    partnerEarnings,
    depositEarnings,
    totalReferrals,
  } = useGlobalStore();

  const deposit = user?.deposit_amount || 0;
  
  // Находим последнюю дату сбора
  const lastCollectedAt = (() => {
    if (!depositEarnings || !Array.isArray(depositEarnings) || depositEarnings.length === 0) {
      return null;
    }
    const collected = depositEarnings
      .filter((e: DepositEarning) => e?.last_collected_at)
      .map((e: DepositEarning) => new Date(e.last_collected_at!).getTime())
      .sort((a, b) => b - a);
    
    return collected.length > 0 ? new Date(collected[0]) : null;
  })();

  // Находим текущий тариф на основе депозита
  const currentTariff = (() => {
    if (deposit < 10000) return tariffs[0]; // TRX
    if (deposit < 100000) return tariffs[1]; // TON
    return tariffs[2]; // BITCOIN
  })();

  // Накопление (несобранная прибыль)
  const accumulation = (() => {
    if (!depositEarnings || !Array.isArray(depositEarnings)) return 0;
    return depositEarnings
      .filter((earning: DepositEarning) => !earning?.last_collected_at)
      .reduce(
        (sum: number, earning: DepositEarning) =>
          sum + (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
        0,
      );
  })();

  // Общий заработок от рефералов
  const referralProfit = partnerEarnings.reduce(
    (sum, earning) =>
      sum + (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
    0,
  );

  // Количество пополнений
  const depositCount = depositEarnings?.length || 0;

  // Данные для графика (последние 7 дней)
  const profitData = (() => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Считаем заработок за этот день
      const dayEarnings = depositEarnings
        ?.filter((earning: DepositEarning) => {
          if (!earning?.last_collected_at) return false;
          const earningDate = new Date(earning.last_collected_at).toISOString().split('T')[0];
          return earningDate === dateStr;
        })
        .reduce(
          (sum: number, earning: DepositEarning) =>
            sum + (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
          0,
        ) || 0;
      
      days.push({
        name: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        value: dayEarnings,
      });
    }
    
    return days;
  })();

  return (
    <motion.div
      className="flex w-full flex-col items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 w-full max-w-md">
        <ProfitChart
          profitData={profitData}
          deposit={deposit}
          depositCount={depositCount}
          referralProfit={referralProfit}
          lastCollectedAt={lastCollectedAt}
          currentTariff={currentTariff}
          totalReferrals={totalReferrals}
        />
      </div>

      <div className="w-full max-w-md">
        <TariffCard
          tariff={currentTariff}
          deposit={deposit}
          accumulation={accumulation}
          profitPercentage={currentTariff?.rate || 0}
        />
      </div>

      <Footer />
    </motion.div>
  );
}
