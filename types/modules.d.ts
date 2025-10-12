// Типы для внешних модулей

declare module 'swr' {
  export default function useSWR<T = any>(
    key: string,
    fetcher: (url: string) => Promise<T>,
    options?: {
      refreshInterval?: number;
      revalidateOnFocus?: boolean;
    }
  ): {
    data: T | undefined;
    error: any;
    isLoading: boolean;
  };
}

declare module 'next/image' {
  import { ComponentType } from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    unoptimized?: boolean;
  }
  
  const Image: ComponentType<ImageProps>;
  export default Image;
}

declare module 'lucide-react' {
  import { ComponentType } from 'react';
  
  interface IconProps {
    className?: string;
    size?: number;
  }
  
  export const ArrowDownRight: ComponentType<IconProps>;
  export const ArrowUpRight: ComponentType<IconProps>;
}

declare module 'react-slick' {
  import { ComponentType } from 'react';
  
  interface SliderProps {
    children: React.ReactNode;
    beforeChange?: (oldIndex: number, newIndex: number) => void;
    ref?: (ref: any) => void;
    [key: string]: any;
  }
  
  const Slider: ComponentType<SliderProps>;
  export default Slider;
}

declare module 'tailwindcss' {
  const tailwindcss: any;
  export default tailwindcss;
}

declare module '@twa-dev/sdk' {
  const WebApp: any;
  export default WebApp;
}

declare module '@twa-dev/types' {
  export interface WebApp {
    initData: string;
    initDataUnsafe: any;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    isVerticalSwipesEnabled: boolean;
    isHorizontalSwipesEnabled: boolean;
    ready(): void;
    expand(): void;
    close(): void;
    sendData(data: string): void;
    openLink(url: string, options?: { try_instant_view?: boolean }): void;
    openTelegramLink(url: string): void;
    openInvoice(url: string, callback?: (status: string) => void): void;
    showPopup(params: any, callback?: (buttonId: string) => void): void;
    showAlert(message: string, callback?: () => void): void;
    showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
    showScanQrPopup(params: any, callback?: (text: string) => void): void;
    closeScanQrPopup(): void;
    readTextFromClipboard(callback?: (text: string) => void): void;
    requestWriteAccess(callback?: (granted: boolean) => void): void;
    requestContact(callback?: (granted: boolean) => void): void;
    hapticFeedback(type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    cloudStorage: {
      setItem(key: string, value: string, callback?: (error: string | null) => void): void;
      getItem(key: string, callback: (error: string | null, value: string | null) => void): void;
      getItems(keys: string[], callback: (error: string | null, values: Record<string, string>) => void): void;
      removeItem(key: string, callback?: (error: string | null) => void): void;
      removeItems(keys: string[], callback?: (error: string | null) => void): void;
      getKeys(callback: (error: string | null, keys: string[]) => void): void;
    };
    biometricManager: {
      isBiometricAvailable(callback: (available: boolean) => void): void;
      requestAccess(callback: (granted: boolean) => void): void;
      authenticate(callback: (authenticated: boolean) => void): void;
      updateBiometricToken(token: string, callback?: (updated: boolean) => void): void;
      openSettings(): void;
    };
    mainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      isProgressVisible: boolean;
      setText(text: string): void;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
      show(): void;
      hide(): void;
      enable(): void;
      disable(): void;
      showProgress(leaveActive?: boolean): void;
      hideProgress(): void;
      setParams(params: any): void;
    };
    backButton: {
      isVisible: boolean;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
      show(): void;
      hide(): void;
    };
    settingsButton: {
      isVisible: boolean;
      onClick(callback: () => void): void;
      offClick(callback: () => void): void;
      show(): void;
      hide(): void;
    };
    hapticFeedback: {
      impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
      notificationOccurred(type: 'error' | 'success' | 'warning'): void;
      selectionChanged(): void;
    };
    onEvent(eventType: string, eventHandler: () => void): void;
    offEvent(eventType: string, eventHandler: () => void): void;
    sendData(data: string): void;
    switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  }
}
