import { useState, type ReactNode } from "react";
import type { SongDetails } from "../components/FlyingNotesCanvas";
import { CollectedSongsContext } from "./CollectedSongsContext";

export function CollectedSongsProvider({ children }: { children: ReactNode }) {
  const [collectedSongs, setCollectedSongs] = useState<SongDetails[]>([]);

  return (
    <CollectedSongsContext.Provider
      value={{ collectedSongs, setCollectedSongs }}
    >
      {children}
    </CollectedSongsContext.Provider>
  );
}
