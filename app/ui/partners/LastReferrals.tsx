/* eslint-disable @typescript-eslint/no-explicit-any */
const RefreshCw = (props: any) => <span {...props}>🔄</span>;
import Image from 'next/image';
import useGlobalStore from '../../store/useGlobalStore';
import { useNotification } from '../../context/NotificContext';
import { useState } from 'react';
import { getPartnerEarningsByTelegramId } from '../../lib/dataQuery';
import clsx from 'clsx';

const logoBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABDCAYAAAAlFqMKAAAAAXNSR0IArs4c6QAABChJREFUeF7tmknIFEcUx38vmqgxxgXjSQkIogYEFdSTiB5cUEkQNSEu8SCCKKgIbrgveFE86CV6CEriinpISA4GxLvmEFFIDh7EDT0EkbhEzbMf1MDMONNdPf11f9rV7zQwVUW9X7/616t6JVTWQEAqHo0EKiBNEVEBqYDEi0QVIUVHiKoOBkYBPTMI+P/AAxH5O8MYXl1zjxBV/RI4AXzqNaPWjV4APwErROR1hnESuxYB5CvgeEYg5shFYImI/JvoVYYG7xuQxSLyNIO/iV3fJyAXXIRUQNxnLQ2QJFE1wfwP6JcQzwbElsyzxLjP0KCIJWNATFT7t5in7Rg3gFuAiW+cnXdAnmfwN7FrdwO5BxwB7ritOWggT4CzwFZgSpS8nQ4pQpoTM9ON34EdInJNVb8OGYjpxp/AfhE5Z1ERMhB1emG6cUhEXjogC12ExGlaqUS1tmQeAyfdUnlU0wxVXQCcAnrE6Ihtu4tEpDS7TO963ah3PMQl8wNw2+nGmeYoCBHIfuDHKBs9KCK2wzRYaECmAXOAAyJiidhblgKIachbQBPTzxQN2qq6qg6ILmVGAH1TjNfc1M4d5sBrEbnebhxPIFeiW7e9USL3KsN8bFe7LyJ2VGhpcUCmurT6iw4nYBO/CuwTkV/ixvAE0uE0Grr9A3wfRdnm7gBiImrL5HCSJyEAqZ1TtonI/dCBmG5cAnbbOSUJRorU3WeopDaFLxlv3eggMUty1uf/woF460YTEBPw7T4exbTpBQwDhsa0KRRIKt3I6HxDd1W1M9AYYBNgVwntrDAgqXWjq4CoqqUOlhWrgHXAR90NpCPd6EIglkB+G423E/gsYdxCIqQj3egKIKpqJ+jpwC5grMeYuQPpTt2w4vn4qISxBbCbfR/LHchfwFHgD5/ZxLR5KCI3fcdwuvE5sNZph+/LgtyB+PqQ1O6MiHyT1Kj2v6oOimo5S91WPdC3H1A+IKraB5htmTAwOgUMa1ouIKr6ITDB1XJmpYRRLiBON4YD64GVHcAoHRDTjWVON1rViX0YZVoy46I1twYwNc9iQ6KSZdIlU6yoquonwERgfge6UT93SxN+FpFj7RwqotjtU6ZsC0RVLRW32q+dVY6IiD2dyM3eaSCq+oGLiI12RkmzNXdK7F0HYmeT5e4U+1vQQFTVbvvnRl/aDm0jo0hJlbyVKkKcbkyOyhfbnH6Yf2ECcbphL542A9/lfdlggdhTcMs3TEjtd83CA6KqHwMznW7YNltvYQGxR7ku+TLdmNFCFIMDYkvEzimroxuwVulAUEB+Bey92Z6YMkJQQOyd6l1gUkz+EBQQnzyqAhLyLlNFiA+BskbIPPfgzi6Hs1hpNMSKSVZzjavK+4C6LCJ2056r5X4fkuvscxi8AtIEtQJSAYlfZ1WEVBESHyFvANHHIWJcS1L4AAAAAElFTkSuQmCC';

export function LastReferrals() {
  const { user, partnerEarnings, setPartnerEarnings } = useGlobalStore();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (!user?.telegram_id || isLoading) return;

    setIsLoading(true);
    try {
      const earnings = await getPartnerEarningsByTelegramId(BigInt(user.telegram_id));
      setPartnerEarnings(earnings);
      showNotification('Данные обновлены', 'success');
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
      showNotification('Ошибка обновления', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const recentEarnings = partnerEarnings.slice(0, 5);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Последние рефералы</h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={clsx(
            'flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          )}
        >
          <RefreshCw className={clsx('h-4 w-4', isLoading && 'animate-spin')} />
          Обновить
        </button>
      </div>

      {recentEarnings.length === 0 ? (
        <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6 text-center">
          <div className="mx-auto mb-4 h-16 w-16">
            <Image
              src={logoBase64}
              alt="Logo"
              width={64}
              height={64}
              className="h-full w-full object-contain opacity-50"
            />
          </div>
          <p className="text-sm text-zinc-400">
            Пока нет рефералов. Пригласите друзей по вашей ссылке!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentEarnings.map((earning, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Реферал #{index + 1}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {new Date(earning.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-400">
                  +{earning.amount.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-xs text-zinc-400">15% от депозита</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}