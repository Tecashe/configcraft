// "use client"

// import { useState } from "react"
// import { useUser } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   LayoutDashboard,
//   Wrench,
//   LayoutTemplateIcon as Template,
//   Puzzle,
//   Settings,
//   CreditCard,
//   Plus,
//   MoreHorizontal,
//   TrendingUp,
//   Users,
//   Activity,
//   Copy,
//   BarChart3,
//   UserPlus,
//   Search,
//   Bell,
//   Loader2,
//   Sparkles,
// } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { UserButton } from "@/components/auth/user-button"
// import { useDashboardData } from "@/hooks/use-dashboard-data"
// import Link from "next/link"
// import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"

// export default async function DashboardPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/auth/signin")
//   }

//   try {
//     // Ensure user exists in database
//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       // User doesn't exist in our database, redirect to onboarding
//       redirect("/onboarding")
//     }

//     // Find user's first organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId,
//         status: "ACTIVE",
//       },
//       include: {
//         organization: true,
//       },
//       orderBy: {
//         joinedAt: "asc",
//       },
//     })

//     if (!membership) {
//       // User has no organizations, redirect to onboarding
//       redirect("/onboarding")
//     }

//     // Redirect to organization dashboard
//     redirect(`/${membership.organization.slug}/dashboard`)
//   } catch (error) {
//     console.error("Dashboard redirect error:", error)
//     // If there's any error, redirect to onboarding to start fresh
//     redirect("/onboarding")
//   }

//   const [activeTab, setActiveTab] = useState("dashboard")
//   const { user: clerkUser } = useUser()
//   const { data, loading, error } = useDashboardData()

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#121212] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#888888]" />
//           <p className="text-[#B0B0B0]">Loading dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#121212] flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 mb-4">Error loading dashboard: {error}</p>
//           <Button onClick={() => window.location.reload()} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const userData = {
//     name: clerkUser?.fullName || `${clerkUser?.firstName} ${clerkUser?.lastName}` || "User",
//     email: clerkUser?.primaryEmailAddress?.emailAddress || "",
//     company: "Your Company",
//     avatar: clerkUser?.imageUrl || "",
//   }

//   const stats = data?.stats || {
//     toolsCount: 0,
//     membersCount: 0,
//     usageThisMonth: 0,
//     subscription: "FREE",
//   }

//   const recentTools = data?.recentTools || []

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "DRAFT":
//         return "bg-[#444444] text-[#B0B0B0]"
//       case "GENERATING":
//         return "bg-blue-900 text-blue-200"
//       case "GENERATED":
//         return "bg-green-900 text-green-200"
//       case "PUBLISHED":
//         return "bg-[#888888] text-[#121212]"
//       case "ARCHIVED":
//         return "bg-orange-900 text-orange-200"
//       case "ERROR":
//         return "bg-red-900 text-red-200"
//       default:
//         return "bg-[#444444] text-[#B0B0B0]"
//     }
//   }

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case "DRAFT":
//         return "Draft"
//       case "GENERATING":
//         return "Generating..."
//       case "GENERATED":
//         return "Ready for Review"
//       case "PUBLISHED":
//         return "Live"
//       case "ARCHIVED":
//         return "Archived"
//       case "ERROR":
//         return "Error"
//       default:
//         return status
//     }
//   }

//   const sidebarItems = [
//     { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
//     { id: "tools", label: "My Tools", icon: Wrench, href: "/tools" },
//     { id: "templates", label: "Templates", icon: Template, href: "/templates" },
//     { id: "integrations", label: "Integrations", icon: Puzzle, href: "/integrations" },
//     { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
//     { id: "billing", label: "Billing", icon: CreditCard, href: "/billing" },
//   ]

