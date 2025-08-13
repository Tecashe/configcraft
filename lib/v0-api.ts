// interface V0GenerationRequest {
//   prompt: string
//   model?: string
//   temperature?: number
// }

// interface V0GenerationResponse {
//   id: string
//   code: string
//   preview_url: string
//   status: "generating" | "completed" | "error"
//   error?: string
// }

// export class V0ApiService {
//   private apiKey: string
//   private baseUrl: string

//   constructor() {
//     this.apiKey = process.env.V0_API_KEY || ""
//     this.baseUrl = process.env.V0_API_URL || "https://api.v0.dev"

//     if (!this.apiKey) {
//       console.warn("V0_API_KEY not found, using mock responses")
//     }
//   }

//   async generateTool(prompt: string): Promise<V0GenerationResponse> {
//     try {
//       // If no API key, return mock response for development
//       if (!this.apiKey) {
//         return this.getMockResponse(prompt)
//       }

//       const response = await fetch(`${this.baseUrl}/generate`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${this.apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt,
//           model: "gpt-4",
//           temperature: 0.7,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("V0 API generation error:", error)

//       // Fallback to mock response if API fails
//       if (!this.apiKey) {
//         return this.getMockResponse(prompt)
//       }

//       throw new Error("Failed to generate tool with V0 API")
//     }
//   }

//   private getMockResponse(prompt: string): V0GenerationResponse {
//     // Generate a realistic mock response based on the prompt
//     const toolName = this.extractToolName(prompt)
//     const mockCode = this.generateMockCode(toolName, prompt)

//     return {
//       id: `mock_${Date.now()}`,
//       code: mockCode,
//       preview_url: `https://v0.dev/preview/mock_${Date.now()}`,
//       status: "completed",
//     }
//   }

//   private extractToolName(prompt: string): string {
//     const lines = prompt.split("\n")
//     for (const line of lines) {
//       if (line.includes("Create a") || line.includes("business application for:")) {
//         return line
//           .replace(/Create a.*?for:\s*/, "")
//           .replace(/Create a\s*/, "")
//           .trim()
//       }
//     }
//     return "Custom Business Tool"
//   }

//   private generateMockCode(toolName: string, prompt: string): string {
//     const isInventory = prompt.toLowerCase().includes("inventory")
//     const isCustomer = prompt.toLowerCase().includes("customer") || prompt.toLowerCase().includes("crm")
//     const isExpense = prompt.toLowerCase().includes("expense") || prompt.toLowerCase().includes("report")
//     const isProject = prompt.toLowerCase().includes("project") || prompt.toLowerCase().includes("task")

//     if (isInventory) {
//       return this.getInventoryMockCode(toolName)
//     } else if (isCustomer) {
//       return this.getCustomerMockCode(toolName)
//     } else if (isExpense) {
//       return this.getExpenseMockCode(toolName)
//     } else if (isProject) {
//       return this.getProjectMockCode(toolName)
//     } else {
//       return this.getGenericMockCode(toolName)
//     }
//   }

//   private getInventoryMockCode(toolName: string): string {
//     return `'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Plus, Search, Package, AlertTriangle, TrendingDown } from 'lucide-react'

// export default function ${toolName.replace(/\s+/g, "")}() {
//   const [items, setItems] = useState([
//     { id: 1, name: 'Laptop Computer', sku: 'LAP001', quantity: 15, minStock: 5, price: 999.99, category: 'Electronics', status: 'In Stock' },
//     { id: 2, name: 'Office Chair', sku: 'CHR001', quantity: 3, minStock: 10, price: 299.99, category: 'Furniture', status: 'Low Stock' },
//     { id: 3, name: 'Printer Paper', sku: 'PAP001', quantity: 0, minStock: 20, price: 12.99, category: 'Supplies', status: 'Out of Stock' },
//     { id: 4, name: 'Wireless Mouse', sku: 'MOU001', quantity: 25, minStock: 8, price: 49.99, category: 'Electronics', status: 'In Stock' },
//   ])

//   const [searchTerm, setSearchTerm] = useState('')
//   const [showAddForm, setShowAddForm] = useState(false)

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'In Stock': return 'bg-green-900 text-green-200'
//       case 'Low Stock': return 'bg-yellow-900 text-yellow-200'
//       case 'Out of Stock': return 'bg-red-900 text-red-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.sku.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-[#121212] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
//             <p className="text-[#B0B0B0]">Manage your inventory and track stock levels</p>
//           </div>
//           <Button 
//             onClick={() => setShowAddForm(true)}
//             className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Item
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Items</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{items.length}</p>
//                 </div>
//                 <Package className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Low Stock</p>
//                   <p className="text-2xl font-bold text-yellow-400">{items.filter(i => i.status === 'Low Stock').length}</p>
//                 </div>
//                 <AlertTriangle className="w-8 h-8 text-yellow-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Out of Stock</p>
//                   <p className="text-2xl font-bold text-red-400">{items.filter(i => i.status === 'Out of Stock').length}</p>
//                 </div>
//                 <TrendingDown className="w-8 h-8 text-red-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Value</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">$\{items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</p>
//                 </div>
//                 <Package className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search items by name or SKU..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//         </div>

