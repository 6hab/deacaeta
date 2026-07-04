import { SearchBar } from "./SearchBar";

import { useState } from "react";

import { Shuffle } from 'lucide-react';
import { ListFilter } from 'lucide-react';
import { MoonStar } from 'lucide-react';
import { Sun } from 'lucide-react';


export function Header() {
    const [isDark, setIsDark] = useState(false);

    return(
        <><header className="bg-white dark:bg-neutral-700 px-7 py-5">
            <div className="flex items-center justify-between gap-3 max-w-screen-xl mx-auto">
                <div className="shrink-0 font-semibold">Deacaeta</div>

                <div className="min-w-0 flex-1 max-w-xs"><SearchBar /></div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border rounded px-2 py-0.5 gap-1 cursor-pointer"> <Shuffle size={16} /> Shuffle</div>
                    <div className="flex items-center border rounded px-2 py-0.5 gap-1 cursor-pointer"> <ListFilter size={16} /> Filter</div>

                    <button
                        onClick={() => {
                            setIsDark(!isDark);
                            document.documentElement.classList.toggle("dark");
                        } }
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