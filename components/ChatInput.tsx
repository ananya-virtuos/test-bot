import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  brandColor?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  brandColor = '#667eea',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Waiting for response...' : placeholder}
            disabled={disabled}
            rows={1}
            className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
              disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'
            }`}
            style={{
              minHeight: '48px',
              maxHeight: '150px',
              }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${brandColor}40, inset 0 1px 3px 0 rgb(0 0 0 / 0.1)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
          />
          {message.trim() && !disabled && (
            <button
              type="submit"
              className="absolute right-2 bottom-2 p-2 transition-colors"
              style={{ color: brandColor }}
              onMouseEnter={(e) => {
                const element = e.currentTarget as HTMLButtonElement;
                const svg = element.querySelector('svg');
                if (svg) svg.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget as HTMLButtonElement;
                const svg = element.querySelector('svg');
                if (svg) svg.style.opacity = '1';
              }}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          )}
        </div>
        {!message.trim() || disabled ? (
          <button
            type="button"
            disabled={disabled}
            className="px-6 py-3 rounded-2xl font-medium transition-all text-white"
            style={{
              background: disabled 
                ? '#d1d5db' 
                : `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              boxShadow: disabled ? 'none' : `0 4px 6px -1px ${brandColor}40`,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.boxShadow = `0 10px 15px -3px ${brandColor}40`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.boxShadow = `0 4px 6px -1px ${brandColor}40`;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Send
          </button>
        ) : null}
      </div>
      <p className="text-xs text-gray-400 mt-2 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
