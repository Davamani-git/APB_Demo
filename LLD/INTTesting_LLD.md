# Low-Level Design (LLD) – Online Shopping Platform

## 1. Component Specifications

### 1.1 Authentication Service
- **Responsibilities:** User registration, login, RBAC enforcement, session/token management
- **API Endpoints:**
  - POST /register
  - POST /login
  - GET /profile
  - POST /logout
- **Database Tables:** User, Profile
- **Security:** Input validation, password hashing (bcrypt), JWT tokens, RBAC middleware

### 1.2 Catalog Service
- **Responsibilities:** Product CRUD, catalog browsing, search/filter
- **API Endpoints:**
  - GET /products
  - GET /products/:id
  - POST /products
  - PUT /products/:id
  - DELETE /products/:id
- **Database Tables:** Product, Catalog
- **Caching:** Redis for product search and recommendations

### 1.3 Order Service
- **Responsibilities:** Order placement, order status, order tracking
- **API Endpoints:**
  - POST /orders
  - GET /orders/:id
  - PUT /orders/:id/status
- **Database Tables:** Order
- **Integration:** Payment Service, Notification Service

### 1.4 Payment Service
- **Responsibilities:** Payment processing, refund handling, PCI DSS compliance
- **API Endpoints:**
  - POST /payments
  - GET /payments/:id
  - POST /refunds
- **Database Tables:** Payment, Refund
- **Integration:** Payment Gateway
- **Security:** Card data never stored, TLS 1.3 enforced, audit logging

### 1.5 Notification Service
- **Responsibilities:** Sending notifications via email/SMS/push
- **API Endpoints:**
  - POST /notifications
- **Database Tables:** Notification
- **Integration:** Email/SMS providers

### 1.6 Review & Refund Service
- **Responsibilities:** Product reviews, refund requests
- **API Endpoints:**
  - POST /reviews
  - GET /reviews/:productId
  - POST /refunds
- **Database Tables:** Review, Refund

### 1.7 Dashboard Service
- **Responsibilities:** Seller/admin dashboards, analytics, reporting
- **API Endpoints:**
  - GET /dashboard/overview
  - GET /dashboard/sales
- **Database Tables:** User, Product, Order

---

## 2. Data Flows

### 2.1 User Registration/Login
- User submits registration/login form → Authentication Service validates input → Stores user/profile → Issues JWT token

### 2.2 Product Discovery
- User searches/browses products → Catalog Service queries database/cache → Returns filtered product list

### 2.3 Shopping Cart
- User adds/removes products → Cart Service updates cart in DB/session → Returns updated cart

### 2.4 Checkout & Payment
- User checks out → Order Service creates order → Payment Service processes payment via gateway (PCI DSS) → On success, order status updated, notification sent

### 2.5 Order Tracking
- User requests order status → Order Service fetches status from DB → Returns status

### 2.6 Notifications
- Triggered by events (order placed, payment success, etc.) → Notification Service sends messages via provider

### 2.7 Reviews/Refunds
- User submits review/refund → Review & Refund Service validates and stores entry → Notifies relevant parties

---

## 3. Sequence Diagrams (Textual)

### 3.1 Checkout & Payment
```
User → Frontend → API Gateway → Order Service → Payment Service → Payment Gateway
Order Service ← Payment Service ← Payment Gateway
Order Service → Notification Service
Order Service ← Notification Service
Order Service → Database
```

### 3.2 User Registration
```
User → Frontend → API Gateway → Authentication Service → Database
Authentication Service → Notification Service
```

---

## 4. Implementation Details

- **Frontend:** React/Angular, REST API integration, form validation, accessibility (WCAG 2.1 AA)
- **Backend:** Node.js/Java (Spring Boot), microservices, API Gateway (Nginx/Kong)
- **Database:** PostgreSQL for relational data, Redis/MongoDB for caching/sessions
- **Security:**
  - Input validation (server/client)
  - Output encoding
  - RBAC enforced at API and DB
  - Audit logging for all sensitive actions
  - Secrets in Vault/KMS
  - TLS 1.3, AES-256 for sensitive data
- **Compliance:**
  - PCI DSS for payments
  - GDPR/CCPA for user data
  - Consent management, data retention, lineage tracking
- **Error Handling:**
  - Retries with exponential backoff
  - Circuit breaker for service failures
  - Graceful fallback for payment/refund errors
- **Monitoring:** Centralized logging (ELK/Prometheus), alerting for anomalies

---

## 5. Notes
- Optional features (recommendations, logistics) are stubbed for future integration
- All APIs documented with OpenAPI/Swagger
- Automated tests (unit/integration) for all services
