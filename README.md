# Expense Tracker

A simple expense tracking application built with SvelteKit, TailwindCSS, Convex BaaS, and shadcn-svelte components.

## Features

- **Expense Types Management**: Create, edit, and delete expense types with custom colors and images
- **Expense Tracking**: Add, edit, and delete individual expenses with type categorization
- **Modern UI**: Built with shadcn-svelte components and TailwindCSS
- **Real-time Data**: Powered by Convex for real-time data synchronization

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up Convex**
   - Create a new Convex project at [convex.dev](https://convex.dev)
   - Copy your Convex URL
   - Create a `.env` file in the root directory:
     ```
     CONVEX_URL=https://your-convex-deployment-url.convex.cloud
     ```

3. **Run Convex Development Server**

   ```bash
   npx convex dev
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/routes/` - Main pages (expense types and expenses)
- `/src/lib/components/` - Reusable components including shadcn-svelte UI components
- `/src/convex/` - Convex backend functions and schema
- `/src/lib/convex.ts` - Convex client configuration

## Pages

1. **Expense Types** (`/`) - Manage expense categories with cards, colors, and images
2. **Expenses** (`/expenses`) - Track individual expenses in a table format

## Technologies Used

- **SvelteKit** - Full-stack web framework
- **TailwindCSS** - Utility-first CSS framework
- **Convex** - Backend-as-a-Service for real-time data
- **shadcn-svelte** - High-quality UI components
- **Lucide Svelte** - Icon library
