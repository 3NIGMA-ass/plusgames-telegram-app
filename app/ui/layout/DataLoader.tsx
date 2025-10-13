'use client';

import { useEffect, useRef, useState } from 'react';
import useGlobalStore from '../../store/useGlobalStore';
import {
  fetchInitialData,
  createUser,
  updateUserTgData,
} from '../../lib/dataQuery';
import LoadingScreen from './LoadingScreen';
import { UserDataTg } from '../../lib/definition';
import { useNotification } from '../../context/NotificContext';
import { useWebApp } from '../../lib/hooks/useWebApp';
import DepositEarningsModal from '../modals/DepositEarningsModal';

export default function DataLoader() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [webAppReady, setWebAppReady] = useState(false);
  const hasShownModalRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hasShownModalRef.current =
        sessionStorage.getItem('hasShownModal') === 'true';
    }
  }, []);

  const [canShowModal, setCanShowModal] = useState(false);

  const { showNotification } = useNotification();
  const WebApp = useWebApp();

  const {
    setUser,
    setTransactions,
    setPartnerEarnings,
    setDepositEarnings,
    setReinvestments,
    setRecentTransactions,
    setTotalUsers,
    setHasPartnerWithMinDeposit,
    setTotalReferrals,
    setAppConfig,
  } = useGlobalStore();

  useEffect(() => {
    if (WebApp && WebApp.initDataUnsafe?.user) {
      setWebAppReady(true);
    }
  }, [WebApp]);

  const animationFrameRef = useRef<number | null>(null);

  function animateProgress(
    target: number,
    duration: number = 500,
  ): Promise<void> {
    return new Promise((resolve) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      let start: number | null = null;
      const initial = progress;
      const delta = target - initial;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progressRatio = Math.min(elapsed / duration, 1);
        const current = Math.round(initial + delta * progressRatio);

        setProgress((prev) => (current > prev ? current : prev));

        if (progressRatio < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          animationFrameRef.current = null;
          resolve();
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    });
  }

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const user = WebApp?.initDataUnsafe?.user;
      if (!user) {
        showNotification(
          'Ошибка инициализации Telegram',
          'error',
          'Не удалось получить данные пользователя Telegram',
        );
        return;
      }

      const telegramId = BigInt(user.id);

      WebApp.lockOrientation();
      WebApp.disableVerticalSwipes();
      WebApp.expand();
      WebApp.setHeaderColor('#000000');
      WebApp.setBottomBarColor('#000000');

      try {
        await animateProgress(15, 300);
        await new Promise((res) => setTimeout(res, 100));
        
        // Добавляем таймаут для fetchInitialData
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await Promise.race([
          fetchInitialData(telegramId),
          timeoutPromise
        ]).catch((err) => {
          console.error('Ошибка загрузки данных:', err);
          return {
            user: null,
            transactions: [],
            partnerEarnings: [],
            depositEarnings: [],
            reinvestments: [],
            recentTransactions: [],
            totalUsers: 0,
            hasPartnerWithMinDeposit: false,
            totalReferrals: 0,
            appConfig: []
          };
        });
        
        if (!isMounted) return;
        await animateProgress(40, 400);
        await new Promise((res) => setTimeout(res, 100));

        const tgUser = user as UserDataTg;

        try {
          if (data.user) {
            const updatedUser = await updateUserTgData(
              data.user.telegram_id.toString(),
              tgUser.first_name,
              tgUser.photo_url,
              tgUser.username,
            );
            setUser(updatedUser);
          } else {
            const newUser = await createUser(
              telegramId,
              tgUser.first_name,
              tgUser.photo_url,
              tgUser.username,
            );
            setUser(newUser);
          }
        } catch (dbError) {
          console.error('Ошибка работы с БД:', dbError);
          // Устанавливаем пользователя из Telegram данных
          setUser({
            telegram_id: telegramId.toString(),
            first_name: tgUser.first_name,
            username: tgUser.username || null,
            photo_url: tgUser.photo_url || null,
            balance: 0,
            deposit_amount: 0,
            total_profit: 0,
            partner_bonus_received: false,
            created_at: new Date(),
            referred_by: null,
            last_deposit_at: null,
          });
        }

        await animateProgress(70, 400);
        await new Promise((res) => setTimeout(res, 100));

        setTransactions(data.transactions || []);
        setPartnerEarnings(data.partnerEarnings || []);
        setDepositEarnings(data.depositEarnings || []);
        setReinvestments(data.reinvestments || []);
        setRecentTransactions(data.recentTransactions || []);
        setTotalUsers(data.totalUsers || 0);
        setHasPartnerWithMinDeposit(data.hasPartnerWithMinDeposit);
        setTotalReferrals(data.totalReferrals || 0);
        setAppConfig(
          data.appConfig?.[0] || {
            id: 1,
            manager_link: 'manager_link',
            referral_percent: 12,
            useapiforcard: false,
            api_amount_ranges: [],
            manager_only_threshold: 0,
          },
        );

        await animateProgress(90, 300);
        await new Promise((res) => setTimeout(res, 100));
        await animateProgress(100, 200);
        await new Promise((res) => setTimeout(res, 100));

        if (isMounted) {
          setIsVisible(false);
          setTimeout(() => {
            setIsDataLoaded(true);
            setCanShowModal(true);
          }, 500);
        }
      } catch (error) {
        console.error('Критическая ошибка загрузки:', error);
        if (isMounted) {
          // Всё равно показываем приложение, даже если данные не загрузились
          await animateProgress(100, 200);
          setIsVisible(false);
          setTimeout(() => {
            setIsDataLoaded(true);
          }, 500);
          
          showNotification(
            'Ошибка подключения',
            'error',
            'Не удалось загрузить данные. Попробуйте позже.',
          );
        }
      }
    };

    if (webAppReady) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webAppReady]);

  if (!isDataLoaded) {
    return <LoadingScreen progress={progress} isVisible={isVisible} />;
  }

  return (
    <>
      {canShowModal && !hasShownModalRef.current && (
        <DepositEarningsModal
          onFinish={() => {
            hasShownModalRef.current = true;
            sessionStorage.setItem('hasShownModal', 'true');
          }}
        />
      )}
    </>
  );
}
