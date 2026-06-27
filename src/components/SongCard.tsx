export interface SongCardProps{
    video_id: string,
    cover: string,
    title: string,
    uploader: string,
    video_published_at: string,
    added_at: string,
    artist: string,
}

export function SongCard(song: Readonly<SongCardProps>){

    return(
        <div>
            {/* <p>id : {song.video_id}</p> */}
            <img src={song.cover}/>
            <p>Title : {song.title}</p>
            <p>{song.artist}</p>
            <p>Uploader : {song.uploader}</p>
            <p>Date : {song.video_published_at.slice(0, 10)}</p> <br />
        </div>
    )
}