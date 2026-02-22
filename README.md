# Hermes Web UI

Hermes is a modern, feature-rich web-based chat and collaboration platform designed for seamless communication. This project serves as the front-end application for the Hermes ecosystem.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing:** [TanStack Router](https://tanstack.com/router/latest)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏗 Project Architecture

The project follows a **Domain-Driven Design (DDD)** and **Clean Architecture** approach to ensure maintainability and scalability.

- **`src/domain`**: Contains the core business logic, including entities, value objects, and domain errors. This layer is independent of any external frameworks.
- **`src/application`**: Houses application-specific business rules and use cases, implemented as custom React hooks.
- **`src/infrastructure`**: Implements external concerns such as API communication (Repositories), WebSocket clients, and storage management.
- **`src/presentation`**: The UI layer containing React components, pages, layouts, and route definitions.
- **`src/state`**: Global state management using Zustand stores.
- **`src/bootstrap`**: Application setup, including providers, router configuration, and query client initialization.

## 🛠 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd hermes-fe

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory and configure the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Development

```bash
# Start the development server
npm run dev
```

### Build & Preview

```bash
# Build the application for production
npm run build

# Preview the production build
npm run preview
```

### Linting & Type-Checking

```bash
# Run ESLint
npm run lint

# Run TypeScript type-checking
npm run type-check
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
