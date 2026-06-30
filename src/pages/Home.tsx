import { SongCard } from "../components/SongCard";
import { useSongs } from "../hooks/useSongs";

export function Home() {
  const { songs, loading, error } = useSongs();

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1>Deacaeta</h1> <br />
          {songs.map((song) => <SongCard {...song} />)}
        </>
      )}
    </div>
  );
}
