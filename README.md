# HelpHub - AI-Powered Customer Support Analytics Platform

HelpHub is a comprehensive analytics platform designed to transform customer support operations through intelligent data analysis and AI-powered insights. Built to address the critical gap between support teams generating valuable interaction data and management having actionable intelligence to improve performance and customer satisfaction.

## Prerequisites

Before setting up HelpHub, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker** - [Download here](https://www.docker.com/products/docker-desktop)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd HelpHub-AI-Powered-Customer-Support-Analytics-Platform
```

2. **Database Setup (PostgreSQL with Docker)**
```bash
docker run --name helphub-db \
  -e POSTGRES_DB=helphub \
  -e POSTGRES_USER=helphub_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:15
```

3. **Backend Setup**
```bash
cd helphub-backend
npm install
```

Create `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=helphub
DB_USER=helphub_user
DB_PASSWORD=your_secure_password
PORT=3000
```

Start the backend server:
```bash
npm run dev
```

4. **Frontend Setup**
```bash
cd ../helphub-frontend
npm install
npm run dev
```

5. **Verify Installation**
- Backend should be running on http://localhost:3000
- Frontend should be running on http://localhost:5173
- Test the connection by visiting the frontend URL

## Detailed Setup Instructions

### Backend Dependencies

**Core Dependencies:**
```bash
npm install express cors helmet morgan dotenv pg
```

**Development Dependencies:**
```bash
npm install -D typescript @types/node @types/express @types/cors @types/morgan @types/pg tsx nodemon
```

### Project Structure

```
HelpHub-AI-Powered-Customer-Support-Analytics-Platform/
├── helphub-backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── routes/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── helphub-frontend/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

### Required Configuration Files

**Backend package.json scripts:**
```json
{
  "scripts": {
    "start": "tsx src/server.ts",
    "dev": "nodemon --exec tsx src/server.ts"
  },
  "type": "module"
}
```

**Backend tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

## Database Management

**Start PostgreSQL container:**
```bash
docker start helphub-db
```

**Stop PostgreSQL container:**
```bash
docker stop helphub-db
```

**Connect to database (optional):**
```bash
docker exec -it helphub-db psql -U helphub_user -d helphub
```

## Development Workflow

1. **Start the database:**
```bash
docker start helphub-db
```

2. **Start the backend (in one terminal):**
```bash
cd helphub-backend
npm run dev
```

3. **Start the frontend (in another terminal):**
```bash
cd helphub-frontend
npm run dev
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns server status and timestamp

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Modern CSS/Styling

**Backend:**
- Node.js
- Express.js
- TypeScript
- PostgreSQL

**Database:**
- PostgreSQL 15
- Docker containerized

**Future Integrations:**
- OpenAI API for AI-powered insights
- Advanced analytics libraries
- Authentication system

## Troubleshooting

**Database connection issues:**
- Ensure Docker is running
- Verify PostgreSQL container is running: `docker ps`
- Check environment variables in `.env` file

**Frontend API connection issues:**
- Ensure backend is running on port 3000
- Check for CORS errors in browser console
- Verify API endpoint URLs match between frontend and backend

**TypeScript errors:**
- Ensure all `@types/*` packages are installed
- Check that `"type": "module"` is in package.json
- Verify tsconfig.json configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request
