interface V0GenerationRequest {
  prompt: string
  model?: string
  temperature?: number
}

interface V0GenerationResponse {
  id: string
  code: string
  preview_url: string
  status: "generating" | "completed" | "error"
  error?: string
}

export class V0ApiService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.V0_API_KEY || ""
    this.baseUrl = process.env.V0_API_URL || "https://api.v0.dev"

    if (!this.apiKey) {
      console.warn("V0_API_KEY not found, using mock responses")
    }
  }

  async generateTool(prompt: string): Promise<V0GenerationResponse> {
    try {
      // If no API key, return mock response for development
      if (!this.apiKey) {
        return this.getMockResponse(prompt)
      }

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: "gpt-4",
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("V0 API generation error:", error)

      // Fallback to mock response if API fails
      if (!this.apiKey) {
        return this.getMockResponse(prompt)
      }

      throw new Error("Failed to generate tool with V0 API")
    }
  }

  private getMockResponse(prompt: string): V0GenerationResponse {
    // Generate a realistic mock response based on the prompt
    const toolName = this.extractToolName(prompt)
    const mockCode = this.generateMockCode(toolName, prompt)

    return {
      id: `mock_${Date.now()}`,
      code: mockCode,
      preview_url: `https://v0.dev/preview/mock_${Date.now()}`,
      status: "completed",
    }
  }

  private extractToolName(prompt: string): string {
    const lines = prompt.split("\n")
    for (const line of lines) {
      if (line.includes("Create a") || line.includes("business application for:")) {
        return line
          .replace(/Create a.*?for:\s*/, "")
          .replace(/Create a\s*/, "")
          .trim()
      }
    }
    return "Custom Business Tool"
  }

  private generateMockCode(toolName: string, prompt: string): string {
    const isInventory = prompt.toLowerCase().includes("inventory")
    const isCustomer = prompt.toLowerCase().includes("customer") || prompt.toLowerCase().includes("crm")
    const isExpense = prompt.toLowerCase().includes("expense") || prompt.toLowerCase().includes("report")
    const isProject = prompt.toLowerCase().includes("project") || prompt.toLowerCase().includes("task")

    if (isInventory) {
      return this.getInventoryMockCode(toolName)
    } else if (isCustomer) {
      return this.getCustomerMockCode(toolName)
    } else if (isExpense) {
      return this.getExpenseMockCode(toolName)
    } else if (isProject) {
      return this.getProjectMockCode(toolName)
    } else {
      return this.getGenericMockCode(toolName)
    }
  }

  private getInventoryMockCode(toolName: string): string {
    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Package, AlertTriangle, TrendingDown } from 'lucide-react'

