import { SongCard } from "../components/SongCard";
import { useSongs } from "../hooks/useSongs";

export function Home() {
  const { songs, loading, error } = useSongs();

  return (
    <div>
      <h1>Deacaeta</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        songs.map((song) => <SongCard {...song} />)
      )}
    </div>
  );
}
