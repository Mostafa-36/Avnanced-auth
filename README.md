
# 🔐 Advanced-auth API - Authentication & Authorization System (Node.js + Express)

A production-ready **Authentication & Authorization system** built from scratch using **Node.js + Express**, with modern security practices and multiple login methods.  
It supports **Email/Password with OTP verification** and **Social Logins** (Google, Facebook, X), with session management, refresh tokens, and strong security middleware.

---

## ✨ **Overview**
Advanced-auth is a backend project that provides a clean and scalable authentication solution.  
It uses **MongoDB** for persistent storage, **Redis** for OTP handling & storing idempotency keys, **Bull** background jobs, and follows a **modular, layered architecture**.  
The project demonstrates practical skills in **secure backend API development**, **OAuth integrations**, and **session/token management**, and the ability to **log out from all devices except the current one**.

⚡ A **frontend** will be built later to connect with this API.

---

## 🛠️ Tech Stack

### 🧠 Backend

- 🟢 **Node.js**
- 🚂 **Express.js**
- 🍃 **MongoDB (Mongoose)**
- 🔐 **JWT (Authentication)**
- 📨 **Nodemailer**
- 🐂 **Redis + Bull** (OTP & Job Queue)
- 🛡️ **Helmet, Rate-Limit, Compression, Cookie-Parser**
- 📝 **Morgan (Logging)**

---

## 📁 Project Structure

```
advanced-auth/
├── src/
│ ├── config/ # App configuration (DB, Redis, env, etc.)
│ ├── controllers/ # Route logic (auth, sessions, social logins)
│ ├── errors/ # Custom error classes and handlers
│ ├── integrations/ # External Emails, OAuth
│ ├── lib/ # db, JWTService, redisClient
│ ├── middleware/ # Auth, error handling, idempotency
│ ├── models/ # Mongoose models (User, Session)
│ ├── provider/ # Handling (facebook, google, x.)
│ ├── queues/ # Email queue
│ ├── routes/ # API routes
│ ├── services/ # Business logic (auth, email, social logins)
│ ├── utils/ # Utilities (tokens, catchAsync, OTP key, etc.)
│ ├── workers/ # Bull workers (email sending)
│ └── server.js # Main server entry point
├── .env
├── package.json
└── README.md
````

---

## ✨ Features

### 👤 User System
- ✅ Register with email & password (OTP verification required).
- ✅ Login / Logout with refresh & access tokens.
- ✅ Forgot / Reset password via email.
- ✅ Email verification + welcome email on activation.

### 🌍 Social Logins (OAuth)
- 🔗 Google Login
- 🔗 Facebook Login
- 🔗 X (Twitter) Login
- 🧩 Built with a **Reusable OAuth Class** → Add new providers without rewriting from scratch.

### 🔑 Session Management
- ✅ MongoDB-based refresh tokens (per session).
- ✅ Logout from all sessions except current.
- ✅ Auto-renew access tokens on expiry.

### 🛡️ Security
- 🔒 HTTP-only cookies.
- 🛡️ Helmet for secure HTTP headers.
- 🚫 Rate-limit for brute force/DDoS protection.
- 🔑 JWT-based auth (short-lived access tokens).
- 🔐 Centralized error handling.

---

## 🧼 Clean Code & Design Highlights

- 🧩 **Reusable OAuth Class**
  Implemented using **Object-Oriented Programming** → one class can handle multiple providers (Google, Facebook, X, etc.) without duplication.

- 🧩 **Reusable Email Service Class**
  Implemented using **Object-Oriented Programming** → created a **flexible Email class** that can send emails via multiple providers (Gmail, Mailtrap, etc.) without rewriting code, making it easy to integrate any new email service while fully adhering to **OO principles**.

- 🔁 **Idempotency**
  Ensures safe re-execution of critical flows (like OTP verification or token refresh) without side effects.

- 📬 **Job Queue (Bull)**
  Used for async tasks (sending OTPs, emails) → improves performance & scalability.

- 🛠️ **Software Engineering Principles Applied**
  - **KISS** (Keep It Simple, Stupid) → straightforward, minimal logic.
  - **DRY** (Don't Repeat Yourself) → shared utilities, reusable services.
  - **OCP** (Open/Closed Principle) → system is extensible for new providers without modifying core logic.
  - **SRP** (Single Responsibility Principle) → small, focused classes & functions.
  - … and more best practices for clean, maintainable code.

- 🚀 **High Performance + Easy Maintenance**
  Designed for both scalability and developer productivity.

---

## ⚙️ Environment Variables

### `backend/.env`

```
PORT=5005
BASE_URL=http://127.0.0.1:5005

MONGO_URI=mongodb://localhost:27017/advanced-auth
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

REDIS_URL=redis://127.0.0.1:6379

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
X_CLIENT_ID=your_x_client_id
X_CLIENT_SECRET=your_x_client_secret
````

---

## 📦 Installation & Development

### 🧾 Prerequisites

- 📦 Node.js 18+
- 🧩 MongoDB (local or Atlas)
- 🟥 Redis (for OTP + Bull jobs)

### ⚙️ Setup

```bash
# Clone repository
git clone https://github.com/your-username/advanced-auth.git
cd advanced-auth

# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
```

---

## 📄 API Documentation

All endpoints and usage examples are fully documented in **Postman**:

🔗 [Advanced-auth API on Postman](https://documenter.getpostman.com/view/37188310/2sB3QFQsHy)

_(Base URL: `http://127.0.0.1:5005`)_

---

## 🔐 Security Highlights

- ✅ Tokens stored in **HTTP-only cookies**.
- ✅ Short-lived access tokens with refresh token rotation.
- ✅ Centralized error handling for safe API responses.
- ✅ Rate-limiting to prevent brute force attacks.

---

## 🤝 Contribution

- 🍴 Fork the repo.
- 👨‍💻 Create your feature branch (`git checkout -b feature/awesome-feature`).
- ✅ Commit changes (`git commit -m 'Add awesome feature'`).
- 📤 Push to branch (`git push origin feature/awesome-feature`).
- 🔁 Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

👨‍💻 **Author**
Mostafa Adly
GitHub: [@Mostafa-36](https://github.com/Mostafa-36)
LinkedIn: [@mostafa-adly](https://linkedin.com/in/mostafa-adly)

⭐️ **Star this project if you like it — it motivates open-source development!**