//         {/* Items Table */}
//         <Card className="bg-[#121212] border-[#444444]">
//           <CardHeader>
//             <CardTitle className="text-[#E0E0E0]">Inventory Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-[#444444]">
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Item</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">SKU</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Quantity</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Min Stock</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Price</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredItems.map((item) => (
//                     <tr key={item.id} className="border-b border-[#444444] hover:bg-[#444444]">
//                       <td className="py-3 px-4">
//                         <div>
//                           <p className="font-medium text-[#E0E0E0]">{item.name}</p>
//                           <p className="text-sm text-[#B0B0B0]">{item.category}</p>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{item.sku}</td>
//                       <td className="py-3 px-4 text-[#E0E0E0]">{item.quantity}</td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{item.minStock}</td>
//                       <td className="py-3 px-4 text-[#E0E0E0]">$\{item.price}</td>
//                       <td className="py-3 px-4">
//                         <Badge className={\`\${getStatusColor(item.status)}\`}>
//                           {item.status}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
//                           Edit
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }`
//   }

//   private getCustomerMockCode(toolName: string): string {
//     return `'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Plus, Search, Users, Phone, Mail, Calendar } from 'lucide-react'

// export default function ${toolName.replace(/\s+/g, "")}() {
//   const [customers, setCustomers] = useState([
//     { id: 1, name: 'John Smith', email: 'john@acme.com', phone: '(555) 123-4567', company: 'Acme Corp', stage: 'Qualified', value: 15000, lastContact: '2024-01-15' },
//     { id: 2, name: 'Sarah Johnson', email: 'sarah@techflow.com', phone: '(555) 234-5678', company: 'TechFlow Inc', stage: 'Proposal', value: 25000, lastContact: '2024-01-14' },
//     { id: 3, name: 'Mike Davis', email: 'mike@datasync.com', phone: '(555) 345-6789', company: 'DataSync LLC', stage: 'Negotiation', value: 35000, lastContact: '2024-01-13' },
//     { id: 4, name: 'Lisa Chen', email: 'lisa@growthlabs.com', phone: '(555) 456-7890', company: 'GrowthLabs', stage: 'Closed Won', value: 45000, lastContact: '2024-01-12' },
//   ])

//   const [searchTerm, setSearchTerm] = useState('')

//   const getStageColor = (stage: string) => {
//     switch (stage) {
//       case 'Lead': return 'bg-gray-900 text-gray-200'
//       case 'Qualified': return 'bg-blue-900 text-blue-200'
//       case 'Proposal': return 'bg-yellow-900 text-yellow-200'
//       case 'Negotiation': return 'bg-orange-900 text-orange-200'
//       case 'Closed Won': return 'bg-green-900 text-green-200'
//       case 'Closed Lost': return 'bg-red-900 text-red-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const filteredCustomers = customers.filter(customer =>
//     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-[#121212] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
//             <p className="text-[#B0B0B0]">Manage customer relationships and track sales pipeline</p>
//           </div>
//           <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Customer
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Customers</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{customers.length}</p>
//                 </div>
//                 <Users className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Pipeline Value</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">$\{customers.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</p>
//                 </div>
//                 <Calendar className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Closed Won</p>
//                   <p className="text-2xl font-bold text-green-400">{customers.filter(c => c.stage === 'Closed Won').length}</p>
//                 </div>
//                 <Users className="w-8 h-8 text-green-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Avg Deal Size</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">$\{Math.round(customers.reduce((sum, c) => sum + c.value, 0) / customers.length).toLocaleString()}</p>
//                 </div>
//                 <Calendar className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search customers by name, company, or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//         </div>

//         {/* Customer Cards */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCustomers.map((customer) => (
//             <Card key={customer.id} className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-[#E0E0E0]">{customer.name}</CardTitle>
//                     <p className="text-[#B0B0B0]">{customer.company}</p>
//                   </div>
//                   <Badge className={\`\${getStageColor(customer.stage)}\`}>
//                     {customer.stage}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-[#B0B0B0]">
//                     <Mail className="w-4 h-4 mr-2" />
//                     {customer.email}
//                   </div>
//                   <div className="flex items-center text-sm text-[#B0B0B0]">
//                     <Phone className="w-4 h-4 mr-2" />
//                     {customer.phone}
//                   </div>
//                   <div className="flex justify-between items-center pt-3 border-t border-[#444444]">
//                     <div>
//                       <p className="text-sm text-[#B0B0B0]">Deal Value</p>
//                       <p className="font-semibold text-[#E0E0E0]">$\{customer.value.toLocaleString()}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-[#B0B0B0]">Last Contact</p>
//                       <p className="text-sm text-[#E0E0E0]">{new Date(customer.lastContact).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                   <Button className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212]">
//                     View Details
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }`
//   }

//   private getExpenseMockCode(toolName: string): string {
//     return `'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react'

// export default function ${toolName.replace(/\s+/g, "")}() {
//   const [expenses, setExpenses] = useState([
//     { id: 1, description: 'Business Lunch with Client', amount: 85.50, category: 'Meals', date: '2024-01-15', status: 'Approved', employee: 'John Smith' },
//     { id: 2, description: 'Flight to Conference', amount: 450.00, category: 'Travel', date: '2024-01-14', status: 'Pending', employee: 'Sarah Johnson' },
//     { id: 3, description: 'Office Supplies', amount: 125.75, category: 'Supplies', date: '2024-01-13', status: 'Submitted', employee: 'Mike Davis' },
//     { id: 4, description: 'Software License', amount: 299.99, category: 'Software', date: '2024-01-12', status: 'Approved', employee: 'Lisa Chen' },
//   ])

