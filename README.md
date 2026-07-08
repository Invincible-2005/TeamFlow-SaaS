# TeamFlow SaaS

TeamFlow is an AI-ready home for modern team communication. Designed as a powerful alternative to traditional chat platforms, it organizes conversations into structured channels and threads, operates in real-time, and seamlessly integrates AI to keep teams in sync, summarize discussions, and boost productivity.

## 🎯 Target Audience

TeamFlow is built for:
- **Remote & Hybrid Teams**: Who need a centralized, real-time hub for day-to-day operations.
- **Startups & Small Businesses**: Looking for a cost-effective, intelligent alternative to Slack or Microsoft Teams.
- **Developers & Creators**: Wanting a modern, open, and extensible communication platform built on cutting-edge web technologies.

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Real-Time Messaging** | Lightning-fast message delivery using WebSockets (PartyServer). |
| **Workspaces & Channels** | Organize your team into dedicated workspaces and topic-specific channels. |
| **Threaded Conversations** | Keep discussions focused and clutter-free with dedicated reply threads. |
| **Rich Text & Media** | Support for markdown, code blocks, emojis, and seamless file/image uploads (UploadThing). |
| **AI Integration** | Built-in AI assistants (via OpenRouter & Vercel AI SDK) that understand context and help summarize long discussions. |
| **Reactions & Engagement** | Express yourself with full emoji reactions on any message. |
| **Secure Authentication** | Enterprise-grade security and user management powered by Kinde and Arcjet. |
| **Modern UI/UX** | A beautiful, accessible, and responsive interface built with Tailwind CSS, Framer Motion, and shadcn/ui. |

## 🏗️ Architecture Structure

TeamFlow follows a modern, decoupled architecture designed for scale and real-time performance. Here is a high-level overview of the codebase:

```text
TeamFlow-SaaS/
├── app/                     — Next.js App Router (Frontend & API)
│   ├── (dashboard)/         — Authenticated workspace UI (channels, threads)
│   ├── (marketing)/         — Public landing pages
│   ├── api/                 — API routes (Webhooks, UploadThing, AI streaming)
│   ├── middlewares/         — Edge middleware for Kinde Auth & Arcjet Security
│   └── rpc/                 — oRPC server definitions for type-safe API calls
├── components/              — Reusable React UI components (shadcn/ui, text editors)
├── hooks/                   — Custom React hooks (state management, real-time sync)
├── lib/                     — Core utilities and configuration
│   ├── db.ts                — Prisma database client initialization
│   ├── orpc.ts              — oRPC client setup
│   ├── query/               — TanStack React Query configuration
│   └── arcjet.ts            — Arcjet security client
├── prisma/                  — Database schema and migrations
│   └── schema.prisma        — PostgreSQL relational schema
├── providers/               — React context providers (Theme, Auth, Query)
└── realtime/                — PartyKit / WebSocket server
    └── index.ts             — Handles live presence, typing, and message broadcasts
```

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Real-time Engine**: [PartyKit / PartyServer](https://partykit.io/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Authentication**: [Kinde](https://kinde.com/)
- **Storage**: [UploadThing](https://uploadthing.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/) & OpenRouter

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **pnpm** (Package manager used for this project)
- **PostgreSQL** database (or a cloud provider like NeonDB/Supabase)

## 💻 Setup Instructions

Follow these steps to successfully set up and run the application locally:

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TeamFlow-SaaS
```

### 2. Install dependencies

Run the following command to install all the required packages. (This will also automatically run `prisma generate` to generate the Prisma client).

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of your project by copying the provided example or creating a new one. You will need to fill in the following keys:

```env
# --- Kinde Authentication ---
# Get these from your Kinde dashboard (https://kinde.com)
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/workspace
KINDE_DOMAIN=
# Kinde Management API for creating orgs/users
KINDE_MANAGEMENT_CLIENT_ID=
KINDE_MANAGEMENT_CLIENT_SECRET=

# --- Arcjet Security ---
# Get this from your Arcjet dashboard (https://arcjet.com)
ARCJET_KEY=

# --- Database ---
# Your PostgreSQL connection string (e.g., from NeonDB)
DATABASE_URL=

# --- UploadThing ---
# For handling file/image uploads (https://uploadthing.com)
UPLOADTHING_TOKEN=

# --- AI / LLM ---
# OpenRouter API key for AI features
LLM_KEY=
```

### 4. Setup the Database

Push the Prisma schema to your PostgreSQL database to create the necessary tables:

```bash
npx prisma db push
```

*(Note: The Prisma client is already generated during `pnpm install`, but you can run `npx prisma generate` manually if needed).*

### 5. Start the Development Server

Start the local Next.js development server:

```bash
pnpm dev
```

### 6. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result. You can now log in, create a workspace, and start using the app!
