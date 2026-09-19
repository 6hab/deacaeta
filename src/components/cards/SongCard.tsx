import { Link } from "react-router-dom";
import { cn, slugify } from "../../lib/utils";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { Heart, Share, ArrowRight } from "lucide-react";

export interface Artist {
  artist_id: number;
  stage_name: string;
  photo: string | null;
}

export interface SongCardProps {
  video_id: string;
  title: string;
  uploader: string;
  thumbnail: string;
  video_published_at: string;
  view_count: number;
  artists: Artist[];
  tags: string[];
}

export type GlassOverlayImageCardProps = Readonly<
  {
    image?: string;
    imageAlt?: string;
    location?: string;
    title?: string;
    savedLabel?: string;
    savedCount?: string | number;
    avatars?: string[];
    exploreLabel?: string;
    onLike?: () => void;
    onShare?: () => void;
    onExplore?: () => void;
    likeIcon?: ReactNode;
    shareIcon?: ReactNode;
    locationIcon?: ReactNode;
    arrowIcon?: ReactNode;
  } & ComponentPropsWithoutRef<"div">
>;

type SongCardComponentProps = SongCardProps & GlassOverlayImageCardProps;

export const SongCard = forwardRef<HTMLDivElement, SongCardComponentProps>(
  (
    {
      className,
      likeIcon,
      shareIcon,
      onLike,
      onShare,
      video_id,
      title: _title,
      uploader,
      thumbnail,
      video_published_at,
      view_count,
      artists,
      tags,
      ...props
    },
    ref,
  ) => {

    return (
      <div
        ref={ref}
        data-slot="glass-overlay-image-card"
        className={cn(
          "group relative w-full aspect-1/1 overflow-hidden rounded-2xl shadow-lg mb-3",
          className,
        )}
        {...props}
      >
        {/* Background image */}
        <Link key={video_id} to={`/songs/${video_id}`}>
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover backdrop-blur-2xl transition-transform duration-400 group-hover:scale-102"
          />
        </Link>

        {/* Glass content */}
        <div className="absolute right-3 bottom-3 left-3">
          <div className="rounded-2xl border border-white/25 bg-black/25 p-4 backdrop-blur-xl">

            {/* Title */}
            <h3 className="mb-2 text-sm leading-snug font-semibold text-white line-clamp-2">
              {_title}
            </h3>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-2.5 text-[15px]">
                  {artists && artists.length > 0 ? (
                    artists.map((artist, index) => (
                      <span key={artist.artist_id} className="inline-flex items-center gap-3">
                        {index > 0 && <span className="text-white/80">,</span>}
                        <Link
                          to={`/artist/${artist.artist_id}/${slugify(artist.stage_name)}`}
                          className="relative inline-flex items-center justify-center font-semibold text-white/80 hover:opacity-80"
                        >
                          {artist.stage_name}
                        </Link>
                      </span>
                    ))
                  ) : (
                    ""
                  )}
                    
                </div>
              </div>

              <p
                className="font-mono  text-white/70"
              >
                {video_published_at.slice(0, 4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

SongCard.displayName = "SongCard";
