# Vlogverse

## Overview
Vlogverse is a full-stack web application for creating, sharing, and viewing realtime posts (vlogs). It uses a React + Vite frontend and a Node.js + Express backend with MongoDB for persistence and Socket.IO for realtime updates.

## Tech stack
- Frontend: React, Vite
- Styling: Tailwind CSS, DaisyUI
- HTTP client: axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Realtime: Socket.IO
- Auth: JWT (JSON Web Tokens)
- Dev tooling: ESLint, nodemon (dev)

## Features
- User authentication (JWT)
- Create / read / update / delete posts (vlogs)
- Realtime updates via Socket.IO
- Tailwind + DaisyUI UI components

## Quick start

Prerequisites
- Node.js (16+)
- npm (or yarn)
- MongoDB (local or remote)

Start backend (PowerShell)
```powershell
cd c:\Users\ASUS\Desktop\DevConnect\server
npm install
npm run dev   # or npm start
```

Start frontend (PowerShell)
```powershell
cd c:\Users\ASUS\Desktop\DevConnect\client
npm install
npm run dev
# npm run build to build for production
```

Run both in two terminals:
- Terminal 1: start server
- Terminal 2: start client

## Environment variables

Example server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/vlogverse
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Example client (Vite) .env
```
VITE_API_URL=http://localhost:5000/api
```

## Useful scripts
- server
  - npm run dev — start backend in development (nodemon)
  - npm start — start backend (production)
- client
  - npm run dev — start Vite dev server
  - npm run build — build production assets
  - npm run preview — preview production build

## Project layout
- /server — Express API, sockets, Mongoose models, controllers, routes
- /client — React app (Vite), components, API helpers, styles

## Notes
- Realtime behavior implemented with Socket.IO 
- Auth middleware verifies JWT on protected routes
- Axios wrapper used in the client for auth-protected requests
