// import { auth } from "@clerk/nextjs/server"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   ArrowRight,
//   CheckCircle,
//   Shield,
//   Sparkles,
//   Star,
//   Quote,
//   ChevronRight,
//   Play,
//   Code,
//   Palette,
//   Database,
//   Users,
//   Target,
//   Clock,
//   Rocket,
//   Brain,
//   Settings,
// } from "lucide-react"
// import Link from "next/link"
// import Image from "next/image"

// export default async function LandingPage() {
//   const { userId } = await auth()

//   const features = [
//     {
//       icon: Brain,
//       title: "AI-Powered Generation",
//       description: "Describe your business need and watch as AI creates a fully functional tool in minutes.",
//     },
//     {
//       icon: Code,
//       title: "No Code Required",
//       description: "Build complex business applications without writing a single line of code.",
//     },
//     {
//       icon: Palette,
//       title: "Beautiful UI/UX",
//       description: "Every tool comes with a modern, responsive design that works on all devices.",
//     },
//     {
//       icon: Database,
//       title: "Smart Data Management",
//       description: "Automatic database setup and management for all your business data needs.",
//     },
//     {
//       icon: Rocket,
//       title: "Instant Deployment",
//       description: "Your tools are instantly deployed and accessible from anywhere in the world.",
//     },
//     {
//       icon: Shield,
//       title: "Enterprise Security",
//       description: "Bank-level security with role-based access control and data encryption.",
//     },
//   ]

//   const testimonials = [
//     {
//       name: "Sarah Chen",
//       role: "Operations Manager",
//       company: "TechFlow Inc",
//       image: "/professional-woman-smiling.png",
//       quote:
//         "ConfigCraft transformed how we handle our inventory. What used to take weeks of development now takes minutes.",
//       rating: 5,
//     },
//     {
//       name: "Marcus Rodriguez",
//       role: "CEO",
//       company: "StartupLab",
//       image: "/professional-man-glasses.png",
//       quote: "The AI understands exactly what we need. We've built 12 custom tools that perfectly fit our workflow.",
//       rating: 5,
//     },
//     {
//       name: "Emily Watson",
//       role: "Project Manager",
//       company: "Creative Solutions",
//       image: "/professional-woman-short-hair.png",
//       quote: "Our team productivity increased by 300% after implementing ConfigCraft tools. It's simply amazing.",
//       rating: 5,
//     },
//   ]

//   const toolExamples = [
//     {
//       title: "Customer Onboarding Dashboard",
//       description: "Streamline new customer setup with automated workflows and progress tracking.",
//       image: "/customer-onboarding-dashboard.png",
//       category: "CRM",
//     },
//     {
//       title: "Inventory Management System",
//       description: "Real-time inventory tracking with automated reorder points and supplier management.",
//       image: "/inventory-management-system.png",
//       category: "Operations",
//     },
//     {
//       title: "Project Management Hub",
//       description: "Collaborative project tracking with timeline visualization and team coordination.",
//       image: "/project-management-dashboard.png",
//       category: "Productivity",
//     },
//     {
//       title: "Expense Management Portal",
//       description: "Automated expense tracking with receipt scanning and approval workflows.",
//       image: "/expense-management-interface.png",
//       category: "Finance",
//     },
//   ]

