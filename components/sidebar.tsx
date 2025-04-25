"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Github, Home, Plus, Settings, Star, Tag, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: Github,
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: Star,
    },
    {
      name: "Tags",
      href: "/tags",
      icon: Tag,
    },
    {
      name: "Statistics",
      href: "/stats",
      icon: BarChart3,
    },
    {
      name: "About",
      href: "/about",
      icon: HelpCircle,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white">
            <Github className="h-5 w-5" />
          </div>
          <span className="text-lg">PM Pro</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    pathname === item.href ? "text-brand-blue" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button className="w-full gradient-blue text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    </div>
  )
}
