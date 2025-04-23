# Order Management Client

A Progressive Web Application (PWA) for managing projects and service orders built with React, TypeScript, and Vite.

## Features

- **User Authentication**: Secure login and registration system
- **Project Management**: Create, view, edit, and delete projects
- **Service Order Tracking**: Manage service orders with detailed tracking
- **Offline Support**: Continue working without an internet connection
- **PWA Capabilities**: Install as a native-like app on desktop and mobile devices
- **Responsive Design**: Works on all device sizes

## Technologies

- React 18.3 with TypeScript
- Vite for fast development and optimized builds
- Workbox for service worker implementation
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form with Zod for form validation
- PWA support with automatic updates

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/order-management-client.git
cd order-management-client

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

### Docker Setup

The application can be run in a Docker container for consistent development and deployment environments.

```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d
```

## PWA Features

The application is configured as a Progressive Web Application with the following features:

- **Offline Support**: Cache-first strategies for assets and API responses
- **Installable**: Can be installed on supported devices and browsers
- **Auto-updates**: Notifies users when new content is available
- **Background Sync**: Changes made offline are synchronized when connection is restored

## Building for Production

```bash
# Build the application
npm run build
# or
pnpm build

# Preview the production build locally
npm run preview
# or
pnpm preview
```

## Testing

The application includes comprehensive testing at multiple levels:

### Unit Tests

Unit tests verify individual components in isolation. The project uses Vitest with React Testing Library.

```bash
# Run tests
npm test
# or
pnpm test

# Watch mode for development
npm run test:watch
# or
pnpm test:watch

# Generate coverage report
npm run test:coverage
# or
pnpm test:coverage
```

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
├── types/          # TypeScript type definitions
├── sw.ts           # Service worker implementation
└── main.tsx        # Application entry point
```

## License

[MIT](LICENSE)
