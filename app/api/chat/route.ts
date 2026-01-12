import { z } from 'zod';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { createGroq } from '@ai-sdk/groq';



export async function POST(req: Request) {
  

const rawKeys = process.env.GROQ_API_KEY;
  
  if (!rawKeys) {
    throw new Error('GROQ_API_KEY not found');
  }

  const keys = rawKeys.split(',').map(k => k.trim());
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  const groq = createGroq({
    apiKey: randomKey,
  });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile',),
    // @ts-ignore
    maxSteps: 5,
    messages: await convertToModelMessages(messages),
    system: `
    # IDENTITY
      - Name: AI vip pro.
      - Created by: Created by Dong Dev
      - Mission: Support users in solving all problems related to programming, daily life, and entertainment...
    # RESPONSE STYLE
      - Language: From prompt of user, default Vietnamese, using a youthful, modern, yet polite style.
      - Frequently use emojis such as: 🔥, 🚀, ✨, 😎.
    # RULES
      - If someone asks about the origin: Always affirm 
        "I am AI vip pro, a passionate creation by Dong Dev".
      - If asked to do unethical or wrongful actions: Politely refuse and say 
        "Dong Dev didn't teach me to do that".
      - Always prioritize short, concise, and straight-to-the-point responses.
    # SENSITIVE WORD HANDLING RULES
      - If encountering sensitive words, replace them with *.

    # TOOL USAGE RULES (CRITICAL):
    - If the user asks about weather, temperature, or thời tiết: You MUST call the 'weather' tool.
    - If the user asks about gold prices or giá vàng: You MUST call the 'goldPrice' tool.
    - Gold price data is only available for Vietnam (Bảo Tín Minh Châu). If the user asks for gold prices elsewhere, inform them that data is currently unavailable.
    - AFTER calling a tool, do NOT provide a text summary of the result. The UI will handle the display automatically. 
    - You should only provide a brief introductory text (if any) before the tool call, or simply call the tool.
    - If a tool returns an error, you can provide a short apology in text.

    # HANDLING TOOL ERRORS
    - If the tool response contains the keyword "SYSTEM_ERROR", inform the user that the service is temporarily experiencing a technical issue.
    - Apologize sincerely and suggest the user check again after a few minutes.
    - Absolutely DO NOT repeat raw technical error codes to the user.
  `,
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const apiKey = process.env.OPENWEATHER_API_KEY;
          if (!apiKey) {
             return { status: 'error', message: 'SYSTEM_ERROR: API key not found' };
          }
          try {
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=vi`
            );
            const weatherData = await weatherRes.json();
            
            if (!weatherRes.ok) {
                return { status: 'error', message: `SYSTEM_ERROR: ${weatherData.message || 'Weather service error'}` };
            }

            return {
                status: 'success',
                data: {
                    name: weatherData?.name,
                    temp: weatherData?.main?.temp,
                    description: weatherData?.weather[0].description,
                }
            }
          } catch (error) {
            return { status: 'error', message: 'SYSTEM_ERROR: Can not connect to weather service' };
          }
        },
      }),
      goldPrice: tool({
        description: 'Get the gold price in Vietnam, Giá vàng mới nhất',
        inputSchema: z.any(),
        execute: async () => {
          try {
            const response = await fetch('http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3kd8ub1llcg9t45hnoh8hmn7t5kc2v');
            const jsonObj = await response.json();
            const dataList = jsonObj.DataList?.Data;

            if (!dataList || !Array.isArray(dataList)) {
                return { status: 'error', message: 'SYSTEM_ERROR: Invalid gold data' };
            }

            const data = dataList.slice(0, 5).map((item: any) => {
              const row = item["@row"];
              return {
                name: item[`@n_${row}`],
                buy: item[`@pb_${row}`],
                sell: item[`@ps_${row}`],
                time: item[`@d_${row}`],
              };
            });

            return { status: 'success', data };
          } catch (error: any) {
            return { status: 'error', message: 'SYSTEM_ERROR: Gold service unavailable' };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
