
// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname, useParams } from "next/navigation"
// import { useUser } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Badge } from "@/components/ui/badge"
// import {
//   LayoutDashboard,
//   Wrench,
//   FileText,
//   Puzzle,
//   CreditCard,
//   Settings,
//   Menu,
//   Plus,
//   ChevronDown,
//   Users,
//   Crown,
//   Shield,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { UserButton } from "@/components/auth/user-button"
// import { CreateOrganizationModal } from "@/components/organization/create-organization-modal"

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Tools", href: "/tools", icon: Wrench },
//   { name: "Templates", href: "/templates", icon: FileText },
//   { name: "Integrations", href: "/integrations", icon: Puzzle },
//   { name: "Billing", href: "/billing", icon: CreditCard },
//   { name: "Settings", href: "/settings", icon: Settings },
// ]

// interface Organization {
//   id: string
//   name: string
//   slug: string
//   description?: string | null
//   logoUrl?: string | null
//   role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
//   memberCount: number
//   toolCount: number
// }

// interface AppNavigationProps {
//   organizations?: Organization[]
//   currentOrganization?: Organization | null
// }

// // Helper function to get role icon
// function getRoleIcon(role: string) {
//   switch (role) {
//     case "OWNER":
//       return <Crown className="h-3 w-3 text-yellow-500" />
//     case "ADMIN":
//       return <Shield className="h-3 w-3 text-blue-500" />
//     case "MEMBER":
//       return <Users className="h-3 w-3 text-green-500" />
//     case "VIEWER":
//       return <Eye className="h-3 w-3 text-gray-500" />
//     default:
//       return null
//   }
// }

// export function AppNavigation({
//   organizations: propOrganizations,
//   currentOrganization: propCurrentOrganization,
// }: AppNavigationProps) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [organizations, setOrganizations] = useState<Organization[]>(propOrganizations || [])
//   const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(propCurrentOrganization || null)
//   const [loading, setLoading] = useState(!propOrganizations)
//   const pathname = usePathname()
//   const params = useParams()
//   const { user } = useUser()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (!propOrganizations && user) {
//       fetchOrganizations()
//     }
//   }, [user, propOrganizations])

//   useEffect(() => {
//     if (organizations.length > 0 && orgSlug) {
//       const org = organizations.find((o) => o.slug === orgSlug)
//       setCurrentOrganization(org || null)
//     }
//   }, [organizations, orgSlug])

//   // Handle responsive sidebar collapse
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarCollapsed(true)
//       }
//     }

//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   const fetchOrganizations = async () => {
//     try {
//       const response = await fetch("/api/organizations")
//       if (response.ok) {
//         const data = await response.json()
//         setOrganizations(data.organizations || [])
//       }
//     } catch (error) {
//       console.error("Error fetching organizations:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getNavHref = (href: string) => {
//     if (orgSlug && href !== "/") {
//       return `/${orgSlug}${href}`
//     }
//     return href
//   }

//   const isActiveRoute = (href: string) => {
//     const fullHref = getNavHref(href)
//     if (fullHref === pathname) return true
//     if (href !== "/dashboard" && pathname.startsWith(fullHref)) return true
//     return false
//   }

//   const handleOrganizationCreated = (organization: any) => {
//     window.location.reload()
//   }

//   return (
//     <>
//       {/* Mobile Navigation */}
//       <div className="lg:hidden">
//         <div className="flex items-center justify-between h-16 px-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
//           <div className="flex items-center space-x-3">
//             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="sm" className="focus-ring">
//                   <Menu className="h-5 w-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-80 p-0 bg-card border-r">
//                 <div className="flex flex-col h-full">
//                   {/* Mobile Header */}
//                   <div className="flex items-center justify-between p-4 border-b">
//                     <div className="flex items-center space-x-2">
//                       <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                         <span className="text-primary-foreground text-sm font-bold">C</span>
//                       </div>
//                       <span className="text-lg font-bold">ConfigCraft</span>
//                     </div>
//                     <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="focus-ring">
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* Organization Selector */}
//                   <div className="p-4 border-b">
//                     <OrganizationSelector
//                       organizations={organizations}
//                       currentOrganization={currentOrganization}
//                       onSelect={() => setMobileMenuOpen(false)}
//                       onOrganizationCreated={handleOrganizationCreated}
//                       collapsed={false}
//                     />
//                   </div>

