import { Header } from "../components/Header";
import { ArtistsCard } from "../components/cards/ArtistsCard";
import { useArtists } from "../hooks/useArtists";

export function ArtistsPage() {
    const { artists, loading, error } = useArtists();
    return(
        <div className="min-h-screen">
            <Header />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {artists.map((artist) => <ArtistsCard key={artist.artist_id} {...artist} />)}
                </div>
            )}
        </div>
    );
}