'use client';

export type ModalType =
  | 'BottomSheet'
  | 'CardTransferDialog'
  | 'WithdrawalRequestDialog'
  | 'CryptoPaymentDialog'
  | 'RequestSuccessDialog'
  | 'QRCodeDialog'
  | 'CardTransferConfirmationDialog';

interface CryptoMethod {
  id: string;
  title: string;
  network: string;
}

export interface ModalProps {
  BottomSheet: { initialActiveTab?: 'Депозит' | 'Вывод' | 'История' };
  CardTransferDialog: { methodId: string };
  WithdrawalRequestDialog: { methodId: string };
  CryptoPaymentDialog: {
    method: CryptoMethod;
    selectedAmount: number;
  };
  RequestSuccessDialog: {
    requestType: 'deposit' | 'withdrawal';
    amount: number;
    method: string;
  };
  QRCodeDialog: { qrData: string; title: string };
  CardTransferConfirmationDialog: { methodId: string; amount: number };
}

// Простая заглушка для контекста
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useModal = () => {
  return {
    state: { modals: [] },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    openModal: (_type?: ModalType, _props?: any) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    closeModal: (_id?: string) => {},
    closeAllModals: () => {},
  };
};