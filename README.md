# TradeSim

TradeSim is a full-stack cryptocurrency paper-trading application. It lets users practise trading with virtual funds while viewing live cryptocurrency prices streamed from Binance—no real money is used.

## Features

- Live cryptocurrency price updates via Binance WebSocket
- Secure registration and login with JWT authentication
- Virtual balance for simulated buy and sell orders
- Portfolio value, holdings, and profit/loss tracking
- Trade history and trader leaderboard
- Personal cryptocurrency watchlist
- Responsive React interface

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Socket.IO Client, Lucide React |
| Backend | Node.js, Express, Socket.IO, Mongoose, JWT, bcrypt |
| Database | MongoDB |
| Market data | Binance WebSocket |

## Project Structure

```text
Tradingsim/
├── backend/
│   ├── controllers/       # Authentication, portfolio, trade, and watchlist logic
│   ├── middleware/        # JWT authentication middleware
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Binance price feed and price registry
│   └── server.js          # Express and Socket.IO server
├── frontend/
│   ├── public/            # Static assets
│   └── src/               # React pages, components, contexts, and styles
└── README.md
```

## Prerequisites

- Node.js 18 or later
- MongoDB 6 or later (local instance or MongoDB Atlas connection string)
- npm

## Getting Started

1. Clone the repository and enter it.

   ```bash
   git clone https://github.com/<your-username>/Tradingsim.git
   cd Tradingsim
   ```

2. Install the backend dependencies.

   ```bash
   cd backend
   npm install
   ```

3. Create `backend/.env` with your local values. Do not commit this file.

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tradesim
   JWT_SECRET=replace-with-a-long-random-secret
   ```

4. Install the frontend dependencies.

   ```bash
   cd ../frontend
   npm install
   ```

5. Start the app in two terminals.

   ```bash
   # Terminal 1
   cd backend
   npm run dev
   ```

   ```bash
   # Terminal 2
   cd frontend
   npm run dev
   ```

Open `http://localhost:5173` in your browser. The API runs on `http://localhost:5000`.

## Available Scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Run the API server with Nodemon |
| `backend` | `npm start` | Run the API server |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production frontend build |
| `frontend` | `npm run lint` | Lint the frontend |

## API Endpoints

Most endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get the authenticated user |
| POST | `/api/trade/execute` | Execute a virtual trade |
| GET | `/api/trade` | Get trade history |
| GET | `/api/portfolio` | Get portfolio details |
| GET | `/api/portfolio/leaderboard` | Get the leaderboard |
| GET | `/api/watchlist` | Get watchlist symbols |
| POST | `/api/watchlist/add` | Add a watchlist symbol |
| DELETE | `/api/watchlist/:symbol` | Remove a watchlist symbol |

## Notes

- This project is for educational and portfolio purposes only.
- TradeSim does not execute real trades or handle real funds.
- Keep secrets such as `JWT_SECRET` and database URLs in `backend/.env`; `.gitignore` prevents them from being committed.

## Contributing

Contributions are welcome. Fork the repository, create a feature branch, commit your changes, and open a pull request.
