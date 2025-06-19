import SearchComponent from "../components/search-component";
import CityComponent from "../components/city-component";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import Layout from "../components/layouts";

const CityPage = () => {
  return (
    <Layout>
      <SearchComponent />
      {/* 現在天氣 */}
      <CityComponent />
      {/* 未來24小時預測 */}
      <HourlyForecast />
      {/* 未來7天預測 */}
      <DailyForecast />
    </Layout>
  );
};

export default CityPage;
