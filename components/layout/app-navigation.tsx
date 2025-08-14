"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@/components/auth/user-button"
import type { Organization } from "@/lib/organization"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Integrations", href: "/integrations", icon: Puzzle },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface AppNavigationProps {
  organizations: Organization[]
  currentOrganization: Organization | null
}

export function AppNavigation({ organizations, currentOrganization }: AppNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const orgSlug = params?.slug as string

  const getRoleIcon = (role: string) => {
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

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 border-b bg-card">
          <div className="flex items-center space-x-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Organization Selector */}
                  <div className="p-4 border-b">
                    <OrganizationSelector
                      organizations={organizations}
                      currentOrganization={currentOrganization}
                      onSelect={() => setMobileMenuOpen(false)}
                    />
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                      const isActive = isActiveRoute(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={getNavHref(item.href)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "config-nav-item",
                            isActive ? "config-nav-item-active" : "config-nav-item-inactive",
                          )}
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Create Tool Button */}
                  <div className="p-4 border-t">
                    <Link href={getNavHref("/tools/create")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full config-button-primary">
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
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentOrganization.logoUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {currentOrganization.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm truncate max-w-32">{currentOrganization.name}</span>
              </div>
            )}
          </div>

          <UserButton />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow config-card border-r border-border">
          {/* Organization Selector */}
          <div className="p-4 border-b border-border">
            <OrganizationSelector organizations={organizations} currentOrganization={currentOrganization} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.name}
                  href={getNavHref(item.href)}
                  className={cn("config-nav-item", isActive ? "config-nav-item-active" : "config-nav-item-inactive")}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Create Tool Button */}
          <div className="p-4 border-t border-border">
            <Link href={getNavHref("/tools/create")}>
              <Button className="w-full config-button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Tool
              </Button>
            </Link>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <UserButton />
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
}: {
  organizations: Organization[]
  currentOrganization: Organization | null
  onSelect?: () => void
}) {
  const [isCreating, setIsCreating] = useState(false)

  const handleSwitchOrganization = async (orgSlug: string) => {
    window.location.href = `/${orgSlug}/dashboard`
    onSelect?.()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentOrganization?.logoUrl || undefined} />
              <AvatarFallback>{currentOrganization?.name.substring(0, 2).toUpperCase() || "CC"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{currentOrganization?.name || "Select Organization"}</p>
              <p className="text-xs text-muted-foreground">
                {currentOrganization?.role && (
                  <span className="flex items-center space-x-1">
                    {getRoleIcon(currentOrganization.role)}
                    <span>{currentOrganization.role}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitchOrganization(org.slug)}
            className="p-3 cursor-pointer"
          >
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={org.logoUrl || undefined} />
                <AvatarFallback>{org.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{org.name}</p>
                  {org.id === currentOrganization?.id && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {getRoleIcon(org.role)}
                  <span>{org.role}</span>
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
        <DropdownMenuItem onClick={() => setIsCreating(true)} className="p-3 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">Create Organization</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
