import { SongCard } from "./components/SongCard"
import React, { useState, useEffect } from "react"

export default function App() {

  const [songs, setSongs] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/coolsongs").then(response => response.json())
    .then(datat => setSongs(datat.message))
  }, [])


  
  return (
    <div>
      <h1>Deacaeta</h1>
      <SongCard title={} channel_title={""} cover={""} video_id={""}/>
    </div>
  );
}


