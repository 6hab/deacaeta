import { Header } from "../components/Header";
import { HomeSidePanel } from "../components/HomeSidePanel";
import { RecentlyAdded } from "../components/RencentlyAdded";
import { SongOfTheDay } from "../components/SongOfTheDay";
import { TagRow } from "../components/TagRow";
import { Top10Viewed } from "../components/Top10Viewed";


export function Home() {

  return (
    <div>
      <Header />
      {/* Body */}
      <div className="px-5 py-5">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 items-start">
          <div className="flex flex-col items-center md:items-stretch gap-5 w-full md:mr- md:ml-10 min-w-0">
          <SongOfTheDay />
          
          <div className="w-full hidden max-md:block">
            <RecentlyAdded variant="row" limit={15} />
          </div>
          
          <TagRow limit={15} tag="Anime"/>
          <TagRow limit={15} tag="Video game"/>
          <TagRow limit={15} tag="Beat"/>
        </div>

        <div className="hidden md:w-80 md:block w-full">
          <HomeSidePanel />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-2">
        <Top10Viewed variant="grid" />
      </div>

    </div>
    </div>
  );
}
