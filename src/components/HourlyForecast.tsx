import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WeatherService from "../services/weather.service";
import { WeatherApiResponse, WeatherApiError } from "../types";
import { SunriseIcon, SunsetIcon } from "./icons";

const HourlyForecast = () => {
  const { city } = useParams<{ city: string }>();
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState<WeatherApiError | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await WeatherService.getWeather(city!);
      if ("message" in response) {
        setError(response);
        setWeather(null);
      } else {
        setWeather(response);
        setError(null);
      }
    };
    fetchWeather();
  }, [city]);

  if (error) return <div>{error.message}</div>;
  if (!weather) return <div>載入中...</div>;

  const forecast = weather.forecast; // 暫時轉型為 any
  const today = forecast.forecastday[0];
  const tomorrow = forecast.forecastday[1];

  const todayHours = today.hour;
  const tomorrowHours = tomorrow?.hour || [];

  const currentHour = new Date().getHours();
  const futureHours = [...todayHours.slice(currentHour), ...tomorrowHours];
  const next24Hours = futureHours.slice(0, 24);

  // 建立一個插入的時間事件陣列（日出日落）
  const events = [];

  const addEvent = (timeString: string, label: string) => {
    events.push({
      time: timeString,
      isEvent: true,
      label,
    });
  };

  // 加入今天的日出日落
  if (today.astro.sunrise) {
    const sunrise = convertTo24Hour(today.date, today.astro.sunrise);
    addEvent(sunrise, "日出");
  }
  if (today.astro.sunset) {
    const sunset = convertTo24Hour(today.date, today.astro.sunset);
    addEvent(sunset, "日落");
  }

  // 加入明天的日出日落
  if (tomorrow?.astro?.sunrise) {
    const sunrise = convertTo24Hour(tomorrow.date, tomorrow.astro.sunrise);
    addEvent(sunrise, "日出");
  }
  if (tomorrow?.astro?.sunset) {
    const sunset = convertTo24Hour(tomorrow.date, tomorrow.astro.sunset);
    addEvent(sunset, "日落");
  }

  console.log(events);
  // 將日出日落插入正確位置
  const combined = [...next24Hours];

  events.forEach((event) => {
    const index = combined.findIndex((h) => h.time > event.time);
    const eventObj = {
      time: event.time,
      isEvent: true,
      label: event.label,
    };
    // if (index === -1) {
    //   combined.push(eventObj);
    // } else {
    //   combined.splice(index, 0, eventObj);
    // }
    if (index !== -1 && index !== 0) {
      combined.splice(index, 0, eventObj);
    }
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-lg text-center overflow-x-auto flex gap-4 scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent">
      {combined.map((item, index) => (
        <div
          key={index}
          className="min-w-[80px] flex flex-col items-center space-y-1"
        >
          <p className="text-sm">{item.time.slice(-5)}</p>
          {item.isEvent ? (
            <>
              {/* <img
                src={
                  item.label === "日出"
                    ? "/icons/sunrise.svg"
                    : "/icons/sunset.svg"
                }
                alt={item.label}
                className="w-8 h-8"
              /> */}
              {item.label === "日出" ? <SunriseIcon /> : <SunsetIcon />}
              <p className="text-base italic">{item.label}</p>
            </>
          ) : (
            <>
              <img
                src={`https:${item.condition.icon}`}
                alt={item.condition.text}
                className="w-8 h-8"
              />
              <p className="text-base italic">{item.temp_c}°C</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// 工具函數：將 AM/PM 格式轉換為 24 小時格式
function convertTo24Hour(date: string, time12h: string): string {
  let [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${date} ${hh}:${mm}`;
}

export default HourlyForecast;
