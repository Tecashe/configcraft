// // "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Zap,
//   ArrowRight,
//   CheckCircle,
//   Users,
//   Clock,
//   Shield,
//   Sparkles,
//   BarChart3,
//   Puzzle,
//   Rocket,
//   Star,
//   Play,
// } from "lucide-react"
// import Link from "next/link"

// export default function HomePage() {
//   const features = [
//     {
//       icon: Zap,
//       title: "AI-Powered Generation",
//       description: "Describe your business process and watch AI create a custom tool in minutes",
//     },
//     {
//       icon: Puzzle,
//       title: "No-Code Required",
//       description: "Build sophisticated business tools without writing a single line of code",
//     },
//     {
//       icon: Users,
//       title: "Team Collaboration",
//       description: "Share tools with your team and collaborate in real-time",
//     },
//     {
//       icon: Shield,
//       title: "Enterprise Security",
//       description: "Bank-level security with SOC 2 compliance and data encryption",
//     },
//     {
//       icon: BarChart3,
//       title: "Analytics & Insights",
//       description: "Track usage and performance with detailed analytics dashboards",
//     },
//     {
//       icon: Rocket,
//       title: "Instant Deployment",
//       description: "Deploy your tools instantly with custom URLs and sharing options",
//     },
//   ]

//   const testimonials = [
//     {
//       name: "Sarah Johnson",
//       role: "Operations Manager",
//       company: "TechFlow Inc",
//       content:
//         "ConfigCraft saved us months of development time. We built our entire onboarding system in just 2 hours.",
//       rating: 5,
//     },
//     {
//       name: "Mike Chen",
//       role: "CEO",
//       company: "GrowthLabs",
//       content: "The AI understands exactly what we need. It's like having a developer who speaks business language.",
//       rating: 5,
//     },
//     {
//       name: "Lisa Davis",
//       role: "Project Manager",
//       company: "DataSync",
//       content: "Our team productivity increased by 40% after implementing ConfigCraft tools across our workflows.",
//       rating: 5,
//     },
//   ]

