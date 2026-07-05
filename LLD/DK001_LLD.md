# Low-Level Design (LLD) for Online Shopping Platform

## 1. Introduction
This LLD document provides a detailed technical specification for the implementation of the Online Shopping Platform, based on the HLD for branch DK001. It covers component specifications, data flows, sequence diagrams, and implementation details to ensure the system is robust, secure, scalable, and compliant with industry standards.

---

## 2. Component Specifications

### 2.1 User Management Service
- **Tech Stack:** Node.js/Express, PostgreSQL, Redis (sessions), JWT, OAuth2
- **Responsibilities:**
  - User registration, authentication, password hashing (bcrypt)
  - RBAC/ABAC enforcement
  - Consent management (GDPR/CCPA compliant)
  - Profile CRUD APIs
  - Account status (active, locked, deleted)
  - Audit logging on all state-changing actions
- **API Endpoints:**
  - `POST /users/register`, `POST /users/login`, `GET/PUT /users/profile`, `POST /users/consent`
- **Security:**
  - Input validation (Joi)
  - Brute-force protection (rate limiting)
  - Secure session/token storage

### 2.2 Product Catalog Service
- **Tech Stack:** Python (FastAPI), PostgreSQL, Elasticsearch (search)
- **Responsibilities:**
  - Product CRUD, categorization, search/filter APIs
  - Inventory management
  - Seller onboarding
  - Product status (active, out-of-stock)
- **API Endpoints:**
  - `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
- **Security:** RBAC for seller/admin actions, input validation

### 2.3 Order Service
- **Tech Stack:** Java (Spring Boot), PostgreSQL
- **Responsibilities:**
  - Cart management
  - Checkout and order creation
  - Order tracking and status updates
  - Refund processing
- **API Endpoints:**
  - `POST /cart/add`, `POST /orders`, `GET /orders/:id`, `POST /orders/:id/refund`
- **Security:**
  - Ownership checks, input validation
  - Transactional integrity

### 2.4 Payment Service
- **Tech Stack:** Go, PostgreSQL, Integration with PCI DSS-compliant gateway
- **Responsibilities:**
  - Payment initiation, status tracking
  - Refunds
  - Secure transaction logging
- **API Endpoints:**
  - `POST /payments`, `GET /payments/:id`, `POST /payments/:id/refund`
- **Security:** PCI DSS, vault-based secrets, audit logging

### 2.5 Notification Service
- **Tech Stack:** Node.js, RabbitMQ, Email/SMS APIs
- **Responsibilities:**
  - Order status, promotional, and system notifications
  - User preference-based delivery
- **API Endpoints:**
  - `POST /notifications`, `GET /notifications/:userId`

### 2.6 Review Service
- **Tech Stack:** Python (Flask), PostgreSQL
- **Responsibilities:**
  - Product reviews/ratings
  - Moderation queue
- **API Endpoints:**
  - `POST /reviews`, `GET /reviews/:productId`

### 2.7 Admin Dashboard
- **Tech Stack:** React, Node.js/Express (API)
- **Responsibilities:**
  - Seller onboarding, fraud detection, compliance analytics
  - RBAC/ABAC enforcement
- **API Endpoints:**
  - `GET /admin/users`, `GET /admin/orders`, `GET /admin/audit-logs`

### 2.8 Audit & Compliance Service
- **Tech Stack:** Java (Spring Boot), PostgreSQL
- **Responsibilities:**
  - Centralized logging of all critical actions
  - Consent and data lineage management
  - Compliance reporting

---

## 3. Data Flows

### 3.1 User Registration & Login
1. User submits registration/login form to User Management Service.
2. Service validates input, hashes password, creates user, issues JWT.
3. Consent record created and stored.
4. Audit log entry generated.

### 3.2 Product Browsing & Search
1. User queries Product Catalog Service via API Gateway.
2. Service returns filtered, paginated product list.
3. User selects product for details; service returns full product data.

### 3.3 Cart & Checkout
1. User adds items to cart (Order Service manages persistent cart).
2. User initiates checkout; Order Service validates inventory.
3. Payment Service processes payment securely (PCI DSS).
4. Order status updated; Notification Service informs user.
5. Audit logs and consent updates as needed.

### 3.4 Refunds
1. User requests refund (Order Service).
2. Refund processed by Payment Service; status updated.
3. Notifications sent; audit logged.

### 3.5 Review Submission
1. User submits review to Review Service.
2. Moderation queue checks for compliance.
3. Review published and linked to product.

---

## 4. Sequence Diagrams (Textual)

### 4.1 Order Placement
```
User -> API Gateway: POST /cart/add
API Gateway -> Order Service: Add item to cart
Order Service -> DB: Update cart
User -> API Gateway: POST /orders
API Gateway -> Order Service: Create order
Order Service -> Product Catalog: Check inventory
Order Service -> Payment Service: Initiate payment
Payment Service -> Payment Gateway: Process payment
Payment Gateway -> Payment Service: Payment status
Payment Service -> Order Service: Payment result
Order Service -> Notification Service: Notify user
Order Service -> DB: Save order
Order Service -> Audit Service: Log action
```

### 4.2 Refund Processing
```
User -> API Gateway: POST /orders/:id/refund
API Gateway -> Order Service: Request refund
Order Service -> Payment Service: Initiate refund
Payment Service -> Payment Gateway: Process refund
Payment Gateway -> Payment Service: Refund status
Payment Service -> Order Service: Refund result
Order Service -> Notification Service: Notify user
Order Service -> DB: Update order/refund
Order Service -> Audit Service: Log action
```

---

## 5. Implementation Details

- **Microservices Deployment:** Each service containerized (Docker), orchestrated via Kubernetes, with horizontal scaling.
- **API Gateway:** NGINX/Envoy proxy, TLS 1.3 termination, JWT validation, rate limiting.
- **Database:** PostgreSQL with encryption at rest (AES-256), regular backups, audit trails.
- **Secrets Management:** HashiCorp Vault/AWS KMS for all sensitive credentials.
- **Monitoring:** Prometheus + Grafana dashboards, alerting on SLO/SLA breaches.
- **CI/CD:** GitHub Actions, automated tests, code scanning, vulnerability checks.
- **Compliance:** GDPR/CCPA policies enforced on all user data, with automated deletion/retention.
- **Accessibility:** WCAG 2.1 AA compliance validated via automated tools.
- **Logging:** Centralized ELK stack, role-based access to logs, real-time anomaly detection.

---

## 6. Security & Compliance Implementation

- **Input Validation:** All APIs use strict schema validation (Joi/Pydantic/Bean Validation).
- **Encryption:** AES-256 for all stored data, TLS 1.3 for all network traffic.
- **RBAC/ABAC:** Enforced at API and database layers, managed centrally.
- **Audit Logging:** Immutable logs for all sensitive operations, regular compliance reviews.
- **Fraud Detection:** Integration with external provider, real-time rules engine.
- **Data Lineage:** All data changes tracked, user-accessible consent and activity logs.
- **Secrets Management:** All credentials managed in Vault/KMS, never hardcoded.

---

## 7. Compliance Checklist
- [x] PCI DSS-compliant payments
- [x] GDPR/CCPA consent & data retention
- [x] AES-256 encryption at rest, TLS 1.3 in transit
- [x] RBAC/ABAC at all layers
- [x] Audit logging & reporting
- [x] WCAG 2.1 AA accessibility
- [x] Automated monitoring, alerting, and vulnerability scanning

---

## 8. Conclusion
This LLD ensures that all HLD requirements are addressed with detailed technical specifications, robust security, full compliance, and scalable, maintainable architecture for the Online Shopping Platform.
