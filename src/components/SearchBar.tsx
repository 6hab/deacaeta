import { Search } from "lucide-react"

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
    return(
        <label className="flex items-center gap-2 px-4 h-9 rounded-full bg-white/8 backdrop-blur border border-white/12 shadow-md cursor-text hover:bg-white/15 transition-colors">
            <Search 
                size={16} 
                className="text-white/60 shrink-0" />

            <input 
                type="text" 
                placeholder="Search..." 
                autoFocus={autoFocus}
                className="bg-transparent outline-none text-sm text-white placeholder:text-white/50 w-full"/> 
        </label>
    )
}