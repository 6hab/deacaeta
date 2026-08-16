import { useState } from "react";
import { Sparkle, Play } from "lucide-react";
import { useSongOfTheDay } from "../hooks/home/useSongOfTheDay";

export function SongOfTheDay() {
  const { song, loading, error } = useSongOfTheDay();
  const [isPlaying, setIsPlaying] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!song) return <p>Not found</p>;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-70">

      <img
        src={song.thumbnail}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur scale-110"
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 p-6">

        <div className="flex-1 min-w-0">
          <span className="inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-white mb-3">
            <div className="flex items-center gap-1">
              <Sparkle size={16} className=""/> 
              Song of the day
            </div>
          </span>

          <p className="text-2xl font-bold text-white mb-2 line-clamp">{song.title}</p>

          <div className="flex gap-2 mb-3">
            {song.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                {tag}
              </span>
            ))}
          </div>

          {song.artists.map((artist) => (
            <p key={artist.artist_id} className="text-sm text-white/80">
              {artist.name_original}
            </p>
          ))}
        </div>

        <div className="w-full md:w-80 aspect-video rounded-lg overflow-hidden shrink-0 relative">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${song.video_id}?autoplay=1`}
              title={song.title}
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full"
            >
              <img
                src={song.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20">
                <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center">
                  <Play size={22} className="fill-white" />
                </div>
              </div>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}