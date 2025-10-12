'use client';

import React from 'react';
import { tariffs } from '../lib/constants/tariffs';
import { TariffCard } from '../ui/cabinet/TariffCard';
import { TotalEarnedCard } from '../ui/cabinet/TotalEarnedCard';
import Footer from '../ui/layout/footer';
import { motion } from 'framer-motion';
import useGlobalStore from '../store/useGlobalStore';
import { DepositEarning } from '../lib/definition';

export default function InvestmentDashboard() {
  const {
    user,
    partnerEarnings,
    depositEarnings,
  } = useGlobalStore();

  const deposit = user?.deposit_amount || 0;

  const totalIncome = (() => {
    const depositProfit =
      depositEarnings && Array.isArray(depositEarnings)
        ? depositEarnings
            .filter((earning: DepositEarning) => earning?.last_collected_at)
            .reduce(
              (sum: number, earning: DepositEarning) =>
                sum +
                (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
              0,
            )
        : 0;

    const partnerProfit = partnerEarnings.reduce(
      (sum, earning) =>
        sum + (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
      0,
    );

    return depositProfit + partnerProfit;
  })();


  const nextTariff = tariffs[0];

  const accumulation = (() => {
    if (!depositEarnings || !Array.isArray(depositEarnings)) return 0;
    return depositEarnings.reduce(
      (sum: number, earning: DepositEarning) =>
        sum + (isNaN(Number(earning?.amount)) ? 0 : Number(earning.amount)),
      0,
    );
  })();

  return (
    <motion.div
      className="flex w-full flex-col items-center p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 w-full text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Инвестиционный портфель
        </h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          Управляйте своими инвестициями и отслеживайте доходность
        </p>
      </div>

      <div className="mb-4 w-full max-w-md">
        <TotalEarnedCard
          totalIncome={totalIncome}
          deposit={deposit}
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <div className="rounded-lg border border-zinc-700/50 bg-gradient-to-br from-black/50 via-black/40 to-black/50 p-4">
          <h3 className="text-lg font-semibold text-white">График прибыли</h3>
          <p className="text-sm text-zinc-400">Данные загружаются...</p>
        </div>
      </div>

      <div className="mb-4 w-full max-w-md">
        <h2 className="mb-4 text-xl font-bold text-white">Тарифные планы</h2>
        <div className="space-y-3">
          {tariffs.map((tariff) => (
            <div key={tariff.id}>
              <TariffCard
                tariff={tariff}
                deposit={deposit}
                accumulation={accumulation}
                nextTariff={nextTariff}
                profitPercentage={0}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}