import type { SongCardProps } from "./cards/SongCard";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function RecentlyAdded() {
  const [songs, setSongs] = useState<SongCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:3000/recentlyaddedsongs")
    .then((res) => res.json())
    .then((data) => {
      setSongs(data);
      setLoading(false)
    }) 
    .catch((err) => {
      console.log(err)
      setLoading(false)
      setError("Erreur, veuillez réessayer plus tard")
    })
  }, [])

  if (loading) return null
  if (error) return null
  if (songs.length === 0) return null

  return (
    <div className="py-8 px-2">
      <div className="flex gap-2 text-white font-semibold mb-3 items-center">
        <Clock size={16} />
        Recently added
      </div>
      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-none] gap-2">
        {songs.map((song) => (
          <>
          <div key={song.video_id} className="shrink-0 w-49 md:w-57">
            <a
              href={`https://www.youtube.com/watch?v=${song.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-46 md:w-54 aspect-video rounded-lg group overflow-hidden block mb-2"
            >
              <img
                src={song.thumbnail}
                alt="thumbnail"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          
            <a href={`https://www.youtube.com/watch?v=${song.video_id}`} target="_blank" rel="noopener noreferrer" className="block w-46 md:w-54">
              <p title={song.title} className="text-sm text-white line-clamp-2 mt-1">
                {song.title}
              </p>
            </a>
          </div>
          </>
        ))}
      </div>
    </div>
  );
}