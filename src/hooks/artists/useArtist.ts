import { useState, useEffect } from "react";
import type { ArtistCardProps } from "../../components/cards/ArtistCard";

export function useArtist(artistId: string | undefined) {
    const [artist, setArtist] = useState<ArtistCardProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!artistId) return;

        fetch(`http://localhost:3000/artists/${artistId}`)
        .then((res) => res.json())
        .then((data) => {
            setArtist(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
            setError("Error, please retry later.");
        });
    }, [artistId]);
    return { artist, loading, error };
}