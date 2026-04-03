# AI SaaS Dashboard — Next.js 14 + OpenAI + Stripe + MongoDB

A production-ready, multi-tenant SaaS dashboard with AI-powered analytics, subscription management, and real-time insights. Built with Next.js 14 App Router, OpenAI GPT-4, Stripe, and MongoDB.

![Dashboard Preview](https://via.placeholder.com/1200x600/0f172a/6366f1?text=AI+SaaS+Dashboard)

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
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── ai-insights/page.tsx
│   │   ├── team/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── ai/chat/route.ts
│   │   ├── ai/report/route.ts
│   │   ├── billing/create-checkout/route.ts
│   │   ├── billing/webhook/route.ts
│   │   └── dashboard/metrics/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── ai/             # AI chat & insight components
├── lib/
│   ├── mongodb.ts
│   ├── stripe.ts
│   ├── openai.ts
│   └── auth.ts
├── models/
│   ├── User.ts
│   ├── Organization.ts
│   └── Subscription.ts
└── prisma/schema.prisma
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- Stripe account

### Installation

```bash
git clone https://github.com/sandeep-dev/ai-saas-dashboard.git
cd ai-saas-dashboard
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## AI Features

### Natural Language Analytics
Ask questions like:
- *"What was our revenue trend last quarter?"*
- *"Which users are most at risk of churning?"*
- *"Summarize team performance for this month"*

The AI engine uses GPT-4o with RAG (Retrieval Augmented Generation) to query your MongoDB data and return structured insights.

### Auto Report Generation
One click generates a full PDF report with:
- Executive summary (AI-written)
- Key metrics and charts
- Trend analysis and recommendations

## Subscription Tiers

| Feature | Free | Pro ($29/mo) | Enterprise |
|---|---|---|---|
| Team members | 1 | 10 | Unlimited |
| AI queries/month | 50 | 1,000 | Unlimited |
| Data retention | 30 days | 1 year | Unlimited |
| Custom reports | ❌ | ✅ | ✅ |
| API access | ❌ | ✅ | ✅ |

## Security

- JWT-based authentication with refresh token rotation
- Row-level security for multi-tenant data isolation
- API rate limiting with Redis
- Stripe webhook signature verification
- Environment variable validation with Zod

## Deployment

### Deploy to Vercel

```bash
vercel --prod
```

Set environment variables in Vercel dashboard and configure MongoDB Atlas IP whitelist.

## Contributing

Pull requests welcome. For major changes, please open an issue first.

## License

MIT License — see [LICENSE](LICENSE) for details.
