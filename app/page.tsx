'use client';

import ChatContainer from '@/app/components/chat-container';

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <ChatContainer />
    </div>
  );
}
