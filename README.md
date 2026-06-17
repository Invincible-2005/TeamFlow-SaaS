# TeamFlow SaaS

TeamFlow is an AI-ready home for team communication. It organizes conversations into channels with threads, operates in real-time, and uses AI to keep teams in sync.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **pnpm** (Package manager used for this project)
- **PostgreSQL** database (or a cloud provider like NeonDB/Supabase)

## Setup Instructions

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

