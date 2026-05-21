# Trade Journal API

A scalable REST API for logging and managing trade journal entries, built with Node.js, Express, and MongoDB. Includes JWT authentication, role-based access control, and a React frontend — submitted as a Backend Developer Internship assignment for Primetrade.ai.

---

## Why Trade Journal?

Since Primetrade.ai is a trading intelligence platform, a trade journal felt more relevant than generic tasks or notes. Users can log buy/sell trades across stocks, crypto, forex, and commodities — with automatic P&L calculation when an exit price is provided.

---

## Tech Stack

**Backend:** Node.js · Express.js · MongoDB + Mongoose · JWT · bcryptjs · Winston · Swagger  
**Frontend:** React · TailwindCSS · Zustand · Axios

---

## Features

- JWT-based register / login with bcrypt password hashing
- Role-based access: `admin` sees all trades, `user` sees own
- Full CRUD for trade entries with automatic P&L calculation
- Filtering by status, asset type, trade type, symbol search
- Backend pagination (skip/limit)
- API versioning at `/api/v1/`
- Input validation and sanitization
- Rate limiting on auth routes (10 req / 15 min)
- MongoDB query injection protection
- Winston structured logging
- Swagger UI docs at `/api/docs`

---

## Project Structure

```
trade-journal/
├── backend/
│   └── src/
│       ├── config/         # DB connection
│       ├── controllers/    # auth.controller.js, trade.controller.js
│       ├── middleware/     # auth, error, validate, rateLimiter
│       ├── models/         # User.js, Trade.js
│       ├── routes/v1/      # auth.routes.js, trade.routes.js
│       ├── swagger/        # Swagger spec setup
│       ├── utils/          # jwt.js, logger.js, response.js
│       ├── validators/     # auth.validator.js, trade.validator.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── api/            # axios.js, auth.js, trades.js
│       ├── components/     # auth, journal, layout, ui
│       ├── hooks/          # useDebounce.js
│       ├── pages/          # Login, Register, Dashboard
│       └── store/          # authStore.js (Zustand)
└── docker-compose.yml
```

---

## Getting Started (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env
# fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

API: `http://localhost:5000`  
Swagger: `http://localhost:5000/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Docker (Optional)

```bash
cp backend/.env.example backend/.env
# set JWT_SECRET

docker-compose up --build
```

- Frontend: `http://localhost`
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api/docs`

---

## API Reference

### Auth — `/api/v1/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, get JWT |
| GET | `/me` | Private | Get own profile |
| GET | `/users` | Admin | List all users |

### Trades — `/api/v1/trades`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get trades (paginated + filtered) |
| GET | `/stats` | Private | P&L summary, breakdown by asset type |
| GET | `/:id` | Private | Get single trade |
| POST | `/` | Private | Log a new trade |
| PUT | `/:id` | Private | Update trade entry |
| DELETE | `/:id` | Private | Delete trade entry |

### Query Params for GET /trades

| Param | Values | Description |
|-------|--------|-------------|
| `page` | number | Page (default: 1) |
| `limit` | number | Per page (default: 10, max: 50) |
| `status` | `open`, `closed` | Filter by trade status |
| `assetType` | `stock`, `crypto`, `forex`, `commodity` | Filter by asset type |
| `tradeType` | `buy`, `sell` | Filter by trade direction |
| `symbol` | string | Search by symbol (regex, case-insensitive) |

---

## RBAC

| Action | User | Admin |
|--------|------|-------|
| View own trades | ✅ | ✅ |
| View all trades | ❌ | ✅ |
| Create trade | ✅ | ✅ |
| Edit own trade | ✅ | ✅ |
| Edit any trade | ❌ | ✅ |
| Delete own trade | ✅ | ✅ |
| Delete any trade | ❌ | ✅ |
| View all users | ❌ | ✅ |

---

## Scalability Notes

- **API versioning** (`/api/v1/`) — new versions can be added without breaking existing clients
- **Mongoose indexes** on `user + status + tradeDate` and text index on `symbol` for fast queries at scale
- **Stateless JWT** — multiple backend instances can run behind a load balancer with no shared session state
- **asyncHandler pattern** — adding new routes requires zero boilerplate error handling
- **Modular structure** — each domain is fully self-contained; adding a new entity means one model, one controller, one validator, one route file
- **Rate limiting** — auth routes protected against brute force at the application layer
- **Redis caching** — can be dropped in front of `GET /trades` reads with minimal change to controller logic
- **MongoDB Atlas** — swap the local `MONGO_URI` for an Atlas URI to go production-ready instantly
