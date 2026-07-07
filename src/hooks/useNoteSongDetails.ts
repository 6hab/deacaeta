import { useState, useEffect } from "react";

type SongDetails = {
    video_id: string
    title: string
    uploader: string
    thumbnail: string
    video_published_at: string
    artist: string | null
}

export function useNoteSongDetails(videoId: string | null) {
    const [song, setSong] = useState<SongDetails | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (videoId === null) return;

        setLoading(true)

        fetch(`http://localhost:3000/coolsongs/${videoId}`)
        .then((res) => res.json())
        .then((data) => {
            setSong(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err)
            setLoading(false)
            setError("Erreur: note song")
        })
    }, [videoId])
    return { song, loading, error }
}
