export interface Artist {
  artist_id: number;
  name_original: string;
  photo: string | null;
}

export interface SongCardProps {
  video_id: string;
  title: string;
  uploader: string;
  thumbnail: string;
  video_published_at: string;
  view_count: number;
  artists: Artist[];
  tags: string[];
}

export function SongCard(song: Readonly<SongCardProps>) {
  return (
    <div className="border border-white/12 rounded-xl overflow-hidden cursor-pointer hover:border-white transition-colors bg-white/8 backdrop-blur">
      <img src={song.thumbnail}
        className="w-full object-cover aspect-video"
      />
      <div className="px-3 py-2">

        <p className="text-sm font-medium text-neutral-100 truncate">
          {song.title}
        </p>

        <p className="text-xs text-neutral-400 mt-0.5">
          {song.artists.map((artist) => (
            <div key={artist.artist_id}>
              {artist.name_original}
            </div>
          ))}
        </p>

        <p className="text-xs italic text-neutral-400 mt-1">
          {song.video_published_at.slice(0, 4)}
        </p>
      </div>

      {/*<p>{song.tags.map((tag) => (
                <span key={tag}>{tag} </span>
            ))}</p> {" "} 
      <br /> */}
    </div>
  );
}
