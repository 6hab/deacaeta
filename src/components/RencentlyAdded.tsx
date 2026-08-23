import { Clock } from "lucide-react";
import { useRecentlyAdded } from "../hooks/home/useRecentlyAdded";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export function RecentlyAdded() {
  const { songs, loading, error } = useRecentlyAdded();

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
          className="flex overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [scrollbar-none] gap-2"
        >
          {songs.map((song) => (
            <div key={song.video_id} className="shrink-0 w-49 md:w-57">
              <Link
                to={`/song/${song.video_id}`}
                className="w-46 md:w-54 aspect-video rounded-lg group overflow-hidden block mb-2"
              >
                <img
                  src={song.thumbnail}
                  alt="thumbnail"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </Link>

              <Link
                to={`/song/${song.video_id}`}
                className="block w-46 md:w-54"
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