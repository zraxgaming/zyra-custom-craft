
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonConfig) => {
        render: (element: string) => void;
      };
    };
  }
}

interface PayPalButtonConfig {
  createOrder: (data: any, actions: any) => Promise<any>;
  onApprove: (data: any, actions: any) => Promise<void>;
  onError: (err: any) => void;
  onCancel: (data: any) => void;
  style?: {
    layout?: string;
    color?: string;
    shape?: string;
    label?: string;
    height?: number;
  };
}

export {};