//   const steps = [
//     {
//       step: "01",
//       title: "Describe Your Need",
//       description: "Simply tell us what business tool you need in plain English.",
//       image: "/business-requirements-typing.png",
//     },
//     {
//       step: "02",
//       title: "AI Builds Your Tool",
//       description: "Our AI analyzes your requirements and generates a complete application.",
//       image: "/ai-code-interface.png",
//     },
//     {
//       step: "03",
//       title: "Deploy & Use",
//       description: "Your tool is instantly deployed and ready for your team to use.",
//       image: "/business-tool-deployment-dashboard.png",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-zinc-950">
//       {/* Navigation */}
//       <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
//                 <span className="text-white text-sm font-bold">C</span>
//               </div>
//               <span className="text-2xl font-bold text-white">ConfigCraft</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               {userId ? (
//                 <Button asChild className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
//                   <Link href="/dashboard">
//                     Go to Dashboard
//                     <ArrowRight className="ml-2 w-4 h-4" />
//                   </Link>
//                 </Button>
//               ) : (
//                 <div className="flex items-center space-x-3">
//                   <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-900">
//                     <Link href="/auth/signin">Sign In</Link>
//                   </Button>
//                   <Button asChild className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
//                     <Link href="/auth/signup">
//                       Get Started Free
//                       <ArrowRight className="ml-2 w-4 h-4" />
//                     </Link>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative py-24 lg:py-40 overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-zinc-950"></div>
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
//         </div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <Badge className="mb-6 bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800">
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 AI-Powered Business Tools
//               </Badge>
//               <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//                 Build Custom
//                 <span className="block text-zinc-400">Business Tools</span>
//                 <span className="block text-zinc-500 text-4xl md:text-5xl lg:text-6xl">In Minutes</span>
//               </h1>
//               <p className="text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
//                 Transform your business processes with AI-generated tools. Simply describe what you need, and watch as
//                 ConfigCraft creates fully functional applications tailored to your workflow.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 mb-12">
//                 <Button
//                   size="lg"
//                   asChild
//                   className="bg-zinc-800 hover:bg-zinc-700 text-white text-lg px-8 py-4 border-zinc-700"
//                 >
//                   <Link href={userId ? "/dashboard" : "/auth/signup"}>
//                     {userId ? "Go to Dashboard" : "Start Building Free"}
//                     <ArrowRight className="ml-2 w-5 h-5" />
//                   </Link>
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 bg-transparent text-lg px-8 py-4"
//                 >
//                   <Play className="mr-2 w-5 h-5" />
//                   Watch Demo
//                 </Button>
//               </div>
//               <div className="flex items-center space-x-8 text-zinc-500">
//                 <div className="flex items-center space-x-2">
//                   <CheckCircle className="w-5 h-5" />
//                   <span>No Credit Card</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <CheckCircle className="w-5 h-5" />
//                   <span>Free Forever</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <CheckCircle className="w-5 h-5" />
//                   <span>Deploy Instantly</span>
//                 </div>
//               </div>
//             </div>
//             <div className="relative">
//               <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
//                 <Image
//                   src="/ai-dashboard-interface.png"
//                   alt="ConfigCraft AI Dashboard Interface"
//                   width={600}
//                   height={600}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="absolute -top-4 -right-4 w-32 h-32 bg-zinc-900 rounded-xl border border-zinc-800 p-4 shadow-xl">
//                 <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
//                   <Settings className="w-12 h-12 text-zinc-400" />
//                 </div>
//               </div>
//               <div className="absolute -bottom-4 -left-4 w-40 h-24 bg-zinc-900 rounded-xl border border-zinc-800 p-4 shadow-xl">
//                 <div className="text-zinc-400 text-sm mb-1">Build Time</div>
//                 <div className="text-white text-2xl font-bold">2 min</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Tool Examples */}
//       <section className="py-24 bg-zinc-950/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">See What You Can Build</h2>
//             <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
//               From simple forms to complex dashboards, ConfigCraft can build any business tool you need.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {toolExamples.map((tool, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-500 group overflow-hidden"
//               >
//                 <CardContent className="p-0">
//                   <div className="aspect-video overflow-hidden">
//                     <Image
//                       src={tool.image || "/placeholder.svg"}
//                       alt={tool.title}
//                       width={400}
//                       height={225}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <Badge className="mb-4 bg-zinc-800 text-zinc-300 border-zinc-700">{tool.category}</Badge>
//                     <h3 className="text-lg font-semibold text-white mb-3">{tool.title}</h3>
//                     <p className="text-zinc-400 text-sm leading-relaxed">{tool.description}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
//             <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
//               Building custom business tools has never been easier. Here's how ConfigCraft transforms your ideas into
//               reality:
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-12">
//             {steps.map((step, index) => (
//               <div key={index} className="relative">
//                 <div className="text-center">
//                   <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
//                     <span className="text-3xl font-bold text-white">{step.step}</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
//                   <p className="text-zinc-400 mb-8 leading-relaxed">{step.description}</p>
//                   <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
//                     <Image
//                       src={step.image || "/placeholder.svg"}
//                       alt={step.title}
//                       width={400}
//                       height={225}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className="hidden lg:block absolute top-12 -right-6 z-10">
//                     <ChevronRight className="w-8 h-8 text-zinc-700" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-24 bg-zinc-950/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powerful Features for Modern Businesses</h2>
//             <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
//               Everything you need to build, deploy, and manage custom business tools at enterprise scale.
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300 group"
//               >
//                 <CardContent className="p-8">
//                   <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-700 transition-colors">
//                     <feature.icon className="w-8 h-8 text-zinc-300" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
//                   <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div className="text-center group">
//               <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
//                 <Target className="w-10 h-10 text-zinc-300" />
//               </div>
//               <div className="text-5xl font-bold text-white mb-3">10,000+</div>
//               <div className="text-zinc-400 text-lg">Tools Created</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
//                 <Users className="w-10 h-10 text-zinc-300" />
//               </div>
//               <div className="text-5xl font-bold text-white mb-3">500+</div>
//               <div className="text-zinc-400 text-lg">Companies</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
//                 <Shield className="w-10 h-10 text-zinc-300" />
//               </div>
//               <div className="text-5xl font-bold text-white mb-3">99.9%</div>
//               <div className="text-zinc-400 text-lg">Uptime</div>
//             </div>
//             <div className="text-center group">
//               <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
//                 <Clock className="w-10 h-10 text-zinc-300" />
//               </div>
//               <div className="text-5xl font-bold text-white mb-3">2 min</div>
//               <div className="text-zinc-400 text-lg">Avg. Build Time</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-24 bg-zinc-950/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Growing Businesses</h2>
//             <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
//               See what our customers are saying about ConfigCraft and how it's transforming their operations
//             </p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300 group"
//               >
//                 <CardContent className="p-8">
//                   <div className="flex mb-6">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star key={i} className="w-6 h-6 fill-zinc-600 text-zinc-600" />
//                     ))}
//                   </div>
//                   <Quote className="w-10 h-10 text-zinc-700 mb-6" />
//                   <p className="text-zinc-300 mb-8 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
//                   <div className="flex items-center space-x-4">
//                     <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-800">
//                       <Image
//                         src={testimonial.image || "/placeholder.svg"}
//                         alt={testimonial.name}
//                         width={56}
//                         height={56}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white text-lg">{testimonial.name}</p>
//                       <p className="text-zinc-400">{testimonial.role}</p>
//                       <p className="text-zinc-500 text-sm">{testimonial.company}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 bg-zinc-900">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
//           <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
//             Join thousands of businesses already using ConfigCraft to build custom tools and streamline their
//             operations. Start building your first tool today.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
//             <Button
//               size="lg"
//               asChild
//               className="bg-zinc-800 hover:bg-zinc-700 text-white text-lg px-10 py-5 border-zinc-700"
//             >
//               <Link href={userId ? "/dashboard" : "/auth/signup"}>
//                 {userId ? "Go to Dashboard" : "Start Building Free"}
//                 <ArrowRight className="ml-2 w-5 h-5" />
//               </Link>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent text-lg px-10 py-5"
//             >
//               Schedule Demo
//             </Button>
//           </div>
//           <div className="flex items-center justify-center space-x-12 text-zinc-400">
//             <div className="flex items-center space-x-3">
//               <CheckCircle className="w-6 h-6" />
//               <span className="text-lg">14-day free trial</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <CheckCircle className="w-6 h-6" />
//               <span className="text-lg">No setup fees</span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <CheckCircle className="w-6 h-6" />
//               <span className="text-lg">Cancel anytime</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-zinc-950 border-t border-zinc-800 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-12">
//             <div className="col-span-1">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
//                   <span className="text-white text-sm font-bold">C</span>
//                 </div>
//                 <span className="text-xl font-bold text-white">ConfigCraft</span>
//               </div>
//               <p className="text-zinc-400 leading-relaxed">Build custom business tools with AI. No code required.</p>
//             </div>
//             <div>
//               <h4 className="font-semibold text-white mb-6 text-lg">Product</h4>
//               <ul className="space-y-3 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Templates
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Integrations
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     API
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
//               <ul className="space-y-3 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-white mb-6 text-lg">Support</h4>
//               <ul className="space-y-3 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Help Center
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Community
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Status
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-zinc-400">© 2024 ConfigCraft. All rights reserved.</p>
//             <div className="flex space-x-8 mt-4 md:mt-0">
//               <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
//                 Privacy Policy
//               </Link>
//               <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
//                 Terms of Service
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }




// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   ArrowRight,
//   Zap,
//   Shield,
//   Rocket,
//   Users,
//   Clock,
//   CheckCircle,
//   Star,
//   Sparkles,
//   Code,
//   Database,
//   Globe,
//   Smartphone,
//   TrendingUp,
//   FileText,
// } from "lucide-react"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-zinc-950 text-white">
//       {/* Navigation */}
//       <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center">
//                 <Code className="h-4 w-4 text-white" />
//               </div>
//               <span className="text-xl font-bold">ConfigCraft</span>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               <Link href="#features" className="text-zinc-300 hover:text-white transition-colors">
//                 Features
//               </Link>
//               <Link href="#examples" className="text-zinc-300 hover:text-white transition-colors">
//                 Examples
//               </Link>
//               <Link href="#pricing" className="text-zinc-300 hover:text-white transition-colors">
//                 Pricing
//               </Link>
//               <Link href="/auth/signin">
//                 <Button variant="ghost" className="text-zinc-300 hover:text-white">
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href="/auth/signup">
//                 <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">Get Started</Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden py-20 lg:py-32">
//         <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               <div className="space-y-4">
//                 <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
//                   <Sparkles className="h-3 w-3 mr-1" />
//                   AI-Powered Tool Generation
//                 </Badge>
//                 <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
//                   Build Business Tools in{" "}
//                   <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-transparent">
//                     Minutes
//                   </span>
//                 </h1>
//                 <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
//                   Transform your business requirements into fully functional web applications using AI. No coding
//                   required, just describe what you need.
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/auth/signup">
//                   <Button
//                     size="lg"
//                     className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 px-8 py-4 text-lg"
//                   >
//                     Start Building Free
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </Link>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-8 py-4 text-lg bg-transparent"
//                 >
//                   Watch Demo
//                 </Button>
//               </div>

