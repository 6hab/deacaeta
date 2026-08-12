import { useState, useEffect } from "react";
import type { ArtistsCardProps } from "../components/cards/ArtistsCard";

export function useArtists() {
    const [artists, setArtists] = useState<ArtistsCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/artists")
        .then((res) => res.json())
        .then((data) => {
            setArtists(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
            setError("Error, please retry later.");
        });
    }, []);
    return { artists, loading, error };
}