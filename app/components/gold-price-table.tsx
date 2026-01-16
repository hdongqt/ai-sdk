const GoldPriceTable = ({ data }: { data: any }) => {
  const list = data?.data || data;
  const isError = data?.status === 'error' || !Array.isArray(list);
  const datetime = data?.datetime;

  if (isError) {
    return (
      <div className="my-2 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-medium">
          {data?.message || 'Không thể lấy thông tin giá vàng.'}
        </p>
      </div>
    );
  }

  const formattedTime = datetime
    ? new Date(parseInt(datetime) * 1000).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-card border-border my-3 max-w-md overflow-hidden rounded-2xl border shadow-md">
      <div className="flex items-center justify-between bg-linear-to-r from-amber-500 to-yellow-600 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">💰</span>
          <h3 className="text-sm font-bold tracking-wider uppercase">
            Bảng Giá Vàng DOJI
          </h3>
        </div>
        {formattedTime && (
          <span className="text-[10px] font-medium text-white/80">
            {formattedTime}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground bg-muted/50 border-border border-b text-[10px] uppercase">
            <tr>
              <th className="px-4 py-2 font-semibold">Khu vực</th>
              <th className="px-4 py-2 text-right font-semibold">Mua vào</th>
              <th className="px-4 py-2 text-right font-semibold">Bán ra</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {list.map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="text-foreground px-4 py-3 text-xs font-medium">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 tabular-nums">
                  {item.buy}
                </td>
                <td className="px-4 py-3 text-right font-bold text-rose-600 tabular-nums">
                  {item.sell}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-muted/20 border-border border-t px-4 py-2">
        <p className="text-muted-foreground text-center text-[10px] italic">
          * Đơn vị: VNĐ/lượng. Giá biến động theo thị trường.
        </p>
      </div>
    </div>
  );
};

export default GoldPriceTable;
