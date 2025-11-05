# B2B Social Platform

A social platform for businesses to connect, collaborate, and grow together.

## Project Structure

```
b2b-social-platform/
├── backend/              # Backend code (Node.js/Express)
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Authentication and other middleware
│   ├── config/           # Configuration files
│   └── server.js         # Main server file
├── src/                  # Frontend code (React/Vite)
├── package.json          # Project dependencies
├── .env                  # Environment variables
└── README.md             # This file
```

## Development Approach

This project follows an MVP (Minimum Viable Product) approach with phased development:

### Phase 1: Authentication & User Management

- User registration and login
- JWT-based authentication
- Basic user profiles

### Phase 2: Core B2B Features

- Business profiles
- Networking features
- Basic messaging

### Phase 3: Advanced Features

- Groups and communities
- Events and webinars
- Analytics and insights

### Phase 4: Monetization

- Subscription plans
- Premium features
- Transaction facilitation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Create a PostgreSQL database named `b2b_platform`
   - Update `.env` file with your database credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Run development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Branch Strategy

Each phase will be developed in separate branches:

- `phase1-authentication`
- `phase2-core-features`
- `phase3-advanced-features`
- `phase4-monetization`

## License

MIT
