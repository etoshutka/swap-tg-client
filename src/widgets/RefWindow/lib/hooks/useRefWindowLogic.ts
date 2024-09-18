import { getIsWindowOpen, globalActions, GlobalWindow } from '@/entities/Global';
import { getTgWebAppSdk } from '@/shared/lib/helpers/getTgWebAppSdk';
import { getWallets, Wallet } from '@/entities/Wallet';
import { useDispatch, useSelector } from 'react-redux';
import { referralApi } from '@/entities/Referral';

export const useRefWindowLogic = () => {
  const dispatch = useDispatch();

  const isWindowOpen: boolean = useSelector(getIsWindowOpen)(GlobalWindow.Referral);
  const wallets: Wallet[] = useSelector(getWallets);

  const { data } = referralApi.useGetReferralProgramQuery(undefined, { skip: !wallets.length });

  const handleWindowClose = async () => {
    dispatch(globalActions.removeWindow(GlobalWindow.Referral));
  };

  const handleSendLinkClick = async () => {
    const TgWebAppSdk = await getTgWebAppSdk();
    if (!TgWebAppSdk || !data?.data) return;
    TgWebAppSdk.openTelegramLink(`https://t.me/share?url=${data.data.link}&text=Join to TestCryptoSwapBot for crypto exchange into telegram 🍻`);
  };

  return {
    flow: {
      handleWindowClose,
      handleSendLinkClick,
    },
    state: {
      refProgram: data?.data,
      isWindowOpen,
    },
  };
};
