"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
            Kunal Singh
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === "/" ? "text-blue-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className={`text-sm transition-colors ${
                pathname === "/projects" ? "text-blue-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/cheatsheets"
              className={`text-sm transition-colors ${
                pathname === "/cheatsheets" ? "text-blue-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              Cheatsheets
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