//                   {/* Navigation */}
//                   <nav className="flex-1 p-4 space-y-1">
//                     {navigation.map((item) => {
//                       const isActive = isActiveRoute(item.href)
//                       return (
//                         <Link
//                           key={item.name}
//                           href={getNavHref(item.href)}
//                           onClick={() => setMobileMenuOpen(false)}
//                           className={cn(
//                             "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-ring",
//                             isActive
//                               ? "bg-primary text-primary-foreground shadow-sm"
//                               : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
//                           )}
//                         >
//                           <item.icon className="h-4 w-4 flex-shrink-0" />
//                           <span>{item.name}</span>
//                         </Link>
//                       )
//                     })}
//                   </nav>

//                   {/* Create Tool Button */}
//                   <div className="p-4 border-t mobile-bottom-safe">
//                     <Link href={getNavHref("/tools/create")} onClick={() => setMobileMenuOpen(false)}>
//                       <Button className="w-full focus-ring">
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create Tool
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </SheetContent>
//             </Sheet>

//             {/* Mobile Organization Display */}
//             {currentOrganization && (
//               <div className="flex items-center space-x-2 min-w-0">
//                 <Avatar className="h-6 w-6 flex-shrink-0">
//                   <AvatarImage src={currentOrganization.logoUrl || undefined} />
//                   <AvatarFallback className="text-xs">
//                     {currentOrganization.name.substring(0, 2).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="font-medium text-sm truncate">{currentOrganization.name}</span>
//               </div>
//             )}
//           </div>

//           <UserButton />
//         </div>
//       </div>

//       {/* Desktop Navigation */}
//       <div
//         className={cn(
//           "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-40",
//           sidebarCollapsed ? "lg:w-16" : "lg:w-72",
//         )}
//       >
//         <div className="flex flex-col flex-grow bg-card border-r shadow-sm">
//           {/* Desktop Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             {!sidebarCollapsed && (
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                   <span className="text-primary-foreground text-sm font-bold">C</span>
//                 </div>
//                 <span className="text-lg font-bold">ConfigCraft</span>
//               </div>
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//               className={cn("focus-ring", sidebarCollapsed && "mx-auto")}
//             >
//               {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//             </Button>
//           </div>

//           {/* Organization Selector */}
//           <div className="p-4 border-b">
//             <OrganizationSelector
//               organizations={organizations}
//               currentOrganization={currentOrganization}
//               onOrganizationCreated={handleOrganizationCreated}
//               collapsed={sidebarCollapsed}
//             />
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4 space-y-1">
//             {navigation.map((item) => {
//               const isActive = isActiveRoute(item.href)
//               return (
//                 <Link
//                   key={item.name}
//                   href={getNavHref(item.href)}
//                   className={cn(
//                     "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-ring group",
//                     isActive
//                       ? "bg-primary text-primary-foreground shadow-sm"
//                       : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
//                     sidebarCollapsed && "justify-center",
//                   )}
//                   title={sidebarCollapsed ? item.name : undefined}
//                 >
//                   <item.icon className="h-4 w-4 flex-shrink-0" />
//                   {!sidebarCollapsed && <span>{item.name}</span>}
//                   {sidebarCollapsed && (
//                     <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
//                       {item.name}
//                     </div>
//                   )}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* Create Tool Button */}
//           <div className="p-4 border-t">
//             <Link href={getNavHref("/tools/create")}>
//               <Button className={cn("focus-ring", sidebarCollapsed ? "w-10 h-10 p-0" : "w-full")}>
//                 <Plus className="h-4 w-4" />
//                 {!sidebarCollapsed && <span className="ml-2">Create Tool</span>}
//               </Button>
//             </Link>
//           </div>

