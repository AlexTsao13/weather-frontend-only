import { Routes, Route } from "react-router-dom";
import CityPage from "./pages/CityPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:city" element={<CityPage />} />
    </Routes>

    // <div className="max-w-4xl mx-auto p-4 bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/:city" element={<CityPage />} />
    //   </Routes>
    // </div>
  );
};

export default App;
