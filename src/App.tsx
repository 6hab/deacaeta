import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { DiscoverPage } from "./pages/DiscoverPage"
import { Background } from "./components/Background";
import { PlayerProvider } from "./context/PlayerContext";
import { ArtistsPage } from "./pages/artistsPage";

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
      </Routes>
      </PlayerProvider>
    </BrowserRouter>
  );
}
