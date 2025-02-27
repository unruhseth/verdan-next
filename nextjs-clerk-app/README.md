# Verdan Platform Frontend

A modern, secure, and scalable frontend application built with Next.js 13+, TypeScript, Tailwind CSS, and Clerk Authentication.

## Features

- 🔐 Secure authentication with Clerk
- 👥 Role-based access control (RBAC)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🚀 Built with Next.js 13+ App Router
- 💪 TypeScript for type safety
- 🔄 Automatic route protection
- 📊 Dashboard for different user roles
- 🎯 Permission-based feature access

## Prerequisites

- Node.js 16.8 or later
- npm or yarn
- A Clerk account for authentication

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd verdan-next/nextjs-clerk-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual values:
   - Get your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.dev)
   - Configure your API URL
   - Set other required environment variables

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js 13+ App Router pages
├── components/            # Reusable React components
├── config/               # Configuration files
│   ├── index.ts         # Environment-specific config
│   └── roles.ts         # Role definitions and permissions
├── hooks/               # Custom React hooks
└── styles/             # Global styles and Tailwind config
```

## Role-Based Access Control

The application implements a comprehensive RBAC system with three main roles:

- **User**: Basic access to dashboard and profile
- **Admin**: Additional access to user management and settings
- **Master Admin**: Full system access including role management

Each role has specific permissions that determine feature access. See `src/config/roles.ts` for detailed role definitions.

## Development Guidelines

1. **TypeScript**
   - Use TypeScript for all new files
   - Ensure proper type definitions
   - Avoid using `any` type

2. **Components**
   - Create reusable components in `src/components`
   - Use TypeScript interfaces for props
   - Implement proper error handling
   - Add loading states where appropriate

3. **Authentication & Authorization**
   - Use the `useAuth` hook for authentication state
   - Implement role checks using `RoleBasedRoute` component
   - Always verify permissions for protected actions

4. **Styling**
   - Use Tailwind CSS classes
   - Follow the project's design system
   - Ensure responsive design
   - Use the provided CSS variables for theming

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler check

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure linting passes
4. Submit a pull request

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_URL`: Frontend application URL

## License

[MIT License](LICENSE)
