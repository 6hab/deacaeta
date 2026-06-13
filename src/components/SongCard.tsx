
interface SongCardProps{
    title: string,
    channel_title: string,
    cover: string,
    //video_id: string,
}

export function SongCard({title,channel_title,cover}:Readonly<SongCardProps>){

    return(
        <div>
            <p>{title}</p>
            <p>{channel_title}</p>
            <img src={cover}/>
            {/*<p>{video_id}</p>*/}
        </div>
    )
}