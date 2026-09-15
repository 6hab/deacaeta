import { ChevronRight, Clock } from "lucide-react";
import { useRecentlyAdded } from "../hooks/home/useRecentlyAdded";
import { Link } from "react-router-dom";
import { ScrollableRow } from "./ScrollableRow";

export function RecentlyAdded({
  variant,
  limit,
}: {
  variant: "row" | "list";
  limit?: number;
}) {
  const { songs: allSongs, loading, error } = useRecentlyAdded();

  if (loading) return null;
  if (error) return null;
  if (allSongs.length === 0) return null;

  if (variant === "list") {
    const songs = limit ? allSongs.slice(0, limit) : allSongs;

    return (
      <div>
        <div className="flex gap-2 text-white font-semibold mb-3 items-center">
          <Clock size={16} />
          Recently added
        </div>

        {songs.map((song) => (
          <div key={song.video_id}>
            <div className="flex items-center gap-3 bg-black/50 rounded-lg mb-2 p-3">
              <Link to={`/song/${song.video_id}/`} className="shrink-0">
                <img
                  src={song.thumbnail}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </Link>

              <div className="min-w-0">
                <Link to={`/song/${song.video_id}`}>
                  <p
                    title={song.title}
                    className="text-white/80 text-sm hover:text-white truncate"
                  >
                    {song.title}
                  </p>
                </Link>

                <div className="flex gap-2 mt-2">
                  {song.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-white/90 text-xs bg-white/20 rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div>
          <Link
            to={"/recently-added"}
            className="inline-flex text-white/70 hover:text-white items-center gap-0.5"
          >
            <p>View all</p>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ScrollableRow
      songs={allSongs}
      limit={limit}
      icon={Clock}
      title="Recently added"
    />
  );
}
