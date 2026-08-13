import { Header } from "../components/Header";
import { ArtistCard } from "../components/cards/ArtistCard";
import { useArtist } from "../hooks/artists/useArtist";
import { useParams } from "react-router-dom";

export function ArtistPage() {
    const { artistId } = useParams();
    const { artist, loading, error } = useArtist(artistId)

    return(
        <div className="min-h-screen">
            <Header />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <p>{error}</p>
            ) : artist ? (
                <div>
                    <ArtistCard {...artist} />
                </div>
            ) : (
                <p>Artist not found</p>
            )}
        </div>
    );
}
