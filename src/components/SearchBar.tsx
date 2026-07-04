import { Search } from "lucide-react"

export function SearchBar() {
    return(
        <div className="flex items-center gap-2 px-4 h-9 rounded-full bg-black/5 dark:bg-white/8 backdrop-blur border border-white/10 dark:border-white/12 shadow-md">
            <Search 
                size={16} 
                className="text-neutral-500 dark:text-white/60 shrink-0" />

            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent outline-none text-sm text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/50 w-full"/> 
        </div>
    )
}