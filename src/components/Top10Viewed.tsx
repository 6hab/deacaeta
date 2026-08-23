import { useTopViewedSongs } from "../hooks/home/useTopViewedSongs";
import { Link } from "react-router-dom";

export function Top10Viewed() {
  const { songs, loading, error } = useTopViewedSongs();
  const topSongs = songs.slice(0, 10);

  const formatViews = (count: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(count);
  }

  if (topSongs.length === 0) return null;
  if (loading) return null;
  if (error) return null;

  return (
    <div>
      {topSongs.map((song) => (
        <div key={song.video_id}>
          <Link to={`/song/${song.video_id}`}>
            <img src={song.thumbnail} alt="thumbnail" />
          </Link>
          <p>{song.title}</p>

          {song.artists.map((artist) => (
            <p key={artist.artist_id}>
              <Link to={`/artist/${artist.artist_id}`}>
                {artist.name_original}
              </Link>
            </p>
          ))}
          <p>{formatViews(song.view_count)}</p>
        </div>
      ))}
    </div>
  );
}