//   return (
//     <div className="min-h-screen bg-[#121212] flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-[#121212] border-r border-[#444444] flex flex-col">
//         {/* Logo */}
//         <div className="p-6 border-b border-[#444444]">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-[#888888] to-[#666666] rounded-lg flex items-center justify-center">
//               <span className="text-[#121212] text-sm font-bold">C</span>
//             </div>
//             <span className="text-xl font-bold text-[#E0E0E0]">ConfigCraft</span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {sidebarItems.map((item) => (
//               <li key={item.id}>
//                 <Link
//                   href={item.href}
//                   className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                     activeTab === item.id
//                       ? "bg-[#444444] text-[#E0E0E0] border border-[#888888]"
//                       : "text-[#B0B0B0] hover:bg-[#444444] hover:text-[#E0E0E0]"
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* User Profile */}
//         <div className="p-4 border-t border-[#444444]">
//           <div className="flex items-center space-x-3 p-2">
//             <UserButton />
//             <div className="flex-1 text-left">
//               <p className="text-sm font-medium text-[#E0E0E0]">{userData.name}</p>
//               <p className="text-xs text-[#B0B0B0]">{userData.company}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Header */}
//         <header className="bg-[#121212] border-b border-[#444444] px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-[#E0E0E0]">Dashboard</h1>
//               <p className="text-[#B0B0B0]">Welcome back, {userData.name}</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//                 <Input
//                   placeholder="Search tools..."
//                   className="pl-10 w-64 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
//               >
//                 <Bell className="w-4 h-4" />
//               </Button>
//               <Button size="sm" className="bg-[#888888] hover:bg-[#666666] text-[#121212]" asChild>
//                 <Link href="/tools/create">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create New Tool
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="flex-1 p-6">
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <div className="bg-gradient-to-r from-[#888888] to-[#666666] rounded-xl p-6 text-[#121212]">
//               <h2 className="text-2xl font-bold mb-2">Welcome to {userData.company}!</h2>
//               <p className="text-[#121212] opacity-80 mb-4">
//                 You've created {stats.toolsCount} custom tools and have {stats.membersCount} team members. Current plan:{" "}
//                 {stats.subscription}
//               </p>
//               <Button size="lg" className="bg-[#121212] text-[#E0E0E0] hover:bg-[#333333]" asChild>
//                 <Link href="/tools/create">
//                   <Plus className="w-5 h-5 mr-2" />
//                   Create Your First Tool
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid md:grid-cols-3 gap-6 mb-8">
//             <Card className="bg-[#121212] border-[#444444]">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-[#B0B0B0]">Tools Created</p>
//                     <p className="text-3xl font-bold text-[#E0E0E0]">{stats.toolsCount}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                     <Wrench className="w-6 h-6 text-[#888888]" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-4 text-sm">
//                   <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
//                   <span className="text-green-400">{stats.usageThisMonth} this month</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-[#121212] border-[#444444]">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-[#B0B0B0]">Team Members</p>
//                     <p className="text-3xl font-bold text-[#E0E0E0]">{stats.membersCount}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                     <Users className="w-6 h-6 text-[#888888]" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-4 text-sm">
//                   <span className="text-[#B0B0B0]">Active members</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-[#121212] border-[#444444]">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-[#B0B0B0]">Current Plan</p>
//                     <p className="text-3xl font-bold text-[#E0E0E0]">{stats.subscription}</p>
//                   </div>
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                     <Activity className="w-6 h-6 text-[#888888]" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-4 text-sm">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
//                     asChild
//                   >
//                     <Link href="/billing">Manage Plan</Link>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recent Tools */}
//           <div>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-[#E0E0E0]">Recent Tools</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
//                 asChild
//               >
//                 <Link href="/tools">View All Tools</Link>
//               </Button>
//             </div>

