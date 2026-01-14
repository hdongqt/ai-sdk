import { UIMessage, convertToModelMessages } from 'ai';
import { myAgent } from '@/app/agent/agent';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await myAgent().stream({
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
