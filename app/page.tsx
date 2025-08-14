import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Sparkles,
  Star,
  Quote,
  ChevronRight,
  Play,
  Code,
  Palette,
  Database,
  Users,
  Target,
  Clock,
  Rocket,
  Brain,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function LandingPage() {
  const { userId } = await auth()

  const features = [
    {
      icon: Brain,
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
      icon: Rocket,
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
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-white">ConfigCraft</span>
            </div>
            <div className="flex items-center space-x-4">
              {userId ? (
                <Button asChild className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-900">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
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
      <section className="relative py-24 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-zinc-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Business Tools
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Build Custom
                <span className="block text-zinc-400">Business Tools</span>
                <span className="block text-zinc-500 text-4xl md:text-5xl lg:text-6xl">In Minutes</span>
              </h1>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed">
                Transform your business processes with AI-generated tools. Simply describe what you need, and watch as
                ConfigCraft creates fully functional applications tailored to your workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  asChild
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-lg px-8 py-4 border-zinc-700"
                >
                  <Link href={userId ? "/dashboard" : "/auth/signup"}>
                    {userId ? "Go to Dashboard" : "Start Building Free"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 bg-transparent text-lg px-8 py-4"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-zinc-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Deploy Instantly</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                <Image
                  src="/ai-dashboard-interface.png"
                  alt="ConfigCraft AI Dashboard Interface"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-zinc-900 rounded-xl border border-zinc-800 p-4 shadow-xl">
                <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Settings className="w-12 h-12 text-zinc-400" />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-40 h-24 bg-zinc-900 rounded-xl border border-zinc-800 p-4 shadow-xl">
                <div className="text-zinc-400 text-sm mb-1">Build Time</div>
                <div className="text-white text-2xl font-bold">2 min</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Examples */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">See What You Can Build</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              From simple forms to complex dashboards, ConfigCraft can build any business tool you need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {toolExamples.map((tool, index) => (
              <Card
                key={index}
                className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-500 group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={tool.image || "/placeholder.svg"}
                      alt={tool.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-4 bg-zinc-800 text-zinc-300 border-zinc-700">{tool.category}</Badge>
                    <h3 className="text-lg font-semibold text-white mb-3">{tool.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Building custom business tools has never been easier. Here's how ConfigCraft transforms your ideas into
              reality:
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <span className="text-3xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-zinc-400 mb-8 leading-relaxed">{step.description}</p>
                  <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
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
                  <div className="hidden lg:block absolute top-12 -right-6 z-10">
                    <ChevronRight className="w-8 h-8 text-zinc-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powerful Features for Modern Businesses</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Everything you need to build, deploy, and manage custom business tools at enterprise scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-700 transition-colors">
                    <feature.icon className="w-8 h-8 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Target className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="text-5xl font-bold text-white mb-3">10,000+</div>
              <div className="text-zinc-400 text-lg">Tools Created</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Users className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="text-5xl font-bold text-white mb-3">500+</div>
              <div className="text-zinc-400 text-lg">Companies</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Shield className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="text-5xl font-bold text-white mb-3">99.9%</div>
              <div className="text-zinc-400 text-lg">Uptime</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Clock className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="text-5xl font-bold text-white mb-3">2 min</div>
              <div className="text-zinc-400 text-lg">Avg. Build Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Growing Businesses</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              See what our customers are saying about ConfigCraft and how it's transforming their operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-zinc-600 text-zinc-600" />
                    ))}
                  </div>
                  <Quote className="w-10 h-10 text-zinc-700 mb-6" />
                  <p className="text-zinc-300 mb-8 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-800">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                      <p className="text-zinc-400">{testimonial.role}</p>
                      <p className="text-zinc-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses already using ConfigCraft to build custom tools and streamline their
            operations. Start building your first tool today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-lg px-10 py-5 border-zinc-700"
            >
              <Link href={userId ? "/dashboard" : "/auth/signup"}>
                {userId ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent text-lg px-10 py-5"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-12 text-zinc-400">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">14-day free trial</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">No setup fees</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-white">ConfigCraft</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">Build custom business tools with AI. No code required.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-zinc-400">
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
              <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-zinc-400">
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
              <h4 className="font-semibold text-white mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-zinc-400">
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
          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-400">© 2024 ConfigCraft. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
