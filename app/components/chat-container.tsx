'use client';

import GoldPriceTable from '@/app/components/gold-price-table';
import WeatherCard from '@/app/components/weather-card';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';

interface ChatContainerProps {
  id?: string;
  initialMessages?: any[];
}

const EMPTY_MESSAGES: any[] = [];

export default function ChatContainer({
  id,
  initialMessages = EMPTY_MESSAGES,
}: ChatContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();
  const { firstMsg, clearFirstMsg, setFirstMsg } = useChatStore();

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    id,
  });
  const hasSentFirstMsg = useRef(false);
  const hasSetInitialMessages = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialMessages.length > 0 && !hasSetInitialMessages.current) {
      setMessages(initialMessages);
      hasSetInitialMessages.current = true;
    }
  }, [initialMessages, setMessages]);

  useEffect(() => {
    if (
      id &&
      firstMsg &&
      !hasSentFirstMsg.current &&
      status === 'ready' &&
      messages.length === 0
    ) {
      hasSentFirstMsg.current = true;
      const msgToSend = firstMsg;
      clearFirstMsg();
      sendMessage({ text: msgToSend }, { body: { chatId: id } });
    }
  }, [id, firstMsg, status, sendMessage, messages.length, clearFirstMsg]);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
      textareaRef.current.style.overflowY =
        scrollHeight > 200 ? 'auto' : 'hidden';
    }
  }, [input]);

  if (!mounted) return null;

  const handleFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (!id) {
      const newId = crypto.randomUUID();
      setFirstMsg(currentInput);
      router.push(`/chat/${newId}`);
      return;
    }

    try {
      await sendMessage({ text: currentInput }, { body: { chatId: id } });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
            <div className="bg-card border-border focus-within:ring-primary/30 relative flex w-full flex-col overflow-hidden rounded-[26px] border shadow-sm transition-all focus-within:ring-2">
              <textarea
                ref={textareaRef}
                rows={1}
                className="placeholder:text-muted-foreground w-full resize-none bg-transparent py-[14px] pr-12 pl-4 text-sm focus:outline-none"
                value={input}
                placeholder="Nhập tin nhắn cho AI vip pro..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                style={{
                  minHeight: '48px',
                  maxHeight: '200px',
                  overflow: 'hidden',
                }}
              />
              <button
                type={isLoading ? 'button' : 'submit'}
                onClick={isLoading ? () => stop() : undefined}
                disabled={!isLoading && !input.trim()}
                className={`absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 focus:outline-none ${
                  isLoading
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground'
                }`}
              >
                {isLoading ? (
                  <div className="h-3 w-3 animate-pulse rounded-sm bg-current" />
                ) : (
                  <ArrowUp size={16} strokeWidth={3} />
                )}
              </button>
            </div>
          </form>
          <p className="text-muted-foreground mt-2 text-center text-[10px]">
            AI vip pro có thể đưa ra thông tin chưa chính xác. Dong Dev. 🔥
          </p>
        </div>
      </footer>
    </div>
  );
}
