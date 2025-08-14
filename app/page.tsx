import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Sparkles,
  Star,
  Quote,
  ChevronRight,
  Play,
  Code,
  Palette,
  Database,
  Globe,
  Users,
  Target,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function LandingPage() {
  const { userId } = await auth()

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Describe your business need and watch as AI creates a fully functional tool in minutes.",
    },
    {
      icon: Code,
      title: "No Code Required",
      description: "Build complex business applications without writing a single line of code.",
    },
    {
      icon: Palette,
      title: "Beautiful UI/UX",
      description: "Every tool comes with a modern, responsive design that works on all devices.",
    },
    {
      icon: Database,
      title: "Smart Data Management",
      description: "Automatic database setup and management for all your business data needs.",
    },
    {
      icon: Globe,
      title: "Instant Deployment",
      description: "Your tools are instantly deployed and accessible from anywhere in the world.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control and data encryption.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      company: "TechFlow Inc",
      image: "/professional-woman-smiling.png",
      quote:
        "ConfigCraft transformed how we handle our inventory. What used to take weeks of development now takes minutes.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "StartupLab",
      image: "/professional-man-glasses.png",
      quote: "The AI understands exactly what we need. We've built 12 custom tools that perfectly fit our workflow.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Project Manager",
      company: "Creative Solutions",
      image: "/professional-woman-short-hair.png",
      quote: "Our team productivity increased by 300% after implementing ConfigCraft tools. It's simply amazing.",
      rating: 5,
    },
  ]

  const toolExamples = [
    {
      title: "Customer Onboarding Dashboard",
      description: "Streamline new customer setup with automated workflows and progress tracking.",
      image: "/customer-onboarding-dashboard.png",
      category: "CRM",
    },
    {
      title: "Inventory Management System",
      description: "Real-time inventory tracking with automated reorder points and supplier management.",
      image: "/inventory-management-system.png",
      category: "Operations",
    },
    {
      title: "Project Management Hub",
      description: "Collaborative project tracking with timeline visualization and team coordination.",
      image: "/project-management-dashboard.png",
      category: "Productivity",
    },
    {
      title: "Expense Management Portal",
      description: "Automated expense tracking with receipt scanning and approval workflows.",
      image: "/expense-management-interface.png",
      category: "Finance",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Describe Your Need",
      description: "Simply tell us what business tool you need in plain English.",
      image: "/business-requirements-typing.png",
    },
    {
      step: "02",
      title: "AI Builds Your Tool",
      description: "Our AI analyzes your requirements and generates a complete application.",
      image: "/ai-code-interface.png",
    },
    {
      step: "03",
      title: "Deploy & Use",
      description: "Your tool is instantly deployed and ready for your team to use.",
      image: "/business-tool-deployment-dashboard.png",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-white">ConfigCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              {userId ? (
                <Button asChild className="bg-slate-700 hover:bg-slate-600 text-white">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-slate-700 hover:bg-slate-600 text-white">
                    <Link href="/auth/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-800/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-6 bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Business Tools
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Build Custom Business Tools
              <span className="block text-slate-400">In Minutes, Not Months</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business processes with AI-generated tools. Simply describe what you need, and watch as
              ConfigCraft creates fully functional applications tailored to your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="bg-slate-700 hover:bg-slate-600 text-white text-lg px-8 py-4">
                <Link href={userId ? "/dashboard" : "/auth/signup"}>
                  {userId ? "Go to Dashboard" : "Start Building Free"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent text-lg px-8 py-4"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-slate-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-slate-500" />
                <span>Free Forever Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-slate-500" />
                <span>Deploy Instantly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Examples */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See What You Can Build</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From simple forms to complex dashboards, ConfigCraft can build any business tool you need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolExamples.map((tool, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={tool.image || "/placeholder.svg"}
                      alt={tool.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3 bg-slate-700 text-slate-300 border-slate-600">{tool.category}</Badge>
                    <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-slate-400 text-sm">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Building custom business tools has never been easier. Here's how ConfigCraft works:
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-300 mb-6">{step.description}</p>
                  <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 z-10">
                    <ChevronRight className="w-8 h-8 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Modern Businesses</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to build, deploy, and manage custom business tools at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-slate-400">Tools Created</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">2 min</div>
              <div className="text-slate-400">Avg. Build Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Growing Businesses</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See what our customers are saying about ConfigCraft
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-slate-500 text-slate-500" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-600 mb-4" />
                  <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                      <p className="text-sm text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using ConfigCraft to build custom tools and streamline their
            operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-slate-700 hover:bg-slate-600 text-white text-lg px-8 py-4">
              <Link href={userId ? "/dashboard" : "/auth/signup"}>
                {userId ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-lg px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className="text-lg font-bold text-white">ConfigCraft</span>
              </div>
              <p className="text-slate-400 text-sm">Build custom business tools with AI. No code required.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 ConfigCraft. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
