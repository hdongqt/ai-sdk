import { UIMessage, convertToModelMessages } from 'ai';
import { myAgent } from '@/app/agent/agent';



export async function POST(req: Request) {
  
const rawKeys = process.env.GROQ_API_KEY;
  
  if (!rawKeys) {
    throw new Error('GROQ_API_KEY not found');
  }

  const keys = rawKeys.split(',').map(k => k.trim());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await myAgent(randomKey).stream({
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