//             {recentTools.length === 0 ? (
//               <Card className="bg-[#121212] border-[#444444]">
//                 <CardContent className="p-8 text-center">
//                   <Sparkles className="w-12 h-12 text-[#888888] mx-auto mb-4" />
//                   <h4 className="text-lg font-semibold text-[#E0E0E0] mb-2">Ready to build your first tool?</h4>
//                   <p className="text-[#B0B0B0] mb-4">
//                     Create custom business tools in minutes with AI. Just describe what you need, and we'll build it for
//                     you.
//                   </p>
//                   <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]" asChild>
//                     <Link href="/tools/create">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Create Your First Tool
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {recentTools.map((tool: any) => (
//                   <Card
//                     key={tool.id}
//                     className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors cursor-pointer"
//                   >
//                     <CardContent className="p-0">
//                       <div className="aspect-video bg-[#444444] rounded-t-lg overflow-hidden">
//                         <img
//                           src="/placeholder.svg?height=120&width=200"
//                           alt={tool.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <div className="flex items-start justify-between mb-2">
//                           <h4 className="font-semibold text-[#E0E0E0] line-clamp-1">{tool.name}</h4>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-8 w-8 p-0 text-[#B0B0B0] hover:bg-[#444444]"
//                               >
//                                 <MoreHorizontal className="w-4 h-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="bg-[#121212] border-[#444444]">
//                               <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]">
//                                 <Copy className="w-4 h-4 mr-2" />
//                                 Clone Tool
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]">
//                                 <BarChart3 className="w-4 h-4 mr-2" />
//                                 View Analytics
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]">
//                                 <UserPlus className="w-4 h-4 mr-2" />
//                                 Manage Team
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                         <p className="text-sm text-[#B0B0B0] mb-3 line-clamp-2">{tool.description}</p>
//                         <div className="flex items-center justify-between">
//                           <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
//                           <div className="flex items-center text-xs text-[#B0B0B0]">
//                             <Users className="w-3 h-3 mr-1" />
//                             {tool._count?.usageRecords || 0} uses
//                           </div>
//                         </div>
//                         <p className="text-xs text-[#B0B0B0] mt-2">
//                           Updated {new Date(tool.updatedAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-8">
//             <h3 className="text-xl font-bold text-[#E0E0E0] mb-6">Quick Actions</h3>
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <Card className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors cursor-pointer">
//                 <CardContent className="p-6 text-center">
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Plus className="w-6 h-6 text-[#888888]" />
//                   </div>
//                   <h4 className="font-semibold text-[#E0E0E0] mb-1">Create Tool</h4>
//                   <p className="text-sm text-[#B0B0B0]">Build a new custom tool</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors cursor-pointer">
//                 <CardContent className="p-6 text-center">
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Template className="w-6 h-6 text-[#888888]" />
//                   </div>
//                   <h4 className="font-semibold text-[#E0E0E0] mb-1">Browse Templates</h4>
//                   <p className="text-sm text-[#B0B0B0]">Start from a template</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors cursor-pointer">
//                 <CardContent className="p-6 text-center">
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <UserPlus className="w-6 h-6 text-[#888888]" />
//                   </div>
//                   <h4 className="font-semibold text-[#E0E0E0] mb-1">Invite Team</h4>
//                   <p className="text-sm text-[#B0B0B0]">Add team members</p>
//                 </CardContent>
//               </Card>

//               <Card className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors cursor-pointer">
//                 <CardContent className="p-6 text-center">
//                   <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <Puzzle className="w-6 h-6 text-[#888888]" />
//                   </div>
//                   <h4 className="font-semibold text-[#E0E0E0] mb-1">Integrations</h4>
//                   <p className="text-sm text-[#B0B0B0]">Connect your tools</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth/signin")
  }

  try {
    // Ensure user exists in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      // User doesn't exist in our database, redirect to onboarding
      redirect("/onboarding")
    }

    // Find user's first organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    if (!membership) {
      // User has no organizations, redirect to onboarding
      redirect("/onboarding")
    }

    // Redirect to organization dashboard
    redirect(`/${membership.organization.slug}/dashboard`)
  } catch (error) {
    console.error("Dashboard redirect error:", error)
    // If there's any error, redirect to onboarding to start fresh
    redirect("/onboarding")
  }

  // This return should never be reached due to redirects above
  return null
}
