'use client';

import GoldPriceTable from '@/app/components/gold-price-table';
import WeatherCard from '@/app/components/weather-card';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

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

    try {
      await sendMessage({ text: currentInput });
    } catch (error) {}
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
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card border-border rounded-tl-none border'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message?.parts?.length > 0
                      ? message.parts.map((part: any, i) => {
                          if (
                            part.type === 'text' &&
                            message.parts.findIndex((p: any) => {
                              return (
                                p.type.startsWith('tool-w') &&
                                p.type !== 'tool-search'
                              );
                            }) === -1
                          ) {
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="relative inline wrap-break-word whitespace-pre-wrap"
                              >
                                {part.text
                                  .split(/(https?:\/\/[^\s]+)/g)
                                  .map((segment: string, j: number) => {
                                    if (segment.match(/^https?:\/\/[^\s]+$/)) {
                                      return (
                                        <a
                                          key={j}
                                          href={segment}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary underline transition-opacity hover:opacity-80"
                                        >
                                          {segment}
                                        </a>
                                      );
                                    }
                                    return segment;
                                  })}
                                {isLastMessage &&
                                  isAI &&
                                  status === 'streaming' && (
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
                        })
                      : null}
                  </div>
                </div>
              </div>
            );
          })}

          {(status === 'submitted' ||
            (status === 'streaming' &&
              messages[messages.length - 1]?.role === 'assistant' &&
              messages[messages.length - 1]?.parts?.length === 0)) && (
            <div className="flex justify-start">
              <div className="bg-card border-border max-w-[90%] rounded-2xl rounded-tl-none border px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5 px-1 py-1">
                  <div className="bg-primary/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
                  <div className="bg-primary/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
                  <div className="bg-primary/40 h-1.5 w-1.5 animate-bounce rounded-full" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Form */}
      <footer className="from-background via-background sticky bottom-0 bg-linear-to-t to-transparent p-4">
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
              type={isLoading ? 'button' : 'submit'}
              onClick={isLoading ? () => stop() : undefined}
              disabled={!isLoading && !input.trim()}
              className={`absolute top-2 right-2 bottom-2 flex aspect-square items-center justify-center rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                isLoading
                  ? 'text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive bg-gray-800 shadow-md hover:scale-105 hover:bg-gray-700 active:scale-95'
                  : 'bg-primary text-primary-foreground focus:ring-primary shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
              }`}
            >
              {isLoading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" rx="1.5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
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
