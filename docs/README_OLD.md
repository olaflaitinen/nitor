
# NITOR - Next-Generation Academic Social Network

Nitor is a modern academic platform designed to bridge the gap between rapid social dissemination and rigorous scientific publishing. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Supabase project (for real backend)
- Google Gemini API Key (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/nitor.git
   cd nitor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   API_KEY=your_google_gemini_api_key
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18
- **Styling:** Tailwind CSS, Shadcn UI
- **Math Engine:** KaTeX (via `rehype-katex`)
- **State Management:** React Hooks (local), Zustand (planned for global)
- **AI:** Google Gemini API (via `@google/genai`)

## 📦 Deployment to Vercel

The easiest way to deploy Nitor is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the Environment Variables (`API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, etc.) in the Vercel Project Settings.
4. Click **Deploy**.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
