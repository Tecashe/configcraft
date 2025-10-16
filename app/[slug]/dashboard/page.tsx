// import type { Viewport } from "next"
// import DashboardClientPage from "./dashboardCleintPage"

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
// }

// export const metadata = {
//   title: "Dashboard",
//   description: "Organization dashboard with analytics and insights",
// }

// export default function DashboardPage() {
//   return <DashboardClientPage />
// }
import type { Viewport } from "next"
import { DashboardClient } from "./dashboardCleintPage"


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata = {
  title: "Dashboard | ConfigCraft",
  description: "Organization dashboard with analytics and insights",
}

export default function DashboardPage() {
  return <DashboardClient />
}
