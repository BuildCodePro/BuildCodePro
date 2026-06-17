# BuildCode Pro

AI Powered Fire Alarm Design & Estimation Platform — monorepo for Milestone 1 foundation.

## Structure

| Folder | Stack | Port | Description |
|--------|-------|------|-------------|
| `node/` | Express.js + Prisma + PostgreSQL | 3000 | REST API backend |

## Quick Start

### 1. Database

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd node
npm install
npm run migrate_dev   # creates tables + runs seeders
npm run dev
```

- API: http://localhost:3000/home
- Swagger: http://localhost:3000/api/v1/docs

### 3. Frontend

```bash
cd nextjs
npm install
npm run dev
```

- App: http://localhost:3001

## Environment

### Backend (`node/.env.development`)

```
DATABASE_URL=postgresql://<usernam>:<password>@localhost:5432/<dbname>
PORT=3000
ACCESS_TOKEN_SECRET=your-secret
```

### Frontend (`nextjs/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Database Schema

Full platform schema documentation: [`node/prisma/SCHEMA.md`](./node/prisma/SCHEMA.md)

Covers all 8 modules: Auth, Projects, AI Design, BOM, Compliance, Exports, Billing, Support.

```bash
cd node && npm run migrate_dev
```

- Project setup & monorepo structure
- PostgreSQL database with Prisma
- JWT authentication
- User management & role permissions
- File upload infrastructure (Cloudinary)
- Swagger API documentation

## API Documentation

Interactive Swagger UI is available at `/api/v1/docs` when the backend is running.

OpenAPI JSON spec: `/api/v1/docs.json`
