import ChatContainer from '@/app/components/chat-container';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', id)
    .order('created_at', { ascending: true });
  // Map database messages to UIMessage format
  const initialMessages =
    messages?.map((m) => {
      let parts: any[] = [];
      let displayContent = '';

      try {
        const parsed = JSON.parse(m.content);
        if (Array.isArray(parsed)) {
          parts = parsed;
          // Extract plain text for the 'content' property if possible
          const textPart = parts.find((p: any) => p.type === 'text');
          if (textPart) displayContent = textPart.text;
        } else {
          parts = [{ type: 'text', text: m.content }];
          displayContent = m.content;
        }
      } catch (e) {
        parts = [{ type: 'text', text: m.content }];
        displayContent = m.content;
      }

      return {
        id: m.id,
        role: m.role,
        content: displayContent,
        parts: parts,
      };
    }) || [];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <ChatContainer id={id} initialMessages={initialMessages} />
    </div>
  );
}
