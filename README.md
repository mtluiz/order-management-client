# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Order Management Client

A React-based client application for managing projects and service orders. Built with React, TypeScript, and Vite.

## Features

- User authentication (login/register)
- Projects management (create, view, edit, delete)
- Service orders management
- Dashboard with overview statistics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/order-management-client.git
cd order-management-client

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Testing

The application includes comprehensive testing at multiple levels:

### Unit Tests

Unit tests verify individual components in isolation. The project uses Vitest with React Testing Library to test UI components, custom hooks, and utility functions.

Run unit tests with:

```bash
pnpm test
```

Watch mode for development:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

### Integration Tests

Integration tests verify interactions between multiple components and how they work together. Key user flows like creating projects, filtering data, and form validation are covered by integration tests.

### End-to-End Tests

End-to-end tests with Cypress simulate real user interactions with the complete application. They verify critical flows like:

- User authentication 
- Project creation and management
- Search and filtering functionality
- Form validation and submission

Run Cypress end-to-end tests:

```bash
# Open Cypress UI
pnpm cypress:open

# Run headless
pnpm cypress:run
```

### Continuous Integration

The project includes GitHub Actions workflows that automatically run tests on pull requests and pushes to the main branch, ensuring code quality is maintained.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── lib/            # Utility functions and API clients
├── pages/          # Page components
├── schemas/        # Zod validation schemas
├── styles/         # Global styles
├── test/           # Test utilities and helpers
│   ├── unit/       # Unit tests for components and utilities
│   ├── integration/# Integration tests for key user flows
│   └── setup.ts    # Test configuration and global setup
├── types/          # TypeScript type definitions
└── main.tsx        # Application entry point
```

## Technologies Used

- React 18.3
- TypeScript
- React Router DOM
- React Hook Form with Zod
- Tailwind CSS
- Axios
- Vite
- Vitest and React Testing Library for unit/integration testing
- Cypress for E2E testing
