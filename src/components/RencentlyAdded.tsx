import type { SongCardProps } from "./SongCard";
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
    <div className="p-3">
      <div className="flex gap-2 text-white font-semibold mb-1 items-center">
        <Clock size={16} />
        Recently added
      </div>
      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-none] gap-2">
        {songs.map((song) => (
          <a
            key={song.video_id}
            href={`https://www.youtube.com/watch?v=${song.video_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-42 hover:bg-white/10 rounded "
          >
            <img
              src={song.thumbnail}
              alt="thumbnail"
              className="w-40 object-cover aspect-video rounded-lg"
            />

              <p 
                className="text-sm text-white line-clamp-2 mt-1"
                title={song.title}
              >
                {song.title}
              </p>
          </a>
        ))}
      </div>
    </div>
  );
}
