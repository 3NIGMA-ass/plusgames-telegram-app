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
  CardTransferConfirmationDialog: { methodId: string };
}

// Простая заглушка для контекста
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useModal = () => {
  return {
    state: { modals: [] },
    openModal: () => {},
    closeModal: () => {},
    closeAllModals: () => {},
  };
};