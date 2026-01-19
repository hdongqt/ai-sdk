import { UIMessage, convertToModelMessages } from 'ai';
import { myAgent } from '@/app/agent/agent';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await myAgent().stream({
    messages: await convertToModelMessages(messages),
  });

  // Đảm bảo stream chạy đến khi hoàn tất để kích hoạt onFinish ngay cả khi client ngắt kết nối
  result.consumeStream();

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => crypto.randomUUID(),
    onFinish: async ({ messages }) => {
      console.log('--- onFinish triggered ---');
      if (!chatId) {
        console.error('Lỗi: chatId không tồn tại!');
        return;
      }
      console.log('chatId:', chatId);
      console.log('Number of messages:', messages.length);
      console.log('User ID:', user?.id);

      try {
        // 1. Lưu/Cập nhật thông tin cuộc trò chuyện
        const firstUserMessage = messages.find((m) => m.role === 'user');
        const titlePart = firstUserMessage?.parts?.find(
          (p: any) => p.type === 'text'
        ) as any;
        const title =
          titlePart?.text?.substring(0, 100) || 'Cuộc trò chuyện mới';

        console.log('Upserting chat:', chatId);
        const { error: chatError } = await supabase.from('chats').upsert({
          id: chatId,
          user_id: user?.id,
          title: title,
          updated_at: new Date().toISOString(),
        });

        if (chatError) {
          console.error('Lỗi khi upsert chat:', chatError);
        } else {
          console.log('Upsert chat thành công');
        }

        // 2. Lưu tất cả tin nhắn vào database
        console.log('Upserting messages...');
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        for (const msg of messages) {
          // Nếu ID không phải là UUID (ví dụ: ID từ client), ta cần xử lý
          const msgId = uuidRegex.test(msg.id) ? msg.id : crypto.randomUUID();

          const { error: msgError } = await supabase.from('messages').upsert({
            id: msgId,
            chat_id: chatId,
            role: msg.role,
            content: JSON.stringify(msg.parts || []),
            created_at: new Date().toISOString(),
          });

          if (msgError) {
            console.error(
              `Lỗi khi upsert message ${msg.id} (as ${msgId}):`,
              msgError
            );
          }
        }
        console.log(
          'Đã hoàn thành quá trình lưu lịch sử chat cho chatId:',
          chatId
        );
      } catch (error) {
        console.error('Lỗi nghiêm trọng trong onFinish:', error);
      }
    },
  });
}
