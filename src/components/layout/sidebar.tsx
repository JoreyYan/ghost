"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Database,
  FolderTree,
  Settings,
  FileText,
  Search,
  Users,
  BarChart3,
  TestTube,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Sources", href: "/sources", icon: Database },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Policies", href: "/policies", icon: Settings },
  { name: "Digests", href: "/digests", icon: FileText },
  { name: "Search", href: "/search", icon: Search },
  { name: "Entities", href: "/entities", icon: Users },
  { name: "Test Supabase", href: "/test-supabase", icon: TestTube },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <span className="ml-2 text-lg font-semibold">News Intelligence</span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
      
      <Separator />
      
      <div className="p-4">
        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
