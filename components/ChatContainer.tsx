'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { sendChatMessage, ApiError } from '@/lib/api';
import { getOrCreateUserId } from '@/lib/utils';
import { 
  fetchShopConfig, 
  getShopId, 
  ShopConfig, 
  DEFAULT_CONFIG,
  generateCSSVariables 
} from '@/lib/shopConfig';

export default function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [shopConfig, setShopConfig] = useState<ShopConfig>(DEFAULT_CONFIG);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load shop configuration on mount
  useEffect(() => {
    const initializeShopConfig = async () => {
      try {
        const shopId = getShopId();
        const config = await fetchShopConfig(shopId);
        setShopConfig(config);

        // Apply CSS variables for theme colors
        const root = document.documentElement;
        root.style.cssText = generateCSSVariables(config);
      } catch (error) {
        console.error('Failed to initialize shop config:', error);
        setShopConfig(DEFAULT_CONFIG);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    initializeShopConfig();
  }, []);

  // Initialize user ID and welcome message
  useEffect(() => {
    if (isLoadingConfig) return;

    // Initialize user ID
    const id = getOrCreateUserId();
    setUserId(id);

    // Add welcome message from config
    const welcomeMessage: ChatMessageType = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: shopConfig.welcomeMessage,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [isLoadingConfig, shopConfig.welcomeMessage]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!userId || isLoading) return;

    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: 'user-' + Date.now(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API with shop ID for personalized responses
      const response = await sendChatMessage({
        user_uuid: userId,
        msg: content,
        shop_id: shopConfig.shopId, // Include shop context
      });

      // Check if response contains an error
      if ('error' in response) {
        const errorMessage: ChatMessageType = {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: response.error,
          timestamp: new Date(),
          error: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const botMessage: ChatMessageType = {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          content: response.bot_message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorContent = 'Sorry, something went wrong. Please try again.';
      
      if (error instanceof ApiError) {
        if (error.isNetworkError) {
          errorContent = '🔌 Unable to connect to the server. Please check your connection and try again.';
        } else {
          errorContent = error.message;
        }
      }

      const errorMessage: ChatMessageType = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessageType = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: `Chat cleared! How can I help you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  if (isLoadingConfig) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin">⏳</div>
          <p className="mt-4 text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  // Dynamic header gradient based on brand color
  const headerStyle = {
    background: `linear-gradient(135deg, ${shopConfig.brandColor}, ${shopConfig.accentColor || shopConfig.brandColor})`,
  };

  return (
    <div 
      className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white"
      style={{
        '--chatbot-brand-color': shopConfig.brandColor,
        '--chatbot-accent-color': shopConfig.accentColor || shopConfig.brandColor,
        '--chatbot-text-color': shopConfig.textColor,
      } as React.CSSProperties}
    >
      {/* Header with Dynamic Branding */}
      <div className="text-white px-6 py-4 shadow-lg" style={headerStyle}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {shopConfig.logoUrl ? (
              <img 
                src={shopConfig.logoUrl} 
                alt={shopConfig.assistantName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                {shopConfig.triggerButtonEmoji}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{shopConfig.assistantName}</h1>
              <p className="text-sm opacity-90">Here to help you</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            aria-label="Clear chat"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              assistantName={shopConfig.assistantName}
              brandColor={shopConfig.brandColor}
            />
          ))}
          {isLoading && <TypingIndicator brandColor={shopConfig.brandColor} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Ask me anything..."
            brandColor={shopConfig.brandColor}
          />
        </div>
      </div>
    </div>
  );
}
