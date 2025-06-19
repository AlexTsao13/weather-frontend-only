import SearchComponent from "../components/search-component";
import HomeComponent from "../components/home-component";

const HomePage = () => {
  return (
    <div>
      <SearchComponent />
      <h1 className="text-2xl font-bold mb-4">首頁</h1>
      <HomeComponent />
      <p className="text-gray-600 mt-4">這是首頁的內容。</p>
    </div>
  );
};

export default HomePage;
