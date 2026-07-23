import { Link } from "react-router-dom";
import type { SongCardProps } from "./SongCard";
import { ChevronRight, Eye } from "lucide-react";

const fakeTopSongs: SongCardProps[] = [
  {
    video_id: "dQw4w9WgXcQ",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    title: "Une song populaire",
    uploader: "Uploader1",
    video_published_at: "2020-01-01",
    added_at: "2026-01-01",
    artist: "Artiste1",
    view_count: 178895974,
    tags: [],
  },
  {
    video_id: "9bZkp7q19f0",
    thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    title: "2eme song",
    uploader: "Uploader2",
    video_published_at: "2021-01-01",
    added_at: "2025-01-01",
    artist: "",
    view_count: 4567890,
    tags: [],
  },
  {
    video_id: "kJQP7kiw5Fk",
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    title: "3eme peu connu",
    uploader: "Uploader3",
    video_published_at: "2022-01-01",
    added_at: "2024-01-01",
    artist: "Artiste3",
    view_count: 123456,
    tags: [],
  },
    {
    video_id: "kJQP7kiw5Fk",
    thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    title: "3eme peu connu",
    uploader: "Uploader3",
    video_published_at: "2022-01-01",
    added_at: "2024-01-01",
    artist: "Artiste3",
    view_count: 123456,
    tags: [],
  },
];

export function TopViewedSongs() {
  return (
    <div className="p-3">
      <div className="flex gap-2 text-white font-semibold mb-1 items-center">
        <Eye size={16} />
        Top most viewed
      </div>
      <div className="flex flex-col gap-2">
        {fakeTopSongs.map((song) => (
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


