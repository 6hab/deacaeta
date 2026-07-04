import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { 
    Search, 
    Shuffle, 
    ListFilter, 
    MoonStar, 
    Sun, 
    X
}from "lucide-react";

export function Header() {
    const [isDark, setIsDark] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return(
        <>
            <header className="bg-white dark:bg-neutral-700 px-7 py-5">

                {/* Recherche sur petit écran */}
                {mobileSearchOpen ? (
                    <div className="flex items-center gap-3 md:hidden">
                        <div className="shrink-0 font-semibold">Deacaeta</div>
                        <div className="flex-1"><SearchBar autoFocus={true} /></div>

                        <X
                            size={25}
                            className="shrink-0 cursor-pointer text-neutral-500 dark:text-white/60"
                            onClick={() => setMobileSearchOpen(false)} 
                        />
                    </div>
                ) : (
            
                    <div className="flex items-center justify-between gap-4 md:hidden">
                        
                        {/* Affichage sur petit écran */}
                        <div className="shrink-0 font-semibold">Deacaeta</div>
                        <div className="flex items-center gap-3">
                            <Search
                                size={25}
                                className="cursor-pointer text-neutral-500 dark:text-white/60"
                                onClick={() => setMobileSearchOpen(true)}
                            />
                            <div className="flex items-center border rounded px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <Shuffle size={16} /> Shuffle
                            </div>
                            <div className="flex items-center border rounded px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <ListFilter size={16} /> Filter
                            </div>
                            <button
                                onClick={() => {
                                    setIsDark(!isDark);
                                    document.documentElement.classList.toggle("dark");
                                }}
                                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                {isDark ? <Sun size={22} className="text-yellow-400" /> : <MoonStar size={22} className="text-blue-400/60" />}
                            </button>
                            <div className="border rounded px-2 py-0.5 cursor-pointer">Connexion</div>
                            
                        </div>
                    </div>
                )}
                
                {/* Affichage grand écran */}
                <div className="hidden md:flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
                        <div className="shrink-0 font-semibold">Deacaeta</div>
                        <div className="min-w-0 flex-1 max-w-xs"><SearchBar /></div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center border rounded px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <Shuffle size={16} /> Shuffle
                            </div>
                            <div className="flex items-center border rounded px-2 py-0.5 gap-1 text-sm cursor-pointer">
                                <ListFilter size={16} /> Filter
                            </div>

                            <button
                                onClick={() => {
                                    setIsDark(!isDark);
                                    document.documentElement.classList.toggle("dark");
                                }}
                                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                {isDark ? <Sun size={22} className="text-yellow-400" /> : <MoonStar size={22} className="text-blue-400/60" />}
                            </button>
                            <div className="border rounded px-2 py-0.5 cursor-pointer">Connexion</div>
                        </div>
                </div>
            </header>
            <hr className="border-gray-300 dark:border-gray-600" />
        </>
    )
}