// import OpenAI from "openai"

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("OPENAI_API_KEY is not set")
// }

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export interface GeneratedTool {
//   name: string
//   description: string
//   category: string
//   config: {
//     fields: Array<{
//       name: string
//       type: string
//       required: boolean
//       label: string
//       options?: string[]
//       validation?: any
//     }>
//     workflows: Array<{
//       trigger: string
//       action: string
//       condition?: string
//     }>
//     permissions: {
//       create: string[]
//       read: string[]
//       update: string[]
//       delete: string[]
//     }
//     integrations?: string[]
//   }
//   schema: {
//     type: string
//     properties: Record<string, any>
//     required: string[]
//   }
//   ui: {
//     layout: string
//     theme: string
//     colors: {
//       primary: string
//       secondary: string
//       success: string
//       warning: string
//       error: string
//     }
//     components: {
//       form: {
//         layout: string
//         spacing: string
//       }
//       table: {
//         pagination: boolean
//         sorting: boolean
//         filtering: boolean
//       }
//     }
//   }
// }

// export async function generateToolWithAI(description: string, category?: string): Promise<GeneratedTool> {
//   const prompt = `
// You are an expert business tool designer. Based on the user's description, generate a comprehensive business tool configuration.

// User Description: "${description}"
// Category: ${category || "General Business"}

// Generate a JSON response with the following structure:
// {
//   "name": "Tool Name (descriptive, professional)",
//   "description": "Brief description of what this tool does",
//   "category": "Category (CRM, HR, Operations, Finance, Project Management, etc.)",
//   "config": {
//     "fields": [
//       {
//         "name": "field_name",
//         "type": "text|textarea|select|date|number|email|phone|checkbox|file",
//         "required": true/false,
//         "label": "Human readable label",
//         "options": ["option1", "option2"] // for select fields only
//       }
//     ],
//     "workflows": [
//       {
//         "trigger": "status_change|due_date_approaching|new_record|field_update",
//         "action": "send_notification|send_email|create_task|update_field",
//         "condition": "optional condition"
//       }
//     ],
//     "permissions": {
//       "create": ["OWNER", "ADMIN", "MEMBER"],
//       "read": ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
//       "update": ["OWNER", "ADMIN", "MEMBER"],
//       "delete": ["OWNER", "ADMIN"]
//     },
//     "integrations": ["Slack", "Email", "Google Calendar", etc.]
//   },
//   "schema": {
//     "type": "object",
//     "properties": {
//       // JSON schema for each field
//     },
//     "required": ["required_field_names"]
//   },
//   "ui": {
//     "layout": "form|table|kanban|calendar",
//     "theme": "modern",
//     "colors": {
//       "primary": "#7c3aed",
//       "secondary": "#64748b", 
//       "success": "#059669",
//       "warning": "#d97706",
//       "error": "#dc2626"
//     },
//     "components": {
//       "form": {
//         "layout": "vertical|horizontal",
//         "spacing": "compact|medium|spacious"
//       },
//       "table": {
//         "pagination": true,
//         "sorting": true,
//         "filtering": true
//       }
//     }
//   }
// }

// Requirements:
// 1. Create 5-12 relevant fields based on the description
// 2. Include appropriate field types and validation
// 3. Add 2-4 workflow automations that make sense
// 4. Choose colors that match the tool's purpose
// 5. Make the tool name professional and descriptive
// 6. Ensure all fields have proper JSON schema validation

// Respond with ONLY the JSON, no additional text.
// `

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a business tool configuration expert. Generate comprehensive, production-ready tool configurations based on user requirements. Always respond with valid JSON only.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 2000,
//     })

//     const response = completion.choices[0]?.message?.content
//     if (!response) {
//       throw new Error("No response from OpenAI")
//     }

//     // Parse and validate the JSON response
//     const generatedTool = JSON.parse(response) as GeneratedTool

//     // Validate required fields
//     if (!generatedTool.name || !generatedTool.config || !generatedTool.schema) {
//       throw new Error("Invalid tool configuration generated")
//     }

//     return generatedTool
//   } catch (error) {
//     console.error("OpenAI generation error:", error)

//     // Fallback to a basic tool if AI fails
//     return {
//       name: `Custom ${category || "Business"} Tool`,
//       description: description.substring(0, 200) + "...",
//       category: category || "Custom",
//       config: {
//         fields: [
//           { name: "title", type: "text", required: true, label: "Title" },
//           { name: "description", type: "textarea", required: false, label: "Description" },
//           {
//             name: "status",
//             type: "select",
//             required: true,
//             label: "Status",
//             options: ["New", "In Progress", "Complete"],
//           },
//           { name: "priority", type: "select", required: false, label: "Priority", options: ["Low", "Medium", "High"] },
//           { name: "assigned_to", type: "text", required: false, label: "Assigned To" },
//           { name: "due_date", type: "date", required: false, label: "Due Date" },
//         ],
//         workflows: [
//           { trigger: "status_change", action: "send_notification" },
//           { trigger: "due_date_approaching", action: "send_reminder" },
//         ],
//         permissions: {
//           create: ["OWNER", "ADMIN", "MEMBER"],
//           read: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
//           update: ["OWNER", "ADMIN", "MEMBER"],
//           delete: ["OWNER", "ADMIN"],
//         },
//       },
//       schema: {
//         type: "object",
//         properties: {
//           title: { type: "string", minLength: 1, maxLength: 100 },
//           description: { type: "string", maxLength: 500 },
//           status: { type: "string", enum: ["New", "In Progress", "Complete"] },
//           priority: { type: "string", enum: ["Low", "Medium", "High"] },
//           assigned_to: { type: "string", maxLength: 100 },
//           due_date: { type: "string", format: "date" },
//         },
//         required: ["title", "status"],
//       },
//       ui: {
//         layout: "form",
//         theme: "modern",
//         colors: {
//           primary: "#7c3aed",
//           secondary: "#64748b",
//           success: "#059669",
//           warning: "#d97706",
//           error: "#dc2626",
//         },
//         components: {
//           form: {
//             layout: "vertical",
//             spacing: "medium",
//           },
//           table: {
//             pagination: true,
//             sorting: true,
//             filtering: true,
//           },
//         },
//       },
//     }
//   }
// }

import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not found - AI features will use mock responses")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
})

