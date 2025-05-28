
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatBotProps {
  type: 'customer' | 'admin';
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ type, isOpen, onToggle }) => {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Load Zapier Interfaces script
    const script = document.createElement('script');
    script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
    script.type = 'module';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Don't show admin bot to non-admin users
  if (type === 'admin' && !isAdmin) {
    return null;
  }

  // Don't show customer bot to admin users when admin bot is available
  if (type === 'customer' && isAdmin) {
    return null;
  }

  const chatbotId = type === 'admin' 
    ? 'cmb7jfprk007i1067dtq0flfo' 
    : 'cmb7qi8k400ejvoldtd71q4kc';

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <zapier-interfaces-chatbot-embed 
        is-popup="true" 
        chatbot-id={chatbotId}
      />
    </div>
  );
};

export default ChatBot;
