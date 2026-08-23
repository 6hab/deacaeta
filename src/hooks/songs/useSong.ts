import { useState, useEffect } from "react";
import type { SongCardProps } from "../../components/cards/SongCard";

export function useSong(videoId: string | undefined) {
  const [song, setSong] = useState<SongCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    fetch(`http://localhost:3000/coolsongs/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError("Error, please retry later.");
      });
  }, [videoId]);
  return { song, loading, error };
}
