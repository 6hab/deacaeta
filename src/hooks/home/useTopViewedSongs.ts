import type { SongCardProps } from "../../components/cards/SongCard";
import { useState, useEffect } from "react";

export function useTopViewedSongs() {
    const [songs, setSongs] = useState<SongCardProps[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/topsongs/views")
        .then((res) => res.json())
        .then((data) => {
            setSongs(data);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            setError("Error, please retry later.")
        });
    }, [])
    return { songs, loading, error }
}