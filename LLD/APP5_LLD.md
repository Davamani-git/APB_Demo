# Low-Level Design (LLD) for APP5

## 1. Component Specifications

### 1.1 User Service
- **Responsibilities:**
  - User registration, authentication, profile management
  - Role-based (RBAC) and attribute-based (ABAC) access control
  - Audit logging for privileged actions
- **Endpoints:**
  - POST /users/register
  - POST /users/login
  - GET /users/{id}
  - PUT /users/{id}/profile
- **Data Model:** User (user_id, email, password_hash, role, profile_info, registration_date)
- **Security:** Password hashing (bcrypt), JWT/OAuth2 tokens, input validation

### 1.2 Catalog Service
- **Responsibilities:**
  - Product CRUD, search, filter, recommendations
  - Inventory management
- **Endpoints:**
  - GET /products
  - GET /products/{id}
  - POST /products
  - PUT /products/{id}
  - DELETE /products/{id}
- **Data Model:** Product (product_id, name, description, price, category, inventory_count, seller_id)
- **Security:** Input/output validation, RBAC for sellers/admins

### 1.3 Order Service
- **Responsibilities:**
  - Shopping cart, checkout, order processing, refunds
- **Endpoints:**
  - GET /orders
  - POST /orders
  - GET /orders/{id}
  - POST /orders/{id}/refund
- **Data Model:** Order (order_id, user_id, product_id, order_date, status, payment_id, shipping_info)
- **Security:** Input validation, audit logging

### 1.4 Payment Service
- **Responsibilities:**
  - Payment initiation, status tracking, refunds
  - PCI DSS compliance
- **Endpoints:**
  - POST /payments
  - GET /payments/{id}
  - POST /payments/{id}/refund
- **Data Model:** Payment (payment_id, order_id, amount, method, status, transaction_date)
- **Security:** AES-256 encryption for sensitive data, TLS 1.3, vault-based secrets management

### 1.5 Notification Service
- **Responsibilities:**
  - Real-time and asynchronous notifications via Email/SMS
- **Endpoints:**
  - POST /notifications
  - GET /notifications/{user_id}
- **Data Model:** Notification (notification_id, user_id, message, sent_at, status)
- **Security:** Output filtering, consent management

### 1.6 Review Service
- **Responsibilities:**
  - Product reviews CRUD, moderation
- **Endpoints:**
  - GET /reviews
  - POST /reviews
  - PUT /reviews/{id}
  - DELETE /reviews/{id}
- **Data Model:** Review (review_id, user_id, product_id, rating, comment, created_at)
- **Security:** Input validation, moderation logging

### 1.7 Dashboard Service
- **Responsibilities:**
  - Metrics aggregation for users, sellers, admins
  - Role-based dashboard views
- **Endpoints:**
  - GET /dashboard/user/{id}
  - GET /dashboard/seller/{id}
  - GET /dashboard/admin/{id}
- **Data Model:** Dashboard (dashboard_id, user_id/seller_id/admin_id, metrics, access_level)

## 2. Data Flows

### 2.1 User Registration and Authentication
1. User submits registration/login request (frontend → API Gateway → User Service)
2. User Service validates input, hashes password, stores/validates credentials
3. On success, returns JWT token

### 2.2 Product Purchase Flow
1. User adds product to cart (frontend → API Gateway → Order Service)
2. Order Service updates ShoppingCart (persistent/session-based)
3. User initiates checkout (Order Service validates cart, calls Payment Service)
4. Payment Service processes payment (PCI DSS, TLS 1.3)
5. On success, Order Service creates Order, updates inventory (Catalog Service)
6. Notification Service sends confirmation

### 2.3 Review Submission
1. User submits review (frontend → API Gateway → Review Service)
2. Review Service validates, stores, and optionally triggers moderation

### 2.4 Refund Request
1. User requests refund (frontend → API Gateway → Order Service)
2. Order Service validates, calls Payment Service for refund
3. Refund status tracked, Notification sent

## 3. Sequence Diagrams (Textual)

### 3.1 Checkout Sequence
```
User → Frontend: Add to Cart
Frontend → API Gateway: POST /cart
API Gateway → Order Service: Update Cart
User → Frontend: Checkout
Frontend → API Gateway: POST /orders
API Gateway → Order Service: Create Order
Order Service → Payment Service: Initiate Payment
Payment Service → Payment Gateway: Process Payment
Payment Gateway → Payment Service: Payment Status
Payment Service → Order Service: Payment Confirmation
Order Service → Catalog Service: Update Inventory
Order Service → Notification Service: Send Confirmation
```

### 3.2 Refund Sequence
```
User → Frontend: Request Refund
Frontend → API Gateway: POST /orders/{id}/refund
API Gateway → Order Service: Process Refund
Order Service → Payment Service: Initiate Refund
Payment Service → Payment Gateway: Refund Transaction
Payment Gateway → Payment Service: Refund Status
Payment Service → Order Service: Refund Confirmation
Order Service → Notification Service: Notify User
```

## 4. Implementation Details

- **Microservices:** Dockerized, deployed via Kubernetes, stateless services with persistent storage for stateful data (users, orders, products, payments)
- **API Gateway:** NGINX or AWS API Gateway for routing, rate limiting, request validation
- **Database:** PostgreSQL/MySQL, encrypted volumes, regular backups
- **Authentication:** JWT tokens, OAuth2 for third-party integrations
- **CI/CD:** GitHub Actions for build/test/deploy, IaC for infrastructure (Terraform)
- **Logging/Monitoring:** ELK stack, Prometheus/Grafana, SIEM integration for security events
- **Error Handling:** Retry logic, circuit breaker patterns, graceful degradation
- **Compliance:** PCI DSS for payments, audit logging, consent management, data retention workflows
- **Accessibility:** WCAG 2.1 AA compliance for frontend

## 5. Security and Compliance
- Input validation, output filtering (OWASP)
- AES-256 encryption at rest, TLS 1.3 in transit
- RBAC/ABAC for all endpoints
- Vault-based secrets management
- PCI DSS compliance for payment processing
- Audit logs for all privileged actions
- Data retention and deletion workflows
- Accessibility compliance

## 6. Compliance Checklist
- [x] Registration, authentication, profile updates
- [x] Product catalog, search/filter
- [x] Shopping cart, checkout, order tracking
- [x] RBAC for seller/admin
- [x] Notifications, reviews, refunds
- [x] Dashboards
- [x] Payment gateway, PCI DSS, fraud detection
- [x] Accessibility
- [x] Performance, scalability, availability
- [x] Encryption, TLS, PCI DSS, audit logging
- [x] Data retention, consent management, data lineage
- [x] Retries, logging, circuit breaker, graceful failures
