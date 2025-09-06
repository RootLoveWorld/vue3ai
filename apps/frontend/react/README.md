# React 19 + TypeScript Application

This is a modern React 19 application with TypeScript, built as part of the vue3ai monorepo.

## Features

- Multi-theme support with custom theme creation
- Internationalization (i18n) with language switching
- Document preview for PDF, DOC, Excel, PPT, images, TXT, CSV, and Markdown files
- User and organization management
- Secure login system

## Technology Stack

- **React 19**: Latest version of React with improved performance and new features
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Vite**: Next generation frontend tooling for fast development
- **Material-UI (MUI)**: Comprehensive React component library with theming support
- **Styled Components**: CSS-in-JS library for component-level styling
- **Zustand**: Lightweight state management solution
- **React Router 7**: Declarative routing for React applications
- **react-i18next**: Internationalization framework for React

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers (theme, i18n)
├── layouts/        # Page layouts
├── pages/          # Page components
├── App.tsx         # Main App component
├── main.tsx        # Entry point
└── vite-env.d.ts   # Vite environment types
```

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build for production
- `pnpm lint`: Run ESLint
- `pnpm preview`: Preview the production build locally

## Customization

### Themes
The application supports multiple themes (light, dark, high-contrast) and allows creating custom themes.

### Internationalization
The application supports multiple languages (English, Chinese) and can be extended to support additional languages.