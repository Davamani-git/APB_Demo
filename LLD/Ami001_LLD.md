# Low-Level Design (LLD) for Online Shopping Platform (Ami001)

---

## 1. Component Specifications

### 1.1 Authentication Service
- **Purpose**: User registration, login, JWT issuance, OAuth2 integration, RBAC enforcement.
- **Endpoints**:
  - POST /register, /login, /logout
  - GET /profile
  - POST /token/refresh
- **Data**: User (user_id, name, email, password_hash, role, timestamps)
- **Security**: AES-256 for password storage, JWT signing, OAuth2 flows, input validation, audit logging.

### 1.2 Catalog Service
- **Purpose**: Product, Category, Search, Filter management.
- **Endpoints**:
  - GET /products, /products/:id
  - GET /categories
  - GET /products/search?query=...
- **Data**: Product, Category, Review
- **Security**: Output sanitization, RBAC for management APIs.

### 1.3 Cart & Checkout Service
- **Purpose**: Cart operations, order placement, payment processing.
- **Endpoints**:
  - GET/POST /cart
  - POST /checkout
  - GET /orders, /orders/:id
- **Data**: Cart, CartItem, Order, OrderItem, Payment
- **Security**: PCI DSS compliance, input validation, circuit breaker for payment API.

### 1.4 Dashboard Service
- **Purpose**: Seller/Admin dashboards, analytics, BI.
- **Endpoints**:
  - GET /dashboard
- **Data**: Dashboard, User, Product, Order
- **Security**: RBAC/ABAC, audit logging.

### 1.5 Notification Service
- **Purpose**: Email/SMS/push notifications.
- **Endpoints**:
  - POST /notify
- **Data**: Notification
- **Security**: Output filtering, retries, logging.

### 1.6 Review & Refund Service
- **Purpose**: Manage reviews and refunds.
- **Endpoints**:
  - POST /products/:id/review
  - POST /orders/:id/refund
- **Data**: Review, Refund
- **Security**: Input validation, RBAC, audit logging.

### 1.7 Audit Logging & Monitoring
- **Purpose**: Track user actions, payment, order, refund events.
- **Data**: AuditLog
- **Security**: Centralized logging, compliance reporting, alerting.

---

## 2. Data Flows

### 2.1 User Registration & Login
```
User → Frontend → Auth Service → DB (User)
```
- On registration/login, input validated, password hashed, JWT returned.
- Audit log created for each action.

### 2.2 Product Search & View
```
User → Frontend → Catalog Service → DB (Product, Category)
```
- User queries/searches, service returns sanitized results.

### 2.3 Cart Operations
```
User → Frontend → Cart Service → DB (Cart, CartItem)
```
- Add/remove/update cart items, actions logged.

### 2.4 Checkout & Payment
```
User → Frontend → Checkout Service → Payment Processor → Order Service → DB (Order, Payment)
```
- Payment processed via PCI DSS-compliant integration, order confirmed, notifications sent.

### 2.5 Review & Refund
```
User → Frontend → Review/Refund Service → DB (Review, Refund)
```
- Reviews/refunds validated and logged.

---

## 3. Sequence Diagrams (Text)

### 3.1 Checkout Sequence
```
User → Frontend → Cart Service: Initiate checkout
Cart Service → Order Service: Create order
Order Service → Payment Service: Process payment
Payment Service → Payment Processor: External payment
Payment Processor → Payment Service: Payment status
Payment Service → Order Service: Confirm payment
Order Service → Notification Service: Send confirmation
Notification Service → User: Notify
```

### 3.2 Review Submission
```
User → Frontend → Review Service: Submit review
Review Service → DB: Persist review
Review Service → Notification Service: Notify seller
Notification Service → Seller: Notify
```

---

## 4. Implementation Details

- **Language/Frameworks**: Backend (Node.js/Python/Java with REST/GraphQL), Frontend (React/Vue), Containerized (Docker, Kubernetes)
- **Database**: PostgreSQL/MySQL for core data, Redis for sessions/cache
- **Security**: AES-256 for data at rest, TLS 1.3 for transit, RBAC/ABAC, secrets in Vault
- **Compliance**: PCI DSS for payments, GDPR/CCPA for data retention, consent management
- **Monitoring**: Centralized logging (ELK/Prometheus/Grafana), alerting, compliance exports
- **Error Handling**: Retries, circuit breakers, fallback responses, audit logs for all critical actions
- **DevOps**: CI/CD pipelines, IaC for infrastructure, automated compliance scans

---

## 5. Compliance & Security

- **Input/Output Filtering**: All APIs enforce validation/sanitization
- **Encryption**: Data at rest (AES-256), in transit (TLS 1.3)
- **RBAC/ABAC**: Enforced at gateway and service layers
- **Audit Logging**: All critical actions logged
- **Secrets Management**: Vault/Key Management for credentials
- **Data Retention & Consent**: Configurable policies, user opt-in/out, logs
- **Data Lineage**: Tracked for order, payment, refund flows
- **Compliance Reporting**: Automated audit log exports

---

## 6. Traceability Matrix

| HLD Requirement                  | LLD Implementation Detail                          |
|----------------------------------|---------------------------------------------------|
| User registration/authentication | Auth Service, input validation, audit logging      |
| Product catalog/search/filter    | Catalog Service, output filtering                  |
| Cart/checkout/payment            | Cart/Checkout Service, PCI DSS, circuit breaker    |
| Seller/admin dashboards          | Dashboard Service, RBAC, audit logging             |
| Notifications                    | Notification Service, retries, logging             |
| Reviews/refunds                  | Review/Refund Service, validation, logging         |
| Security/compliance              | Input/output filtering, encryption, RBAC/ABAC      |
| Audit logging                    | Centralized logging, compliance reporting          |
| Data retention/consent           | Policy config, consent management, logs            |
| Error handling                   | Retries, circuit breaker, fallback, logs           |

---

*This LLD is generated for branch Ami001 as per HLD and compliance requirements.*
