import { Header } from "../components/Header";
import { SongOfTheDay } from "../components/SongOfTheDay";
import { RecentlyAdded } from "../components/RencentlyAdded";
import { Top10Viewed } from "../components/Top10Viewed";


export function Home() {

  return (
    <div>
      <Header />

      {/* Body */}
      <div className="px-5 py-5">

        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center gap-6 max-w-7xl mx-auto">
          <SongOfTheDay />
          <Top10Viewed variant="list"/>

        </div>

        <div>
            <div className="">
              <RecentlyAdded variant="list"/>
            </div>
            
          <Top10Viewed variant="grid" />
          </div>
      </div>

    </div>
  );
}