//   const [searchTerm, setSearchTerm] = useState('')

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Submitted': return 'bg-blue-900 text-blue-200'
//       case 'Pending': return 'bg-yellow-900 text-yellow-200'
//       case 'Approved': return 'bg-green-900 text-green-200'
//       case 'Rejected': return 'bg-red-900 text-red-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const filteredExpenses = expenses.filter(expense =>
//     expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     expense.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     expense.category.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-[#121212] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
//             <p className="text-[#B0B0B0]">Track and manage employee expense reports</p>
//           </div>
//           <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//             <Plus className="w-4 h-4 mr-2" />
//             New Expense
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Expenses</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">$\{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
//                 </div>
//                 <DollarSign className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-400">{expenses.filter(e => e.status === 'Pending').length}</p>
//                 </div>
//                 <Clock className="w-8 h-8 text-yellow-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Approved</p>
//                   <p className="text-2xl font-bold text-green-400">{expenses.filter(e => e.status === 'Approved').length}</p>
//                 </div>
//                 <CheckCircle className="w-8 h-8 text-green-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">This Month</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{expenses.length}</p>
//                 </div>
//                 <Receipt className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search expenses by description, employee, or category..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//         </div>

//         {/* Expenses Table */}
//         <Card className="bg-[#121212] border-[#444444]">
//           <CardHeader>
//             <CardTitle className="text-[#E0E0E0]">Recent Expenses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-[#444444]">
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Description</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Employee</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Category</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Amount</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Date</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredExpenses.map((expense) => (
//                     <tr key={expense.id} className="border-b border-[#444444] hover:bg-[#444444]">
//                       <td className="py-3 px-4 text-[#E0E0E0]">{expense.description}</td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{expense.employee}</td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{expense.category}</td>
//                       <td className="py-3 px-4 text-[#E0E0E0] font-semibold">$\{expense.amount.toFixed(2)}</td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{new Date(expense.date).toLocaleDateString()}</td>
//                       <td className="py-3 px-4">
//                         <Badge className={\`\${getStatusColor(expense.status)}\`}>
//                           {expense.status}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
//                           Review
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }`
//   }

//   private getProjectMockCode(toolName: string): string {
//     return `'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Plus, Search, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react'

// export default function ${toolName.replace(/\s+/g, "")}() {
//   const [tasks, setTasks] = useState([
//     { id: 1, title: 'Design Homepage Mockup', project: 'Website Redesign', assignee: 'John Smith', status: 'In Progress', priority: 'High', dueDate: '2024-01-20', timeSpent: 8 },
//     { id: 2, title: 'Setup Database Schema', project: 'Mobile App', assignee: 'Sarah Johnson', status: 'Todo', priority: 'Medium', dueDate: '2024-01-22', timeSpent: 0 },
//     { id: 3, title: 'Write API Documentation', project: 'API Development', assignee: 'Mike Davis', status: 'Done', priority: 'Low', dueDate: '2024-01-18', timeSpent: 12 },
//     { id: 4, title: 'User Testing Session', project: 'Website Redesign', assignee: 'Lisa Chen', status: 'In Progress', priority: 'High', dueDate: '2024-01-25', timeSpent: 4 },
//   ])

//   const [searchTerm, setSearchTerm] = useState('')

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Todo': return 'bg-gray-900 text-gray-200'
//       case 'In Progress': return 'bg-blue-900 text-blue-200'
//       case 'Done': return 'bg-green-900 text-green-200'
//       case 'Blocked': return 'bg-red-900 text-red-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'High': return 'bg-red-900 text-red-200'
//       case 'Medium': return 'bg-yellow-900 text-yellow-200'
//       case 'Low': return 'bg-green-900 text-green-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const filteredTasks = tasks.filter(task =>
//     task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-[#121212] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
//             <p className="text-[#B0B0B0]">Manage projects and track team progress</p>
//           </div>
//           <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//             <Plus className="w-4 h-4 mr-2" />
//             New Task
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Tasks</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{tasks.length}</p>
//                 </div>
//                 <CheckCircle2 className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">In Progress</p>
//                   <p className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.status === 'In Progress').length}</p>
//                 </div>
//                 <Clock className="w-8 h-8 text-blue-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Completed</p>
//                   <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'Done').length}</p>
//                 </div>
//                 <CheckCircle2 className="w-8 h-8 text-green-400" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Hours</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{tasks.reduce((sum, t) => sum + t.timeSpent, 0)}h</p>
//                 </div>
//                 <Clock className="w-8 h-8 text-[#888888]" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search tasks by title, project, or assignee..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//         </div>

//         {/* Task Board */}
//         <div className="grid md:grid-cols-3 gap-6">
//           {['Todo', 'In Progress', 'Done'].map((status) => (
//             <Card key={status} className="bg-[#121212] border-[#444444]">
//               <CardHeader>
//                 <CardTitle className="text-[#E0E0E0] flex items-center justify-between">
//                   {status}
//                   <Badge className="bg-[#444444] text-[#B0B0B0]">
//                     {filteredTasks.filter(task => task.status === status).length}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {filteredTasks
//                   .filter(task => task.status === status)
//                   .map((task) => (
//                     <Card key={task.id} className="bg-[#444444] border-[#666666] hover:border-[#888888] transition-colors">
//                       <CardContent className="p-4">
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-start">
//                             <h4 className="font-medium text-[#E0E0E0] text-sm">{task.title}</h4>
//                             <Badge className={\`\${getPriorityColor(task.priority)} text-xs\`}>
//                               {task.priority}
//                             </Badge>
//                           </div>
                          
//                           <p className="text-xs text-[#B0B0B0]">{task.project}</p>
                          
//                           <div className="flex items-center justify-between text-xs text-[#B0B0B0]">
//                             <div className="flex items-center">
//                               <Users className="w-3 h-3 mr-1" />
//                               {task.assignee}
//                             </div>
//                             <div className="flex items-center">
//                               <Clock className="w-3 h-3 mr-1" />
//                               {task.timeSpent}h
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center text-xs text-[#B0B0B0]">
//                             <Calendar className="w-3 h-3 mr-1" />
//                             Due: {new Date(task.dueDate).toLocaleDateString()}
//                           </div>
                          
//                           <Button size="sm" className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212] text-xs">
//                             View Details
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }`
//   }

//   private getGenericMockCode(toolName: string): string {
//     return `'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Badge } from '@/components/ui/badge'
// import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'

// export default function ${toolName.replace(/\s+/g, "")}() {
//   const [items, setItems] = useState([
//     { id: 1, name: 'Sample Item 1', description: 'This is a sample item for demonstration', status: 'Active', createdAt: '2024-01-15' },
//     { id: 2, name: 'Sample Item 2', description: 'Another sample item with different properties', status: 'Pending', createdAt: '2024-01-14' },
//     { id: 3, name: 'Sample Item 3', description: 'Third sample item for testing purposes', status: 'Completed', createdAt: '2024-01-13' },
//   ])

//   const [searchTerm, setSearchTerm] = useState('')
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [newItem, setNewItem] = useState({ name: '', description: '', status: 'Active' })

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active': return 'bg-green-900 text-green-200'
//       case 'Pending': return 'bg-yellow-900 text-yellow-200'
//       case 'Completed': return 'bg-blue-900 text-blue-200'
//       case 'Inactive': return 'bg-gray-900 text-gray-200'
//       default: return 'bg-gray-900 text-gray-200'
//     }
//   }

//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleAddItem = () => {
//     if (newItem.name && newItem.description) {
//       setItems([...items, {
//         id: items.length + 1,
//         ...newItem,
//         createdAt: new Date().toISOString().split('T')[0]
//       }])
//       setNewItem({ name: '', description: '', status: 'Active' })
//       setShowAddForm(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#121212] p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
//             <p className="text-[#B0B0B0]">Manage your business data efficiently</p>
//           </div>
//           <Button 
//             onClick={() => setShowAddForm(true)}
//             className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add New Item
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Total Items</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0]">{items.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                   <Eye className="w-6 h-6 text-[#888888]" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Active</p>
//                   <p className="text-2xl font-bold text-green-400">{items.filter(i => i.status === 'Active').length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                   <Eye className="w-6 h-6 text-green-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-[#B0B0B0]">Completed</p>
//                   <p className="text-2xl font-bold text-blue-400">{items.filter(i => i.status === 'Completed').length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-[#444444] rounded-lg flex items-center justify-center">
//                   <Eye className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search items..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//         </div>

//         {/* Add Form */}
//         {showAddForm && (
//           <Card className="bg-[#121212] border-[#444444] mb-6">
//             <CardHeader>
//               <CardTitle className="text-[#E0E0E0]">Add New Item</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="name" className="text-[#E0E0E0]">Name</Label>
//                 <Input
//                   id="name"
//                   value={newItem.name}
//                   onChange={(e) => setNewItem({...newItem, name: e.target.value})}
//                   className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description" className="text-[#E0E0E0]">Description</Label>
//                 <Input
//                   id="description"
//                   value={newItem.description}
//                   onChange={(e) => setNewItem({...newItem, description: e.target.value})}
//                   className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
//                 />
//               </div>
//               <div className="flex space-x-2">
//                 <Button onClick={handleAddItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//                   Add Item
//                 </Button>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setShowAddForm(false)}
//                   className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444]"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Items Table */}
//         <Card className="bg-[#121212] border-[#444444]">
//           <CardHeader>
//             <CardTitle className="text-[#E0E0E0]">Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-[#444444]">
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Name</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Description</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Status</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Created</th>
//                     <th className="text-left py-3 px-4 text-[#E0E0E0]">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredItems.map((item) => (
//                     <tr key={item.id} className="border-b border-[#444444] hover:bg-[#444444]">
//                       <td className="py-3 px-4 text-[#E0E0E0] font-medium">{item.name}</td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{item.description}</td>
//                       <td className="py-3 px-4">
//                         <Badge className={\`\${getStatusColor(item.status)}\`}>
//                           {item.status}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4 text-[#B0B0B0]">{new Date(item.createdAt).toLocaleDateString()}</td>
//                       <td className="py-3 px-4">
//                         <div className="flex space-x-2">
//                           <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
//                             <Edit className="w-3 h-3" />
//                           </Button>
//                           <Button size="sm" variant="outline" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
//                             <Trash2 className="w-3 h-3" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }`
//   }

//   async getGenerationStatus(generationId: string): Promise<V0GenerationResponse> {
//     try {
//       if (!this.apiKey) {
//         // Mock status response
//         return {
//           id: generationId,
//           code: "",
//           preview_url: "",
//           status: "completed",
//         }
//       }

//       const response = await fetch(`${this.baseUrl}/generate/${generationId}`, {
//         headers: {
//           Authorization: `Bearer ${this.apiKey}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error("V0 API status check error:", error)
//       throw new Error("Failed to check generation status")
//     }
//   }
// }

// export function processRequirements(userInput: string, toolName: string): string {
//   return `
// Create a professional business application for: ${toolName}

// Requirements: ${userInput}

// Generate a complete React application with:
// - Modern, clean interface using Tailwind CSS with dark theme (#121212 background, #E0E0E0 text)
// - Fully responsive design for desktop and mobile
// - Professional form inputs for data entry with proper validation
// - Interactive table/list views for data display with sorting and filtering
// - Complete CRUD operations (Create, Read, Update, Delete)
// - Professional styling with excellent UX and accessibility
// - Include realistic sample data to demonstrate all functionality
// - Use modern React patterns with hooks and proper state management
// - Add loading states, error handling, and success feedback
// - Include a professional header with navigation
// - Make it production-ready with proper TypeScript types

// The application should be a complete, working business tool that users can immediately start using for their specific needs.

// Style requirements:
// - Use dark theme with #121212 background
// - Primary text: #E0E0E0
// - Secondary text: #B0B0B0  
// - Borders: #444444
// - Accent color: #888888
// - Professional, modern design
// - Excellent contrast and readability
// - Smooth animations and transitions
// `
// }

// export const v0Api = new V0ApiService()

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
      console.warn("V0_API_KEY not found - using development mode")
    }
  }

  async generateTool(prompt: string): Promise<V0GenerationResponse> {
    try {
      // If no API key, return mock response for development
      if (!this.apiKey) {
        console.log("Development mode: Using mock v0 response")
        return this.getMockResponse(prompt)
      }

      console.log("Calling v0 API with prompt:", prompt.substring(0, 100) + "...")

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "v0-1.5-md",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("v0 API error:", response.status, errorText)
        throw new Error(`v0 API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("v0 API response received:", result.id)

      // Extract the generated code from v0 response
      const generatedCode = result.choices?.[0]?.message?.content || ""

      return {
        id: result.id || `v0_${Date.now()}`,
        code: generatedCode,
        preview_url: `https://v0.dev/preview/${result.id}`,
        status: "completed",
      }
    } catch (error) {
      console.error("v0 API generation error:", error)

      // Fallback to mock response if API fails
      if (!this.apiKey) {
        return this.getMockResponse(prompt)
      }

      throw new Error("Failed to generate tool with v0 API")
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

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Package, AlertTriangle, TrendingDown, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface InventoryItem {
  id: number
  name: string
  sku: string
  quantity: number
  minStock: number
  price: number
  category: string
  status: string
}

export default function ${toolName.replace(/\s+/g, "")}() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    quantity: 0,
    minStock: 0,
    price: 0,
    category: '',
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inventory-items')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      // Initialize with sample data
      const sampleItems = [
        { id: 1, name: 'Laptop Computer', sku: 'LAP001', quantity: 15, minStock: 5, price: 999.99, category: 'Electronics', status: 'In Stock' },
        { id: 2, name: 'Office Chair', sku: 'CHR001', quantity: 3, minStock: 10, price: 299.99, category: 'Furniture', status: 'Low Stock' },
        { id: 3, name: 'Printer Paper', sku: 'PAP001', quantity: 0, minStock: 20, price: 12.99, category: 'Supplies', status: 'Out of Stock' },
        { id: 4, name: 'Wireless Mouse', sku: 'MOU001', quantity: 25, minStock: 8, price: 49.99, category: 'Electronics', status: 'In Stock' },
      ]
      setItems(sampleItems)
      localStorage.setItem('inventory-items', JSON.stringify(sampleItems))
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('inventory-items', JSON.stringify(items))
    }
  }, [items])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-900 text-green-200'
      case 'Low Stock': return 'bg-yellow-900 text-yellow-200'
      case 'Out of Stock': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const getItemStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return 'Out of Stock'
    if (quantity <= minStock) return 'Low Stock'
    return 'In Stock'
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.sku) {
      const item: InventoryItem = {
        id: Date.now(),
        ...newItem,
        status: getItemStatus(newItem.quantity, newItem.minStock)
      }
      setItems([...items, item])
      setNewItem({ name: '', sku: '', quantity: 0, minStock: 0, price: 0, category: '' })
      setShowAddForm(false)
    }
  }

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      minStock: item.minStock,
      price: item.price,
      category: item.category,
    })
  }

  const handleUpdateItem = () => {
    if (editingItem && newItem.name && newItem.sku) {
      const updatedItems = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...newItem, status: getItemStatus(newItem.quantity, newItem.minStock) }
          : item
      )
      setItems(updatedItems)
      setEditingItem(null)
      setNewItem({ name: '', sku: '', quantity: 0, minStock: 0, price: 0, category: '' })
    }
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage your inventory and track stock levels</p>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-[#E0E0E0]">Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Name</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">SKU</Label>
                  <Input
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Quantity</Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Min Stock</Label>
                    <Input
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Category</Label>
                    <Input
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#444444] text-[#B0B0B0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              placeholder="Search items by name, SKU, or category..."
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
                      <td className="py-3 px-4 text-[#E0E0E0]">$\{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge className={\`\${getStatusColor(item.status)}\`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditItem(item)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteItem(item.id)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
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

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="bg-[#121212] border-[#444444]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0]">Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#E0E0E0]">Name</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div>
                <Label className="text-[#E0E0E0]">SKU</Label>
                <Input
                  value={newItem.sku}
                  onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Quantity</Label>
                  <Input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Min Stock</Label>
                  <Input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Category</Label>
                  <Input
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Update Item
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="border-[#444444] text-[#B0B0B0]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}`
  }

  private getCustomerMockCode(toolName: string): string {
    return `'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  company: string
  stage: string
  value: number
  lastContact: string
}

export default function ${toolName.replace(/\s+/g, "")}() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    stage: 'Lead',
    value: 0,
  })

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('crm-customers')
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      // Initialize with sample data
      const sampleCustomers = [
        { id: 1, name: 'John Smith', email: 'john@acme.com', phone: '(555) 123-4567', company: 'Acme Corp', stage: 'Qualified', value: 15000, lastContact: '2024-01-15' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@techflow.com', phone: '(555) 234-5678', company: 'TechFlow Inc', stage: 'Proposal', value: 25000, lastContact: '2024-01-14' },
        { id: 3, name: 'Mike Davis', email: 'mike@datasync.com', phone: '(555) 345-6789', company: 'DataSync LLC', stage: 'Negotiation', value: 35000, lastContact: '2024-01-13' },
        { id: 4, name: 'Lisa Chen', email: 'lisa@growthlabs.com', phone: '(555) 456-7890', company: 'GrowthLabs', stage: 'Closed Won', value: 45000, lastContact: '2024-01-12' },
      ]
      setCustomers(sampleCustomers)
      localStorage.setItem('crm-customers', JSON.stringify(sampleCustomers))
    }
  }, [])

  // Save to localStorage whenever customers change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('crm-customers', JSON.stringify(customers))
    }
  }, [customers])

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

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer: Customer = {
        id: Date.now(),
        ...newCustomer,
        lastContact: new Date().toISOString().split('T')[0]
      }
      setCustomers([...customers, customer])
      setNewCustomer({ name: '', email: '', phone: '', company: '', stage: 'Lead', value: 0 })
      setShowAddForm(false)
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      stage: customer.stage,
      value: customer.value,
    })
  }

  const handleUpdateCustomer = () => {
    if (editingCustomer && newCustomer.name && newCustomer.email) {
      const updatedCustomers = customers.map(customer =>
        customer.id === editingCustomer.id
          ? { ...customer, ...newCustomer, lastContact: new Date().toISOString().split('T')[0] }
          : customer
      )
      setCustomers(updatedCustomers)
      setEditingCustomer(null)
      setNewCustomer({ name: '', email: '', phone: '', company: '', stage: 'Lead', value: 0 })
    }
  }

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter(customer => customer.id !== id))
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
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-[#E0E0E0]">Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Name</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Email</Label>
                  <Input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Phone</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Company</Label>
                    <Input
                      value={newCustomer.company}
                      onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Stage</Label>
                    <Select value={newCustomer.stage} onValueChange={(value) => setNewCustomer({...newCustomer, stage: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage} className="text-[#E0E0E0]">
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Deal Value</Label>
                    <Input
                      type="number"
                      value={newCustomer.value}
                      onChange={(e) => setNewCustomer({...newCustomer, value: parseInt(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddCustomer} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    Add Customer
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#444444] text-[#B0B0B0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleEditCustomer(customer)}
                      className="flex-1 bg-[#888888] hover:bg-[#666666] text-[#121212]"
                    >
                      <Edit className="w-3 h-3 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent className="bg-[#121212] border-[#444444]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0]">Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#E0E0E0]">Name</Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div>
                <Label className="text-[#E0E0E0]">Email</Label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Phone</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Company</Label>
                  <Input
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Stage</Label>
                  <Select value={newCustomer.stage} onValueChange={(value) => setNewCustomer({...newCustomer, stage: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage} className="text-[#E0E0E0]">
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Deal Value</Label>
                  <Input
                    type="number"
                    value={newCustomer.value}
                    onChange={(e) => setNewCustomer({...newCustomer, value: parseInt(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateCustomer} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Update Customer
                </Button>
                <Button variant="outline" onClick={() => setEditingCustomer(null)} className="border-[#444444] text-[#B0B0B0]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}`
  }

  private getExpenseMockCode(toolName: string): string {
    return `'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
  status: string
  employee: string
}

export default function ${toolName.replace(/\s+/g, "")}() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Meals',
    employee: '',
  })

  const categories = ['Meals', 'Travel', 'Supplies', 'Software', 'Equipment', 'Other']
  const statuses = ['Submitted', 'Pending', 'Approved', 'Rejected']

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expense-reports')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    } else {
      // Initialize with sample data
      const sampleExpenses = [
        { id: 1, description: 'Business Lunch with Client', amount: 85.50, category: 'Meals', date: '2024-01-15', status: 'Approved', employee: 'John Smith' },
        { id: 2, description: 'Flight to Conference', amount: 450.00, category: 'Travel', date: '2024-01-14', status: 'Pending', employee: 'Sarah Johnson' },
        { id: 3, description: 'Office Supplies', amount: 125.75, category: 'Supplies', date: '2024-01-13', status: 'Submitted', employee: 'Mike Davis' },
        { id: 4, description: 'Software License', amount: 299.99, category: 'Software', date: '2024-01-12', status: 'Approved', employee: 'Lisa Chen' },
      ]
      setExpenses(sampleExpenses)
      localStorage.setItem('expense-reports', JSON.stringify(sampleExpenses))
    }
  }, [])

  // Save to localStorage whenever expenses change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expense-reports', JSON.stringify(expenses))
    }
  }, [expenses])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-900 text-blue-200'
      case 'Pending': return 'bg-yellow-900 text-yellow-200'
      case 'Approved': return 'bg-green-900 text-green-200'
      case 'Rejected': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0 && newExpense.employee) {
      const expense: Expense = {
        id: Date.now(),
        ...newExpense,
        date: new Date().toISOString().split('T')[0],
        status: 'Submitted'
      }
      setExpenses([...expenses, expense])
      setNewExpense({ description: '', amount: 0, category: 'Meals', employee: '' })
      setShowAddForm(false)
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setNewExpense({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      employee: expense.employee,
    })
  }

  const handleUpdateExpense = () => {
    if (editingExpense && newExpense.description && newExpense.amount > 0 && newExpense.employee) {
      const updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id
          ? { ...expense, ...newExpense }
          : expense
      )
      setExpenses(updatedExpenses)
      setEditingExpense(null)
      setNewExpense({ description: '', amount: 0, category: 'Meals', employee: '' })
    }
  }

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id ? { ...expense, status: newStatus } : expense
    )
    setExpenses(updatedExpenses)
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
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                <Plus className="w-4 h-4 mr-2" />
                New Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-[#E0E0E0]">Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Description</Label>
                  <Input
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    placeholder="Business lunch, travel, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-[#E0E0E0]">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Employee</Label>
                  <Input
                    value={newExpense.employee}
                    onChange={(e) => setNewExpense({...newExpense, employee: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    placeholder="Employee name"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddExpense} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    Add Expense
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#444444] text-[#B0B0B0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                        <Select value={expense.status} onValueChange={(value) => handleStatusChange(expense.id, value)}>
                          <SelectTrigger className="w-32 bg-[#444444] border-[#444444]">
                            <Badge className={\`\${getStatusColor(expense.status)}\`}>
                              {expense.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent className="bg-[#121212] border-[#444444]">
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status} className="text-[#E0E0E0]">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditExpense(expense)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
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

        {/* Edit Dialog */}
        <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
          <DialogContent className="bg-[#121212] border-[#444444]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0]">Edit Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#E0E0E0]">Description</Label>
                <Input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Category</Label>
                  <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-[#E0E0E0]">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-[#E0E0E0]">Employee</Label>
                <Input
                  value={newExpense.employee}
                  onChange={(e) => setNewExpense({...newExpense, employee: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateExpense} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Update Expense
                </Button>
                <Button variant="outline" onClick={() => setEditingExpense(null)} className="border-[#444444] text-[#B0B0B0]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}`
  }

  private getProjectMockCode(toolName: string): string {
    return `'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Calendar, Users, Clock, CheckCircle2, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Task {
  id: number
  title: string
  project: string
  assignee: string
  status: string
  priority: string
  dueDate: string
  timeSpent: number
}

export default function ${toolName.replace(/\s+/g, "")}() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    project: '',
    assignee: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
    timeSpent: 0,
  })

  const statuses = ['Todo', 'In Progress', 'Done', 'Blocked']
  const priorities = ['Low', 'Medium', 'High', 'Critical']

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('project-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Initialize with sample data
      const sampleTasks = [
        { id: 1, title: 'Design Homepage Mockup', project: 'Website Redesign', assignee: 'John Smith', status: 'In Progress', priority: 'High', dueDate: '2024-01-20', timeSpent: 8 },
        { id: 2, title: 'Setup Database Schema', project: 'Mobile App', assignee: 'Sarah Johnson', status: 'Todo', priority: 'Medium', dueDate: '2024-01-22', timeSpent: 0 },
        { id: 3, title: 'Write API Documentation', project: 'API Development', assignee: 'Mike Davis', status: 'Done', priority: 'Low', dueDate: '2024-01-18', timeSpent: 12 },
        { id: 4, title: 'User Testing Session', project: 'Website Redesign', assignee: 'Lisa Chen', status: 'In Progress', priority: 'High', dueDate: '2024-01-25', timeSpent: 4 },
      ]
      setTasks(sampleTasks)
      localStorage.setItem('project-tasks', JSON.stringify(sampleTasks))
    }
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('project-tasks', JSON.stringify(tasks))
    }
  }, [tasks])

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
      case 'Critical': return 'bg-red-900 text-red-200'
      case 'High': return 'bg-orange-900 text-orange-200'
      case 'Medium': return 'bg-yellow-900 text-yellow-200'
      case 'Low': return 'bg-green-900 text-green-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const handleAddTask = () => {
    if (newTask.title && newTask.project && newTask.assignee && newTask.dueDate) {
      const task: Task = {
        id: Date.now(),
        ...newTask,
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', project: '', assignee: '', status: 'Todo', priority: 'Medium', dueDate: '', timeSpent: 0 })
      setShowAddForm(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      timeSpent: task.timeSpent,
    })
  }

  const handleUpdateTask = () => {
    if (editingTask && newTask.title && newTask.project && newTask.assignee && newTask.dueDate) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...newTask } : task
      )
      setTasks(updatedTasks)
      setEditingTask(null)
      setNewTask({ title: '', project: '', assignee: '', status: 'Todo', priority: 'Medium', dueDate: '', timeSpent: 0 })
    }
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    )
    setTasks(updatedTasks)
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
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-[#E0E0E0]">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Title</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    placeholder="Task title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Project</Label>
                    <Input
                      value={newTask.project}
                      onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Assignee</Label>
                    <Input
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                      placeholder="Assigned to"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Status</Label>
                    <Select value={newTask.status} onValueChange={(value) => setNewTask({...newTask, status: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="text-[#E0E0E0]">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority} className="text-[#E0E0E0]">
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Time Spent (hours)</Label>
                    <Input
                      type="number"
                      value={newTask.timeSpent}
                      onChange={(e) => setNewTask({...newTask, timeSpent: parseInt(e.target.value) || 0})}
                      className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddTask} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#444444] text-[#B0B0B0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditTask(task)}
                              className="flex-1 bg-[#888888] hover:bg-[#666666] text-[#121212] text-xs"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteTask(task.id)}
                              className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-[#121212] border-[#444444]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0]">Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#E0E0E0]">Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Project</Label>
                  <Input
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Assignee</Label>
                  <Input
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Status</Label>
                  <Select value={newTask.status} onValueChange={(value) => setNewTask({...newTask, status: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-[#E0E0E0]">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority} className="text-[#E0E0E0]">
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Time Spent (hours)</Label>
                  <Input
                    type="number"
                    value={newTask.timeSpent}
                    onChange={(e) => setNewTask({...newTask, timeSpent: parseInt(e.target.value) || 0})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateTask} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Update Task
                </Button>
                <Button variant="outline" onClick={() => setEditingTask(null)} className="border-[#444444] text-[#B0B0B0]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}`
  }

  private getGenericMockCode(toolName: string): string {
    return `'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye, Settings } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Item {
  id: number
  name: string
  description: string
  status: string
  category: string
  createdAt: string
}

export default function ${toolName.replace(/\s+/g, "")}() {
  const [items, setItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    status: 'Active',
    category: 'General',
  })

  const statuses = ['Active', 'Pending', 'Completed', 'Inactive']
  const categories = ['General', 'Important', 'Urgent', 'Archive']

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('business-tool-items')
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      // Initialize with sample data
      const sampleItems = [
        { id: 1, name: 'Sample Item 1', description: 'This is a sample item for demonstration', status: 'Active', category: 'General', createdAt: '2024-01-15' },
        { id: 2, name: 'Sample Item 2', description: 'Another sample item with different properties', status: 'Pending', category: 'Important', createdAt: '2024-01-14' },
        { id: 3, name: 'Sample Item 3', description: 'Third sample item for testing purposes', status: 'Completed', category: 'Urgent', createdAt: '2024-01-13' },
      ]
      setItems(sampleItems)
      localStorage.setItem('business-tool-items', JSON.stringify(sampleItems))
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('business-tool-items', JSON.stringify(items))
    }
  }, [items])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-200'
      case 'Pending': return 'bg-yellow-900 text-yellow-200'
      case 'Completed': return 'bg-blue-900 text-blue-200'
      case 'Inactive': return 'bg-gray-900 text-gray-200'
      default: return 'bg-gray-900 text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Important': return 'bg-orange-900 text-orange-200'
      case 'Urgent': return 'bg-red-900 text-red-200'
      case 'Archive': return 'bg-gray-900 text-gray-200'
      default: return 'bg-blue-900 text-blue-200'
    }
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.description) {
      const item: Item = {
        id: Date.now(),
        ...newItem,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setItems([...items, item])
      setNewItem({ name: '', description: '', status: 'Active', category: 'General' })
      setShowAddForm(false)
    }
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      description: item.description,
      status: item.status,
      category: item.category,
    })
  }

  const handleUpdateItem = () => {
    if (editingItem && newItem.name && newItem.description) {
      const updatedItems = items.map(item =>
        item.id === editingItem.id ? { ...item, ...newItem } : item
      )
      setItems(updatedItems)
      setEditingItem(null)
      setNewItem({ name: '', description: '', status: 'Active', category: 'General' })
    }
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#E0E0E0]">${toolName}</h1>
            <p className="text-[#B0B0B0]">Manage your business data efficiently</p>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#444444]">
              <DialogHeader>
                <DialogTitle className="text-[#E0E0E0]">Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Name</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Description</Label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                    placeholder="Item description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Status</Label>
                    <Select value={newItem.status} onValueChange={(value) => setNewItem({...newItem, status: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status} className="text-[#E0E0E0]">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                      <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121212] border-[#444444]">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-[#E0E0E0]">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#444444] text-[#B0B0B0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

        {/* Items Table */}
        <Card className="bg-[#121212] border-[#444444]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#E0E0E0]">Items</CardTitle>
              <Button variant="outline" size="sm" className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#444444]">
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Name</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Description</th>
                    <th className="text-left py-3 px-4 text-[#E0E0E0]">Category</th>
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
                        <Badge className={\`\${getCategoryColor(item.category)}\`}>
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={\`\${getStatusColor(item.status)}\`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[#B0B0B0]">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditItem(item)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteItem(item.id)}
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          >
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

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="bg-[#121212] border-[#444444]">
            <DialogHeader>
              <DialogTitle className="text-[#E0E0E0]">Edit Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-[#E0E0E0]">Name</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div>
                <Label className="text-[#E0E0E0]">Description</Label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="bg-[#444444] border-[#444444] text-[#E0E0E0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#E0E0E0]">Status</Label>
                  <Select value={newItem.status} onValueChange={(value) => setNewItem({...newItem, status: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status} className="text-[#E0E0E0]">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#E0E0E0]">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger className="bg-[#444444] border-[#444444] text-[#E0E0E0]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#444444]">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-[#E0E0E0]">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateItem} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  Update Item
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="border-[#444444] text-[#B0B0B0]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
        throw new Error(`v0 API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("v0 API status check error:", error)
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