//           {/* User Section */}
//           <div className="p-4 border-t">
//             <UserButton collapsed={sidebarCollapsed} />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// function OrganizationSelector({
//   organizations,
//   currentOrganization,
//   onSelect,
//   onOrganizationCreated,
//   collapsed = false,
// }: {
//   organizations: Organization[]
//   currentOrganization: Organization | null
//   onSelect?: () => void
//   onOrganizationCreated?: (organization: any) => void
//   collapsed?: boolean
// }) {
//   const handleSwitchOrganization = async (orgSlug: string) => {
//     window.location.href = `/${orgSlug}/dashboard`
//     onSelect?.()
//   }

//   if (collapsed) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="w-10 h-10 p-0 focus-ring">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src={currentOrganization?.logoUrl || undefined} />
//               <AvatarFallback className="text-xs">
//                 {currentOrganization?.name.substring(0, 2).toUpperCase() || "CC"}
//               </AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-80" align="start" side="right">
//           <DropdownMenuLabel>Organizations</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {organizations.map((org) => (
//             <DropdownMenuItem
//               key={org.id}
//               onClick={() => handleSwitchOrganization(org.slug)}
//               className="p-3 cursor-pointer"
//             >
//               <div className="flex items-center space-x-3 w-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={org.logoUrl || undefined} />
//                   <AvatarFallback>{org.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center space-x-2">
//                     <p className="font-medium text-sm truncate">{org.name}</p>
//                     {org.id === currentOrganization?.id && (
//                       <Badge variant="secondary" className="text-xs">
//                         Current
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="flex items-center space-x-2 text-xs text-muted-foreground">
//                     {getRoleIcon(org.role)}
//                     <span>{org.role}</span>
//                     <span>•</span>
//                     <span>{org.memberCount} members</span>
//                   </div>
//                 </div>
//               </div>
//             </DropdownMenuItem>
//           ))}
//           <DropdownMenuSeparator />
//           <DropdownMenuItem asChild className="p-0">
//             <CreateOrganizationModal onSuccess={onOrganizationCreated}>
//               <div className="flex items-center space-x-3 p-3 cursor-pointer w-full">
//                 <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
//                   <Plus className="h-4 w-4" />
//                 </div>
//                 <span className="font-medium text-sm">Create Organization</span>
//               </div>
//             </CreateOrganizationModal>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     )
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="w-full justify-between p-2 h-auto focus-ring">
//           <div className="flex items-center space-x-3 min-w-0">
//             <Avatar className="h-8 w-8 flex-shrink-0">
//               <AvatarImage src={currentOrganization?.logoUrl || undefined} />
//               <AvatarFallback>{currentOrganization?.name.substring(0, 2).toUpperCase() || "CC"}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1 text-left min-w-0">
//               <p className="font-medium text-sm truncate">{currentOrganization?.name || "Select Organization"}</p>
//               <p className="text-xs text-muted-foreground">
//                 {currentOrganization?.role && (
//                   <span className="flex items-center space-x-1">
//                     {getRoleIcon(currentOrganization.role)}
//                     <span>{currentOrganization.role}</span>
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//           <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-80" align="start">
//         <DropdownMenuLabel>Organizations</DropdownMenuLabel>
//         <DropdownMenuSeparator />

//         {organizations.map((org) => (
//           <DropdownMenuItem
//             key={org.id}
//             onClick={() => handleSwitchOrganization(org.slug)}
//             className="p-3 cursor-pointer"
//           >
//             <div className="flex items-center space-x-3 w-full">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src={org.logoUrl || undefined} />
//                 <AvatarFallback>{org.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center space-x-2">
//                   <p className="font-medium text-sm truncate">{org.name}</p>
//                   {org.id === currentOrganization?.id && (
//                     <Badge variant="secondary" className="text-xs">
//                       Current
//                     </Badge>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2 text-xs text-muted-foreground">
//                   {getRoleIcon(org.role)}
//                   <span>{org.role}</span>
//                   <span>•</span>
//                   <span>{org.memberCount} members</span>
//                   <span>•</span>
//                   <span>{org.toolCount} tools</span>
//                 </div>
//               </div>
//             </div>
//           </DropdownMenuItem>
//         ))}

