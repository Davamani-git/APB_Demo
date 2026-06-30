# Low-Level Design (LLD) for APBNN1

## 1. Component Specifications

### 1.1 User Service
- **Responsibilities:** Registration, authentication, RBAC, profile management
- **Endpoints:**
  - POST /users/register
  - POST /users/login
  - GET /users/{id}
  - PATCH /users/{id}
- **Data:** User, Profile, AuditLog
- **Security:** OAuth2, input validation, password hashing (bcrypt), JWT, TLS 1.3
- **Storage:** PostgreSQL (users, profiles), AuditLog table

### 1.2 Catalog Service
- **Responsibilities:** Product CRUD, search, filtering, catalog management
- **Endpoints:**
  - GET /products
  - POST /products
  - GET /products/{id}
  - PATCH /products/{id}
  - DELETE /products/{id}
- **Data:** Product, Catalog, AuditLog
- **Security:** RBAC, input validation, output encoding
- **Storage:** PostgreSQL/NoSQL (products, catalogs)

### 1.3 Cart Service
- **Responsibilities:** Cart management, session persistence
- **Endpoints:**
  - GET /cart
  - POST /cart/items
  - PATCH /cart/items/{id}
  - DELETE /cart/items/{id}
- **Data:** Cart, CartItem
- **Security:** User authentication, input validation
- **Storage:** PostgreSQL (cart, cart_items)

### 1.4 Order Service
- **Responsibilities:** Order placement, tracking, order items, status updates
- **Endpoints:**
  - POST /orders
  - GET /orders/{id}
  - PATCH /orders/{id}
- **Data:** Order, OrderItem, AuditLog
- **Security:** RBAC, idempotency, TLS 1.3
- **Storage:** PostgreSQL (orders, order_items)

### 1.5 Payment Service
- **Responsibilities:** Payment processing, PCI DSS compliance, fraud detection
- **Endpoints:**
  - POST /payments
  - GET /payments/{id}
- **Data:** Payment, Refund
- **Security:** PCI DSS, external gateway integration, anomaly monitoring
- **Storage:** PostgreSQL (payments, refunds)

### 1.6 Notification Service
- **Responsibilities:** Email/SMS/push notifications
- **Endpoints:**
  - POST /notifications
  - GET /notifications/{user_id}
- **Data:** Notification
- **Security:** Output encoding, user validation
- **Storage:** PostgreSQL (notifications)

### 1.7 Review/Refund Service
- **Responsibilities:** Reviews, refund processing
- **Endpoints:**
  - POST /reviews
  - GET /reviews/{product_id}
  - POST /refunds
  - GET /refunds/{order_id}
- **Data:** Review, Refund
- **Security:** RBAC, input validation
- **Storage:** PostgreSQL (reviews, refunds)

### 1.8 Dashboard Service
- **Responsibilities:** Analytics for sellers/admins
- **Endpoints:**
  - GET /dashboard/{user_id}
- **Data:** Dashboard
- **Security:** RBAC, data privacy
- **Storage:** PostgreSQL (dashboards)

### 1.9 Audit Logging Service
- **Responsibilities:** Track all critical actions
- **Endpoints:**
  - POST /auditlog
  - GET /auditlog/{entity_type}/{entity_id}
- **Data:** AuditLog
- **Security:** Access control, log integrity
- **Storage:** PostgreSQL (audit_logs)


## 2. Data Flows
- **User Registration/Login:**
  1. User submits registration/login via Web Frontend.
  2. API Gateway forwards to User Service.
  3. User Service validates, persists, and returns tokens.
  4. AuditLog entry created.
- **Product Browsing:**
  1. User requests products via API Gateway.
  2. Catalog Service queries DB, applies filters, returns results.
- **Cart Operations:**
  1. User adds/updates/removes items.
  2. Cart Service updates cart, persists changes.
- **Checkout:**
  1. User places order via Cart.
  2. Order Service creates order, triggers Payment Service.
  3. Payment processed, notification sent, AuditLog updated.
- **Order Tracking:**
  1. User requests order status.
  2. Order Service fetches status, returns to user.
- **Review/Refund:**
  1. User submits review/refund.
  2. Review/Refund Service validates, stores, triggers notification if needed.
- **Dashboards:**
  1. Seller/admin requests dashboard data.
  2. Dashboard Service aggregates and returns analytics.


## 3. Sequence Diagrams (Textual)

### 3.1 Registration Sequence
1. Web Frontend → API Gateway: POST /users/register
2. API Gateway → User Service: Validate & create user
3. User Service → DB: Persist user, profile
4. User Service → Audit Logging Service: Log registration
5. User Service → API Gateway → Web Frontend: Success token

### 3.2 Checkout Sequence
1. Web Frontend → API Gateway: POST /orders
2. API Gateway → Order Service: Create order
3. Order Service → Payment Service: Initiate payment
4. Payment Service → Payment Gateway: Process payment
5. Payment Service → Order Service: Payment result
6. Order Service → Notification Service: Send confirmation
7. Order Service → Audit Logging Service: Log order
8. Order Service → API Gateway → Web Frontend: Order confirmation


## 4. Implementation Details
- **Tech Stack:** React/Angular (frontend), Node.js/Java/Python (services), PostgreSQL/NoSQL, OAuth2, JWT, TLS 1.3
- **Security:** Input validation, output encoding, RBAC/ABAC, encryption at rest and in transit, secrets management, audit logging
- **Compliance:** PCI DSS for payments, privacy regulations, data retention, consent management
- **Error Handling:** Retries, idempotency, circuit breakers, detailed logging
- **Deployment:** Dockerized microservices, orchestrated via Kubernetes, CI/CD pipelines, IaC for cloud provisioning
- **Monitoring:** Centralized logging (ELK), anomaly detection, alerting, dashboards (Prometheus/Grafana)
