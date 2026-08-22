import { useState, useEffect } from "react";
import type { SongCardProps } from "../../components/cards/SongCard";

export function useRecentlyAdded() {
  const [songs, setSongs] = useState<SongCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/recentlyaddedsongs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("Erreur, veuillez réessayer plus tard");
      });
  }, []);
  return { songs, loading, error }
}
