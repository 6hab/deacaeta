import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function slugify(text:string) {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}