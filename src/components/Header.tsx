import { Search } from "lucide-react"

export function Header() {


    return(
        <header className="flex justify-between items-center px-7 py-4 bg-zinc-900">
            <div>Deacaeta</div>

            <div><Search/></div>

            <div>Connexion</div>

        </header>
    )
}