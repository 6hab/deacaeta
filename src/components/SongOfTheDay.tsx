import { useState } from "react";
import { Sparkle, User, Play } from "lucide-react";
import { useSongOfTheDay } from "../hooks/home/useSongOfTheDay";
import { Link } from "react-router-dom";

export function SongOfTheDay() {
  const { song, loading, error } = useSongOfTheDay();
  const [isPlaying, setIsPlaying] = useState(false);

  if (loading) return null;
  if (error) return console.log(error);
  if (!song) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-70 w-full max-w-165">
      <img src={song.thumbnail} alt="" 
        className="absolute inset-0 w-full h-full object-cover blur scale-110"
      />

      <div className="absolute inset-0  bg-black/10" />

      <div className="relative p-5">
        <div className="w-full">          
          <span className="inline-block bg-amber-400/40 rounded-full px-3 py-1 text-sm mb-3">
            <div className="flex text-white items-center gap-1">
              <Sparkle size={16} className="text-amber-400"/>
              Song of the day
            </div>
          </span>

          <p className="text-white text-2xl font-bold  line-clamp mb-3">{song.title}</p>

          <div className="flex flex-wrap items-center gap-x-3 mb-3">
            {song.artists.map((artist, index) => (
              <span key={artist.artist_id} className="inline-flex items-center gap-2">
                {index !== 0 && <span className="text-white/50 text-sm">feat.</span>}
                
                <Link 
                  to={`/artist/${artist.artist_id}`}
                  className="inline-flex items-center gap-2 hover:opacity-80"
                >
                  {index === 0 && artist.photo ? 
                  <img
                    src={artist.photo} 
                    alt={artist.name_original} 
                    className="w-7 h-7 rounded-full object-cover"
                  /> :
                  <User className="text-white/90 w-7 h-7 bg-white/60 rounded-full" />}
                  
                  <p className="text-sm text-white/70 ">{artist.name_original}</p>
                </Link>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            {song.tags.map((tag) => (
              <span key={tag} className="text-white/90 text-xs bg-white/20 rounded-full px-2 py-1">
                {tag}
              </span>
            ))}
          </div>


          <div className="relative w-full aspect-video rounded-lg overflow-hidden shrink-0">
            {isPlaying ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${song.video_id}?autoplay=1`}
                title={song.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <button onClick={() => setIsPlaying(true)} className="absolute inset-0 w-full h-full">
                <img 
                  src={song.thumbnail} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center hover:bg-black/10">
                  <div className="w-14 h-14 bg-mauve-600/90 rounded-full flex items-center justify-center">
                    <Play size={22} className="text-white"/>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  
  );
}