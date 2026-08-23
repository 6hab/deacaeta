import { Header } from "../components/Header";
import { SongOfTheDay } from "../components/SongOfTheDay";
import { RecentlyAdded } from "../components/RencentlyAdded";

export function Home() {

  return (
    <div>
      <Header />

      {/* Body */}
      <div className="px-5 py-5">

        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-center gap-6 max-w-7xl mx-auto">
          <div className="">
            <SongOfTheDay/>
          </div>
          
        </div>

        <div>
            <div className="">
              <RecentlyAdded/>
            </div>

          </div>
      </div>

    </div>
  );
}
