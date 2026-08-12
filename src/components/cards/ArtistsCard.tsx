export interface ArtistsCardProps {
  artist_id: number;
  name_original: string;
  photo: string | null;
}

export function ArtistsCard(artist: Readonly<ArtistsCardProps>) {
  return (
    <div>
      <img src={artist.photo ?? ""} alt="Artist's photo" />
      <p>{artist.name_original}</p>
    </div>
  );
}