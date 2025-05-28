
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AdminChatbot = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <div id="admin-chatbot">
      <zapier-interfaces-chatbot-embed 
        is-popup='true' 
        chatbot-id='cmb7jfprk007i1067dtq0flfo'
      />
    </div>
  );
};

export default AdminChatbot;
