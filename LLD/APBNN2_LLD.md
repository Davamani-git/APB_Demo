# Low-Level Design (LLD) for Online Shopping Platform

## 1. Component Specifications

### 1.1 User Service
- **Responsibilities:** Registration, login, profile management, RBAC
- **Endpoints:**
  - POST /users/register
  - POST /users/login
  - GET/PUT /users/profile
- **Implementation:** Node.js REST API, JWT authentication, bcrypt password hashing
- **Data Access:** PostgreSQL (User, Profile, Role tables)
- **Security:** Input validation, RBAC, audit logging

### 1.2 Catalog Service
- **Responsibilities:** Product search, filter, recommendations
- **Endpoints:**
  - GET /products
  - GET /products/:id
  - GET /products/search
- **Implementation:** Node.js/Java microservice, Redis caching for search/filter
- **Data Access:** PostgreSQL (Product table), Redis (cache)
- **Security:** Output filtering, audit logging

### 1.3 Cart Service
- **Responsibilities:** Cart operations, wishlist management
- **Endpoints:**
  - GET/POST/PUT/DELETE /cart
  - GET/POST/DELETE /wishlist
- **Implementation:** Node.js microservice
- **Data Access:** PostgreSQL (Cart table)
- **Security:** JWT authentication, audit logging

### 1.4 Order Service
- **Responsibilities:** Checkout, order tracking, refunds
- **Endpoints:**
  - POST /orders
  - GET /orders/:id
  - POST /orders/refund
- **Implementation:** Java/Spring Boot microservice
- **Data Access:** PostgreSQL (Order table)
- **Security:** PCI DSS, audit logging

### 1.5 Payment Service
- **Responsibilities:** Payment processing, PCI DSS compliance
- **Endpoints:**
  - POST /payments
  - GET /payments/:id
- **Implementation:** Node.js microservice, Stripe/PayPal integration
- **Data Access:** PostgreSQL (Payment table)
- **Security:** AES-256 encryption, TLS 1.3, Vault/KMS secrets

### 1.6 Notification Service
- **Responsibilities:** Alerts, status updates (Email/SMS)
- **Endpoints:**
  - POST /notifications
  - GET /notifications/:userId
- **Implementation:** Node.js microservice, integration with email/SMS gateways
- **Data Access:** PostgreSQL (Notification table)

### 1.7 Review Service
- **Responsibilities:** Ratings, comments
- **Endpoints:**
  - POST /reviews
  - GET /reviews/:productId
- **Implementation:** Node.js microservice
- **Data Access:** PostgreSQL (Review table)

### 1.8 Admin Service
- **Responsibilities:** Seller/product management, compliance reporting
- **Endpoints:**
  - GET/PUT /admin/sellers
  - GET/PUT /admin/products
  - GET /admin/compliance
- **Implementation:** Node.js/Java microservice
- **Data Access:** PostgreSQL (Seller, Product tables)
- **Security:** RBAC, audit logging

---

## 2. Data Flows

### Registration/Login
- User submits registration/login request → User Service → DB
- JWT issued on successful login

### Product Search
- User searches → Catalog Service → DB/Redis cache → Results

### Add to Cart
- User adds product → Cart Service → DB

### Checkout
- User checks out → Order Service → Payment Service → Notification Service

### Order Tracking/Refunds
- User checks order/refund status → Order Service → Notification/Payment Service

### Admin Operations
- Admin accesses dashboard → Admin Service → DB/Reporting

---

## 3. Sequence Diagrams (Textual)

### 3.1 User Registration
```
User → User Service: Register
User Service → DB: Insert user
DB → User Service: Success
User Service → User: JWT issued
```

### 3.2 Product Search
```
User → Catalog Service: Search products
Catalog Service → Redis: Query cache
Catalog Service → DB: Query products
DB → Catalog Service: Product data
Catalog Service → User: Results
```

### 3.3 Checkout
```
User → Cart Service: Get cart
Cart Service → Order Service: Initiate order
Order Service → Payment Service: Process payment
Payment Service → External Provider (Stripe/PayPal): Payment
Payment Service → Order Service: Payment status
Order Service → Notification Service: Notify user
Notification Service → User: Order status
```

---

## 4. Implementation Details

- **Microservice Deployment:** Docker containers, orchestrated via Kubernetes
- **API Gateway:** NGINX or AWS API Gateway, circuit breaker, throttling
- **Database:** PostgreSQL schema with normalized tables for all entities
- **Caching:** Redis for frequently accessed data (product search/filter)
- **Authentication:** OAuth 2.0, JWT, RBAC/ABAC
- **Encryption:** AES-256 (data at rest), TLS 1.3 (data in transit)
- **Secrets Management:** Vault/Cloud KMS
- **Audit Logging:** ELK/Splunk, centralized
- **Compliance:** PCI DSS, consent management, data lineage, retention policies
- **Error Handling:** Circuit breaker, retries, logging at critical points

---

## 5. Compliance & Security

- PCI DSS for payments
- AES-256, TLS 1.3 for encryption
- RBAC/ABAC for access control
- Audit logging at all critical operations
- Secrets stored in Vault/KMS
- Consent management, data retention, lineage tracking
- Compliance dashboard for admin

---

## 6. Diagram Placeholder

```
Frontend (React/Angular)
   |
API Gateway (NGINX/AWS)
   |
Backend Microservices (User, Catalog, Cart, Order, Payment, Notification, Review, Admin)
   |
PostgreSQL (DB) / Redis (Cache)
   |
External Integrations (Stripe/PayPal, Email/SMS)
```

---

**End of LLD Document**
