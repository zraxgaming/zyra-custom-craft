
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  type: 'customer' | 'admin';
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ type, isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const greeting = type === 'customer' 
        ? "Hi! I'm here to help you with any questions about our products or orders. How can I assist you today?"
        : "Welcome to the admin support bot! I can help you with order management, customer queries, and system issues. What do you need help with?";
      
      setMessages([{
        id: '1',
        text: greeting,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, type, messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input, type),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string, chatType: 'customer' | 'admin'): string => {
    const input = userInput.toLowerCase();
    
    if (chatType === 'customer') {
      if (input.includes('order') || input.includes('shipping')) {
        return "I can help you track your order! Please provide your order number and I'll look it up for you. You can also check your order status in your account dashboard.";
      }
      if (input.includes('return') || input.includes('refund')) {
        return "We offer a 30-day return policy for most items. You can initiate a return from your account page or contact our support team for assistance.";
      }
      if (input.includes('product') || input.includes('custom')) {
        return "Our products are fully customizable! You can add text, images, and choose from various materials. Would you like me to guide you through the customization process?";
      }
      if (input.includes('payment') || input.includes('price')) {
        return "We accept all major credit cards and Ziina payments. Pricing varies by product and customization options. Check our products page for detailed pricing.";
      }
      return "I understand you need help. Could you please provide more details about your specific question? I'm here to assist with orders, products, returns, and general inquiries.";
    } else {
      if (input.includes('order') || input.includes('customer')) {
        return "For order management, you can use the Admin Orders section to view, update, and process customer orders. Need help with a specific order?";
      }
      if (input.includes('product') || input.includes('inventory')) {
        return "You can manage products and inventory through the Admin Products section. This includes adding new products, updating stock, and managing categories.";
      }
      if (input.includes('email') || input.includes('newsletter')) {
        return "Email campaigns can be managed through the Newsletter section. You can create campaigns, manage subscribers, and track email performance.";
      }
      if (input.includes('analytics') || input.includes('stats')) {
        return "Check the Analytics dashboard for detailed insights on sales, traffic, and customer behavior. All key metrics are available there.";
      }
      return "I can help you with order management, product administration, email campaigns, analytics, and system configuration. What specific area do you need assistance with?";
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-blue-500" />
            {type === 'customer' ? 'Support Chat' : 'Admin Assistant'}
            <Badge variant="outline" className="text-xs">
              {type === 'customer' ? 'Customer' : 'Admin'}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[280px]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-lg p-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="text-sm"
            />
            <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
