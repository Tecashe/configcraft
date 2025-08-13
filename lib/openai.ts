import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set")
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratedTool {
  name: string
  description: string
  category: string
  config: {
    fields: Array<{
      name: string
      type: string
      required: boolean
      label: string
      options?: string[]
      validation?: any
    }>
    workflows: Array<{
      trigger: string
      action: string
      condition?: string
    }>
    permissions: {
      create: string[]
      read: string[]
      update: string[]
      delete: string[]
    }
    integrations?: string[]
  }
  schema: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
  ui: {
    layout: string
    theme: string
    colors: {
      primary: string
      secondary: string
      success: string
      warning: string
      error: string
    }
    components: {
      form: {
        layout: string
        spacing: string
      }
      table: {
        pagination: boolean
        sorting: boolean
        filtering: boolean
      }
    }
  }
}

export async function generateToolWithAI(description: string, category?: string): Promise<GeneratedTool> {
  const prompt = `
You are an expert business tool designer. Based on the user's description, generate a comprehensive business tool configuration.

User Description: "${description}"
Category: ${category || "General Business"}

Generate a JSON response with the following structure:
{
  "name": "Tool Name (descriptive, professional)",
  "description": "Brief description of what this tool does",
  "category": "Category (CRM, HR, Operations, Finance, Project Management, etc.)",
  "config": {
    "fields": [
      {
        "name": "field_name",
        "type": "text|textarea|select|date|number|email|phone|checkbox|file",
        "required": true/false,
        "label": "Human readable label",
        "options": ["option1", "option2"] // for select fields only
      }
    ],
    "workflows": [
      {
        "trigger": "status_change|due_date_approaching|new_record|field_update",
        "action": "send_notification|send_email|create_task|update_field",
        "condition": "optional condition"
      }
    ],
    "permissions": {
      "create": ["OWNER", "ADMIN", "MEMBER"],
      "read": ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
      "update": ["OWNER", "ADMIN", "MEMBER"],
      "delete": ["OWNER", "ADMIN"]
    },
    "integrations": ["Slack", "Email", "Google Calendar", etc.]
  },
  "schema": {
    "type": "object",
    "properties": {
      // JSON schema for each field
    },
    "required": ["required_field_names"]
  },
  "ui": {
    "layout": "form|table|kanban|calendar",
    "theme": "modern",
    "colors": {
      "primary": "#7c3aed",
      "secondary": "#64748b", 
      "success": "#059669",
      "warning": "#d97706",
      "error": "#dc2626"
    },
    "components": {
      "form": {
        "layout": "vertical|horizontal",
        "spacing": "compact|medium|spacious"
      },
      "table": {
        "pagination": true,
        "sorting": true,
        "filtering": true
      }
    }
  }
}

Requirements:
1. Create 5-12 relevant fields based on the description
2. Include appropriate field types and validation
3. Add 2-4 workflow automations that make sense
4. Choose colors that match the tool's purpose
5. Make the tool name professional and descriptive
6. Ensure all fields have proper JSON schema validation

Respond with ONLY the JSON, no additional text.
`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a business tool configuration expert. Generate comprehensive, production-ready tool configurations based on user requirements. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error("No response from OpenAI")
    }

    // Parse and validate the JSON response
    const generatedTool = JSON.parse(response) as GeneratedTool

    // Validate required fields
    if (!generatedTool.name || !generatedTool.config || !generatedTool.schema) {
      throw new Error("Invalid tool configuration generated")
    }

    return generatedTool
  } catch (error) {
    console.error("OpenAI generation error:", error)

    // Fallback to a basic tool if AI fails
    return {
      name: `Custom ${category || "Business"} Tool`,
      description: description.substring(0, 200) + "...",
      category: category || "Custom",
      config: {
        fields: [
          { name: "title", type: "text", required: true, label: "Title" },
          { name: "description", type: "textarea", required: false, label: "Description" },
          {
            name: "status",
            type: "select",
            required: true,
            label: "Status",
            options: ["New", "In Progress", "Complete"],
          },
          { name: "priority", type: "select", required: false, label: "Priority", options: ["Low", "Medium", "High"] },
          { name: "assigned_to", type: "text", required: false, label: "Assigned To" },
          { name: "due_date", type: "date", required: false, label: "Due Date" },
        ],
        workflows: [
          { trigger: "status_change", action: "send_notification" },
          { trigger: "due_date_approaching", action: "send_reminder" },
        ],
        permissions: {
          create: ["OWNER", "ADMIN", "MEMBER"],
          read: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
          update: ["OWNER", "ADMIN", "MEMBER"],
          delete: ["OWNER", "ADMIN"],
        },
      },
      schema: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          status: { type: "string", enum: ["New", "In Progress", "Complete"] },
          priority: { type: "string", enum: ["Low", "Medium", "High"] },
          assigned_to: { type: "string", maxLength: 100 },
          due_date: { type: "string", format: "date" },
        },
        required: ["title", "status"],
      },
      ui: {
        layout: "form",
        theme: "modern",
        colors: {
          primary: "#7c3aed",
          secondary: "#64748b",
          success: "#059669",
          warning: "#d97706",
          error: "#dc2626",
        },
        components: {
          form: {
            layout: "vertical",
            spacing: "medium",
          },
          table: {
            pagination: true,
            sorting: true,
            filtering: true,
          },
        },
      },
    }
  }
}
