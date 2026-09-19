import { useTopViewedSongs } from "../hooks/home/useTopViewedSongs";
import { Link } from "react-router-dom";
import { ChevronRight, Eye } from "lucide-react";
import { SongCard } from "./cards/SongCard";


export function Top10Viewed({ variant }: { variant: "list" | "grid" }) {
  const { songs, loading, error } = useTopViewedSongs();
  const topSongs = songs.slice(0, 10);

  const formatViews = (count: number) => {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(count);
  }

  if (topSongs.length === 0) return null;
  if (loading) return null;
  if (error) return null;

  if (variant === "grid") {
    return (
      <div>
        <div className="flex text-white font-semibold items-center justify-between mb-3 px-5">
          <div className="flex items-center gap-1">
            <Eye size={16} />
            Most viewed
          </div>

          <Link to={"/top"} className="text-white/70 hover:text-white inline-flex items-center gap-0.5">
            <p>View all</p>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2">
          {topSongs.map((song, index) => (
            <div key={song.video_id} className="relative h-full">
              <span className="absolute z-10 text-white bg-mauve-700/70 rounded-full top-2 left-2 w-7 h-7 flex items-center justify-center font-semibold">{index + 1}</span>
              
              <span className="absolute z-10 text-white/90 text-xs bg-gray-700/90 rounded-full right-2 top-2 flex items-center px-2 py-0.5 gap-1">
                <Eye size={12} />
                {formatViews(song.view_count)}
              </span>
              <SongCard {...song} />
            </div> 
          ))}
        </div>

      </div>
    )
  }

  return (
    <div>
      <div className="text-white font-semibold mb-3">
        <Link to={"/top"} className="inline-flex items-center gap-2">
          <Eye size={16} />
          Most viewed
        </Link>
        
      </div>

      {topSongs.map((song, index) => (
        <div key={song.video_id}>
          <div className="flex items-center gap-3 bg-black/50 rounded-lg mb-2 p-1">
            <span className="text-white/50 font-semibold w-4 text-right">{index + 1}</span>
              <Link to={`/song/${song.video_id}`} className="shrink-0">
              <img src={song.thumbnail} className="w-20 h-20 rounded-lg object-cover"/>
              </Link>

              <div className="min-w-0">
                <Link to={`/song/${song.video_id}`}>
                  <p className="text-white/80 hover:text-white text-sm truncate">{song.title}</p>
                </Link>

                <p className="text-white/50 text-xs">{formatViews(song.view_count)}</p>
              </div>
          </div>
        </div>
      ))}

      <div>
        <Link to={"/top"} className="text-white/70 hover:text-white inline-flex items-center gap-0.5">
          <p>View all</p>
          <ChevronRight size={16} className="translate-y-0"/>
        </Link>
        
      </div>
    </div>
  );
}