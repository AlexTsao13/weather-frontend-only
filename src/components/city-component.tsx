import { useState, useEffect } from "react";
import { data, useParams } from "react-router-dom";
import WeatherService from "../services/weather.service";
import { WeatherApiResponse, WeatherApiError } from "../types";

const CityComponent = () => {
  const { city } = useParams<{ city: string }>();
  const [weather, setWeather] = useState<WeatherApiResponse | null>(); // 儲存後端回傳天氣資料
  const [error, setError] = useState<WeatherApiError | null>(); // 儲存錯誤訊息

  // 當城市名稱改變時，重新取得天氣資料
  useEffect(() => {
    const fetchWeather = async () => {
      const response = await WeatherService.getWeather(city!); // 取得天氣資料
      console.log("response:", response);
      if ("message" in response) {
        setError(response); // 設定錯誤訊息
        setWeather(null); // 清空天氣資料
      } else {
        setWeather(response); // 設定天氣資料
        setError(null); // 清空錯誤訊息
      }
    };
    fetchWeather();
  }, [city]);
  console.log("city:", city);
  console.log("weather:", weather);
  console.log("error:", error);

  console.log("city:", city === undefined);

  if (error) return <div>{error.message}</div>;
  if (!weather) return <div>載入中...</div>;

  return (
    <div className=" backdrop-blur-md rounded-2xl p-6 text-white  text-center space-y-2">
      <h2 className="text-3xl font-bold">我的位置</h2>
      <p className="text-2xl font-semibold">{weather.location.name}</p>
      <p className="text-6xl font-bold">{weather.current.temp_c}°C</p>

      <div className="flex justify-center gap-6 text-sm text-gray-200">
        <p>最高 {weather.forecast.forecastday[0].day.maxtemp_c}°C</p>
        <p>最低 {weather.forecast.forecastday[0].day.mintemp_c}°C</p>
      </div>

      <p className="text-lg italic">{weather.current.condition.text}</p>
    </div>
  );
};

export default CityComponent;
