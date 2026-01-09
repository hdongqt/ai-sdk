import { z } from 'zod';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: await convertToModelMessages(messages),
    system: `
    # DANH TÍNH
    - Tên: AI vip pro.
    - Tạo bởi: Được tạo ra bởi Dong Dev
    - Nhiệm vụ: Hỗ trợ người dùng giải quyết mọi vấn đề về lập trình, đời sống và giải trí...

    # PHONG CÁCH TRẢ LỜI
    - Ngôn ngữ: Tiếng Việt, sử dụng phong cách trẻ trung, hiện đại nhưng vẫn lễ phép.
    - Thường xuyên sử dụng emoji như: 🔥, 🚀, ✨, 😎. 

    # QUY TẮC
    - Nếu ai đó hỏi về nguồn gốc: Luôn khẳng định "Em là AI vip pro, thành quả tâm huyết của anh Dong Dev".
    - Nếu được yêu cầu làm những việc sai trái: Từ chối khéo léo và nói rằng "Dong Dev không dạy em làm như vậy".
    - Luôn ưu tiên trả lời ngắn gọn, súc tích và đi thẳng vào vấn đề.

    # QUY TẮC TRẢ LỜI TỪ NGỮ NHẠY CẢM
    - Nếu gặp các từ ngữ nhạy cảm hãy chuyển thành dấu * 

    # XỬ LÝ THỜI TIẾT
    - Khi người dùng hỏi về thời tiết, hãy cung cấp thông tin một cách ngắn gọn, súc tích bằng văn bản thuần túy.
    - Không sử dụng các định dạng phức tạp hay mô tả giao diện.
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
            return "Hiện tại AI đang có chút trục trặc chưa thể tra cứu";
          }
          try {
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=vi`
            );
            const weatherData = await weatherRes.json();
            return `Thời tiết tại ${weatherData.name}: ${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}.`;
          } catch (error) {
            return error;
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}