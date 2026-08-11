export interface ArtistSocial {
  social_id: number;
  link_name: string;
  link_url: string;
}

export interface ArtistCardProps {
  artist_id: number;
  name_original: string;
  birth_date: Date | null;
  death_date: Date | null;
  bio: string | null;
  photo: string | null;
  aliases: string[];
  socials: ArtistSocial[];
}

export function ArtistCard(artist: Readonly<ArtistCardProps>) {
  return (
    <div>
      <img src={artist.photo ?? ""} alt="Artist's photo" />
      <p>{artist.name_original}</p>
      <p>{artist.aliases.join(" - ")}</p>

      <p>{artist.birth_date ? artist.birth_date.toLocaleDateString() : ""}</p>
      <p>{artist.death_date ? artist.death_date.toLocaleDateString() : ""}</p>

      <p>{artist.bio ?? ""}</p>

      <p>
        {artist.socials.map((social) => (
          <a key={social.social_id} href={social.link_url}>
            {social.link_name}
          </a>
        ))}
      </p>
    </div>
  );
}