//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild className="p-0">
//           <CreateOrganizationModal onSuccess={onOrganizationCreated}>
//             <div className="flex items-center space-x-3 p-3 cursor-pointer w-full">
//               <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
//                 <Plus className="h-4 w-4" />
//               </div>
//               <span className="font-medium text-sm">Create Organization</span>
//             </div>
//           </CreateOrganizationModal>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Wrench,
  FileText,
  Puzzle,
  CreditCard,
  Settings,
  Menu,
  Plus,
  ChevronDown,
  Users,
  Crown,
  Shield,
  Eye,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@/components/auth/user-button"
import { CreateOrganizationModal } from "@/components/organization/create-organization-modal"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  logoUrl?: string | null
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  memberCount: number
  toolCount: number
}

interface AppNavigationProps {
  organizations?: Organization[]
  currentOrganization?: Organization | null
}

// Helper function to get role icon
function getRoleIcon(role: string) {
  switch (role) {
    case "OWNER":
      return <Crown className="h-3 w-3 text-yellow-500" />
    case "ADMIN":
      return <Shield className="h-3 w-3 text-blue-500" />
    case "MEMBER":
      return <Users className="h-3 w-3 text-green-500" />
    case "VIEWER":
      return <Eye className="h-3 w-3 text-gray-500" />
    default:
      return null
  }
}

export function AppNavigation({
  organizations: propOrganizations,
  currentOrganization: propCurrentOrganization,
}: AppNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarHovered, setSidebarHovered] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>(propOrganizations || [])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(propCurrentOrganization || null)
  const [loading, setLoading] = useState(!propOrganizations)
  const pathname = usePathname()
  const params = useParams()
  const { user } = useUser()
  const orgSlug = params?.slug as string

  useEffect(() => {
    if (!propOrganizations && user) {
      fetchOrganizations()
    }
  }, [user, propOrganizations])

  useEffect(() => {
    if (organizations.length > 0 && orgSlug) {
      const org = organizations.find((o) => o.slug === orgSlug)
      setCurrentOrganization(org || null)
    }
  }, [organizations, orgSlug])

  // Sidebar is always collapsed by default, expands on hover
  useEffect(() => {
    setSidebarCollapsed(true)
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations")
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error("Error fetching organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNavHref = (href: string) => {
    if (orgSlug && href !== "/") {
      return `/${orgSlug}${href}`
    }
    return href
  }

  const isActiveRoute = (href: string) => {
    const fullHref = getNavHref(href)
    if (fullHref === pathname) return true
    if (href !== "/dashboard" && pathname.startsWith(fullHref)) return true
    return false
  }

  const handleOrganizationCreated = (organization: any) => {
    window.location.reload()
  }

  const isExpanded = !sidebarCollapsed || sidebarHovered

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="focus-ring">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-card border-r">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">C</span>
                      </div>
                      <span className="text-lg font-bold">ConfigCraft</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="focus-ring">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Organization Selector */}
                  <div className="p-4 border-b">
                    <OrganizationSelector
                      organizations={organizations}
                      currentOrganization={currentOrganization}
                      onSelect={() => setMobileMenuOpen(false)}
                      onOrganizationCreated={handleOrganizationCreated}
                      collapsed={false}
                    />
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                      const isActive = isActiveRoute(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={getNavHref(item.href)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-ring",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Create Tool Button */}
                  <div className="p-4 border-t mobile-bottom-safe">
                    <Link href={getNavHref("/tools/create")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full focus-ring">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Tool
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Organization Display */}
            {currentOrganization && (
              <div className="flex items-center space-x-2 min-w-0">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src={currentOrganization.logoUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {currentOrganization.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate">{currentOrganization.name}</span>
              </div>
            )}
          </div>

          <UserButton />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out z-50",
          isExpanded ? "lg:w-[280px]" : "lg:w-16",
        )}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="flex flex-col flex-grow bg-gradient-to-b from-card to-card/95 border-r shadow-lg backdrop-blur-sm">
          {/* Desktop Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b bg-card/50">
            <div
              className={cn(
                "flex items-center space-x-3 transition-all duration-300",
                !isExpanded && "justify-center w-full",
              )}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-foreground text-sm font-bold">C</span>
              </div>
              {isExpanded && (
                <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  ConfigCraft
                </span>
              )}
            </div>
          </div>

          {/* Organization Selector */}
          <div className="p-3 border-b bg-card/30">
            <OrganizationSelector
              organizations={organizations}
              currentOrganization={currentOrganization}
              onOrganizationCreated={handleOrganizationCreated}
              collapsed={!isExpanded}
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.name}
                  href={getNavHref(item.href)}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus-ring group relative",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    !isExpanded && "justify-center",
                    isExpanded && "space-x-3",
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 transition-transform duration-200",
                      isActive ? "h-5 w-5" : "h-4 w-4",
                      "group-hover:scale-110",
                    )}
                  />
                  {isExpanded && <span className="truncate">{item.name}</span>}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45 border-l border-b" />
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Create Tool Button */}
          <div className="p-3 border-t bg-card/30">
            <Link href={getNavHref("/tools/create")}>
              <Button
                className={cn(
                  "focus-ring shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105",
                  !isExpanded ? "w-10 h-10 p-0" : "w-full",
                )}
                size={!isExpanded ? "icon" : "default"}
              >
                <Plus className="h-4 w-4" />
                {isExpanded && <span className="ml-2">Create Tool</span>}
              </Button>
            </Link>
          </div>

          {/* User Section */}
          <div className="p-3 border-t bg-card/30">
            <UserButton collapsed={!isExpanded} />
          </div>
        </div>
      </div>
    </>
  )
}

