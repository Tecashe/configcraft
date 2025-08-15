// import { UserButton as ClerkUserButton } from "@clerk/nextjs"

// export function UserButton() {
//   return (
//     <ClerkUserButton
//       appearance={{
//         elements: {
//           avatarBox: "w-8 h-8",
//         },
//       }}
//       userProfileProps={{
//         appearance: {
//           elements: {
//             card: "shadow-lg",
//           },
//         },
//       }}
//     />
//   )
// }

"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface UserButtonProps {
  collapsed?: boolean
}

export function UserButton({ collapsed = false }: UserButtonProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { theme, setTheme } = useTheme()

  if (!user) {
    return null
  }

  const userInitials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
    "U"

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-10 h-10 p-0 focus-ring">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
              <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" side="right">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>{theme === "dark" ? "Light" : "Dark"} mode</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 h-auto focus-ring">
          <div className="flex items-center space-x-3 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
              <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          <span>{theme === "dark" ? "Light" : "Dark"} mode</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
