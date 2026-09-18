import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SongDetails } from "../components/FlyingNotesCanvas";

type CollectedSongsContextType = {
  collectedSongs: SongDetails[];
  setCollectedSongs: Dispatch<SetStateAction<SongDetails[]>>;
};

export const CollectedSongsContext = createContext<
  CollectedSongsContextType | undefined
>(undefined);

export function useCollectedSongs() {
  const context = useContext(CollectedSongsContext);

  if (!context) {
    throw new Error("useCollectedSongs must be used in CollectedSongsProvider");
  }
  return context;
}