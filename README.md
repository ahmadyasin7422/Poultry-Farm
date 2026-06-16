# Poultry Farm Management System

Complete MERN stack application for managing poultry farm operations — birds, feed, eggs, sales, expenses, customers, and reports.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| API | Fetch API (no axios) |

## Project Structure

```
ahmad/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/seedData.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layouts/
    │   ├── pages/
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Environment Variables

The backend `.env` file is already configured:

```env
MONGO_URI=mongodb+srv://ahmad:ahmad2005@cluster0.hqvz7gv.mongodb.net/poultryfarm?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=my_poultry_secret_key_123
PORT=5000
```

> **Security note:** Never commit `.env` to public repositories. Use `.env.example` for sharing template values.

## How to Run

### 1. Backend

```powershell
cd backend
npm install
npm run server
```

Backend runs at **http://localhost:5000**

### 2. Frontend (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 3. Seed Sample Data (optional)

```powershell
cd backend
npm run seed
```

This creates a demo account with sample records:

| Field | Value |
|-------|-------|
| Email | `ahmad@poultryfarm.com` |
| Password | `demo1234` |

## API Routes

### Authentication
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### CRUD Modules (all support GET, POST, PUT, DELETE)
| Module | Route |
|--------|-------|
| Flocks | `/api/flocks` |
| Feeds | `/api/feeds` |
| Eggs | `/api/eggs` |
| Sales | `/api/sales` |
| Expenses | `/api/expenses` |
| Customers | `/api/customers` |

### Reports
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard` | Total birds, eggs, sales, expenses, net profit |
| GET | `/api/reports?period=daily` | Daily/weekly/monthly reports |

Protected routes require header: `Authorization: Bearer <token>`

## Data Models

### Flock
`batchName`, `breed`, `totalBirds`, `purchaseDate`, `age`, `mortalityCount`, `notes`

### Feed
`feedName`, `quantityKg`, `cost`, `supplier`, `date`

### Egg Production
`date`, `goodEggs`, `damagedEggs`, `totalEggs` (auto-calculated)

### Sale
`customerName`, `productType`, `quantity`, `unitPrice`, `totalPrice` (auto-calculated), `date`

### Expense
`title`, `category`, `amount`, `description`, `date`

### Customer
`name`, `phone`, `address`, `notes`

## Features

- Register / Login / Logout with JWT
- Dashboard with live stats from MongoDB
- Full CRUD for all modules
- Search and date filtering
- Toast notifications
- Loading states and form validation
- Delete confirmation modals
- Responsive sidebar layout
- Daily, weekly, monthly reports

## Verification Checklist

- Backend connects to MongoDB Atlas (`MongoDB Connected` in terminal)
- Frontend opens at http://localhost:5173
- Backend API at http://localhost:5000
- Register/Login works
- CRUD saves data to MongoDB Atlas
- Dashboard shows real database totals

## MongoDB Atlas Setup (if starting fresh)

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add database user
3. Allow network access (`0.0.0.0/0` for development)
4. Copy connection string into `.env` as `MONGO_URI`
