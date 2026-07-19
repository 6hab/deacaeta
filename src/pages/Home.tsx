import { Header } from "../components/Header";
import { SongOfTheDay } from "../components/SongOfTheDay";
import { RecentlyAdded } from "../components/RencentlyAdded";

import { SongCard } from "../components/SongCard";
import { useSongs } from "../hooks/useSongs";

export function Home() {
  //const { songs, loading, error } = useSongs();

  const HomeTags = [
    // Genre
    "Anime",
    "Beat",
    "Hyperpop",

    // Source
    "Cartoon",
    "TV series",
    "Video game",

    // Format
    "Fanmande",
    "Instrumental",
    "Nightcore",

    // Language
    "Japanese",
    "English",
    "French",
  ];

  return (
    <div>
      <Header />

      {/* Body */}
      <div className="px-5 py-5">

        <div className="flex flex-col md:flex-row md:justify-center gap-6 text-white max-w-7xl mx-auto md:items-start">
          <div className="max-w-sm self-center md:self-start">
            <SongOfTheDay/>
          </div>

          <div className="w-70">
            <RecentlyAdded/>
          </div>

          <div>

          </div>
        </div>

      </div>



    </div>
  );
}
