export interface SongCardProps{
    video_id: string,
    cover: string,
    title: string,
    uploader: string
    publish_date: string,
    artist: string,
}

export function SongCard(song: Readonly<SongCardProps>){

    return(
        <div>
            <img src={song.cover}/>
            <p>{song.title}</p>
            <p>{song.artist}</p>
            <p>{song.uploader}</p>
            <p>{song.publish_date.slice(0, 10)}</p>
        </div>
    )
}