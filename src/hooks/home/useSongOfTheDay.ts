import { useState, useEffect } from "react";
import type { SongCardProps } from "../../components/cards/SongCard";


export function useSongOfTheDay() {
    const [song, setSong] = useState<SongCardProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/songoftheday")
        .then((res) => res.json())
        .then((data) =>{
            setSong(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
            setError("Error, please retry later.");
        });
    }, []);
    return { song, loading, error }
}