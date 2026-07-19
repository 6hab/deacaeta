import type { SongCardProps } from "./SongCard";
import { Clock } from "lucide-react";

// Maquette
const fakeRecentSongs: SongCardProps[] = [
  {
    video_id: "dQw4w9WgXcQ",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    title: "Une song recente",
    uploader: "Uploader1",
    video_published_at: "2020-01-01",
    added_at: "2026-01-01",
    artist: "Artiste1",
    tags: [],
  },
  {
    video_id: "9bZkp7q19f0",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    title: "Une song avec un titre vraiment mais alors long",
    uploader: "Uploader2",
    video_published_at: "2021-01-01",
    added_at: "2025-01-01",
    artist: "",
    tags: [],
  },
  {
    video_id: "kJQP7kiw5Fk",
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    title: "Une 3eme song",
    uploader: "Uploader3",
    video_published_at: "2022-01-01",
    added_at: "2024-01-01",
    artist: "Artiste3",
    tags: [],
  },
];


export function RecentlyAdded() {
    
  return (
    <div className="p-3">
      <div className="flex gap-2 text-white font-semibold mb-1 items-center">
        <Clock size={16} />
        Recently added
      </div>
      <div className="flex flex-col gap-2">
        {fakeRecentSongs.map((song) => (
          <a
            key={song.video_id}
            href={`https://www.youtube.com/watch?v=${song.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-white/10 rounded p-1"
          >
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-15 h-15 object-cover rounded shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <p className="text-sm text-white truncate">{song.title}</p>
              <p className="text-xs text-neutral-400 truncate">
                {song.artist == "" ? song.uploader : song.artist}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
