import { Link } from "react-router-dom";
import { ChevronRight, Eye } from "lucide-react";
import { useTopViewedSongs } from "../hooks/home/useTopViewedSongs";

export function TopViewedSongs() {
  const { songs, loading, error } = useTopViewedSongs();

  if (songs.length === 0) return null;
  if (loading) return null;
  if(error) return null;

  return (
    <div className="p-3">
      <div className="flex gap-2 text-white font-semibold mb-1 items-center">
        <Eye size={16} />
        Top most viewed
      </div>
      <div className="flex flex-col gap-2">
        {songs.map((song) => (
          <a
            key={song.video_id}
            href={`https://www.youtube.com/watch?v=${song.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-white/10 rounded p-1"
          >
            <img
              src={song.thumbnail}
              alt="thumbnail"
              className="w-15 h-15 object-cover rounded shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <p className="text-sm text-white truncate">{song.title}</p>
              <p className="text-xs text-neutral-400 truncate">
                {song.view_count.toLocaleString("en-US")} views
              </p>
            </div>
          </a>
        ))}
        <Link
            to="/ranking"
            className="flex text-xs leading-none text-cyan-400 hover:text-cyan-300 transition-colors mt-1 items-center self-start"
        >
            View full ranking
            <ChevronRight 
                size={15} 
                className="shrink-0 translate-y-[1.5px]"
            />
        </Link>
      </div>
    </div>
  );
}


