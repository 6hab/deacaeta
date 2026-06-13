import { SongCard } from "./components/SongCard"
import { useState, useEffect } from "react"

interface Song {
  title: string,
  channel_title: string
  cover: string,
  //video_id: string,
}

export default function App() {

  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/coolsongs")
      .then(res => res.json())
      .then(datat => setSongs(datat)) 
  }, [])
  
  return (
    <div>
      <h1>Deacaeta</h1>
      {songs.map((song) => (
        <SongCard title={song.title} channel_title={song.channel_title} cover={song.cover}/>
      ))}
    </div>
  );
}


