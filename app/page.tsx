'use client';

import GoldPriceTable from '@/app/components/gold-price-table';
import WeatherCard from '@/app/components/weather-card';
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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
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
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.length === 0 && (
            <div className="space-y-4 py-20 text-center">
              <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
                👋
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Xin chào Boss!
              </h2>
              <p className="text-muted-foreground mx-auto max-w-sm">
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
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card border-border rounded-tl-none border'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message?.parts?.length > 0 &&
                      message.parts.map((part: any, i) => {
                        if (
                          part.type === 'text' &&
                          message.parts.findIndex((p: any) =>
                            p.type.startsWith('tool')
                          ) === -1
                        ) {
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="relative inline whitespace-pre-wrap"
                            >
                              {part.text}
                              {isLastMessage && isAI && isLoading && (
                                <span className="bg-primary ml-1 inline-block h-4 w-1.5 animate-pulse align-middle" />
                              )}
                            </div>
                          );
                        }
                        if (part.type.startsWith('tool')) {
                          if (part.type === 'tool-weather') {
                            return (
                              <WeatherCard
                                key={`${message.id}-${i}`}
                                data={(part.output as any)?.data}
                              />
                            );
                          }
                          if (part.type === 'tool-goldPrice') {
                            return (
                              <GoldPriceTable
                                key={`${message.id}-${i}`}
                                data={(part.output as any)?.data}
                              />
                            );
                          }
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
      <footer className="from-background via-background sticky bottom-0 bg-gradient-to-t to-transparent p-4">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              className="glass border-border focus:ring-primary/50 placeholder:text-muted-foreground w-full rounded-2xl border py-4 pr-12 pl-4 shadow-lg transition-all focus:ring-2 focus:outline-none"
              value={input}
              placeholder="Nhập tin nhắn cho AI vip pro..."
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground absolute top-2 right-2 bottom-2 flex items-center justify-center rounded-xl px-4 font-medium transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                'Gửi'
              )}
            </button>
          </form>
          <p className="text-muted-foreground mt-2 text-center text-[10px]">
            AI vip pro có thể đưa ra thông tin chưa chính xác. Thành quả của
            Dong Dev. 🔥
          </p>
        </div>
      </footer>
    </div>
  );
}
