import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CollectedSongsProvider } from "./contexts/CollectedSongsProvider";
import { DarkMidnightMeshBackground } from "./components/opensourceui/background-gradient/DarkMidnightMeshBackground";
import { FlyingNotesCanvas } from "./components/FlyingNotesCanvas";
import { DrawerButton } from "./components/DrawerButton";

import { Home } from "./pages/Home";
import { DiscoverPage } from "./pages/DiscoverPage";
import { SongPage } from "./pages/SongPage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { ArtistPage } from "./pages/ArtistPage";


export default function App() {
  return (
    <BrowserRouter>
      <CollectedSongsProvider>
        <DarkMidnightMeshBackground className="fixed inset-0 -z-10">
          <FlyingNotesCanvas />
        </DarkMidnightMeshBackground>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/song/:videoId" element={<SongPage />} />

          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:artistId/:slug?" element={<ArtistPage />} />
        </Routes>

        <DrawerButton />
      </CollectedSongsProvider>
    </BrowserRouter>
  );
}
