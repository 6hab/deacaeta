import { SongCard } from "../components/SongCard";
import { useSongs } from "../hooks/useSongs";

export function Home() {
  const { songs, loading, error } = useSongs();

  return (
    <div>
      <h1>Deacaeta</h1> <br />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p>{error}</p>
      ) : (
      <div className="grid grid-cols-4 gap-3">
        {songs.map((song) => <SongCard {...song} />)}
      </div>
        
      )}</div>
  );
}
