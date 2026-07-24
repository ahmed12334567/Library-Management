# Library Management System — Backend API

<p align="left">
  <img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-brightgreen.svg" alt="Version">
  <img src="https://img.shields.io/badge/node.js-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/postgresql-%23316192.svg?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## 1. Description

**Library Management System** is a complete REST API for managing a library, built with **Node.js**, **Express**, and **PostgreSQL**.
It solves the problem of manual library administration by automating:

- User registration and login, including **Google OAuth** sign-in.
- Book and category management (add, update, delete, bulk import from Excel files).
- Borrow request workflows and returns, with tracking of overdue books.
- An admin statistics dashboard.

The system follows a clear **MVC** architecture (Routes → Middleware → Controllers → Models) with full interactive API documentation via **Swagger**.

---

## 2. Key Features

- **Secure authentication**: password hashing with bcrypt, Google OAuth login, and JWT-based sessions.
- **Role-based access control**: separate permissions for `user` and `admin` via custom authorization middleware.
- **Full book management**: list, search, add, update, delete, and bulk-import books from an Excel file.
- **Category management** for organizing books.
- **Complete borrow lifecycle**: submit a borrow request, admin approval/rejection, return handling, and an overdue-books view.
- **Admin statistics dashboard** for monitoring library activity.
- **Abuse protection**: dedicated rate limiting for auth routes and general routes.
- **Interactive Swagger documentation** for testing every endpoint directly from the browser.

---

## 3. Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Authentication | JWT (`jsonwebtoken`) + `bcrypt` + `google-auth-library` |
| Input validation | `express-validator` |
| File upload/import | `multer` + `xlsx` |
| Documentation | `swagger-jsdoc` + `swagger-ui-express` |
| Security | `express-rate-limit`, `cors` |
| Logging | `pino`, `pino-http`, `pino-pretty`, `morgan` |
| Dev tools | `nodemon`, `dotenv` |

---

## 4. Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or later
- [PostgreSQL](https://www.postgresql.org/) installed and running, locally or on a server
- A [Google Cloud Console](https://console.cloud.google.com/) project to obtain a `GOOGLE_CLIENT_ID` (needed for Google sign-in)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmed12334567/Library-Management.git

# 2. Move into the backend folder
cd Library-Management/Back-end/src

# 3. Install dependencies
npm install

# 4. Create your env file from the template
cp .env.example .env
```

Then open `.env` and fill in your connection details:

```env
PORT=3000
DB_PORT=5432
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=library_db
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
# 5. Create the database tables (schema.sql is in src/database)
psql -U your_db_user -d library_db -f database/schema.sql

# 6. Run the server in development mode
npx nodemon server.js

# or run it in production mode
npm start
```

Once running, the server listens by default on:
`http://localhost:3000`

---

## 5. Usage

Once the server is running, you can test every endpoint directly through the interactive **Swagger** UI at:

```
http://localhost:3000/api-docs
```

### Quick usage examples

**Register a new user**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Ahmed Ali", "email": "ahmed@example.com", "password": "StrongPass123"}'
```

**Log in and get a JWT**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ahmed@example.com", "password": "StrongPass123"}'
```

**List all books**

```bash
curl http://localhost:3000/api/v1/books
```

**Submit a borrow request (with an auth token)**

```bash
curl -X POST http://localhost:3000/api/v1/borrow \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1}'
```

### Main API routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Log in |
| `POST` | `/api/v1/auth/google` | Sign in via Google |
| `GET`  | `/api/v1/auth/me` | Get the current user's profile |
| `GET`  | `/api/v1/books` | List all books |
| `POST` | `/api/v1/books` | Add a book (admin) |
| `POST` | `/api/v1/books/import-file` | Bulk-import books from Excel (admin) |
| `GET`  | `/api/v1/categories` | List categories (admin) |
| `POST` | `/api/v1/borrow` | Submit a borrow request |
| `PATCH`| `/api/v1/borrow/:id/Approved` | Approve a borrow request (admin) |
| `GET`  | `/api/v1/borrow/over-date` | List overdue books |
| `GET`  | `/api/v1/dashboard/statistics` | Get dashboard statistics (admin) |

> The full, detailed list of routes (with request/response examples) is available in the Swagger UI.

---

## 6. Contributing

Contributions are welcome. To add a change or a new feature:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add: amazing feature"
   ```
4. Push the branch to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a **Pull Request** with a clear description of the change.

Please follow the existing code structure (Controllers/Models/Middleware) when adding new features.

---

## 7. License

This project is licensed under the **ISC License**.

---

## 8. Contact

**Ahmed**
GitHub: [@ahmed12334567](https://github.com/ahmed12334567)
Project link: [Library-Management](https://github.com/ahmed12334567/Library-Management)
