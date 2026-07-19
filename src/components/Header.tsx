import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { 
    Search, 
    Shuffle, 
    ListFilter, 
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
                            <div className="flex items-center border rounded border-amber-600 hover:border-amber-400 text-white/90 px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <Shuffle 
                                    size={16} 
                                    className="text-amber-500"
                                />

                                Shuffle
                            </div>
                            <div className="flex items-center border rounded border-indigo-600 hover:border-indigo-400 text-white/90 px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <ListFilter 
                                    size={16} 
                                    className="text-indigo-500"
                                /> 

                                Filter
                            </div>

                            <div className="text-neutral-400 border border-cyan-600 hover:border-cyan-400 rounded px-2 py-0.5 cursor-pointer whitespace-nowrap">Log in</div>
                        </div>
                    </div>
                )}
                
                {/* Affichage grand écran */}
                <div className="hidden md:flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
                        <div className="shrink-0 font-semibold text-white">Deacaeta - Cool Songs</div>
                        <div className="min-w-0 flex-1 max-w-xs"><SearchBar /></div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center border rounded border-amber-600 hover:border-amber-400 text-white/90 px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <Shuffle 
                                    size={16} 
                                    className="text-amber-500"
                                />

                                Shuffle
                            </div>
                            <div className="flex items-center border rounded border-indigo-600 hover:border-indigo-400 text-white/90 px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <ListFilter 
                                    size={16} 
                                    className="text-indigo-500"
                                /> 

                                Filter
                            </div>

                            <div className="text-neutral-400 border border-cyan-600 rounded px-2 py-0.5 cursor-pointer">Log in</div>
                        </div>
                </div>
            </header>
            <hr className="border-gray-600" />
        </>
    )
}