//               {/* Floating Success Cards */}
//               <div className="hidden lg:block absolute top-20 right-20 animate-pulse">
//                 <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-400" />
//                       <span className="text-sm text-zinc-300">Tool deployed successfully</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="hidden lg:block absolute bottom-20 right-32 animate-pulse delay-1000">
//                 <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-2">
//                       <Users className="h-4 w-4 text-blue-400" />
//                       <span className="text-sm text-zinc-300">5 team members added</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="relative">
//               <div className="relative z-10">
//                 <Image
//                   src="/ai-dashboard-interface.png"
//                   alt="AI Dashboard Interface"
//                   width={600}
//                   height={400}
//                   className="rounded-xl shadow-2xl border border-zinc-800"
//                 />
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 to-transparent rounded-xl" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-zinc-900/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               { icon: Rocket, label: "Tools Created", value: "10,000+", color: "text-blue-400" },
//               { icon: Users, label: "Active Users", value: "50,000+", color: "text-green-400" },
//               { icon: Clock, label: "Time Saved", value: "1M+ Hours", color: "text-purple-400" },
//               { icon: TrendingUp, label: "Success Rate", value: "99.9%", color: "text-orange-400" },
//             ].map((stat, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/80 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-300 group"
//               >
//                 <CardContent className="p-6 text-center">
//                   <stat.icon
//                     className={`h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`}
//                   />
//                   <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
//                   <div className="text-sm text-zinc-400">{stat.label}</div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
//               Everything you need to build, deploy, and manage business tools at scale
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Zap,
//                 title: "AI-Powered Generation",
//                 description: "Describe your tool in plain English and watch AI build it for you",
//                 color: "text-yellow-400",
//               },
//               {
//                 icon: Code,
//                 title: "No Code Required",
//                 description: "Build complex applications without writing a single line of code",
//                 color: "text-blue-400",
//               },
//               {
//                 icon: Database,
//                 title: "Smart Data Management",
//                 description: "Automatic database schema generation and data handling",
//                 color: "text-green-400",
//               },
//               {
//                 icon: Globe,
//                 title: "Instant Deployment",
//                 description: "Deploy your tools to the web with one click",
//                 color: "text-purple-400",
//               },
//               {
//                 icon: Smartphone,
//                 title: "Mobile Responsive",
//                 description: "All tools work perfectly on desktop, tablet, and mobile",
//                 color: "text-pink-400",
//               },
//               {
//                 icon: Shield,
//                 title: "Enterprise Security",
//                 description: "Bank-level security with role-based access control",
//                 color: "text-red-400",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-all duration-300 group"
//               >
//                 <CardContent className="p-6">
//                   <feature.icon
//                     className={`h-10 w-10 mb-4 ${feature.color} group-hover:scale-110 transition-transform`}
//                   />
//                   <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
//                   <p className="text-zinc-400">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Tool Examples Section */}
//       <section id="examples" className="py-20 bg-zinc-900/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Built by Our Users</h2>
//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
//               See what's possible with ConfigCraft - real tools built by real businesses
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Customer Onboarding Dashboard",
//                 category: "CRM",
//                 image: "/customer-onboarding-dashboard.png",
//                 description: "Streamline new customer setup with automated workflows",
//               },
//               {
//                 title: "Inventory Management System",
//                 category: "Operations",
//                 image: "/inventory-management-system.png",
//                 description: "Track stock levels, orders, and suppliers in real-time",
//               },
//               {
//                 title: "Project Management Dashboard",
//                 category: "Productivity",
//                 image: "/project-management-dashboard.png",
//                 description: "Manage tasks, timelines, and team collaboration",
//               },
//               {
//                 title: "Expense Management Interface",
//                 category: "Finance",
//                 image: "/expense-management-interface.png",
//                 description: "Track expenses, approvals, and budget allocation",
//               },
//               {
//                 title: "Business Requirements Tool",
//                 category: "Planning",
//                 image: "/business-requirements-typing.png",
//                 description: "Capture and manage business requirements efficiently",
//               },
//               {
//                 title: "Deployment Dashboard",
//                 category: "DevOps",
//                 image: "/business-tool-deployment-dashboard.png",
//                 description: "Monitor deployments and system health",
//               },
//             ].map((tool, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 overflow-hidden group hover:bg-zinc-800/50 transition-all duration-300"
//               >
//                 <div className="relative overflow-hidden">
//                   <Image
//                     src={tool.image || "/placeholder.svg"}
//                     alt={tool.title}
//                     width={400}
//                     height={250}
//                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div className="absolute top-3 left-3">
//                     <Badge className="bg-zinc-800/80 text-zinc-300 border-zinc-700">{tool.category}</Badge>
//                   </div>
//                 </div>
//                 <CardContent className="p-6">
//                   <h3 className="text-lg font-semibold mb-2 text-white">{tool.title}</h3>
//                   <p className="text-zinc-400 text-sm">{tool.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">How It Works</h2>
//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto">From idea to deployed tool in three simple steps</p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-12">
//             {[
//               {
//                 step: "01",
//                 title: "Describe Your Tool",
//                 description:
//                   "Tell us what you need in plain English. Our AI understands complex business requirements.",
//                 image: "/business-requirements-typing.png",
//                 icon: FileText,
//               },
//               {
//                 step: "02",
//                 title: "AI Builds Your Tool",
//                 description: "Watch as our AI generates a fully functional application with database, UI, and logic.",
//                 image: "/ai-code-interface.png",
//                 icon: Code,
//               },
//               {
//                 step: "03",
//                 title: "Deploy & Share",
//                 description: "One-click deployment to the web. Share with your team and start using immediately.",
//                 image: "/business-tool-deployment-dashboard.png",
//                 icon: Rocket,
//               },
//             ].map((step, index) => (
//               <div key={index} className="text-center group">
//                 <div className="relative mb-8">
//                   <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-zinc-700 transition-colors">
//                     <step.icon className="h-8 w-8 text-zinc-300" />
//                   </div>
//                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-bold">
//                     {step.step}
//                   </div>
//                 </div>
//                 <Image
//                   src={step.image || "/placeholder.svg"}
//                   alt={step.title}
//                   width={300}
//                   height={200}
//                   className="rounded-lg mb-6 mx-auto border border-zinc-800 group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
//                 <p className="text-zinc-400">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-zinc-900/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
//               Join thousands of businesses already using ConfigCraft
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Sarah Chen",
//                 role: "Operations Manager",
//                 company: "TechFlow Inc",
//                 image: "/professional-woman-smiling.png",
//                 content:
//                   "ConfigCraft transformed how we handle internal tools. What used to take months now takes hours. The AI understands exactly what we need.",
//               },
//               {
//                 name: "Marcus Rodriguez",
//                 role: "Startup Founder",
//                 company: "InnovateLab",
//                 image: "/professional-man-glasses.png",
//                 content:
//                   "As a non-technical founder, ConfigCraft gave me superpowers. I can build and iterate on business tools faster than hiring a development team.",
//               },
//               {
//                 name: "Emily Watson",
//                 role: "Project Manager",
//                 company: "Global Solutions",
//                 image: "/professional-woman-short-hair.png",
//                 content:
//                   "The deployment speed is incredible. We went from idea to production tool in under an hour. Our team productivity has increased by 300%.",
//               },
//             ].map((testimonial, index) => (
//               <Card
//                 key={index}
//                 className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-all duration-300"
//               >
//                 <CardContent className="p-6">
//                   <div className="flex items-center mb-4">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                     ))}
//                   </div>
//                   <p className="text-zinc-300 mb-6 italic">"{testimonial.content}"</p>
//                   <div className="flex items-center">
//                     <Avatar className="h-12 w-12 mr-4">
//                       <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
//                       <AvatarFallback>
//                         {testimonial.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="font-semibold text-white">{testimonial.name}</div>
//                       <div className="text-sm text-zinc-400">
//                         {testimonial.role} at {testimonial.company}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-12 border border-zinc-700">
//             <h2 className="text-4xl font-bold mb-4">Ready to Build Your First Tool?</h2>
//             <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
//               Join thousands of businesses using ConfigCraft to build custom tools in minutes, not months.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/auth/signup">
//                 <Button size="lg" className="bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-4 text-lg">
//                   Start Building Free
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-8 py-4 text-lg bg-transparent"
//               >
//                 Schedule Demo
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-zinc-800 bg-zinc-950">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg flex items-center justify-center">
//                   <Code className="h-4 w-4 text-white" />
//                 </div>
//                 <span className="text-xl font-bold">ConfigCraft</span>
//               </div>
//               <p className="text-zinc-400">Build business tools in minutes with AI-powered generation.</p>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-4 text-white">Product</h3>
//               <ul className="space-y-2 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Templates
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Integrations
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     API
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-4 text-white">Company</h3>
//               <ul className="space-y-2 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-4 text-white">Support</h3>
//               <ul className="space-y-2 text-zinc-400">
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Help Center
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Community
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     Status
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-zinc-400">© 2024 ConfigCraft. All rights reserved.</p>
//             <div className="flex space-x-6 mt-4 md:mt-0">
//               <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
//                 Privacy
//               </Link>
//               <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
//                 Terms
//               </Link>
//               <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
//                 Security
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }


