import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Business Tools
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Build Custom Business Tools
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                In Minutes, Not Months
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Transform your business processes with AI-generated custom tools. Just describe what you need, and our AI
              will build it for you - no coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4"
              >
                <Link href={userId ? "/dashboard" : "/auth/signup"}>
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Three simple steps to transform your business processes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Describe Your Need</h3>
              <p className="text-slate-300">
                Tell our AI what kind of business tool you need in plain English. Be as detailed or as simple as you
                want.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. AI Builds Your Tool</h3>
              <p className="text-slate-300">
                Our advanced AI analyzes your requirements and generates a fully functional business tool tailored to
                your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Deploy & Use</h3>
              <p className="text-slate-300">
                Your custom tool is ready to use immediately. Share it with your team and start improving your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to build and manage custom business tools
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-slate-300">
                  Generate fully functional tools in minutes, not weeks
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Team Collaboration</CardTitle>
                <CardDescription className="text-slate-300">
                  Share tools with your team and collaborate in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Shield className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Enterprise Security</CardTitle>
                <CardDescription className="text-slate-300">
                  Bank-level security with SOC 2 compliance and data encryption
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-orange-400 mb-2" />
                <CardTitle className="text-white">Analytics & Insights</CardTitle>
                <CardDescription className="text-slate-300">
                  Track usage and performance with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Globe className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Global Deployment</CardTitle>
                <CardDescription className="text-slate-300">
                  Deploy your tools globally with our CDN infrastructure
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Wrench className="w-8 h-8 text-pink-400 mb-2" />
                <CardTitle className="text-white">Customizable</CardTitle>
                <CardDescription className="text-slate-300">
                  Fine-tune and customize every aspect of your tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Built for Every Business</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From startups to enterprises, ConfigCraft adapts to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <Target className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Project Management</h3>
              <p className="text-slate-300 text-sm">Custom dashboards, task trackers, and team coordination tools</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <BarChart3 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Data Analysis</h3>
              <p className="text-slate-300 text-sm">Custom reporting tools, data visualizations, and KPI dashboards</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">HR & Operations</h3>
              <p className="text-slate-300 text-sm">Employee onboarding, time tracking, and workflow automation</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <Clock className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Customer Service</h3>
              <p className="text-slate-300 text-sm">Support ticket systems, customer portals, and feedback tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Loved by Teams Worldwide</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              See what our customers are saying about ConfigCraft
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">
                  "ConfigCraft transformed our workflow. What used to take our dev team weeks now takes minutes. The AI
                  understands exactly what we need."
                </p>
                <div className="flex items-center">
                  <img src="/professional-woman-smiling.png" alt="Sarah Chen" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="text-white font-semibold">Sarah Chen</p>
                    <p className="text-slate-400 text-sm">CTO, TechFlow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">
                  "The ROI has been incredible. We've built 15+ custom tools that would have cost us $100k+ to develop
                  traditionally."
                </p>
                <div className="flex items-center">
                  <img
                    src="/professional-man-glasses.png"
                    alt="Marcus Rodriguez"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-white font-semibold">Marcus Rodriguez</p>
                    <p className="text-slate-400 text-sm">Operations Director, ScaleUp Inc</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">
                  "Our team productivity increased by 40% after implementing ConfigCraft tools. The learning curve was
                  practically zero."
                </p>
                <div className="flex items-center">
                  <img
                    src="/professional-woman-short-hair.png"
                    alt="Emily Watson"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-white font-semibold">Emily Watson</p>
                    <p className="text-slate-400 text-sm">Product Manager, InnovateLab</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams already building custom tools with ConfigCraft
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
              <Link href={userId ? "/dashboard" : "/auth/signup"}>
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-blue-100 text-sm mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ConfigCraft
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Build custom business tools in minutes with AI. Transform your workflow today.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">© 2024 ConfigCraft. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <Link href="#" className="text-slate-400 hover:text-white text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm">
                Terms
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
