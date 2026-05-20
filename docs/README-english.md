# Wait, How Much Was It Again?!

※ [日本語のREADME.mdはここ！](./../README.md)👈

An app for tracking and comparing grocery item prices across supermarkets.

![Video showing the flow and features of the app](/docs/images/movie.gif)

## Features

- Track grocery items and their prices across multiple supermarkets
- Add, edit, and browse items and supermarkets
- Compare prices between supermarkets for each item

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Add local domain to hosts file

```sh
# /etc/hosts
127.0.0.1 local.super-price-check.com
```

### Local setup

```sh
git clone <repo-url>
cd supermarket-item-price-comparison

# Copy environment files
cp .env.example .env
cp ./frontend/.env.example .env
cp ./backend/.env.example .env

# Start all services
make up
```

The app is served via nginx at **http://local.super-price-check.com:8082** or **http://localhost:8082**.

## Architecture

### Key Technologies

#### Frontend
- React 19 + TypeScript
- TanStack Router (file-based routing)
- TanStack Query (server state / caching)
- Tailwind CSS v4
- Vite

#### Backend
- Laravel 13 (PHP 8.3)
- PostgreSQL 16
- Garage (S3-compatible object storage)

#### Testing
- Vitest (unit/component)
- Playwright (E2E)

### Monorepo Structure

```
supermarket-item-price-comparison/
├── frontend/                  # React + TypeScript SPA
│   └── app/
│       ├── features/          # Feature modules (items, supermarkets)
│       ├── routes/            # File-based routes (TanStack Router)
│       ├── components/        # Shared UI components
│       └── lib/               # Utilities and API clients
├── backend/                   # Laravel REST API
│   ├── app/Http/Controllers/  # Controllers
│   ├── database/migrations/   # PostgreSQL schema
│   └── routes/api.php         # API route definitions
├── docker/                    # Dockerfiles per service
├── nginx/                     # Reverse proxy config
├── tests/                     # Root-level E2E test helpers
├── docs/                      # OpenAPI spec and images
├── docker-compose.yml         # Local dev stack
├── docker-compose.production.yml
└── Makefile                   # Dev convenience commands
```

## Services

| Service | Description | Port |
|---|---|---|
| nginx | Reverse proxy — routes `/api` to backend, rest to frontend | 8082 |
| frontend | React dev server (Vite) | internal |
| backend | Laravel API | internal |
| postgres | Primary database | 5432 |
| garage | S3-compatible object storage | 3900 |

## Useful commands

| Command | Description |
|---|---|
| `make up` | Start all services in the background |
| `make down` | Stop all services |
| `make build` | Build and start all services |
| `make laravel` | Open a shell in the backend container |
| `make laravel-migrate` | Run database migrations |
| `make laravel-migrate-seed` | Run migrations and seed data |
| `make laravel-logs` | Tail backend logs |

## API documentation (locally)

```sh
make docs
```

Viewable on http://local.super-price-check.com:9090 or http://localhost:9090

![The app's API docs](/docs/images/swagger-docs.png)
