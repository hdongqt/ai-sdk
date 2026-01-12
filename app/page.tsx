'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';


const WeatherCard = ({ data }: { data: any }) => {
  const weatherInfo = data?.data || data;
  const isError = data?.status === 'error' || !weatherInfo;

  if (isError) {
    return (
        <p className="text-sm font-medium">{data?.message || 'Không thể lấy thông tin thời tiết.'}</p>
    );
  }

  const { name, temp, description } = weatherInfo;

  return (
    <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 my-3 shadow-lg shadow-blue-500/20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold opacity-90">{name || 'Vị trí không xác định'}</h3>
            <p className="text-sm opacity-80 capitalize">{description || 'Bầu trời quang đãng'}</p>
          </div>
          <span className="text-4xl">🌤️</span>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter">{Math.round(temp) || 0}</span>
          <span className="text-2xl font-medium">°C</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

const GoldPriceTable = ({ data }: { data: any }) => {
  const list = data?.data || data;
  const isError = data?.status === 'error' || !Array.isArray(list);

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-2 flex items-center gap-3 text-red-700">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-medium">{data?.message || 'Không thể lấy thông tin giá vàng.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden my-3 shadow-sm">
      <div className="bg-amber-500/10 px-4 py-2 border-b border-border flex items-center gap-2">
        <span className="text-amber-600">💰</span>
        <h3 className="text-sm font-bold text-amber-800">Bảng Giá Vàng Bảo Tín Minh Châu</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-2 font-medium">Loại vàng</th>
              <th className="px-4 py-2 font-medium text-right">Mua vào</th>
              <th className="px-4 py-2 font-medium text-right">Bán ra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-xs max-w-[150px] truncate">{item.name}</td>
                <td className="px-4 py-3 text-right text-green-600 font-semibold">{item.buy}</td>
                <td className="px-4 py-3 text-right text-red-600 font-semibold">{item.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-muted/20 border-t border-border">
        <p className="text-[10px] text-muted-foreground italic text-center">
          * Giá vàng biến động liên tục, chỉ mang tính chất tham khảo.
        </p>
      </div>
    </div>
  );
};


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
    <div className="flex flex-col min-h-screen bg-background" >
      <header className="sticky top-0 z-10 border-b border-border px-4 py-4 bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            AI
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AI vip pro</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={'w-2 h-2 rounded-full bg-green-500'}></span>
              Đang sẵn sàng hỗ trợ Boss
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
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card border border-border rounded-tl-none'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {message?.parts?.length > 0 && message.parts.map((part: any, i) => {
                      if (part.type === 'text' && message.parts.findIndex((p: any) => p.type.startsWith('tool')) === -1) {
                        return (
                          <div key={`${message.id}-${i}`} className="whitespace-pre-wrap relative inline">
                            {part.text}
                            {isLastMessage && isAI && isLoading && (
                              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                            )}
                          </div>
                        );
                      }
                      if (part.type.startsWith('tool')) {
                         if (part.type === 'tool-weather') {
                            return <WeatherCard key={`${message.id}-${i}`} data={(part.output as any)?.data} />;
                         }
                         if (part.type === 'tool-goldPrice') {
                            return <GoldPriceTable key={`${message.id}-${i}`} data={(part.output as any)?.data} />;
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