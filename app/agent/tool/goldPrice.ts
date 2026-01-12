import { tool } from "ai";
import z from "zod";

export const goldPriceTool = tool({
    description: 'Get the gold price in Vietnam, Giá vàng mới nhất',
    inputSchema: z.object({}),
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
  });