# ConfigCraft Production Deployment Guide

## Required Environment Variables

### 1. Database (Choose One)
- **Neon**: `DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/configcraft"`
- **Supabase**: `DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"`
- **PlanetScale**: `DATABASE_URL="mysql://user:pass@aws.connect.psdb.cloud/configcraft?sslaccept=strict"`

### 2. Authentication (Clerk)
1. Create account at clerk.com
2. Create new application
3. Get keys from Dashboard > API Keys
4. Set up webhook endpoint: `https://your-domain.com/api/webhooks/clerk`

### 3. Payments (Stripe)
1. Create account at stripe.com
2. Get API keys from Dashboard > Developers > API Keys
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Configure webhook events: `customer.subscription.created`, `customer.subscription.updated`, `invoice.payment_succeeded`

### 4. AI Integration (OpenAI)
1. Create account at platform.openai.com
2. Generate API key from API Keys section
3. Ensure billing is set up for API usage

### 5. File Storage (Vercel Blob)
1. In Vercel dashboard, go to Storage
2. Create new Blob store
3. Copy the read/write token

### 6. Email Service (Resend)
1. Create account at resend.com
2. Verify your domain
3. Generate API key from API Keys section

## Deployment Steps

1. **Set up external services** (database, Clerk, Stripe, etc.)
2. **Configure environment variables** in Vercel
3. **Run database migrations**: `npx prisma db push`
4. **Seed database**: `npx prisma db seed`
5. **Deploy to Vercel**

## Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test payment flow with Stripe test cards
- [ ] Verify email notifications are working
- [ ] Test tool creation and AI generation
- [ ] Check error monitoring in Sentry
- [ ] Verify webhook endpoints are receiving data
