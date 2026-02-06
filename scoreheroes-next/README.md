# ScoreHeroes Next.js App

This is a comprehensive Next.js application built with performance, scalability, and best practices in mind.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/scoreheroes-next.git
   cd scoreheroes-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Linting & Formatting**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/), [Lint-Staged](https://github.com/okonet/lint-staged)

## 📂 Project Structure

```
src/
├── app/                 # App Router pages and layouts
│   ├── matches/         # Matches feature routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # UI primitives
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and libraries
│   └── utils.ts         # CN utility
├── styles/              # Additional styles
└── types/               # TypeScript type definitions
```

## ✅ Quality Assurance

- **Linting**: Run `npm run lint` to check for code quality issues.
- **Testing**: Run `npm test` to execute the test suite.
- **Formatting**: Prettier is configured to run on pre-commit via Husky.

## 🔧 Configuration

- **Next.js**: `next.config.ts` for build and runtime config.
- **Tailwind**: `tailwind.config.ts` (if present) or implicit v4 config.
- **TypeScript**: `tsconfig.json` for strict type checking.

## 🌍 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to a Git repository.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and deploy.

For Docker or other platforms, `next build` and `next start` scripts are standard.
