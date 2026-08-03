import React, { createContext, useContext, useState } from "react";

type PlayerContextType = {
    currentVideoId: string | null
    playSong: (videoId: string) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: {children: React.ReactNode }) {
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)

    function playSong(videoId: string) {
        setCurrentVideoId(videoId)
    }

    return (
        <PlayerContext.Provider value={{currentVideoId, playSong}}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)

    if (!context) {
        throw new Error("usePlayer doit être utilisé à l'intérieur de PlayerProvider")
    }
    return context
}