export default function ${toolName.replace(/\s+/g, "")}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop Computer', sku: 'LAP001', quantity: 15, minStock: 5, price: 999.99, category: 'Electronics', status: 'In Stock' },
    { id: 2, name: 'Office Chair', sku: 'CHR001', quantity: 3, minStock: 10, price: 299.99, category: 'Furniture', status: 'Low Stock' },
    { id: 3, name: 'Printer Paper', sku: 'PAP001', quantity: 0, minStock: 20, price: 12.99, category: 'Supplies', status: 'Out of Stock' },
    { id: 4, name: 'Wireless Mouse', sku: 'MOU001', quantity: 25, minStock: 8, price: 49.99, category: 'Electronics', status: 'In Stock' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-900 text-green-200'
      case 'Low Stock': return 'bg-yellow-900 text-yellow-200'
      case 'Out of Stock': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage your inventory and track stock levels</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Items</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{items.length}</p>
                </div>
                <Package className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-400">{items.filter(i => i.status === 'Low Stock').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-400">{items.filter(i => i.status === 'Out of Stock').length}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Value</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">$\{items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</p>
                </div>
                <Package className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search items by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
        </div>

        {/* Items Table */}
        <Card className="bg-[#121212] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444]">
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Item</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">SKU</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Quantity</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Min Stock</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Price</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-[#444444] hover:bg-[#444444]">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-[#E0E0E0]">{item.name}</p>
                          <p className="text-sm text-[#B0B0B0]">{item.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{item.sku}</td>
                      <td className="py-3 px-4 text-[#E0E0E0]">{item.quantity}</td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{item.minStock}</td>
                      <td className="py-3 px-4 text-[#E0E0E0]">$\{item.price}</td>
                      <td className="py-3 px-4">
                        <Badge className={\`\${getStatusColor(item.status)}\`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
  }

  private getCustomerMockCode(toolName: string): string {
    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users, Phone, Mail, Calendar } from 'lucide-react'

export default function ${toolName.replace(/\s+/g, "")}() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', email: 'john@acme.com', phone: '(555) 123-4567', company: 'Acme Corp', stage: 'Qualified', value: 15000, lastContact: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@techflow.com', phone: '(555) 234-5678', company: 'TechFlow Inc', stage: 'Proposal', value: 25000, lastContact: '2024-01-14' },
    { id: 3, name: 'Mike Davis', email: 'mike@datasync.com', phone: '(555) 345-6789', company: 'DataSync LLC', stage: 'Negotiation', value: 35000, lastContact: '2024-01-13' },
    { id: 4, name: 'Lisa Chen', email: 'lisa@growthlabs.com', phone: '(555) 456-7890', company: 'GrowthLabs', stage: 'Closed Won', value: 45000, lastContact: '2024-01-12' },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-gray-900 text-gray-200'
      case 'Qualified': return 'bg-blue-900 text-blue-200'
      case 'Proposal': return 'bg-yellow-900 text-yellow-200'
      case 'Negotiation': return 'bg-orange-900 text-orange-200'
      case 'Closed Won': return 'bg-green-900 text-green-200'
      case 'Closed Lost': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage customer relationships and track sales pipeline</p>
          </div>
          <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Customers</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{customers.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Pipeline Value</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">$\{customers.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Closed Won</p>
                  <p className="text-2xl font-bold text-green-400">{customers.filter(c => c.stage === 'Closed Won').length}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">$\{Math.round(customers.reduce((sum, c) => sum + c.value, 0) / customers.length).toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search customers by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
        </div>

        {/* Customer Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-[#E0E0E0]">{customer.name}</CardTitle>
                    <p className="text-[#B0B0B0]">{customer.company}</p>
                  </div>
                  <Badge className={\`\${getStageColor(customer.stage)}\`}>
                    {customer.stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-[#B0B0B0]">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-[#B0B0B0]">
                    <Phone className="w-4 h-4 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#444444]">
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Deal Value</p>
                      <p className="font-semibold text-[#E0E0E0]">$\{customer.value.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#B0B0B0]">Last Contact</p>
                      <p className="text-sm text-[#E0E0E0]">{new Date(customer.lastContact).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}`
  }

  private getExpenseMockCode(toolName: string): string {
    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react'

export default function ${toolName.replace(/\s+/g, "")}() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Business Lunch with Client', amount: 85.50, category: 'Meals', date: '2024-01-15', status: 'Approved', employee: 'John Smith' },
    { id: 2, description: 'Flight to Conference', amount: 450.00, category: 'Travel', date: '2024-01-14', status: 'Pending', employee: 'Sarah Johnson' },
    { id: 3, description: 'Office Supplies', amount: 125.75, category: 'Supplies', date: '2024-01-13', status: 'Submitted', employee: 'Mike Davis' },
    { id: 4, description: 'Software License', amount: 299.99, category: 'Software', date: '2024-01-12', status: 'Approved', employee: 'Lisa Chen' },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-900 text-blue-200'
      case 'Pending': return 'bg-yellow-900 text-yellow-200'
      case 'Approved': return 'bg-green-900 text-green-200'
      case 'Rejected': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Track and manage employee expense reports</p>
          </div>
          <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Expenses</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">$\{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{expenses.filter(e => e.status === 'Pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{expenses.filter(e => e.status === 'Approved').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">This Month</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{expenses.length}</p>
                </div>
                <Receipt className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search expenses by description, employee, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
        </div>

        {/* Expenses Table */}
        <Card className="bg-[#121212] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444]">
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Description</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Employee</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Category</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Amount</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Date</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-[#444444] hover:bg-[#444444]">
                      <td className="py-3 px-4 text-[#E0E0E0]">{expense.description}</td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{expense.employee}</td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{expense.category}</td>
                      <td className="py-3 px-4 text-[#E0E0E0] font-semibold">$\{expense.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <Badge className={\`\${getStatusColor(expense.status)}\`}>
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
  }

  private getProjectMockCode(toolName: string): string {
    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react'

export default function ${toolName.replace(/\s+/g, "")}() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Homepage Mockup', project: 'Website Redesign', assignee: 'John Smith', status: 'In Progress', priority: 'High', dueDate: '2024-01-20', timeSpent: 8 },
    { id: 2, title: 'Setup Database Schema', project: 'Mobile App', assignee: 'Sarah Johnson', status: 'Todo', priority: 'Medium', dueDate: '2024-01-22', timeSpent: 0 },
    { id: 3, title: 'Write API Documentation', project: 'API Development', assignee: 'Mike Davis', status: 'Done', priority: 'Low', dueDate: '2024-01-18', timeSpent: 12 },
    { id: 4, title: 'User Testing Session', project: 'Website Redesign', assignee: 'Lisa Chen', status: 'In Progress', priority: 'High', dueDate: '2024-01-25', timeSpent: 4 },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'bg-gray-900 text-gray-200'
      case 'In Progress': return 'bg-blue-900 text-blue-200'
      case 'Done': return 'bg-green-900 text-green-200'
      case 'Blocked': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-900 text-red-200'
      case 'Medium': return 'bg-yellow-900 text-yellow-200'
      case 'Low': return 'bg-green-900 text-green-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage projects and track team progress</p>
          </div>
          <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Tasks</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{tasks.length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">In Progress</p>
                  <p className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.status === 'In Progress').length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'Done').length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Hours</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{tasks.reduce((sum, t) => sum + t.timeSpent, 0)}h</p>
                </div>
                <Clock className="w-8 h-8 text-[#888888]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search tasks by title, project, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
        </div>

        {/* Task Board */}
        <div className="grid md:grid-cols-3 gap-6">
          {['Todo', 'In Progress', 'Done'].map((status) => (
            <Card key={status} className="bg-[#121212] border-[#444444]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0] flex items-center justify-between">
                  {status}
                  <Badge className="bg-[#444444] text-[#B0B0B0]">
                    {filteredTasks.filter(task => task.status === status).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <Card key={task.id} className="bg-[#444444] border-[#666666] hover:border-[#888888] transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-[#E0E0E0] text-sm">{task.title}</h4>
                            <Badge className={\`\${getPriorityColor(task.priority)} text-xs\`}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-[#B0B0B0]">{task.project}</p>
                          
                          <div className="flex items-center justify-between text-xs text-[#B0B0B0]">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.assignee}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.timeSpent}h
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-[#B0B0B0]">
                            <Calendar className="w-3 h-3 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          
                          <Button size="sm" className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212] text-xs">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}`
  }

  private getGenericMockCode(toolName: string): string {
    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

export default function ${toolName.replace(/\s+/g, "")}() {
  const [items, setItems] = useState([
    { id: 1, name: 'Sample Item 1', description: 'This is a sample item for demonstration', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, name: 'Sample Item 2', description: 'Another sample item with different properties', status: 'Pending', createdAt: '2024-01-14' },
    { id: 3, name: 'Sample Item 3', description: 'Third sample item for testing purposes', status: 'Completed', createdAt: '2024-01-13' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '', status: 'Active' })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-200'
      case 'Pending': return 'bg-yellow-900 text-yellow-200'
      case 'Completed': return 'bg-blue-900 text-blue-200'
      case 'Inactive': return 'bg-gray-900 text-gray-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddItem = () => {
    if (newItem.name && newItem.description) {
      setItems([...items, {
        id: items.length + 1,
        ...newItem,
        createdAt: new Date().toISOString().split('T')[0]
      }])
      setNewItem({ name: '', description: '', status: 'Active' })
      setShowAddForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage your business data efficiently</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Total Items</p>
                  <p className="text-2xl font-bold text-[#E0E0E0]">{items.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#888888]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Active</p>
                  <p className="text-2xl font-bold text-green-400">{items.filter(i => i.status === 'Active').length}</p>
                </div>
                <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#B0B0B0]">Completed</p>
                  <p className="text-2xl font-bold text-blue-400">{items.filter(i => i.status === 'Completed').length}</p>
                </div>
                <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="bg-[#121212] border-[#444444] mb-6">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">Add New Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#E0E0E0]">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-[#E0E0E0]">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Add Item
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444]"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Table */}
        <Card className="bg-[#121212] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444]">
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Name</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Description</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Created</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-[#444444] hover:bg-[#444444]">
                      <td className="py-3 px-4 text-[#E0E0E0] font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{item.description}</td>
                      <td className="py-3 px-4">
                        <Badge className={\`\${getStatusColor(item.status)}\`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
  }

  async getGenerationStatus(generationId: string): Promise<V0GenerationResponse> {
    try {
      if (!this.apiKey) {
        // Mock status response
        return {
          id: generationId,
          code: "",
          preview_url: "",
          status: "completed",
        }
      }

      const response = await fetch(`${this.baseUrl}/generate/${generationId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("V0 API status check error:", error)
      throw new Error("Failed to check generation status")
    }
  }
}

export function processRequirements(userInput: string, toolName: string): string {
  return `
Create a professional business application for: ${toolName}

Requirements: ${userInput}

Generate a complete React application with:
- Modern, clean interface using Tailwind CSS with dark theme (#121212 background, #E0E0E0 text)
- Fully responsive design for desktop and mobile
- Professional form inputs for data entry with proper validation
- Interactive table/list views for data display with sorting and filtering
- Complete CRUD operations (Create, Read, Update, Delete)
- Professional styling with excellent UX and accessibility
- Include realistic sample data to demonstrate all functionality
- Use modern React patterns with hooks and proper state management
- Add loading states, error handling, and success feedback
- Include a professional header with navigation
- Make it production-ready with proper TypeScript types

The application should be a complete, working business tool that users can immediately start using for their specific needs.

Style requirements:
- Use dark theme with #121212 background
- Primary text: #E0E0E0
- Secondary text: #B0B0B0  
- Borders: #444444
- Accent color: #888888
- Professional, modern design
- Excellent contrast and readability
- Smooth animations and transitions
`
}

export const v0Api = new V0ApiService()
