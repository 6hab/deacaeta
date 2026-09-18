import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";

import { Background } from "./components/Background";
import { Home } from "./pages/Home";

import { DiscoverPage } from "./pages/DiscoverPage"
import { SongPage } from "./pages/SongPage";

import { ArtistsPage } from "./pages/ArtistsPage";
import { ArtistPage } from "./pages/ArtistPage";
import { DarkMidnightMeshBackground } from "./components/opensourceui/background-gradient/DarkMidnightMeshBackground";

export default function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>

      <DarkMidnightMeshBackground className="fixed inset-0 -z-10">
        <Background />
      </DarkMidnightMeshBackground>
      
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/song/:videoId" element={<SongPage />} />

        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artist/:artistId/:slug?" element={<ArtistPage />} />
      </Routes>
      </PlayerProvider>
    </BrowserRouter>
  );
}
