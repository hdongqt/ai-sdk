'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Throttled scroll to bottom to avoid loops and jitter
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!mounted) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      await sendMessage({ text: currentInput });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            AI
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Gemini Assistant</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
              {isLoading ? 'AI vip pro đang suy nghĩ...' : 'Online & Ready'}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl mx-auto flex items-center justify-center text-3xl">
                👋
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Xin chào Boss!</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Em là AI vip pro. Boss muốn em hỗ trợ gì hôm nay không ạ? 🔥
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isAI = message.role !== 'user';

            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card border border-border rounded-tl-none'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.parts.map((part, i) => {
                      console.log(part)
                      switch (part.type) {
                        case 'text':
                          return (
                            <div key={`${message.id}-${i}`} className="whitespace-pre-wrap relative inline">
                              {part.text}
                              {isLastMessage && isAI && isLoading && (
                                <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                              )}
                            </div>
                          );    
                         case 'tool-weather': 
                         return (
                         <div key={`${message.id}-${i}`} className="whitespace-pre-wrap relative inline">
                          {(part as any).output}
                            </div>
                        );
                        case 'tool-invocation':
                          const isCalling = (part as any).state === 'call' || (part as any).toolInvocation?.state === 'call';
                          if (isCalling) {
                            return (
                              <div key={`${message.id}-${i}`} className="flex items-center gap-2 py-2 text-muted-foreground italic">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                <span>Đang lấy thông tin...</span>
                              </div>
                            );
                          }
                          return null;
                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Form */}
      <footer className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              className="w-full glass pl-4 pr-12 py-4 rounded-2xl shadow-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              value={input}
              placeholder="Nhập tin nhắn cho AI vip pro..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Gửi'
              )}
            </button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI vip pro có thể đưa ra thông tin chưa chính xác. Thành quả của Dong Dev. 🔥
          </p>
        </div>
      </footer>
    </div>
  );
}