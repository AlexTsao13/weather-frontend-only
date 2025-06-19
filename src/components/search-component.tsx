import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
  const [city, setCity] = useState<string>(""); // 存輸入的城市
  const navigate = useNavigate(); // React Router 導航

  // 監聽輸入框變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value); // 更新城市狀態
  };
  // 觸發搜尋
  const handleSearch = () => {
    if (city.trim()) {
      navigate(`/${city}`); // 導航到城市頁面
    }
  };
  // 監聽Enter鍵觸發搜尋
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // 觸發搜尋
    }
  };

  return (
    <div className="bg-red-700 w-full max-w-md mx-auto mt-10 rounded-lg">
      {/* Search Input */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        <input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          name="search"
          className="flex-1 px-4 py-2 outline-none"
          placeholder="輸入城市名稱"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition"
        >
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
