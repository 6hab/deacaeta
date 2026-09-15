import { ChevronRight, Clock } from "lucide-react";
import { useRecentlyAdded } from "../hooks/home/useRecentlyAdded";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export function RecentlyAdded({ variant, limit }: { variant: "row" | "list"; limit?: number } ) {
  const { songs: allSongs, loading, error } = useRecentlyAdded();
  const songs = limit ? allSongs.slice(0, limit) : allSongs;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;

    const checkScroll = () => {
      if (!container) return;

      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft + container.clientWidth < container.scrollWidth,
      );
    };
    checkScroll();

    container?.addEventListener("scroll", checkScroll);
    return () => {
      container?.removeEventListener("scroll", checkScroll);
    };
  }, [songs]);

  if (loading) return null;
  if (error) return null;
  if (songs.length === 0) return null;


if (variant === "list") {
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
              <img src={song.thumbnail} className="w-20 h-20 object-cover rounded-lg"/>
            </Link>

            <div className="min-w-0">
              <Link to={`/song/${song.video_id}`}>
                <p className="text-white/80 text-sm hover:text-white truncate">{song.title}</p>
              </Link>

              <div className="flex gap-2 mt-2">
              {song.tags.map((tag) => (
                <span key={tag} className="text-white/90 text-xs bg-white/20 rounded-full px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
            </div>

            
          </div>
        </div>
      ))}

      <div>
        <Link to={"/recently-added"} className="inline-flex text-white/70 hover:text-white items-center gap-0.5">
          <p>View all</p>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}

  return (
    <div className="py-8 px-2">
      <div className="flex gap-2 text-white font-semibold mb-3 items-center">
        <Clock size={16} />
        Recently added
      </div>

      <div className="relative">
        {canScrollLeft && (
          <div className="absolute bg-linear-to-r from-[#223968] to-transparent w-13 h-full top-0 left-0 pointer-events-none z-10" />
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [scrollbar-none] snap-x snap-mandatory gap-2"
        >
          {songs.map((song) => (
            <div key={song.video_id} className="shrink-0 w-49 md:w-57 snap-start">
              <Link
                to={`/song/${song.video_id}`}
                className="aspect-video rounded-lg group overflow-hidden block mb-2"
              >
                <img
                  src={song.thumbnail}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </Link>

              <Link
                to={`/song/${song.video_id}`}
                className="block"
              >
                <p
                  title={song.title}
                  className="text-sm text-white line-clamp-2 mt-1"
                >
                  {song.title}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <div className="absolute bg-linear-to-l from-[#223968] to-transparent w-13 h-full top-0 right-0 pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
}