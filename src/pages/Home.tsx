import { SongCard } from "../components/SongCard"
import type { SongCardProps } from "../components/SongCard"
import { useState, useEffect } from "react"


export default function App() {

  const [songs, setSongs] = useState<SongCardProps[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/coolsongs")
      .then(res => res.json())
      .then(datat => setSongs(datat)) 
  }, [])
  
  return (
      <div>
        <h1>Deacaeta</h1>
        {songs.map((song) => (
          <SongCard {...song} />
        ))}
      </div>
  );
}