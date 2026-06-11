# Backend Ledger System

A production-ready Ledger Management Backend built using Node.js, Express.js, and MongoDB. The system follows the Double-Entry Accounting Principle to ensure transaction consistency, auditability, and secure financial operations.

---

## Overview

Backend Ledger System is a RESTful API application designed to manage users, accounts, balances, and financial transactions. The application supports secure authentication, account management, transaction processing, idempotent operations, and email notifications.

The project demonstrates modern backend development practices including JWT authentication, MongoDB transactions, middleware architecture, and secure API design.

---

## Key Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Based Authentication
* Secure Logout
* Token Blacklisting

### Account Management

* Create Account
* View Accounts
* Check Account Balance
* Account Validation

### Transaction Processing

* Double-Entry Ledger Architecture
* Fund Transfer Between Accounts
* Initial Account Funding
* Idempotent Transaction Handling
* Transaction Status Tracking

### Security

* Password Hashing using Bcrypt
* JWT Authentication
* Protected API Routes
* Secure Cookie Management

### Notifications

* Automated Email Notifications
* Transaction Alerts

---

## Technology Stack

### Backend Framework

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Authentication

* JSON Web Token (JWT)

### Security

* BcryptJS
* Cookie Parser

### Email Service

* Nodemailer

### Environment Configuration

* Dotenv

---

## System Architecture

```text
Client Application
        │
        ▼
Express REST API
        │
 ┌──────┴──────┐
 ▼             ▼
Authentication Business Logic
        │
        ▼
MongoDB Database
        │
        ▼
Ledger & Transaction Records
```

---

## Project Structure

```text
BACKEND-LEDGER
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware
│   │   └── auth.middleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Ledger.js
│   │   ├── Transaction.js
│   │   └── BlacklistToken.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   │
│   └── services
│       └── email.service.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

## Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/backend-ledger.git

cd backend-ledger
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the project root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@gmail.com

CLIENT_ID=your_google_client_id

CLIENT_SECRET=your_google_client_secret

REFRESH_TOKEN=your_refresh_token
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Start Production Server

```bash
npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register New User |
| POST   | /api/auth/login    | Login User        |
| GET    | /api/auth/logout   | Logout User       |

### Accounts

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/accounts             | Create Account      |
| GET    | /api/accounts             | Get User Accounts   |
| GET    | /api/accounts/balance/:id | Get Account Balance |

### Transactions

| Method | Endpoint                               | Description     |
| ------ | -------------------------------------- | --------------- |
| POST   | /api/transactions                      | Transfer Funds  |
| POST   | /api/transactions/system/initial-funds | Initial Funding |

---

## Transaction Workflow

The transaction engine follows a secure double-entry bookkeeping process:

1. Validate Request
2. Verify Authentication
3. Validate Idempotency Key
4. Check Account Existence
5. Calculate Current Balance
6. Create Pending Transaction
7. Generate Debit Entry
8. Generate Credit Entry
9. Commit Database Transaction
10. Send Notification Email

This workflow ensures data consistency and prevents duplicate transactions.

---

## Security Implementation

* JWT Authentication
* Password Hashing with BcryptJS
* Protected API Endpoints
* MongoDB Session Transactions
* Token Blacklisting
* Idempotency Validation
* Environment Variable Protection

---

## Dependencies

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.6.2",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.4.2",
  "nodemailer": "^8.0.8"
}
```

---

## Future Enhancements

* Refresh Token Authentication
* Role-Based Access Control
* Transaction History Analytics
* Swagger API Documentation
* Docker Deployment
* Unit Testing
* Integration Testing
* CI/CD Pipeline
* Redis Caching

---

## Learning Outcomes

This project demonstrates:

* REST API Development
* JWT Authentication
* MongoDB Transactions
* Double-Entry Accounting Systems
* Middleware Design Patterns
* Error Handling
* Secure Backend Development
* Database Modeling

---

## Author

Developed using Node.js, Express.js, MongoDB, JWT Authentication, and Modern Backend Development Practices.
