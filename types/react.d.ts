// Типы для React
declare module 'react' {
  export = React;
  export as namespace React;
  
  namespace React {
    type ReactNode = any;
    type ReactElement = any;
    type ComponentType<P = {}> = any;
    type FC<P = {}> = (props: P) => ReactElement | null;
    
    interface Component<P = {}, S = {}> {
      state: S;
      props: P;
      setState(state: Partial<S> | ((prevState: S) => Partial<S>)): void;
      render(): ReactElement | null;
    }
    
    function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useRef<T>(initialValue: T): { current: T };
    function createElement(type: any, props?: any, ...children: any[]): ReactElement;
  }
  
  export = React;
  export as namespace React;
}
