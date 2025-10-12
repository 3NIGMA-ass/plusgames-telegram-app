'use client';

import { motion } from 'framer-motion';
import useGlobalStore from '../store/useGlobalStore';
import { CalculatorButton } from '../ui/modals/Calculator';
import { Transactions } from '../ui/wallet/transactions';
import { UserCard } from '../ui/wallet/UserWalletCard';
import { Banner } from '../ui/banners/BannerWallet';
import { InfoBlock } from '../ui/wallet/InfoWalletBlock';
import Footer from '../ui/layout/footer';

export default function WalletPage() {
  const { user } = useGlobalStore();

  return (
    <motion.div
      className='p-2 text-white'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {user && (
        <>
          <div className='rounded-b-[40px]'>
            <UserCard telegramId={user.telegram_id} balance={user.balance} />
          </div>
          <CalculatorButton />
          <Banner />
          <Transactions />
          <InfoBlock />
          <Footer />
        </>
      )}
    </motion.div>
  );
}
