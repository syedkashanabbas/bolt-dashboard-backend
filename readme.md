
# AI Dashboard (Multi-Tenant Platform)

A **multi-tenant SaaS-style dashboard** with role-based authentication, organization & tenant management, audit logging, and notifications.  
Built with **Node.js (Express + MySQL)** for backend and **Next.js + Tailwind** for frontend.

---

## ✨ Features

- **Authentication & Authorization**
  - JWT-based access + refresh tokens
  - Role-based access (`SuperAdmin`, `Admin`, `Manager`, `User`)
  - Secure password hashing with bcrypt

- **Multi-Tenancy**
  - Tenants (created by SuperAdmin)
  - Organizations (with plans, status, domain)
  - Staff users linked to tenants

- **Audit Logging**
  - Every CRUD action is tracked in `audit_logs`
  - SuperAdmin sees **all logs**
  - Admins see **their tenant’s logs**
  - Users see **only their own logs**

- **Notifications**
  - React Context API for frontend notifications
  - Notifications persisted in localStorage
  - Unread/read tracking
  - Audit logs integrated into notification feed

- **Frontend (Next.js + Tailwind)**
  - Modern dashboard UI
  - Profile & Settings page
  - Organization management (CRUD, search, stats)
  - Notifications center
  - Role-based conditional rendering

---

## 🛠️ Tech Stack

**Backend**
- Node.js (ESM)
- Express
- MySQL (via `mysql2/promise`)
- JWT Authentication
- Bcrypt (password hashing)

**Frontend**
- Next.js 13+
- Tailwind CSS + shadcn/ui
- Context API (Auth & Notifications)
- Sonner (toast notifications)

---

## 📂 Project Structure

### Backend
```

bolt-dashboard-backend/
├── controllers/        # Business logic (auth, users, tenants, orgs, audit)
├── routes/             # Express routes
├── middlewares/        # Auth middleware
├── utils/              # Audit logger
├── config/db.js        # MySQL connection pool
├── server.js           # Express app entry

```

### Frontend
```

bolt-dashboard-frontend/
├── app/                # Next.js app router
├── components/         # UI components
├── contexts/           # Auth & Notification providers
├── lib/                # API fetch wrapper

````

---

## 📑 Database Schema

```sql
-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('SuperAdmin','Admin','Manager','User') DEFAULT 'User',
  tenant_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenants
CREATE TABLE tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations
CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  domain VARCHAR(255),
  plan ENUM('Free','Pro','Enterprise') DEFAULT 'Free',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP NULL
);

-- Audit Logs
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  tenant_id INT,
  table_name VARCHAR(100),
  action ENUM('CREATE','UPDATE','DELETE'),
  record_id INT,
  changes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
````

---

## 🚀 Getting Started

### Backend

```bash
cd bolt-dashboard-backend
cp .env.example .env   # configure DB + JWT secrets
npm install
npm run dev
```

### Frontend

```bash
cd bolt-dashboard-frontend
npm install
npm run dev
```

---

## 🔑 Roles & Access

* **SuperAdmin**

  * Manage tenants & organizations
  * See all audit logs
* **Admin**

  * Manage users in their tenant
  * See tenant’s audit logs
* **User**

  * Update profile
  * See only their own audit logs

---

## 📡 API Endpoints

* **Auth**

  * `POST /api/auth/register`
  * `POST /api/auth/login`
  * `GET /api/auth/refresh`

* **Profile**

  * `GET /api/profile`
  * `PUT /api/profile`

* **Tenants (SuperAdmin)**

  * `POST /api/tenants`
  * `GET /api/tenants`
  * `PUT /api/tenants/:id`
  * `DELETE /api/tenants/:id`

* **Organizations**

  * `POST /api/organizations`
  * `GET /api/organizations`
  * `PUT /api/organizations/:id`
  * `DELETE /api/organizations/:id`

* **Users**

  * `POST /api/users`
  * `GET /api/users`
  * `PUT /api/users/:id`
  * `DELETE /api/users/:id`

* **Audit Logs**

  * `GET /api/audit`

---

## 📸 Screens (Frontend)

* **Login / Register**
* **Dashboard with Stats**
* **Organization Management**
* **Audit Logs (Notifications page)**

---

## 📌 Notes

* For local development, backend runs on **[http://localhost:5000](http://localhost:5000)**
* Frontend expects backend API at that base URL
* Use `.env` for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and DB credentials

---

## ✅ Status

MVP completed:
✔ Authentication
✔ Multi-Tenant Users + Orgs
✔ Audit Logging
✔ Notifications UI
✔ Role-based Access

Next steps (optional):

* WebSocket real-time notifications
* Admin dashboard for logs
* Multi-region support

```

---
