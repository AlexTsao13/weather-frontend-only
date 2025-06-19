import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WeatherService from "../services/weather.service";
import { WeatherApiResponse, WeatherApiError } from "../types";

const DailyForecast = () => {
  const { city } = useParams<{ city: string }>();
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState<WeatherApiError | null>(null);

  // 取得天氣資料
  useEffect(() => {
    const fetchWeather = async () => {
      const response = await WeatherService.getWeather(city!);
      if ("message" in response) {
        // 發生錯誤時
        setError(response);
        setWeather(null);
      } else {
        // 成功取得資料
        setWeather(response);
        setError(null);
      }
    };
    fetchWeather();
  }, [city]);

  console.log("weather:" + weather);

  // 顯示錯誤或 loading
  if (error) return <div>{error.message}</div>;
  if (!weather) return <div>載入中...</div>;

  // 取得原始資料
  const forecast = weather.forecast;

  // 提取三天的最高溫與最低溫作為整體區間
  const temps = forecast.forecastday.flatMap((d: any) => [
    d.day.mintemp_c,
    d.day.maxtemp_c,
  ]);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // 日期格式處理函式，index 為 0 時顯示「今天」，其餘顯示「週X」
  const formatWeekday = (dateString: string, index: number) => {
    const date = new Date(dateString);
    if (index === 0) return "今天";
    return date.toLocaleDateString("zh-TW", { weekday: "short" }); // 週一、週二...
  };

  // 依照每一天資料建立畫面區塊
  const forecastItems = forecast.forecastday.map((day: any, index: number) => {
    const label = formatWeekday(day.date, index);
    const min = day.day.mintemp_c;
    const max = day.day.maxtemp_c;

    // 溫度條位置與寬度計算（相對整體溫度區間）
    const left = ((min - minTemp) / (maxTemp - minTemp)) * 100;
    const width = ((max - min) / (maxTemp - minTemp)) * 100;

    return (
      <div key={day.date}>
        {/* 間隔線 */}
        <hr className="border-white/20" />
        {/* 單日預報區塊 */}
        <div className="flex items-center justify-evenly my-6 w-full gap-4 h-10">
          {/* 日期文字區塊 */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center flex-3">
            {label}
          </h3>

          {/* 天氣圖示區塊 */}
          <div className="items-center justify-center flex-1">
            <img src={day.day.condition.icon} alt={day.day.condition.text} />
          </div>

          {/* 溫度顯示與視覺化區塊 */}
          <div className="flex items-center justify-center gap-4 flex-10 h-12 sm:h-14 md:h-16 lg:h-20">
            {/* 最低溫文字 */}
            <p className="w-auto text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-1">
              {min}°C
            </p>

            {/* 溫度條容器 */}
            <div className="w-full h-[10%] bg-gray-300 rounded-full relative flex-2">
              {/* 白色背景條，代表當日溫度範圍在整體中的位置 */}
              <div
                className="h-full rounded-full bg-white overflow-hidden"
                style={{
                  marginLeft: `${left}%`,
                  width: `${width}%`,
                }}
              >
                {/* 漸層顏色條，實際溫度條圖案，套用 scaleX 來保持一致比例 */}
                <div
                  className="h-full w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-500"
                  style={{
                    transform: `scaleX(${1 / (width / 100 || 1)})`, // 確保實際視覺比例保持一致
                    transformOrigin: "left", // 從左側放大
                    marginLeft: `-${left}%`, // 將視覺偏移回到左邊
                  }}
                />
              </div>
            </div>

            {/* 最高溫文字 */}
            <p className="w-auto text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-1">
              {max}°C
            </p>
          </div>
        </div>
      </div>
    );
  });

  // 最終畫面結構
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white shadow-lg text-center overflow-x-auto flex flex-col mt-8 scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent w-full mx-auto">
      <p className="text-xl font-semibold mb-2">3天天氣預報</p>
      <div className="flex flex-col">{forecastItems}</div>
    </div>
  );
};

export default DailyForecast;
