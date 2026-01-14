
const GoldPriceTable = ({ data }: { data: any }) => {
  const list = data?.data || data;
  const isError = data?.status === 'error' || !Array.isArray(list);

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-2 flex items-center gap-3 text-red-700">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-medium">{data?.message || 'Không thể lấy thông tin giá vàng.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden my-3 shadow-sm">
      <div className="bg-amber-500/10 px-4 py-2 border-b border-border flex items-center gap-2">
        <span className="text-amber-600">💰</span>
        <h3 className="text-sm font-bold text-amber-800">Bảng Giá Vàng Bảo Tín Minh Châu</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-2 font-medium">Loại vàng</th>
              <th className="px-4 py-2 font-medium text-right">Mua vào</th>
              <th className="px-4 py-2 font-medium text-right">Bán ra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-xs max-w-[150px] truncate">{item.name}</td>
                <td className="px-4 py-3 text-right text-green-600 font-semibold">{item.buy}</td>
                <td className="px-4 py-3 text-right text-red-600 font-semibold">{item.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-muted/20 border-t border-border">
        <p className="text-[10px] text-muted-foreground italic text-center">
          * Giá vàng biến động liên tục, chỉ mang tính chất tham khảo.
        </p>
      </div>
    </div>
  );
};

export default GoldPriceTable;
