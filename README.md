# R-Loko Frontend

A modern, luxury e-commerce frontend built with React, TypeScript, and Vite.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS 4** for styling
- **Motion** for smooth animations
- **Radix UI** components for accessible UI primitives
- **Material-UI** components
- **React Router** for navigation
- **Axios** for API calls
- Complete shopping cart functionality
- Product catalog with filtering and search
- User authentication UI
- Admin dashboard
- Responsive design
- Dark mode support

## Tech Stack

- **React 18.3.1**
- **TypeScript**
- **Vite 6.3.5**
- **Tailwind CSS 4.1.12**
- **Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Material-UI** - React component library
- **React Router 7** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Recharts** - Chart library

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rloco-frontend
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/      # React components
│   │   │   ├── admin/       # Admin components
│   │   │   └── ui/          # UI primitives
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── imports/             # Imported assets
│   ├── styles/              # Global styles
│   └── main.tsx             # Entry point
├── docs/                    # Documentation
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## Key Features

### Shopping Experience
- Product catalog with filtering and search
- Product detail pages
- Shopping cart
- Wishlist
- Checkout flow
- Order tracking

### User Features
- User registration and login
- Profile management
- Order history
- Returns and refunds
- Customer support tickets

### Admin Features
- Admin dashboard
- Product management
- Order management
- Customer management
- Analytics and reporting
- Content management
- Configuration settings

## Component Architecture

### UI Components
Located in `src/app/components/ui/`, these are reusable UI primitives built with Radix UI and Tailwind CSS.

### Page Components
Located in `src/app/pages/`, these are full page components that compose UI components.

### Context Providers
Located in `src/app/context/`, these manage global state:
- `UserContext` - User authentication and profile
- `CartContext` - Shopping cart state
- `WishlistContext` - Wishlist state
- `AdminContext` - Admin authentication
- `SiteConfigContext` - Site configuration
- `CurrencyContext` - Currency management

## Styling

The project uses Tailwind CSS 4 for styling. Custom theme configuration is in `src/styles/theme.css`.

### Design System
- Luxury-focused design
- Responsive layouts
- Dark mode support
- Smooth animations

## API Integration

API calls are handled through services in `src/app/services/`. The base API configuration is in `src/app/lib/api.ts`.

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting (if configured)

### Best Practices
- Component-based architecture
- Type-safe API calls
- Error boundaries
- Loading states
- Optimistic updates

## Building for Production

```bash
pnpm build
```

The production build will be in the `dist/` directory.

## Documentation

See `docs/` directory for:
- Component Guide
- UI/UX Guidelines
- Project Summary
- Quick Start Guide

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Your License Here]
