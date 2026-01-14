const WeatherCard = ({ data }: { data: any }) => {
  const weatherInfo = data?.data || data;
  const isError = data?.status === 'error' || !weatherInfo;

  if (isError) {
    return (
        <p className="text-sm font-medium">{data?.message || 'Không thể lấy thông tin thời tiết.'}</p>
    );
  }

  const { name, temp, description } = weatherInfo;

  return (
    <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-5 my-3 shadow-lg shadow-blue-500/20 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold opacity-90">{name || 'Vị trí không xác định'}</h3>
            <p className="text-sm opacity-80 capitalize">{description || 'Bầu trời quang đãng'}</p>
          </div>
          <span className="text-4xl">🌤️</span>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter">{Math.round(temp) || 0}</span>
          <span className="text-2xl font-medium">°C</span>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default WeatherCard;
