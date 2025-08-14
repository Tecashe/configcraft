import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Code,
  Zap,
  Users,
  Shield,
  Star,
  Sparkles,
  Wrench,
  BarChart3,
  Globe,
  Clock,
  Target,
  Lightbulb,
  Rocket,
  CheckCircle,
  Play,
} from "lucide-react"

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ConfigCraft
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-300 hover:text-white transition-colors font-medium">
                How it Works
              </Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">
                Pricing
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {userId ? (
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
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
              Transform your business processes with AI-generated tools. Just describe what you need in plain English,
              and our AI builds a fully functional business application for you. No coding required, no lengthy
              development cycles.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
              >
                <Link href={userId ? "/dashboard" : "/auth/signup"}>
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
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
        </div>
      </section>

      {/* Hero Demo Image */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
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
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-slate-400">Tools Created</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-400">Companies</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">2 min</div>
              <div className="text-slate-400">Avg. Build Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How ConfigCraft Works</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From idea to deployed business tool in three simple steps. Our AI handles all the complexity.
            </p>
          </div>
          <div className="space-y-20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-slate-700">01</div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Describe Your Need</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Tell our AI what business process you want to automate or improve in plain English. Be as detailed or
                  as simple as you want.
                </p>
              </div>
              <div className="flex-1">
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <CardContent className="p-4">
                    <img
                      src="/business-requirements-typing.png"
                      alt="Describing requirements"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-slate-700">02</div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Generates Your Tool</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Watch as our AI creates a fully functional business tool tailored to your needs, complete with UI,
                  logic, and integrations.
                </p>
              </div>
              <div className="flex-1">
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <CardContent className="p-4">
                    <img
                      src="/ai-code-interface.png"
                      alt="AI generating code"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-slate-700">03</div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Deploy & Scale</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Launch your tool instantly and share it with your team or customers. Scale as your business grows.
                </p>
              </div>
              <div className="flex-1">
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <CardContent className="p-4">
                    <img
                      src="/business-tool-deployment-dashboard.png"
                      alt="Deployed tool"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need to Build Better</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Powerful features that make creating custom business tools as easy as describing what you need
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Generation</h3>
                <p className="text-slate-300 leading-relaxed">
                  Describe your business process in plain English and watch our AI create a fully functional tool in
                  minutes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No-Code Required</h3>
                <p className="text-slate-300 leading-relaxed">
                  Build sophisticated business applications without writing a single line of code or hiring developers
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
                <p className="text-slate-300 leading-relaxed">
                  Share tools with your team, set permissions, and collaborate in real-time with built-in commenting
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
                <p className="text-slate-300 leading-relaxed">
                  Bank-level security with SOC 2 compliance, end-to-end encryption, and role-based access control
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-slate-300 leading-relaxed">
                  Track usage, performance, and ROI with detailed analytics dashboards and custom reporting
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Deployment</h3>
                <p className="text-slate-300 leading-relaxed">
                  Deploy your tools instantly with custom URLs, embed codes, and seamless integrations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for Every Business Need</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From startups to enterprises, ConfigCraft adapts to your unique business processes
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/customer-onboarding-dashboard.png"
                    alt="Customer Onboarding"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Customer Onboarding</h3>
                      <div className="text-green-400 text-sm font-medium">85% faster onboarding</div>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Streamline new customer setup with automated workflows and data collection
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/inventory-management-system.png"
                    alt="Inventory Management"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Inventory Management</h3>
                      <div className="text-green-400 text-sm font-medium">60% reduction in stockouts</div>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Track stock levels, manage suppliers, and automate reordering processes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/project-management-dashboard.png"
                    alt="Project Tracking"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Project Tracking</h3>
                      <div className="text-green-400 text-sm font-medium">45% improvement in delivery</div>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Monitor project progress with custom dashboards and automated reporting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="/expense-management-interface.png"
                    alt="Expense Management"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Expense Management</h3>
                      <div className="text-green-400 text-sm font-medium">70% faster processing</div>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Automate expense submission, approval workflows, and financial reporting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Growing Businesses</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See what our customers are saying about ConfigCraft
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "ConfigCraft saved us months of development time. We built our entire customer onboarding system in
                  just 2 hours. The AI understood exactly what we needed."
                </p>
                <div className="flex items-center">
                  <img
                    src="/professional-woman-smiling.png"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-white">Sarah Johnson</p>
                    <p className="text-slate-400 text-sm">Operations Manager at TechFlow Inc</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "It's like having a developer who speaks business language. We've created 12 custom tools that would
                  have cost us $200K+ to develop traditionally."
                </p>
                <div className="flex items-center">
                  <img src="/professional-man-glasses.png" alt="Mike Chen" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-bold text-white">Mike Chen</p>
                    <p className="text-slate-400 text-sm">CEO at GrowthLabs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  "Our team productivity increased by 40% after implementing ConfigCraft tools across our workflows. The
                  ROI was immediate and substantial."
                </p>
                <div className="flex items-center">
                  <img
                    src="/professional-woman-short-hair.png"
                    alt="Lisa Davis"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-white">Lisa Davis</p>
                    <p className="text-slate-400 text-sm">Project Manager at DataSync Solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
                    <Link href={userId ? "/dashboard" : "/auth/signup"}>
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
        <div className="max-w-7xl mx-auto">
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
                  <Users className="w-4 h-4" />
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
