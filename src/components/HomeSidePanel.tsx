import { useRecentlyAdded } from "../hooks/home/useRecentlyAdded";
import { RecentlyAdded } from "./RencentlyAdded";
import { Top10Viewed } from "./Top10Viewed";


export function HomeSidePanel() {
    const { songs } = useRecentlyAdded();

    return (
        <div className="flex flex-col gap-6">
            {songs.length !== 0 && <RecentlyAdded variant="list" limit={6}/>}
            <Top10Viewed variant="list" />
        </div>
    )
}
