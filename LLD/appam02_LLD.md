# Low-Level Design (LLD): Online Shopping Platform

## 1. Component Specifications

### 1.1 Authentication Service
- **Tech Stack**: Node.js, OAuth2, JWT
- **Endpoints**:
  - `/register`, `/login`, `/logout`, `/refresh-token`
- **Functions**:
  - User registration/login, input validation, JWT issuance/validation, password hashing (bcrypt), role-based checks
- **Security**:
  - TLS 1.3, AES-256 for sensitive data, brute-force protection, audit logging

### 1.2 Product Catalog Service
- **Tech Stack**: Python (FastAPI), PostgreSQL
- **Endpoints**:
  - `/products`, `/products/{id}`, `/search`, `/filter`
- **Functions**:
  - CRUD for products, search/filter, recommendation integration
- **Security**:
  - Input/output validation, RBAC for sellers/admins

### 1.3 Shopping Cart Service
- **Tech Stack**: Go, Redis
- **Endpoints**:
  - `/cart`, `/cart/items`, `/cart/checkout`
- **Functions**:
  - Cart CRUD, session handling, stock checks
- **Security**:
  - User authentication, audit logging

### 1.4 Order & Payment Service
- **Tech Stack**: Java (Spring Boot), MySQL
- **Endpoints**:
  - `/orders`, `/orders/{id}`, `/payments`, `/refunds`
- **Functions**:
  - Order placement, payment processing (PCI DSS), refund initiation
- **Security**:
  - Payment tokenization, circuit breaker for gateway, audit logging

### 1.5 Seller Management Service
- **Tech Stack**: Python (Django)
- **Endpoints**:
  - `/sellers`, `/sellers/products`, `/sellers/dashboard`
- **Functions**:
  - Seller onboarding, product management, dashboard widgets
- **Security**:
  - Role-based access, logging

### 1.6 Admin Dashboard Service
- **Tech Stack**: React, Node.js
- **Endpoints**:
  - `/admin`, `/admin/reports`, `/admin/logs`
- **Functions**:
  - Platform monitoring, compliance reporting, RBAC/ABAC
- **Security**:
  - Admin-only access, data lineage tracking

### 1.7 Notification Service
- **Tech Stack**: Node.js, RabbitMQ
- **Endpoints**:
  - `/notifications`
- **Functions**:
  - Email/SMS/push, batch sending, read tracking
- **Security**:
  - Consent management, audit logging

### 1.8 Review Service
- **Tech Stack**: Python (Flask)
- **Endpoints**:
  - `/reviews`, `/reviews/{id}`
- **Functions**:
  - Product reviews, rating aggregation
- **Security**:
  - User verification, anti-fraud

### 1.9 Compliance/Audit Service
- **Tech Stack**: Java, ELK Stack
- **Endpoints**:
  - `/audit`, `/compliance`
- **Functions**:
  - Logging, compliance reports, consent tracking
- **Security**:
  - Immutable logs, RBAC

### 1.10 Inventory Service
- **Tech Stack**: Go, PostgreSQL
- **Endpoints**:
  - `/inventory`, `/inventory/{id}`
- **Functions**:
  - Stock tracking, sync with orders
- **Security**:
  - Seller-only access


## 2. Data Flows

1. **User Registration/Login**: User submits credentials → Auth Service validates & issues JWT → Consent status stored.
2. **Product Search**: User queries catalog → Catalog Service returns filtered products.
3. **Add to Cart**: User adds product → Cart Service checks stock → Adds to user cart.
4. **Checkout**: User initiates checkout → Cart validated → Order created → Payment Service processes payment securely.
5. **Order Tracking**: User checks order → Order Service returns status → Notification sent.
6. **Refund**: User requests refund → Refund processed → Status updated.
7. **Seller/Admin Dashboards**: User accesses dashboard → Data aggregated from relevant services.


## 3. Sequence Diagrams (Textual)

### 3.1 Checkout Flow
- User → Cart Service: Initiate checkout
- Cart Service → Inventory Service: Verify stock
- Cart Service → Order Service: Create order
- Order Service → Payment Service: Process payment
- Payment Service → Order Service: Payment status
- Order Service → Notification Service: Notify user

### 3.2 Refund Flow
- User → Order Service: Request refund
- Order Service → Payment Service: Initiate refund
- Payment Service → Order Service: Refund status
- Order Service → Notification Service: Notify user


## 4. Implementation Details

- **Service-to-service authentication**: mTLS, JWT
- **API Gateway**: Centralized ingress, rate limiting, CORS
- **Database Encryption**: AES-256 at rest, keys in vault
- **CI/CD**: Automated pipelines, SAST/DAST scans, dependency checks
- **Monitoring**: Prometheus, Grafana, ELK for logs
- **Error Handling**: Retry, circuit breaker for payments, graceful degradation
- **Accessibility**: All UIs WCAG 2.1 AA compliant
- **Compliance**: PCI DSS for payments, audit logging, consent management

---

*This LLD is generated based on the HLD in branch `appam02` and covers all architectural components, requirements, and compliance mandates stated therein.*
