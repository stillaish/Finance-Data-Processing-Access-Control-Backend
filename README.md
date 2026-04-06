# 💰 Finance Data Processing & Access Control Backend

A backend system for managing financial records with role-based access control, built using **Node.js, Express, MongoDB, and JWT authentication**.

---

## 🚀 Overview

This project implements a backend for a finance dashboard where users can:

* Manage financial records (income & expenses)
* View aggregated financial insights
* Access features based on roles (Viewer, Analyst, Admin)

The focus is on **clean architecture, secure access control, and reliable API design**.

---

## 🧠 Key Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control (RBAC)
* User status handling (active/inactive)

### 👥 User Roles

* **Viewer** → Read-only access
* **Analyst** → View + insights
* **Admin** → Full access (CRUD + user management)

---

### 💰 Financial Records

* Create, read, update, delete records
* Fields include:

  * amount
  * type (income / expense)
  * category
  * date
  * notes
* Filtering & pagination support

---

### 📊 Dashboard APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Safe handling of empty datasets

---

### 🛡️ Security & Validation

* Input validation (auth & records)
* Protected routes with middleware
* Centralized error handling
* Environment variable enforcement

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **Auth:** JSON Web Tokens (JWT)
* **Security:** Helmet, CORS
* **Logging:** Morgan

---

## 📁 Project Structure

```
src/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── utils/
 ├── config/
server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd finance-dashboard-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

### 4. Run Server

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## 🔌 API Endpoints

### 🔐 Auth Routes

```
POST   /api/auth/register
POST   /api/auth/login
```

---

### 👤 User Routes (Admin only)

```
GET    /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

### 💰 Record Routes

```
POST   /api/records
GET    /api/records
PUT    /api/records/:id
DELETE /api/records/:id
```

---

### 📊 Dashboard Routes

```
GET    /api/dashboard/summary
```

---

## 🔒 Access Control Logic

| Role    | Permissions                          |
| ------- | ------------------------------------ |
| Viewer  | View records & dashboard             |
| Analyst | View + insights                      |
| Admin   | Full access (CRUD + user management) |

---

## ⚠️ Validation & Error Handling

* Invalid input → `400 Bad Request`
* Unauthorized → `401 Unauthorized`
* Forbidden → `403 Forbidden`
* Not found → `404 Not Found`

All errors are handled via a **centralized error middleware**.

---

## 📌 Assumptions

* Authentication is token-based (JWT)
* MongoDB is used for persistence
* Roles are assigned during registration or by admin
* Simplified validation for demonstration purposes

---

## ✨ Possible Enhancements

* Rate limiting
* API documentation (Swagger)
* Unit & integration tests
* Refresh tokens
* Soft delete for records

---

## 🧾 Evaluation Focus

This project demonstrates:

* Backend architecture design
* Role-based access control
* API structuring & data flow
* Error handling & validation
* Clean and maintainable code

---

## 👨‍💻 Author

**Aish Maheshwari**