function OrganizationSelector({
  organizations,
  currentOrganization,
  onSelect,
  onOrganizationCreated,
  collapsed = false,
}: {
  organizations: Organization[]
  currentOrganization: Organization | null
  onSelect?: () => void
  onOrganizationCreated?: (organization: any) => void
  collapsed?: boolean
}) {
  const handleSwitchOrganization = async (orgSlug: string) => {
    window.location.href = `/${orgSlug}/dashboard`
    onSelect?.()
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full h-10 p-0 focus-ring hover:bg-accent/50 transition-all duration-200">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
              <AvatarImage src={currentOrganization?.logoUrl || undefined} />
              <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                {currentOrganization?.name.substring(0, 2).toUpperCase() || "CC"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start" side="right" sideOffset={8}>
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Organizations
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitchOrganization(org.slug)}
              className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-9 w-9 ring-2 ring-border">
                  <AvatarImage src={org.logoUrl || undefined} />
                  <AvatarFallback className="text-xs font-semibold">
                    {org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-sm truncate">{org.name}</p>
                    {org.id === currentOrganization?.id && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                    {getRoleIcon(org.role)}
                    <span className="font-medium">{org.role}</span>
                    <span>•</span>
                    <span>{org.memberCount} members</span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="p-0">
            <CreateOrganizationModal onSuccess={onOrganizationCreated}>
              <div className="flex items-center space-x-3 p-3 cursor-pointer w-full hover:bg-accent/50 transition-colors">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">Create Organization</span>
              </div>
            </CreateOrganizationModal>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto focus-ring hover:bg-accent/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-primary/20">
              <AvatarImage src={currentOrganization?.logoUrl || undefined} />
              <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                {currentOrganization?.name.substring(0, 2).toUpperCase() || "CC"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-sm truncate">{currentOrganization?.name || "Select Organization"}</p>
              <p className="text-xs text-muted-foreground">
                {currentOrganization?.role && (
                  <span className="flex items-center space-x-1">
                    {getRoleIcon(currentOrganization.role)}
                    <span className="font-medium">{currentOrganization.role}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start" sideOffset={4}>
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Organizations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitchOrganization(org.slug)}
            className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarImage src={org.logoUrl || undefined} />
                <AvatarFallback className="text-xs font-semibold">
                  {org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-sm truncate">{org.name}</p>
                  {org.id === currentOrganization?.id && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                  {getRoleIcon(org.role)}
                  <span className="font-medium">{org.role}</span>
                  <span>•</span>
                  <span>{org.memberCount} members</span>
                  <span>•</span>
                  <span>{org.toolCount} tools</span>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-0">
          <CreateOrganizationModal onSuccess={onOrganizationCreated}>
            <div className="flex items-center space-x-3 p-3 cursor-pointer w-full hover:bg-accent/50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">Create Organization</span>
            </div>
          </CreateOrganizationModal>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
