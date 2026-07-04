import { Header } from "../components/Header";
import { SongCard } from "../components/SongCard";
import { useSongs } from "../hooks/useSongs";

export function Home() {
  const { songs, loading, error } = useSongs();

  return (
    <div className="bg-white dark:bg-neutral-800 min-h-screen">
      <Header />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 px-2 py-4 max-w-screen-xl mx-auto">
          {songs.map((song) => <SongCard key={song.video_id} {...song} />)}
        </div>
      )}
    </div>
  );
}
