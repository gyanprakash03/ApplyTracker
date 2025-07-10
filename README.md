# ApplyTracker

A full-stack job application and company tracker. Add, search, and manage job applications and target companies, with AI-powered company info enrichment.

## Features

- **Job Application Tracking:** Add, edit, search, and manage your job applications.
- **Company Wishlist:** Maintain a list of companies you want to target, with their career and LinkedIn pages.
- **AI-Powered Enrichment:** Company info (about, career page, LinkedIn, country) is auto-filled using the Gemini API.
- **Modern UI:** Responsive dashboard with search, filters, and modals.
- **Authentication:** Secure user management with Clerk.
- **Database:** Uses PostgreSQL (Neon) and Prisma ORM.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL (Neon)](https://neon.tech/)
- [Clerk](https://clerk.com/) (Authentication)
- [Google Gemini API](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [React](https://react.dev/)

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/applytracker.git
   cd applytracker
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
    ```env
    DATABASE_URL=
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    GEMINI_API_KEY=
    ```

5. **Set up the database:**
   ```sh
   npx prisma migrate dev
   ```

6. **Run the development server:**
   ```sh
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- `/app` — Next.js app directory (pages, components, modals)
- `/actions` — Server actions (CRUD, AI, etc.)
- `/components` — Shared UI components
- `/prisma` — Prisma schema and migrations

## Screenshots



---

**Made with ❤️ by Gyan Prakash**
