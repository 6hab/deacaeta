import { Header } from "../components/Header";
import { SongCard } from "../components/cards/SongCard";
import { useSongs } from "../hooks/useSongs";


export function DiscoverPage() {
  const { songs, loading, error } = useSongs();

  return (
    
    <div className="min-h-screen">
      <Header />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p>{error}</p>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-5 py-5 max-w-7xl mx-auto">
          {songs.map((song) => <SongCard key={song.video_id} {...song} />)}
        </div>
      )}
    </div>
  );
}