"use client"

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  Zap,
  Shield,
  Rocket,
  Users,
  Clock,
  CheckCircle,
  Star,
  Sparkles,
  Code,
  Database,
  Globe,
  Smartphone,
  TrendingUp,
  FileText,
  Play,
} from "lucide-react"

export default function ConfigCraftPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation with 3D effect */}
      <nav
        className="border-b border-[#262626] sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 -1px 0 0 rgba(255, 107, 53, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff3366] rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(255, 107, 53, 0.4), 0 4px 6px -2px rgba(255, 107, 53, 0.3)",
                }}
              >
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ConfigCraft
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-[#ff6b35] transition-colors font-medium">
                Features
              </Link>
              <Link href="#examples" className="text-gray-300 hover:text-[#00d9a3] transition-colors font-medium">
                Examples
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-[#9d4edd] transition-colors font-medium">
                Pricing
              </Link>
              <Button
                className="bg-[#ff6b35] hover:bg-[#ff8555] text-white font-semibold px-6 rounded-xl"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(255, 107, 53, 0.5), 0 4px 6px -2px rgba(255, 107, 53, 0.3)",
                }}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6b35] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-[#9d4edd] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#00d9a3] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <Badge className="bg-[#ff6b35]/20 text-[#ff6b35] border-[#ff6b35]/30 px-4 py-2 text-sm font-semibold rounded-full">
                <Sparkles className="h-4 w-4 mr-2 inline" />
                AI-Powered Revolution
              </Badge>

              <h1 className="text-6xl lg:text-8xl font-black leading-none">
                <span className="block text-white">Build Tools</span>
                <span className="block bg-gradient-to-r from-[#ff6b35] via-[#ff3366] to-[#9d4edd] bg-clip-text text-transparent">
                  In Minutes
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl">
                Transform ideas into fully functional web applications using AI.
                <span className="text-[#00d9a3] font-semibold"> No coding required</span>, just describe what you need.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold px-8 py-6 text-lg rounded-2xl group"
                  style={{
                    boxShadow: "0 20px 40px -10px rgba(255, 107, 53, 0.6), 0 10px 20px -5px rgba(255, 107, 53, 0.4)",
                  }}
                >
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  className="bg-[#1a1a1a] hover:bg-[#262626] text-white font-bold px-8 py-6 text-lg rounded-2xl border-2 border-[#262626]"
                  style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Floating success indicators */}
              <div className="flex gap-4 pt-8">
                <div className="flex items-center gap-2 bg-[#00d9a3]/10 border border-[#00d9a3]/30 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5 text-[#00d9a3]" />
                  <span className="text-sm font-semibold text-[#00d9a3]">10,000+ Tools Built</span>
                </div>
                <div className="flex items-center gap-2 bg-[#ffd23f]/10 border border-[#ffd23f]/30 rounded-full px-4 py-2">
                  <Star className="h-5 w-5 text-[#ffd23f]" />
                  <span className="text-sm font-semibold text-[#ffd23f]">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right side - Interactive demo */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <div className="relative">
                {/* Main demo card */}
                <div
                  className="relative z-10 bg-[#1a1a1a] rounded-3xl p-8 border border-[#262626]"
                  style={{ boxShadow: "0 25px 50px -12px rgba(255, 107, 53, 0.25), 0 0 0 1px rgba(255, 107, 53, 0.1)" }}
                >
                  <Image
                    src="/ai-dashboard-interface-with-colorful-charts-and-mo.jpg"
                    alt="AI Dashboard"
                    width={600}
                    height={400}
                    className="rounded-2xl w-full"
                  />
                </div>

                {/* Floating cards */}
                <div
                  className="absolute -top-6 -right-6 bg-[#00d9a3] rounded-2xl p-4 animate-float"
                  style={{ boxShadow: "0 20px 40px -10px rgba(0, 217, 163, 0.6)" }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-white" />
                    <span className="text-white font-bold">AI Generated</span>
                  </div>
                </div>

                <div
                  className="absolute -bottom-6 -left-6 bg-[#9d4edd] rounded-2xl p-4 animate-float"
                  style={{ animationDelay: "1s", boxShadow: "0 20px 40px -10px rgba(157, 78, 221, 0.6)" }}
                >
                  <div className="flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-white" />
                    <span className="text-white font-bold">Deployed Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Features with 3D Cards */}
      <FeaturesSection />

      {/* Interactive How It Works */}
      <HowItWorksSection activeStep={activeStep} setActiveStep={setActiveStep} />

      {/* Tool Examples Gallery */}
      <ToolExamplesSection />

      {/* Testimonials with Personality */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

// Animated Stats Component
function AnimatedStats() {
  const [counts, setCounts] = useState({ tools: 0, users: 0, hours: 0, rate: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateValue("tools", 0, 10000, 2000)
          animateValue("users", 0, 50000, 2000)
          animateValue("hours", 0, 1000000, 2000)
          animateValue("rate", 0, 99.9, 2000)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateValue = (key: string, start: number, end: number, duration: number) => {
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = start + (end - start) * progress
      setCounts((prev) => ({ ...prev, [key]: value }))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  const stats = [
    { key: "tools", icon: Rocket, label: "Tools Created", value: counts.tools, suffix: "+", color: "#ff6b35" },
    { key: "users", icon: Users, label: "Active Users", value: counts.users, suffix: "+", color: "#00d9a3" },
    { key: "hours", icon: Clock, label: "Hours Saved", value: counts.hours, suffix: "+", color: "#9d4edd" },
    { key: "rate", icon: TrendingUp, label: "Success Rate", value: counts.rate, suffix: "%", color: "#ffd23f" },
  ]

  return (
    <section ref={sectionRef} className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={stat.key}
              className="bg-[#1a1a1a] border-[#262626] hover:scale-105 transition-all duration-300 group cursor-pointer rounded-2xl"
              style={{
                boxShadow: `0 10px 30px -10px ${stat.color}40, 0 0 0 1px ${stat.color}20`,
                animation: `float 3s ease-in-out infinite ${index * 0.5}s`,
              }}
            >
              <CardContent className="p-8 text-center">
                <stat.icon
                  className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform"
                  style={{ color: stat.color }}
                />
                <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>
                  {stat.key === "hours"
                    ? `${Math.floor(counts.hours / 1000)}M`
                    : Math.floor(stat.value).toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section with 3D Cards
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Describe your tool in plain English and watch AI build it instantly",
      color: "#ffd23f",
      gradient: "from-[#ffd23f] to-[#ff6b35]",
    },
    {
      icon: Code,
      title: "Zero Code Required",
      description: "Build complex applications without writing a single line of code",
      color: "#00d9a3",
      gradient: "from-[#00d9a3] to-[#00b8d4]",
    },
    {
      icon: Database,
      title: "Smart Data Management",
      description: "Automatic database schema generation and intelligent data handling",
      color: "#9d4edd",
      gradient: "from-[#9d4edd] to-[#7b2cbf]",
    },
    {
      icon: Globe,
      title: "Instant Deployment",
      description: "Deploy your tools to the web with a single click",
      color: "#ff6b35",
      gradient: "from-[#ff6b35] to-[#ff3366]",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "All tools work perfectly on desktop, tablet, and mobile devices",
      color: "#ff3366",
      gradient: "from-[#ff3366] to-[#e91e63]",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control",
      color: "#8b2635",
      gradient: "from-[#8b2635] to-[#6a1b2a]",
    },
  ]

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to build, deploy, and manage business tools at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1a] border-[#262626] hover:scale-105 hover:-translate-y-2 transition-all duration-300 group cursor-pointer rounded-3xl overflow-hidden"
              style={{
                boxShadow: `0 20px 40px -15px ${feature.color}30, 0 0 0 1px ${feature.color}20`,
              }}
            >
              <CardContent className="p-8 relative">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${feature.color}20`,
                      boxShadow: `0 10px 25px -10px ${feature.color}60`,
                    }}
                  >
                    <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 opacity-10"
                  style={{
                    background: `radial-gradient(circle at top right, ${feature.color}, transparent 70%)`,
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Interactive How It Works Section
function HowItWorksSection({
  activeStep,
  setActiveStep,
}: {
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<number>>
}) {
  const steps = [
    {
      step: "01",
      title: "Describe Your Tool",
      description:
        "Tell us what you need in plain English. Our AI understands complex business requirements and translates them into functional specifications.",
      image: "/person-typing-business-requirements-on-laptop.jpg",
      icon: FileText,
      color: "#ff6b35",
    },
    {
      step: "02",
      title: "AI Builds Your Tool",
      description:
        "Watch as our AI generates a fully functional application with database schema, beautiful UI, and business logic in real-time.",
      image: "/ai-code-generation-interface-with-colorful-syntax.jpg",
      icon: Code,
      color: "#00d9a3",
    },
    {
      step: "03",
      title: "Deploy & Share",
      description:
        "One-click deployment to the web. Share with your team, set permissions, and start using your tool immediately.",
      image: "/deployment-dashboard-with-success-indicators.jpg",
      icon: Rocket,
      color: "#9d4edd",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [setActiveStep])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">How It Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">From idea to deployed tool in three simple steps</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => setActiveStep(index)}
              className={`cursor-pointer transition-all duration-500 ${
                activeStep === index ? "scale-105" : "scale-95 opacity-60"
              }`}
            >
              <Card
                className={`bg-[#1a1a1a] border-[#262626] rounded-3xl overflow-hidden transition-all duration-500 ${
                  activeStep === index ? "ring-2" : ""
                }`}
                style={{
                  boxShadow:
                    activeStep === index
                      ? `0 25px 50px -12px ${step.color}60, 0 0 0 2px ${step.color}`
                      : "0 10px 25px -10px rgba(0,0,0,0.5)",
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl"
                      style={{
                        backgroundColor: `${step.color}20`,
                        color: step.color,
                        boxShadow: `0 10px 25px -10px ${step.color}60`,
                      }}
                    >
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8" style={{ color: step.color }} />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{step.description}</p>

                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={400}
                      height={300}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${activeStep === index ? "w-12" : "w-2"}`}
              style={{
                backgroundColor: activeStep === index ? steps[index].color : "#262626",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Tool Examples Section
function ToolExamplesSection() {
  const tools = [
    {
      title: "Customer Onboarding Dashboard",
      category: "CRM",
      image: "/customer-onboarding-dashboard-with-colorful-cards.jpg",
      description: "Streamline new customer setup with automated workflows",
      color: "#ff6b35",
    },
    {
      title: "Inventory Management System",
      category: "Operations",
      image: "/inventory-management-system-with-charts.jpg",
      description: "Track stock levels, orders, and suppliers in real-time",
      color: "#00d9a3",
    },
    {
      title: "Project Management Dashboard",
      category: "Productivity",
      image: "/project-management-kanban.png",
      description: "Manage tasks, timelines, and team collaboration",
      color: "#9d4edd",
    },
    {
      title: "Expense Management Interface",
      category: "Finance",
      image: "/expense-management-interface-with-receipts.jpg",
      description: "Track expenses, approvals, and budget allocation",
      color: "#ffd23f",
    },
    {
      title: "Business Requirements Tool",
      category: "Planning",
      image: "/business-requirements-documentation-tool.jpg",
      description: "Capture and manage business requirements efficiently",
      color: "#ff3366",
    },
    {
      title: "Deployment Dashboard",
      category: "DevOps",
      image: "/deployment-dashboard-with-status-indicators.jpg",
      description: "Monitor deployments and system health",
      color: "#8b2635",
    },
  ]

  return (
    <section id="examples" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Built by Our Users
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what's possible with ConfigCraft - real tools built by real businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1a] border-[#262626] overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer rounded-3xl"
              style={{
                boxShadow: `0 20px 40px -15px ${tool.color}30, 0 0 0 1px ${tool.color}20`,
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.title}
                  width={400}
                  height={250}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                <Badge
                  className="absolute top-4 left-4 font-bold rounded-full px-4 py-1"
                  style={{
                    backgroundColor: `${tool.color}20`,
                    color: tool.color,
                    border: `1px solid ${tool.color}40`,
                  }}
                >
                  {tool.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{tool.title}</h3>
                <p className="text-gray-400">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      company: "TechFlow Inc",
      image: "/professional-woman-smiling.png",
      content:
        "ConfigCraft transformed how we handle internal tools. What used to take months now takes hours. The AI understands exactly what we need.",
      color: "#ff6b35",
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateLab",
      image: "/professional-man-glasses.png",
      content:
        "As a non-technical founder, ConfigCraft gave me superpowers. I can build and iterate on business tools faster than hiring a development team.",
      color: "#00d9a3",
    },
    {
      name: "Emily Watson",
      role: "Project Manager",
      company: "Global Solutions",
      image: "/professional-woman-short-hair.jpg",
      content:
        "The deployment speed is incredible. We went from idea to production tool in under an hour. Our team productivity has increased by 300%.",
      color: "#9d4edd",
    },
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of businesses already using ConfigCraft
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-[#1a1a1a] border-[#262626] hover:scale-105 transition-all duration-300 rounded-3xl"
              style={{
                boxShadow: `0 20px 40px -15px ${testimonial.color}30, 0 0 0 1px ${testimonial.color}20`,
              }}
            >
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{ color: testimonial.color }} />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2" style={{ borderColor: testimonial.color }}>
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback style={{ backgroundColor: `${testimonial.color}20`, color: testimonial.color }}>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[3rem] p-12 lg:p-16 border border-[#262626] overflow-hidden"
          style={{
            boxShadow: "0 25px 50px -12px rgba(255, 107, 53, 0.3), 0 0 0 1px rgba(255, 107, 53, 0.1)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9d4edd] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

          <div className="relative text-center">
            <h2 className="text-4xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Ready to Build Your First Tool?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses using ConfigCraft to build custom tools in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold px-10 py-6 text-lg rounded-2xl group"
                style={{ boxShadow: "0 20px 40px -10px rgba(255, 107, 53, 0.6)" }}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                className="bg-[#1a1a1a] hover:bg-[#262626] text-white font-bold px-10 py-6 text-lg rounded-2xl border-2 border-[#262626]"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Section
function FooterSection() {
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#ff3366] rounded-xl flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ConfigCraft</span>
            </div>
            <p className="text-gray-400 leading-relaxed">Build business tools in minutes with AI-powered generation.</p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Templates", "Integrations", "API"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Support",
              links: ["Documentation", "Help Center", "Community", "Status"],
            },
          ].map((column, index) => (
            <div key={index}>
              <h3 className="font-bold mb-4 text-white text-lg">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#262626] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2025 ConfigCraft. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Security"].map((link, index) => (
              <Link key={index} href="#" className="text-gray-400 hover:text-[#ff6b35] transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