export interface RequirementsAnalysis {
  toolType: string
  dataFields: string[]
  userRoles: string[]
  workflows: string[]
  integrations: string[]
  complexity: "simple" | "medium" | "complex"
  estimatedHours: number
  followUpQuestions: string[]
}

export class AIRequirementsService {
  async analyzeRequirements(userInput: string): Promise<RequirementsAnalysis> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getMockAnalysis(userInput)
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert business analyst who helps companies define requirements for custom internal business applications. 

Analyze the user's request and extract:
1. Tool type (CRM, Inventory, Project Management, etc.)
2. Required data fields
3. User roles who will use this tool
4. Key workflows and processes
5. Potential integrations needed
6. Complexity level (simple/medium/complex)
7. Estimated development hours
8. Follow-up questions to clarify requirements

Respond in JSON format with the RequirementsAnalysis interface structure.`,
          },
          {
            role: "user",
            content: `Please analyze this business tool request: "${userInput}"`,
          },
        ],
        temperature: 0.3,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error("No response from OpenAI")
      }

      try {
        return JSON.parse(response) as RequirementsAnalysis
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        return this.getMockAnalysis(userInput)
      }
    } catch (error) {
      console.error("OpenAI API error:", error)
      return this.getMockAnalysis(userInput)
    }
  }

  async generateFollowUpQuestions(userInput: string, context: string[]): Promise<string[]> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return this.getMockFollowUpQuestions(userInput)
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are helping gather detailed requirements for a custom business application. Based on the user's initial request and any previous context, generate 3-5 specific follow-up questions that will help clarify the requirements.

Focus on:
- Who will use this tool (roles, departments)
- What data needs to be tracked
- What workflows or processes are involved
- What integrations are needed
- What reports or outputs are required

Return only an array of question strings in JSON format.`,
          },
          {
            role: "user",
            content: `Initial request: "${userInput}"
Previous context: ${context.join(", ")}

Generate follow-up questions:`,
          },
        ],
        temperature: 0.5,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error("No response from OpenAI")
      }

      try {
        return JSON.parse(response) as string[]
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", parseError)
        return this.getMockFollowUpQuestions(userInput)
      }
    } catch (error) {
      console.error("OpenAI API error:", error)
      return this.getMockFollowUpQuestions(userInput)
    }
  }

  private getMockAnalysis(userInput: string): RequirementsAnalysis {
    const input = userInput.toLowerCase()

    if (input.includes("inventory") || input.includes("stock")) {
      return {
        toolType: "Inventory Management",
        dataFields: ["item_name", "sku", "quantity", "price", "supplier", "category"],
        userRoles: ["Inventory Manager", "Warehouse Staff", "Purchasing"],
        workflows: ["Stock Receiving", "Stock Counting", "Reorder Process", "Reporting"],
        integrations: ["Accounting System", "Supplier APIs", "Barcode Scanner"],
        complexity: "medium",
        estimatedHours: 40,
        followUpQuestions: [
          "How many different product categories do you manage?",
          "Do you need barcode scanning capabilities?",
          "What triggers reorder alerts?",
          "Which accounting system do you use?",
        ],
      }
    } else if (input.includes("crm") || input.includes("customer") || input.includes("lead")) {
      return {
        toolType: "Customer Relationship Management",
        dataFields: ["contact_name", "company", "email", "phone", "deal_value", "stage"],
        userRoles: ["Sales Rep", "Sales Manager", "Customer Success"],
        workflows: ["Lead Qualification", "Deal Pipeline", "Follow-up Tasks", "Reporting"],
        integrations: ["Email System", "Calendar", "Marketing Automation"],
        complexity: "medium",
        estimatedHours: 35,
        followUpQuestions: [
          "What are your sales stages?",
          "How do you currently track leads?",
          "What email system do you use?",
          "Do you need automated follow-up reminders?",
        ],
      }
    } else if (input.includes("expense") || input.includes("finance")) {
      return {
        toolType: "Expense Management",
        dataFields: ["description", "amount", "category", "receipt", "employee", "approval_status"],
        userRoles: ["Employee", "Manager", "Finance Team"],
        workflows: ["Expense Submission", "Approval Process", "Reimbursement", "Reporting"],
        integrations: ["Accounting Software", "Bank APIs", "Receipt OCR"],
        complexity: "medium",
        estimatedHours: 30,
        followUpQuestions: [
          "What expense categories do you have?",
          "Who approves different expense amounts?",
          "Do you need receipt scanning?",
          "How do you handle reimbursements?",
        ],
      }
    } else {
      return {
        toolType: "Custom Business Tool",
        dataFields: ["name", "description", "status", "date", "assigned_to"],
        userRoles: ["User", "Manager", "Admin"],
        workflows: ["Data Entry", "Review Process", "Reporting"],
        integrations: ["Email Notifications", "File Storage"],
        complexity: "simple",
        estimatedHours: 20,
        followUpQuestions: [
          "Who will be the primary users of this tool?",
          "What specific data do you need to track?",
          "Are there any approval processes involved?",
          "What reports do you need to generate?",
        ],
      }
    }
  }

  private getMockFollowUpQuestions(userInput: string): string[] {
    return [
      "Who are the main users of this tool?",
      "What specific data fields do you need to track?",
      "Are there any approval workflows involved?",
      "What integrations with existing systems do you need?",
      "What kind of reports or analytics do you require?",
    ]
  }
}

export const aiRequirementsService = new AIRequirementsService()
