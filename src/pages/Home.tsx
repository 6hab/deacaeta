import { Header } from "../components/Header";
import { SongOfTheDay } from "../components/SongOfTheDay";
import { RecentlyAdded } from "../components/RencentlyAdded";
import { TopViewedSongs } from "../components/TopViewedSongs";

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

        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center gap-6 text-white max-w-7xl mx-auto">
          <div className="max-w-sm">
            <SongOfTheDay/>
          </div>

          <div className="w-full md:w-70 flex flex-row md:flex-col gap-2">
            <div className="flex-1 min-w-0">
              <RecentlyAdded/>
            </div>
            <div className="flex-1 min-w-0">
              <TopViewedSongs />
            </div>
          </div>

          <div>

          </div>
        </div>

      </div>



    </div>
  );
}
