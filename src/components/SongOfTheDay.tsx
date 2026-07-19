import { Sparkle, Heart, Play, ExternalLink } from "lucide-react";
import type { SongCardProps } from "./SongCard";

// Maquette
const fakeSong: SongCardProps = {
  video_id: "dQw4w9WgXcQ",
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  title: "Un titre vraiment vraiment mais alors vraiment long",
  uploader: "Uploader1",
  video_published_at: "2020-01-01",
  added_at: "2026-01-01",
  artist: "Artiste1",
  tags: [],
};


export function SongOfTheDay() {
  const isUserConnected = true;

  return (
    <div>
      <div className="flex gap-2 text-white font-semibold mb-1 items-center">
        <Sparkle size={16} />
        Song of the day
      </div>
      <div className="border border-white/10 rounded-xl overflow-hidden bg-white/7 backdrop-blur">
        <img
          src={fakeSong.thumbnail}
          alt={fakeSong.title}
          className="w-full object-cover aspect-video"
        />

        <div className="p-3">
          <p className="text-lg font-semibold text-white truncate">
            {fakeSong.title}
          </p>

          <p className="text-sm text-neutral-400 mt-1">
            {fakeSong.artist ?? fakeSong.uploader}
          </p>

          <div className="flex gap-3 mt-2">
            <button className="cursor-pointer">
              <Play size={20} />
            </button>

            {isUserConnected ? (
              <button className="cursor-pointer">
                <Heart size={20} />
              </button>
            ) : (
              ""
            )}

            <a
              href={`https://www.youtube.com/watch?v=${fakeSong.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
