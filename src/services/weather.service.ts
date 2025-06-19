import axios, { AxiosResponse, AxiosError } from "axios";
import { WeatherApiError, WeatherApiResponse } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY; // 從環境變數中取得 API 金鑰

class WeatherService {
  async getWeather(city: string) {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;
    try {
      const response: AxiosResponse<WeatherApiResponse> = await axios.get(
        API_URL
      );
      return response.data;
    } catch (error) {
      // 錯誤處理
      const axiosError = error as AxiosError<WeatherApiError>;
      if (axiosError.response === undefined) {
        return { message: axiosError.message }; // 錯誤訊息
      }
      return axiosError.response!.data; // 錯誤訊息
    }
  }
}

export default new WeatherService();
