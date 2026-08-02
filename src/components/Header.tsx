import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { 
    Search,
    CircleUser,
    X
}from "lucide-react";

export function Header() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return(
        <>
            <header className=" px-7 py-5">

                {/* Recherche sur petit écran */}
                {mobileSearchOpen ? (
                    <div className="flex items-center h-14 gap-3 md:hidden">
                        <div className="shrink-0 font-semibold text-white">Deacaeta</div>
                        <div className="flex-1"><SearchBar autoFocus={true} /></div>

                        <X
                            size={25}
                            className="shrink-0 cursor-pointer text-white/60"
                            onClick={() => setMobileSearchOpen(false)} 
                        />
                    </div>
                ) : (
            
                    <div className="flex items-center justify-between h-14 gap-4 md:hidden">
                        
                        {/* Affichage sur petit écran */}
                        <div className="shrink-0 font-semibold text-white">Deacaeta - Cool Songs</div>
                        <div className="flex items-center gap-3">
                            <Search
                                size={25}
                                className="cursor-pointer text-white/60"
                                onClick={() => setMobileSearchOpen(true)}
                            />
                            <p className="flex text-white/80 hover:text-amber-500  px-2 py-0.5 gap-1 cursor-pointer">

                                Discover
                            </p>
                            <div className="flex text-white/80 hover:text-indigo-400 px-2 py-0.5 gap-1 cursor-pointer">

                                Artists
                            </div>

                            <div className="text-neutral-400  px-2 py-0.5 hover:text-blue-400/70 cursor-pointer whitespace-nowrap">
                                <CircleUser 
                                    size={25} 
                                    className="inline mr-1"/>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Affichage grand écran */}
                <div className="hidden md:flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
                        <div className="shrink-0 font-semibold text-white">Deacaeta - Cool Songs</div>
                        <div className="min-w-0 flex-1 max-w-xs"><SearchBar /></div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex text-white/80 hover:text-amber-500 px-2 py-0.5 gap-1 cursor-pointer">

                                Discover
                            </div>
                            <div className="flex text-white/80 hover:text-indigo-400 px-2 py-0.5 gap-1 cursor-pointer">

                                Artists
                            </div>

                            <div className="text-neutral-400 px-2 py-0.5 hover:text-blue-400/70 cursor-pointer">
                                <CircleUser 
                                    size={25} 
                                    className="inline mr-1" />
                            </div>
                        </div>
                </div>
            </header>
            <hr className="border-gray-600" />
        </>
    )
}