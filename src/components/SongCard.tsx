
interface SongCardProps{
    title: string,
    uploader: string,
    cover: string,
    video_id?: string,
}

export function SongCard({title,uploader,cover}:Readonly<SongCardProps>){

    return(
        <div>
            <p>{title}</p>
            <p>{uploader}</p>
            <img src={cover}/>
            {/*<p>{video_id}</p>*/}
        </div>
    )
}