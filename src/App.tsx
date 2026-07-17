import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { DiscoverPage } from "./pages/DiscoverPage"
import { Background } from "./components/Background";

export default function App() {
  return (
    <BrowserRouter>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>
    </BrowserRouter>
  );
}
