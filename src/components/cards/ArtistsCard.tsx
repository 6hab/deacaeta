export interface ArtistsCardProps {
  artist_id: number;
  stage_name: string;
  photo: string | null;
}

export function ArtistsCard(artist: Readonly<ArtistsCardProps>) {
  return (
    <div>
      <img src={artist.photo ?? ""} alt="Artist's photo" />
      <p>{artist.stage_name}</p>
    </div>
  );
}