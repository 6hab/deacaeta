import { Header } from "../components/Header";
import { HomeSidePanel } from "../components/HomeSidePanel";
import { RecentlyAdded } from "../components/RencentlyAdded";
import { SongOfTheDay } from "../components/SongOfTheDay";


export function Home() {

  return (
    <div>
      <Header />
      {/* Body */}
      <div className="px-5 py-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="flex flex-col items-center md:items-stretch gap-5 pr-10 pl-10 min-w-0">
          <SongOfTheDay />
          <RecentlyAdded variant="row" limit={15} />
        </div>
        <div className="hidden md:block">
          <HomeSidePanel />
        </div>
      </div>
    </div>
    </div>
  );
}
