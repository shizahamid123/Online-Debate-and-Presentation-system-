# Debate Platform Backend

This folder contains the Node.js/Express backend for the Online Debate and Presentation Platform.

## Setup

1. Copy `.env.example` to `.env`.
2. Configure `MONGO_URI` and `JWT_SECRET`.
3. Run `npm install`.
4. Start the server with `npm run dev`.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/debates`
- `POST /api/debates`
- `GET /api/debates/:id`
- `POST /api/debates/:id/join`
- `GET /api/users/:id`
- `PUT /api/users/:id`
