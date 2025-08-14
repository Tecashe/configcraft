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
  Rocket,
  Star,
  Play,
  Code,
  Database,
  Brain,
  Target,
  Globe,
  MessageSquare,
  FileText,
  Layers,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import { ensureUserHasOrganization } from "@/utils/organizationUtils"

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    // User is authenticated, redirect to their organization dashboard
    const orgSlug = await ensureUserHasOrganization()
    redirect(`/${orgSlug}/dashboard`)
  }

  // User is not authenticated, show landing page
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description:
        "Describe your business process in plain English and watch our AI create a fully functional tool in minutes",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Code,
      title: "No-Code Required",
      description:
        "Build sophisticated business applications without writing a single line of code or hiring developers",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share tools with your team, set permissions, and collaborate in real-time with built-in commenting",
      color: "from-green-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, end-to-end encryption, and role-based access control",
      color: "from-red-500 to-orange-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track usage, performance, and ROI with detailed analytics dashboards and custom reporting",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: Rocket,
      title: "Instant Deployment",
      description: "Deploy your tools instantly with custom URLs, embed codes, and seamless integrations",
      color: "from-orange-500 to-red-600",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechFlow Inc",
      content:
        "ConfigCraft saved us months of development time. We built our entire customer onboarding system in just 2 hours. The AI understood exactly what we needed.",
      rating: 5,
      avatar: "/professional-woman-smiling.png",
    },
    {
      name: "Mike Chen",
      role: "CEO",
      company: "GrowthLabs",
      content:
        "It's like having a developer who speaks business language. We've created 12 custom tools that would have cost us $200K+ to develop traditionally.",
      rating: 5,
      avatar: "/professional-man-glasses.png",
    },
    {
      name: "Lisa Davis",
      role: "Project Manager",
      company: "DataSync Solutions",
      content:
        "Our team productivity increased by 40% after implementing ConfigCraft tools across our workflows. The ROI was immediate and substantial.",
      rating: 5,
      avatar: "/professional-woman-short-hair.png",
    },
  ]

  const useCases = [
    {
      title: "Customer Onboarding",
      description: "Streamline new customer setup with automated workflows and data collection",
      icon: Users,
      image: "/customer-onboarding-dashboard.png",
      stats: "85% faster onboarding",
    },
    {
      title: "Inventory Management",
      description: "Track stock levels, manage suppliers, and automate reordering processes",
      icon: Database,
      image: "/inventory-management-system.png",
      stats: "60% reduction in stockouts",
    },
    {
      title: "Project Tracking",
      description: "Monitor project progress with custom dashboards and automated reporting",
      icon: Target,
      image: "/project-management-dashboard.png",
      stats: "45% improvement in delivery",
    },
    {
      title: "Expense Management",
      description: "Automate expense submission, approval workflows, and financial reporting",
      icon: FileText,
      image: "/expense-management-interface.png",
      stats: "70% faster processing",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Describe Your Need",
      description: "Tell our AI what business process you want to automate or improve",
      icon: MessageSquare,
      image: "/business-requirements-typing.png",
    },
    {
      number: "02",
      title: "AI Generates Your Tool",
      description: "Watch as our AI creates a fully functional business tool tailored to your needs",
      icon: Cpu,
      image: "/ai-code-interface.png",
    },
    {
      number: "03",
      title: "Deploy & Scale",
      description: "Launch your tool instantly and share it with your team or customers",
      icon: Rocket,
      image: "/business-tool-deployment-dashboard.png",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Tools Created", icon: Layers },
    { number: "500+", label: "Companies", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "2 min", label: "Avg. Build Time", icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ConfigCraft
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors font-medium">
                How it Works
              </Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">
                Pricing
              </Link>
              <Button
                variant="outline"
                asChild
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-slate-800 text-blue-400 border-blue-500/20 hover:bg-slate-700">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Business Automation
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Build Custom Business Tools
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              in Minutes, Not Months
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your business processes with AI-generated tools. Just describe what you need in plain English, and
            our AI builds a fully functional business application for you. No coding required, no lengthy development
            cycles.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
            >
              <Link href="/auth/signup">
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Free 14-day trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Hero Demo Image */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="max-w-6xl mx-auto bg-slate-800/50 border-slate-700 overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                <img
                  src="/ai-dashboard-interface.png"
                  alt="ConfigCraft AI Tool Generation Demo"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How ConfigCraft Works</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From idea to deployed business tool in three simple steps. Our AI handles all the complexity.
            </p>
          </div>

          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-slate-700">{step.number}</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-xl text-slate-300 leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-1">
                  <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                    <CardContent className="p-4">
                      <img
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need to Build Better</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Powerful features that make creating custom business tools as easy as describing what you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for Every Business Need</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From startups to enterprises, ConfigCraft adapts to your unique business processes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={useCase.image || "/placeholder.svg"}
                      alt={useCase.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <useCase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                        <div className="text-green-400 text-sm font-medium">{useCase.stats}</div>
                      </div>
                    </div>
                    <p className="text-slate-300">{useCase.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Growing Businesses</h2>
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
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-slate-400 text-sm">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 overflow-hidden">
            <CardContent className="p-16 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
                <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                  Join thousands of businesses already using ConfigCraft to streamline their operations and boost
                  productivity
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
                  <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                    <Link href="/auth/signup">
                      Start Your Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
                  >
                    Schedule a Demo
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-8 text-blue-100">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Setup in 5 minutes
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Enterprise security
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    24/7 support
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ConfigCraft
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                AI-powered business tools that adapt to your unique needs. Transform your processes in minutes, not
                months.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent"
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-800 bg-transparent"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 ConfigCraft. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
