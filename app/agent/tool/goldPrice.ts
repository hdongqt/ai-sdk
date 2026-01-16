import { tool } from 'ai';
import z from 'zod';

export const goldPriceTool = tool({
  description: 'Get the gold price in Vietnam, Giá vàng mới nhất',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const response = await fetch(
        'https://vapi.vnappmob.com/api/v2/gold/doji',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VNAPPMOB_API_KEY}`,
          },
        }
      );
      const jsonObj = await response.json();
      const results = jsonObj.results;

      if (!results || !Array.isArray(results) || results.length === 0) {
        return { status: 'error', message: 'SYSTEM_ERROR: Invalid gold data' };
      }

      const item = results[0];
      const formatPrice = (price: string) => {
        return new Intl.NumberFormat('vi-VN').format(parseFloat(price));
      };

      const data = [
        {
          name: 'Hà Nội',
          buy: formatPrice(item.buy_hn),
          sell: formatPrice(item.sell_hn),
        },
        {
          name: 'TP. Hồ Chí Minh',
          buy: formatPrice(item.buy_hcm),
          sell: formatPrice(item.sell_hcm),
        },
        {
          name: 'Đà Nẵng',
          buy: formatPrice(item.buy_dn),
          sell: formatPrice(item.sell_dn),
        },
        {
          name: 'Cần Thơ',
          buy: formatPrice(item.buy_ct),
          sell: formatPrice(item.sell_ct),
        },
      ];

      return { status: 'success', data, datetime: item.datetime };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'SYSTEM_ERROR: Gold service unavailable',
      };
    }
  },
});
