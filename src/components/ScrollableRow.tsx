import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import type { SongCardProps } from "./cards/SongCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type ScrollProps = {
    songs: SongCardProps[];
    limit?: number;
    icon?: LucideIcon;
    title: string;
}

export function ScrollableRow({ songs, limit, icon: Icon, title}: ScrollProps) {
      const displayedSongs = limit ? songs.slice(0, limit) : songs;

      const [emblRef, emblaApi] = useEmblaCarousel({
        align: "start",
        slidesToScroll: 1,
        breakpoints: {
          "(min-width: 768px)": { slidesToScroll: 1 },
        },
      });
    
      const [canScrollLeft, setCanScrollLeft] = useState(false);
      const [canScrollRight, setCanScrollRight] = useState(true);
    
      useEffect(() => {
        if (!emblaApi) return;
    
        const update = () => {
          setCanScrollLeft(emblaApi.canScrollPrev());
          setCanScrollRight(emblaApi.canScrollNext());
        };
    
        update();
        emblaApi.on("select", update);
        emblaApi.on("reInit", update);
      }, [emblaApi]);

  return (
    <div className="py-8 px-2 w-full">
      <div className="text-white font-semibold mb-3 items-center">
        <Link to={""} className="inline-flex items-center gap-2">
            {Icon && <Icon size={16} />}
            {title}
        </Link>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <div className="absolute bg-linear-to-r from-[#223968] to-transparent w-10 h-full top-0 left-0 pointer-events-none z-10" />
        )}

        <div ref={emblRef} className="overflow-hidden">
          <div className="flex gap-4">
            {displayedSongs.map((song) => (
              <div
                key={song.video_id}
                className="shrink-0 basis-1/2 md:basis-1/3"
              >
                <Link
                  to={`/song/${song.video_id}`}
                  className="aspect-video rounded-lg group overflow-hidden block mb-2"
                >
                  <img
                    src={song.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>

                <Link to={`/song/${song.video_id}`} className="block">
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
        </div>

        {canScrollRight && (
          <div className="absolute bg-linear-to-l from-[#223968] to-transparent w-10 h-full top-0 right-0 pointer-events-none z-10" />
        )}

        <div className="flex gap-1 mt-3 text-white/80">
          <button
            type="button"
            disabled={!canScrollLeft}
            onClick={() => emblaApi?.scrollPrev()}
            className="bg-black/60 disabled:text-white/30 rounded-full p-1.5 z-10 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            disabled={!canScrollRight}
            onClick={() => emblaApi?.scrollNext()}
            className="bg-black/60 disabled:text-white/30 rounded-full p-1.5 z-10 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}