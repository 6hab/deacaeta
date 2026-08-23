import { Header } from "../components/Header";
import { SongCard } from "../components/cards/SongCard";
import { useSong } from "../hooks/songs/useSong";
import { useParams } from "react-router-dom";

export function SongPage() {
    const { videoId } = useParams();
    const { song, loading, error } = useSong(videoId);
    return(
        <div className="min-h-screen">
            <Header />
        {loading ? (
            <div>Loading...</div>
        ) : error ? (
            <p>{error}</p>
        ) : song ? (
            <div>
                <SongCard {...song} />
            </div>
        ) : (
            <p>Song not found</p>
        )}
        </div>
    )
}