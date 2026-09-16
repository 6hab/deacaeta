import { useEffect, useState } from "react";
import type { SongCardProps } from "../../components/cards/SongCard";

export function useTagRow(tagName: string | undefined) {
  const [songs, setSongs] = useState<SongCardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!tagName) return;

    fetch(`http://localhost:3000/tags/${tagName}/songs`)
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError("Error");
      });
  },[tagName]);
  return { songs, loading, error };
}