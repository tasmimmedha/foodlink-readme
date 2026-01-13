# FoodFlow Frontend

A modern, scalable Next.js 15 frontend application for smart food management, built with TypeScript, TailwindCSS, and a modular architecture.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** + **shadcn/ui** for beautiful UI components
- **Zustand** for global state management
- **Tanstack Query** for data fetching and caching
- **Zod** for schema validation
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Modular Architecture** with clean separation of concerns

## 📁 Project Structure

```
/src
  /app                    # Next.js App Router pages
    /(public)            # Public routes
    /dashboard           # Dashboard module
    /inventory           # Inventory module
    /shopping            # Shopping list module
    /community           # Community module
    /analytics           # Analytics module
    /settings            # Settings module
    /login               # Auth pages
    /register
    /forgot-password
  /components
    /ui                  # shadcn/ui base components
    /shared              # Reusable shared components
  /modules               # Feature modules
    /inventory
    /receipt-ocr
    /shopping-list
    /community
    /analytics
    /notifications
    /auth
    /shared              # Shared module utilities
  /lib                   # Core utilities
  /store                 # Zustand stores
  /hooks                 # Custom React hooks
  /styles                # Global styles
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗️ Architecture

### Modules
Each feature module contains:
- **Service layer** (`*.service.ts`) - API communication
- **Types** - TypeScript interfaces and types
- **Components** (optional) - Module-specific components

### Components
- **UI Components** (`/components/ui`) - Base shadcn/ui components
- **Shared Components** (`/components/shared`) - Reusable design system components

### State Management
- **Zustand Stores** (`/store`) - Global application state
- **Tanstack Query** - Server state and caching

### Hooks
- **Query Hooks** (`/hooks`) - Tanstack Query hooks for data fetching
- **Custom Hooks** - Reusable React hooks

## 🎨 Styling

The project uses:
- **TailwindCSS** for utility-first styling
- **CSS Variables** for theming (light/dark mode)
- **shadcn/ui** components built on Radix UI

## 🔌 API Integration

All API calls are handled through:
- **Axios instance** (`/lib/axios.ts`)
- **API client utilities** (`/lib/api-client.ts`)
- **Service modules** (`/modules/*/ *.service.ts`)

## 🧪 Development

### Adding a New Module

1. Create service file: `/modules/[module-name]/[module-name].service.ts`
2. Create query hooks: `/hooks/use-query-[module-name].ts`
3. Create page: `/app/[module-name]/page.tsx`
4. Add route to sidebar navigation

### Adding a New Component

1. Base UI components go in `/components/ui`
2. Shared components go in `/components/shared`
3. Module-specific components go in `/modules/[module-name]/components`

## 📦 Dependencies

See `package.json` for a complete list of dependencies.

## 🔐 Authentication

Authentication is handled through:
- JWT tokens stored in localStorage
- Zustand user store
- Protected routes (to be implemented)

## 🌐 Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🍽️ NGO / Charity Admin Dashboard

The FoodFlow NGO operations workspace lives inside `src/app/(dashboard)/ngo` with reusable interface pieces under `src/components/ngo` and Dexie-driven services in `src/lib/server/ngo.*.ts`. It covers donation matching, capacity guardrails, pickup routing, partnership management, recipient feedback, and rich impact analytics.

To explore the experience locally:

1. Start the dev server with `npm run dev`.
2. Visit `/role-selection` and choose the NGO / Charity persona to load the admin shell.
3. Navigate to `/ngo` and browse the Dashboard, Donations, Capacity, Pickups, History, Partners, Reports, Feedback, and Profile routes. Demo data (offers, pickups, partners, impact stories, feedback) seeds on first visit and persists across sessions.

## 📄 License

This project is part of the FoodFlow application.

