import { Music4 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCollectedSongs } from "../contexts/CollectedSongsContext";

export function DrawerButton() {
  const { collectedSongs } = useCollectedSongs();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleClicksOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("click", handleClicksOutside);
    return () => {
      document.removeEventListener("click", handleClicksOutside);
    };
  }, [isDrawerOpen]);

  return (
    <>
      {collectedSongs.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDrawerOpen((prev) => !prev);
          }}
          className="bg-neutral-900 fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border border-neutral-600 flex items-center justify-center hover:bg-neutral-800 cursor-pointer"
        >
          <Music4 size={15} className="text-amber-300" />

          <span className="bg-cyan-500/60 absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs flex items-center justify-center">
            {collectedSongs.length}
          </span>
        </button>
      )}

      {isDrawerOpen && (
        <div
          ref={drawerRef}
          className="fixed z-50 bg-black/90 w-60 max-h-70 overflow-y-auto bottom-25 right-4 rounded"
        >
          <h2 className="flex text-amber-500/90 justify-center gap-1 mb-1 mt-2">
            {" "}
            <Music4 size={19} /> Collected notes <Music4 size={19} />
          </h2>

          {collectedSongs.map((song) => (
            <a
              key={song.video_id}
              href={`https://www.youtube.com/watch?v=${song.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-1 py-2 hover:bg-neutral-800"
            >
              <img
                src={song.thumbnail}
                alt="thumbnail"
                className="w-15 h-15 object-cover"
              />

              <div className="flex flex-col min-w-0">
                <p className="text-white text-sm truncate">{song.title}</p>
                <p className="text-neutral-300 text-xs">
                  {song.artist ?? song.uploader}
                </p>
                <p className="text-neutral-400 italic">
                  {song.video_published_at.slice(0, 4)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