//   const useCases = [
//     {
//       title: "Customer Onboarding",
//       description: "Streamline new customer setup with automated workflows",
//       icon: Users,
//     },
//     {
//       title: "Inventory Management",
//       description: "Track stock levels and manage suppliers efficiently",
//       icon: BarChart3,
//     },
//     {
//       title: "Project Tracking",
//       description: "Monitor project progress with custom dashboards",
//       icon: Rocket,
//     },
//     {
//       title: "Expense Reporting",
//       description: "Automate expense submission and approval processes",
//       icon: CheckCircle,
//     },
//   ]

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
//       {/* Header */}
//       <header className="border-b" style={{ borderColor: "#444444", backgroundColor: "#121212" }}>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-2">
//               <div
//                 className="w-8 h-8 rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: "#888888" }}
//               >
//                 <Zap className="w-5 h-5" style={{ color: "#121212" }} />
//               </div>
//               <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
//                 ConfigCraft
//               </span>
//             </div>
//             <nav className="hidden md:flex items-center space-x-8">
//               <Link href="#features" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                 Features
//               </Link>
//               <Link href="#pricing" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                 Pricing
//               </Link>
//               <Link href="#about" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                 About
//               </Link>
//               <Button
//                 variant="outline"
//                 asChild
//                 style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
//               >
//                 <Link href="/auth/signin">Sign In</Link>
//               </Button>
//               <Button asChild style={{ backgroundColor: "#888888", color: "#121212" }} className="hover:opacity-90">
//                 <Link href="/auth/signup">Get Started</Link>
//               </Button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto text-center">
//           <Badge className="mb-6" style={{ backgroundColor: "#444444", color: "#E0E0E0" }}>
//             <Sparkles className="w-4 h-4 mr-2" />
//             AI-Powered Business Tools
//           </Badge>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: "#E0E0E0" }}>
//             Build Custom Business Tools
//             <br />
//             <span style={{ color: "#888888" }}>in Minutes, Not Months</span>
//           </h1>
//           <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: "#B0B0B0" }}>
//             Transform your business processes with AI-generated tools. Just describe what you need, and our AI builds it
//             for you. No coding required, no lengthy development cycles.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//             <Button
//               size="lg"
//               asChild
//               style={{ backgroundColor: "#888888", color: "#121212" }}
//               className="hover:opacity-90"
//             >
//               <Link href="/auth/signup">
//                 Start Building Free
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </Link>
//             </Button>
//             <Button
//               variant="outline"
//               size="lg"
//               style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
//             >
//               <Play className="w-5 h-5 mr-2" />
//               Watch Demo
//             </Button>
//           </div>
//           <div className="flex items-center justify-center space-x-6 text-sm" style={{ color: "#B0B0B0" }}>
//             <div className="flex items-center">
//               <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
//               Free 14-day trial
//             </div>
//             <div className="flex items-center">
//               <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
//               No credit card required
//             </div>
//             <div className="flex items-center">
//               <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
//               Cancel anytime
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Demo Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
//               See ConfigCraft in Action
//             </h2>
//             <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
//               Watch how easy it is to create a custom business tool from just a simple description
//             </p>
//           </div>
//           <Card className="max-w-4xl mx-auto" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//             <CardContent className="p-8">
//               <div
//                 className="aspect-video rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: "#444444" }}
//               >
//                 <div className="text-center">
//                   <Play className="w-16 h-16 mx-auto mb-4" style={{ color: "#888888" }} />
//                   <h3 className="text-xl font-semibold mb-2" style={{ color: "#E0E0E0" }}>
//                     Interactive Demo
//                   </h3>
//                   <p style={{ color: "#B0B0B0" }}>See how ConfigCraft transforms ideas into working tools</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
//               Everything You Need to Build Better
//             </h2>
//             <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
//               Powerful features that make creating custom business tools as easy as describing what you need
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <Card
//                 key={index}
//                 className="p-6 hover:shadow-lg transition-shadow"
//                 style={{ backgroundColor: "#121212", borderColor: "#444444" }}
//               >
//                 <CardContent className="p-0">
//                   <div
//                     className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
//                     style={{ backgroundColor: "#444444" }}
//                   >
//                     <feature.icon className="w-6 h-6" style={{ color: "#888888" }} />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2" style={{ color: "#E0E0E0" }}>
//                     {feature.title}
//                   </h3>
//                   <p style={{ color: "#B0B0B0" }}>{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Use Cases Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
//               Built for Every Business Need
//             </h2>
//             <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
//               From startups to enterprises, ConfigCraft adapts to your unique business processes
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {useCases.map((useCase, index) => (
//               <Card
//                 key={index}
//                 className="p-6 text-center hover:shadow-lg transition-shadow"
//                 style={{ backgroundColor: "#121212", borderColor: "#444444" }}
//               >
//                 <CardContent className="p-0">
//                   <div
//                     className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
//                     style={{ backgroundColor: "#444444" }}
//                   >
//                     <useCase.icon className="w-8 h-8" style={{ color: "#888888" }} />
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2" style={{ color: "#E0E0E0" }}>
//                     {useCase.title}
//                   </h3>
//                   <p className="text-sm" style={{ color: "#B0B0B0" }}>
//                     {useCase.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
//               Trusted by Growing Businesses
//             </h2>
//             <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
//               See what our customers are saying about ConfigCraft
//             </p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <Card key={index} className="p-6" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//                 <CardContent className="p-0">
//                   <div className="flex mb-4">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#888888" }} />
//                     ))}
//                   </div>
//                   <p className="mb-4" style={{ color: "#B0B0B0" }}>
//                     "{testimonial.content}"
//                   </p>
//                   <div>
//                     <p className="font-semibold" style={{ color: "#E0E0E0" }}>
//                       {testimonial.name}
//                     </p>
//                     <p className="text-sm" style={{ color: "#888888" }}>
//                       {testimonial.role} at {testimonial.company}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
//         <div className="container mx-auto">
//           <Card className="p-12 text-center" style={{ backgroundColor: "#444444", borderColor: "#444444" }}>
//             <CardContent className="p-0">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
//                 Ready to Transform Your Business?
//               </h2>
//               <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
//                 Join thousands of businesses already using ConfigCraft to streamline their operations
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
//                 <Button
//                   size="lg"
//                   asChild
//                   style={{ backgroundColor: "#888888", color: "#121212" }}
//                   className="hover:opacity-90"
//                 >
//                   <Link href="/auth/signup">
//                     Start Your Free Trial
//                     <ArrowRight className="w-5 h-5 ml-2" />
//                   </Link>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   style={{ borderColor: "#888888", color: "#888888", backgroundColor: "transparent" }}
//                 >
//                   Schedule a Demo
//                 </Button>
//               </div>
//               <div className="flex items-center justify-center space-x-6 text-sm" style={{ color: "#B0B0B0" }}>
//                 <div className="flex items-center">
//                   <Clock className="w-4 h-4 mr-2" />
//                   Setup in 5 minutes
//                 </div>
//                 <div className="flex items-center">
//                   <Shield className="w-4 h-4 mr-2" />
//                   Enterprise security
//                 </div>
//                 <div className="flex items-center">
//                   <Users className="w-4 h-4 mr-2" />
//                   24/7 support
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer
//         className="border-t py-12 px-4 sm:px-6 lg:px-8"
//         style={{ borderColor: "#444444", backgroundColor: "#121212" }}
//       >
//         <div className="container mx-auto">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div
//                   className="w-8 h-8 rounded-lg flex items-center justify-center"
//                   style={{ backgroundColor: "#888888" }}
//                 >
//                   <Zap className="w-5 h-5" style={{ color: "#121212" }} />
//                 </div>
//                 <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
//                   ConfigCraft
//                 </span>
//               </div>
//               <p style={{ color: "#B0B0B0" }}>AI-powered business tools that adapt to your unique needs.</p>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
//                 Product
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Templates
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Integrations
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     API
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
//                 Company
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
//                 Support
//               </h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Help Center
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Status
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
//                     Privacy
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t pt-8 mt-8 text-center" style={{ borderColor: "#444444" }}>
//             <p style={{ color: "#B0B0B0" }}>© 2024 ConfigCraft. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import {
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Sparkles,
  BarChart3,
  Puzzle,
  Rocket,
  Star,
  Play,
} from "lucide-react"
import Link from "next/link"
import { ensureUserHasOrganization } from "@/utils/organizationUtils" // Declare the variable before using it

export default async function HomePage() {
  const { userId } = auth()

  if (userId) {
    // User is authenticated, redirect to their organization dashboard
    const orgSlug = await ensureUserHasOrganization()
    redirect(`/${orgSlug}/dashboard`)
  }

  // User is not authenticated, show landing page
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Describe your business process and watch AI create a custom tool in minutes",
    },
    {
      icon: Puzzle,
      title: "No-Code Required",
      description: "Build sophisticated business tools without writing a single line of code",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share tools with your team and collaborate in real-time",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and data encryption",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track usage and performance with detailed analytics dashboards",
    },
    {
      icon: Rocket,
      title: "Instant Deployment",
      description: "Deploy your tools instantly with custom URLs and sharing options",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechFlow Inc",
      content:
        "ConfigCraft saved us months of development time. We built our entire onboarding system in just 2 hours.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "CEO",
      company: "GrowthLabs",
      content: "The AI understands exactly what we need. It's like having a developer who speaks business language.",
      rating: 5,
    },
    {
      name: "Lisa Davis",
      role: "Project Manager",
      company: "DataSync",
      content: "Our team productivity increased by 40% after implementing ConfigCraft tools across our workflows.",
      rating: 5,
    },
  ]

  const useCases = [
    {
      title: "Customer Onboarding",
      description: "Streamline new customer setup with automated workflows",
      icon: Users,
    },
    {
      title: "Inventory Management",
      description: "Track stock levels and manage suppliers efficiently",
      icon: BarChart3,
    },
    {
      title: "Project Tracking",
      description: "Monitor project progress with custom dashboards",
      icon: Rocket,
    },
    {
      title: "Expense Reporting",
      description: "Automate expense submission and approval processes",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" style={{ borderColor: "#444444", backgroundColor: "#121212" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#888888" }}
              >
                <Zap className="w-5 h-5" style={{ color: "#121212" }} />
              </div>
              <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
                ConfigCraft
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
                Features
              </Link>
              <Link href="#pricing" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
                Pricing
              </Link>
              <Link href="#about" className="font-medium hover:opacity-80" style={{ color: "#B0B0B0" }}>
                About
              </Link>
              <Button
                variant="outline"
                asChild
                style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild style={{ backgroundColor: "#888888", color: "#121212" }} className="hover:opacity-90">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Landing page content */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to ConfigCraft</h1>
        <p className="text-xl text-muted-foreground mb-8">Build custom business tools with AI-powered generation</p>
        <div className="space-x-4">
          <a
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Get Started
          </a>
          <a
            href="/auth/sign-in"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto text-center">
          <Badge className="mb-6" style={{ backgroundColor: "#444444", color: "#E0E0E0" }}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Business Tools
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: "#E0E0E0" }}>
            Build Custom Business Tools
            <br />
            <span style={{ color: "#888888" }}>in Minutes, Not Months</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: "#B0B0B0" }}>
            Transform your business processes with AI-generated tools. Just describe what you need, and our AI builds it
            for you. No coding required, no lengthy development cycles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              asChild
              style={{ backgroundColor: "#888888", color: "#121212" }}
              className="hover:opacity-90"
            >
              <Link href="/auth/signup">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm" style={{ color: "#B0B0B0" }}>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
              Free 14-day trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" style={{ color: "#888888" }} />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
              See ConfigCraft in Action
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
              Watch how easy it is to create a custom business tool from just a simple description
            </p>
          </div>
          <Card className="max-w-4xl mx-auto" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
            <CardContent className="p-8">
              <div
                className="aspect-video rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#444444" }}
              >
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4" style={{ color: "#888888" }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                    Interactive Demo
                  </h3>
                  <p style={{ color: "#B0B0B0" }}>See how ConfigCraft transforms ideas into working tools</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
              Everything You Need to Build Better
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
              Powerful features that make creating custom business tools as easy as describing what you need
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{ backgroundColor: "#121212", borderColor: "#444444" }}
              >
                <CardContent className="p-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#444444" }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: "#888888" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "#B0B0B0" }}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
              Built for Every Business Need
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
              From startups to enterprises, ConfigCraft adapts to your unique business processes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
                style={{ backgroundColor: "#121212", borderColor: "#444444" }}
              >
                <CardContent className="p-0">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#444444" }}
                  >
                    <useCase.icon className="w-8 h-8" style={{ color: "#888888" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                    {useCase.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#B0B0B0" }}>
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
              Trusted by Growing Businesses
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
              See what our customers are saying about ConfigCraft
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#888888" }} />
                    ))}
                  </div>
                  <p className="mb-4" style={{ color: "#B0B0B0" }}>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold" style={{ color: "#E0E0E0" }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm" style={{ color: "#888888" }}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#121212" }}>
        <div className="container mx-auto">
          <Card className="p-12 text-center" style={{ backgroundColor: "#444444", borderColor: "#444444" }}>
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#E0E0E0" }}>
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#B0B0B0" }}>
                Join thousands of businesses already using ConfigCraft to streamline their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  size="lg"
                  asChild
                  style={{ backgroundColor: "#888888", color: "#121212" }}
                  className="hover:opacity-90"
                >
                  <Link href="/auth/signup">
                    Start Your Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  style={{ borderColor: "#888888", color: "#888888", backgroundColor: "transparent" }}
                >
                  Schedule a Demo
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm" style={{ color: "#B0B0B0" }}>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Setup in 5 minutes
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise security
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  24/7 support
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-12 px-4 sm:px-6 lg:px-8"
        style={{ borderColor: "#444444", backgroundColor: "#121212" }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#888888" }}
                >
                  <Zap className="w-5 h-5" style={{ color: "#121212" }} />
                </div>
                <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
                  ConfigCraft
                </span>
              </div>
              <p style={{ color: "#B0B0B0" }}>AI-powered business tools that adapt to your unique needs.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:opacity-80" style={{ color: "#B0B0B0" }}>
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center" style={{ borderColor: "#444444" }}>
            <p style={{ color: "#B0B0B0" }}>© 2024 ConfigCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
