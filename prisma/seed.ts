import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create sample templates
  const templates = [
    {
      name: "Customer Onboarding Tracker",
      description: "Track new customer onboarding progress with automated workflows",
      category: "Sales & CRM",
      tags: ["crm", "onboarding", "sales"],
      config: {
        fields: [
          { name: "customer_name", type: "text", required: true },
          { name: "email", type: "email", required: true },
          { name: "onboarding_stage", type: "select", options: ["Welcome", "Setup", "Training", "Complete"] },
          { name: "assigned_rep", type: "text" },
          { name: "start_date", type: "date" },
        ],
        workflows: [
          { trigger: "stage_change", action: "send_email" },
          { trigger: "completion", action: "create_task" },
        ],
      },
      schema: {
        type: "object",
        properties: {
          customer_name: { type: "string" },
          email: { type: "string", format: "email" },
          onboarding_stage: { type: "string", enum: ["Welcome", "Setup", "Training", "Complete"] },
          assigned_rep: { type: "string" },
          start_date: { type: "string", format: "date" },
        },
      },
      ui: {
        layout: "form",
        theme: "modern",
        colors: { primary: "#3b82f6", secondary: "#64748b" },
      },
      rating: 4.8,
      downloads: 1250,
    },
    {
      name: "Inventory Management System",
      description: "Track inventory levels, orders, and supplier information",
      category: "Operations",
      tags: ["inventory", "operations", "tracking"],
      config: {
        fields: [
          { name: "item_name", type: "text", required: true },
          { name: "sku", type: "text", required: true },
          { name: "quantity", type: "number", required: true },
          { name: "reorder_level", type: "number" },
          { name: "supplier", type: "text" },
          { name: "last_updated", type: "datetime" },
        ],
        workflows: [
          { trigger: "low_stock", action: "send_alert" },
          { trigger: "reorder", action: "create_purchase_order" },
        ],
      },
      schema: {
        type: "object",
        properties: {
          item_name: { type: "string" },
          sku: { type: "string" },
          quantity: { type: "number" },
          reorder_level: { type: "number" },
          supplier: { type: "string" },
          last_updated: { type: "string", format: "date-time" },
        },
      },
      ui: {
        layout: "table",
        theme: "clean",
        colors: { primary: "#059669", secondary: "#6b7280" },
      },
      rating: 4.6,
      downloads: 890,
    },
    {
      name: "Employee Performance Review",
      description: "Structured performance review process with goal tracking",
      category: "HR & People",
      tags: ["hr", "performance", "reviews"],
      config: {
        fields: [
          { name: "employee_name", type: "text", required: true },
          { name: "review_period", type: "text", required: true },
          { name: "goals_met", type: "number", min: 0, max: 10 },
          { name: "strengths", type: "textarea" },
          { name: "areas_for_improvement", type: "textarea" },
          { name: "overall_rating", type: "select", options: ["Exceeds", "Meets", "Below"] },
        ],
        workflows: [
          { trigger: "review_complete", action: "notify_hr" },
          { trigger: "low_rating", action: "schedule_followup" },
        ],
      },
      schema: {
        type: "object",
        properties: {
          employee_name: { type: "string" },
          review_period: { type: "string" },
          goals_met: { type: "number", minimum: 0, maximum: 10 },
          strengths: { type: "string" },
          areas_for_improvement: { type: "string" },
          overall_rating: { type: "string", enum: ["Exceeds", "Meets", "Below"] },
        },
      },
      ui: {
        layout: "form",
        theme: "professional",
        colors: { primary: "#7c3aed", secondary: "#64748b" },
      },
      rating: 4.7,
      downloads: 650,
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
