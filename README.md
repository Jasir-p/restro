
---

# Restaurant Live Table Order & Billing System

**Full Stack Django Developer – Take-Home Assignment Submission**

---

## 1. Project Overview

This project implements a **Restaurant Live Table Order & Billing System** to manage dine-in orders, table occupancy, billing, and staff access with real-time visibility.

The system is built using **Django (Backend)** and **React (Frontend)** with a focus on:

* Correct workflow handling
* Clean architecture
* Role-based access control
* Real-time updates
* Maintainable backend design

---

## 2. Objective (As per Assignment)

> Build a mini system to manage restaurant dine-in orders, table occupancy, and billing status with real-time visibility.

This implementation satisfies all **core requirements** and includes **multiple bonus features**.

---

## 3. System Architecture

### 3.1 High-Level Architecture

* **Frontend**: React application for staff interaction and live dashboards
* **Backend**: Django REST API handling all business logic
* **Database**: PostgreSQL for persistent data
* **Real-Time Layer**: Django Channels with in-memory layers
* **Background Tasks**: Celery with Redis
* **Infrastructure**: Docker & Docker Compose

```
React Frontend
     ↓ (REST / WebSocket)
Django REST API
     ↓
PostgreSQL
     ↓
Redis (Channels & Celery)
     ↓
Celery Workers
```

All business rules and state transitions are enforced at the **backend level**.

---

## 4. Core Requirements – Implementation Details

### 4.1 Table Management

**Implemented Features**

* Multiple tables supported
* Each table contains:

  * Table number (unique)
  * Seating capacity
  * Status:

    * Available
    * Occupied
    * Bill Requested
    * Closed
* Live table dashboard

**Workflow Logic**

* When an order is created for an **Available** table → status automatically becomes **Occupied**
* When bill is paid → table becomes **Available**

**State Transition**

```
Available → Occupied → Bill Requested → Available
```

Table state transitions are triggered **only by backend events**.

---

### 4.2 Menu & Orders

**Menu Items**

* Name
* Category (Starter / Main / Drinks / Dessert)
* Price
* Availability flag

**Orders**

* Orders assigned to a table
* Multiple menu items per order
* Quantity updates supported
* Order status lifecycle:

  * Placed
  * In Kitchen
  * Served

**Enforced Rules**

* Orders cannot be created for closed tables
* Menu availability validated server-side
* Invalid status transitions blocked at API level

---

### 4.3 Billing

**Billing Features**

* Generate bill per table
* Bill includes:

  * Items
  * Quantities
  * Subtotal
  * Flat tax percentage
  * Total amount

**Bill Status**

* Not Generated
* Pending Payment
* Paid

**Workflow**

* When bill is marked **Paid** → table resets to **Available**

All billing calculations are handled on the backend.

---

### 4.4 Staff Roles & RBAC

RBAC is implemented using **Django Auth Groups & Permissions**.

| Role    | Permissions                        |
| ------- | ---------------------------------- |
| Waiter  | Create orders, update order status |
| Cashier | Generate bills, mark bills as paid |
| Manager | CRUD menu items, CRUD tables       |

**Security Enforcement**

* API-level permission checks
* Frontend respects backend permissions
* No role logic hardcoded in frontend

---

### 4.5 Notification / Background Task

Background processing is implemented using **Celery with Redis**.

* One required async/background task implemented
* Prevents blocking API requests
* Designed for easy future extension (alerts, cleanup, reports)

---

## 5. Bonus Features (Optional)

**4 out of 5 bonus features implemented**

* ✅ Real-time updates using Django Channels (WebSockets)
* ✅ REST APIs using Django REST Framework
* ✅ Dockerized setup (Backend + Frontend + Redis + DB)
* ✅ RBAC using Django Groups & Permissions
* ❌ Reports / PDF export (not implemented)

---

## 6. Explicit Non-Implementation: Reports

**Manager Reports / Analytics Dashboard**

* Not implemented

**Reason**

* Reports are not critical for core workflow correctness
* Priority given to:

  * Backend-driven workflows
  * RBAC enforcement
  * Real-time updates
  * Clean architecture

The system design supports adding reports later without refactoring.

---

## 7. Environment Configuration

Environment variables are used to separate configuration from source code and support **development**, **Docker**, and **future production** deployments.

---

### 7.1 Backend Environment Variables

The backend uses a `.env` file located at the project root or injected via Docker.

**File:** `.env`

```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DB_NAME=restaurant_db
DB_USER=restaurant_user
DB_PASSWORD=restaurant_password
DB_HOST=db
DB_PORT=5432

# Redis (Celery + Channels)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379/0

# Celery Configuration
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_ACCEPT_CONTENT=json
CELERY_TASK_SERIALIZER=json
CELERY_RESULT_BACKEND=redis://redis:6379/0

# Email Configuration (Notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=restaurant-system@example.com
```

**Usage**

* Django: application settings and security
* PostgreSQL: persistent data storage
* Redis: Celery broker + WebSocket channel layer
* Celery: background tasks
* Email: notification workflows

Sensitive values are excluded from version control and documented in `.env.example`.

---

### 7.2 Frontend Environment Variables

The frontend uses a separate `.env` file inside the `frontend` directory.

**File:** `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8001
```

**Usage**

* `REACT_APP_API_URL` → Backend REST API base URL
* `REACT_APP_WS_URL` → WebSocket endpoint

---

### 7.3 Environment Separation Design

* Backend and frontend use independent environment configs
* No secrets are hardcoded
* Supports:

  * Local development
  * Docker-based setup
  * Production deployment

---

## 8. Setup Instructions

### 8.1 Using Docker (Recommended)

```bash
git clone https://github.com/Jasir-p/restro.git

cd backend
docker-compose up --build
```

Run migrations and seed data:

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py seed_data
```

---

### 8.2 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 9. Demo Credentials

| Role    | Username | Password   |
| ------- | -------- | ---------- |
| Manager | manager  | manager123 |
| Waiter  | waiter   | waiter123  |
| Cashier | cashier  | cashier123 |

---

## 10. Database & Seed Data

* Database migrations included
* Seed data includes:

  * Sample tables
  * Menu items
  * Demo users with roles
* Seed command: `python manage.py seed_data`

---

## 11. Assumptions

* Single restaurant
* One active order per table
* Flat tax calculation
* No payment gateway
* Currency: INR
* Table numbers are unique

---

## 12. Evaluation Criteria Mapping

| Criteria                    | Addressed By                     |
| --------------------------- | -------------------------------- |
| Architecture & Code Quality | Layered backend design           |
| Django Best Practices       | DRF, ORM, Groups                 |
| Workflow Handling           | Backend-driven state transitions |
| RBAC & Security             | Permission-based APIs            |
| Performance & Reliability   | WebSockets, Celery, Redis        |
| Docs & Clarity              | Structured README                |
| Bonus Features              | 4/5 completed                    |

---



---

## 13. Author

Developed as part of **Full Stack Django Developer – Take-Home Assignment**.

---


