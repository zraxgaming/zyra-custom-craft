
declare namespace JSX {
  interface IntrinsicElements {
    'zapier-interfaces-chatbot-embed': {
      'is-popup'?: string;
      'chatbot-id'?: string;
      [key: string]: any;
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'is-popup'?: string;
        'chatbot-id'?: string;
      };
    }
  }
}

export {};
