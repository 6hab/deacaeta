export interface SongCardProps {
  video_id: string;
  thumbnail: string;
  title: string;
  uploader: string;
  video_published_at: string;
  added_at: string;
  artist: string;
  tags: string[];
}

export function SongCard(song: Readonly<SongCardProps>) {
  return (
    <div>
      <p>id : {song.video_id}</p>
      {/* <img src={song.thumbnail}/> */}
      <p>Title : {song.title}</p>
      {song.artist !== null ? <p>Artist : {song.artist}</p> : ""}
      <p>Uploader : {song.uploader}</p>
      <p>Date : {song.video_published_at.slice(0, 10)}</p>
      {/*<p>{song.tags.map((tag) => (
                <span key={tag}>{tag} </span>
            ))}</p> */}{" "}
      <br />
    </div>
  );
}
