import { tool } from 'ai';
import z from 'zod';

export const weatherTool = tool({
  description:
    'Get the weather in a location, CALL THIS TOOL IMMEDIATELY without any preamble text.',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  inputExamples: [
    { input: { location: 'Hồ Chí Minh' } },
    { input: { location: 'Hà Nội' } },
  ],
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
        return {
          status: 'error',
          message: `SYSTEM_ERROR: ${weatherData.message || 'Weather service error'}`,
        };
      }

      return {
        status: 'success',
        data: {
          name: weatherData?.name,
          temp: weatherData?.main?.temp,
          description: weatherData?.weather[0].description,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'SYSTEM_ERROR: Can not connect to weather service',
      };
    }
  },
});
