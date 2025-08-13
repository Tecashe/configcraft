// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { UserButton } from "@/components/auth/user-button"
// import { LayoutDashboard, Wrench, FileText, Puzzle, CreditCard, Settings, Menu, X, Plus } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface AppLayoutProps {
//   children: React.ReactNode
// }

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Tools", href: "/tools", icon: Wrench },
//   { name: "Templates", href: "/templates", icon: FileText },
//   { name: "Integrations", href: "/integrations", icon: Puzzle },
//   { name: "Billing", href: "/billing", icon: CreditCard },
//   { name: "Settings", href: "/settings", icon: Settings },
// ]

// export function AppLayout({ children }: AppLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const pathname = usePathname()

//   return (
//     <div className="min-h-screen bg-[#121212]">
//       {/* Mobile sidebar */}
//       <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
//         <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
//         <div className="fixed left-0 top-0 h-full w-64 bg-[#121212] border-r border-[#444444]">
//           <div className="flex items-center justify-between p-4 border-b border-[#444444]">
//             <h1 className="text-xl font-bold text-[#E0E0E0]">ConfigCraft</h1>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(false)}
//               className="text-[#E0E0E0] hover:bg-[#444444]"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           <nav className="p-4 space-y-2">
//             {navigation.map((item) => {
//               const isActive = pathname.startsWith(item.href)
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={cn(
//                     "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                     isActive ? "bg-[#888888] text-[#121212]" : "text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]",
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               )
//             })}
//           </nav>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
//         <div className="flex flex-col flex-grow bg-[#121212] border-r border-[#444444]">
//           <div className="flex items-center justify-between p-4 border-b border-[#444444]">
//             <h1 className="text-xl font-bold text-[#E0E0E0]">ConfigCraft</h1>
//           </div>
//           <nav className="flex-1 p-4 space-y-2">
//             {navigation.map((item) => {
//               const isActive = pathname.startsWith(item.href)
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                     isActive ? "bg-[#888888] text-[#121212]" : "text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]",
//                   )}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               )
//             })}
//           </nav>
//           <div className="p-4 border-t border-[#444444]">
//             <Link href="/tools/create">
//               <Button className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212]">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Tool
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         {/* Top bar */}
//         <div className="sticky top-0 z-40 bg-[#121212] border-b border-[#444444]">
//           <div className="flex items-center justify-between px-4 py-3">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="lg:hidden text-[#E0E0E0] hover:bg-[#444444]"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-4 w-4" />
//             </Button>
//             <div className="flex items-center space-x-4">
//               <UserButton />
//             </div>
//           </div>
//         </div>

//         {/* Page content */}
//         <main className="min-h-screen bg-[#121212]">{children}</main>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button"
import { LayoutDashboard, Wrench, Puzzle, Zap, CreditCard, Settings, Menu, X } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Templates", href: "/templates", icon: Puzzle },
  { name: "Integrations", href: "/integrations", icon: Zap },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ConfigCraft</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ConfigCraft</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
