import React from 'react';

interface TypingIndicatorProps {
  brandColor?: string;
  assistantName?: string;
}

export default function TypingIndicator({ 
  brandColor = '#667eea',
  assistantName = 'Assistant'
}: TypingIndicatorProps) {
  return (
    <div className="flex w-full mb-4 justify-start animate-fade-in">
      <div className="flex items-start max-w-[80%]">
        {/* Avatar */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mr-2"
          style={{
            background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
          }}
        >
          🤖
        </div>

        {/* Typing Bubble */}
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: brandColor,
                animationDelay: '0ms' 
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: brandColor,
                animationDelay: '150ms' 
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-bounce" 
              style={{ 
                backgroundColor: brandColor,
                animationDelay: '300ms' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
