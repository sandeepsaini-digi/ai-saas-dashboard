# AI SaaS Dashboard — Next.js 14 + OpenAI + Stripe + MongoDB

A production-ready, multi-tenant SaaS dashboard with AI-powered analytics, subscription management, and real-time insights. Built with Next.js 14 App Router, OpenAI GPT-4, Stripe, and MongoDB.

## Features

- **AI Analytics Engine** — Ask natural language questions about your data using GPT-4
- **Multi-tenant Architecture** — Isolated workspaces per organization with role-based access
- **Subscription System** — Stripe-powered billing with Free, Pro, and Enterprise tiers
- **Real-time Dashboard** — Live metrics with WebSocket updates and Chart.js visualizations
- **Authentication** — NextAuth.js with Google OAuth + credentials
- **Team Management** — Invite members, assign roles (Owner/Admin/Member/Viewer)
- **AI Report Generator** — Auto-generate PDF reports using OpenAI + PDFKit
- **Dark / Light Mode** — System-aware theming with Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| AI | OpenAI GPT-4o, LangChain.js, Vercel AI SDK |
| Backend | Next.js API Routes, Node.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js v5 |
| Payments | Stripe (Subscriptions + Webhooks) |
| Charts | Recharts, Chart.js |
| Deployment | Vercel + MongoDB Atlas |

## Project Structure

```
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/dashboard, analytics, ai-insights, team, settings
│   └── api/auth, ai/chat, ai/report, billing/webhook, dashboard/metrics
├── components/ui, dashboard, ai
├── lib/mongodb.ts, stripe.ts, openai.ts, auth.ts
└── models/User.ts, Organization.ts, Subscription.ts
```

## Getting Started

```bash
git clone https://github.com/sandeepsaini-digi/ai-saas-dashboard.git
cd ai-saas-dashboard
npm install
cp .env.example .env.local
npm run dev
```

## AI Features

**Natural Language Analytics** — Ask questions like:
- *"What was our revenue trend last quarter?"*
- *"Which users are most at risk of churning?"*

The AI engine uses GPT-4o with RAG to query your MongoDB data and return structured insights.

**Auto Report Generation** — One click generates a full PDF with executive summary, metrics, and recommendations.

## Subscription Tiers

| Feature | Free | Pro ($29/mo) | Enterprise |
|---|---|---|---|
| Team members | 1 | 10 | Unlimited |
| AI queries/month | 50 | 1,000 | Unlimited |
| Custom reports | ❌ | ✅ | ✅ |
| API access | ❌ | ✅ | ✅ |

## Security

- JWT-based authentication with refresh token rotation
- Row-level security for multi-tenant data isolation
- API rate limiting with Redis
- Stripe webhook signature verification

## License

MIT License
