import { tool } from 'ai';
import { z } from 'zod';

export const searchTool = tool({
  description:
    'You MUST call the search tool when the user asks for information that requires searching the internet, news, or general knowledge.',
  inputSchema: z.object({
    query: z.string().describe('The search query to execute.'),
  }),
  execute: async ({ query }) => {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERP_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    });
    const data = await response.json();
    return {
      status: 'success',
      data: data.organic ? data.organic.slice(0, 5) : [],
    };
  },
});
