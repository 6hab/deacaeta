import { useTagRow } from "../hooks/songs/useTagRow";
import { ScrollableRow } from "./ScrollableRow";

export function TagRow({ tag, limit}: {tag: string; limit?: number}){
    const { songs, loading, error } = useTagRow(tag);

    if (!songs) return null;
    if (loading) return null;
    if (error) return null;

    return (
        <ScrollableRow songs={songs} limit={limit} title={tag}/>
    )
}
