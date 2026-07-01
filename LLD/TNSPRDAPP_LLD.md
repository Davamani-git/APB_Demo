# Low-Level Design (LLD): Online Shopping Platform – TNSPRDAPP

## 1. Component Specifications

### 1.1 Authentication Service
- **Responsibilities:** Registration, login, RBAC/ABAC enforcement, consent capture, password management
- **Endpoints:**
  - POST /register
  - POST /login
  - GET /user/profile
  - POST /user/consent
- **Security:**
  - Passwords hashed (bcrypt, salt)
  - JWT tokens for authentication, refresh tokens
  - Input validation, rate limiting, audit logging
- **Data:**
  - User (user_id, email, password_hash, role, consent_status, profile)

### 1.2 Catalog Service
- **Responsibilities:** Product management, search, filter
- **Endpoints:**
  - GET /products
  - GET /products/{id}
  - POST /products (seller)
  - PUT /products/{id} (seller)
- **Data:**
  - Product (product_id, seller_id, name, description, price, category, inventory_count)
- **Features:**
  - Full-text search, category filtering
  - Caching (Redis)

### 1.3 Cart Service
- **Responsibilities:** Cart creation, item management, session tracking
- **Endpoints:**
  - GET /cart
  - POST /cart/items
  - PUT /cart/items/{id}
  - DELETE /cart/items/{id}
- **Data:**
  - Cart (cart_id, user_id, items, status)
  - CartItem (cart_item_id, cart_id, product_id, quantity, price)
- **Features:**
  - Session-based or persistent carts

### 1.4 Checkout Service
- **Responsibilities:** Secure checkout, address validation
- **Endpoints:**
  - POST /checkout
  - POST /checkout/address/validate
- **Security:**
  - PCI DSS compliance, address validation APIs

### 1.5 Order Service
- **Responsibilities:** Order creation, tracking, refunds
- **Endpoints:**
  - POST /orders
  - GET /orders/{id}
  - POST /orders/{id}/refund
- **Data:**
  - Order (order_id, user_id, cart_id, status, payment_id, shipping_address, placed_at)

### 1.6 Payment Service
- **Responsibilities:** Payment processing, fraud detection
- **Endpoints:**
  - POST /payments
  - GET /payments/{id}
- **Integration:**
  - Stripe/PayPal APIs
- **Security:**
  - AES-256 encryption at rest, TLS 1.3 in transit
  - PCI DSS compliance
- **Data:**
  - Payment (payment_id, order_id, method, status, amount, transaction_ref)

### 1.7 Review Service
- **Responsibilities:** Product reviews
- **Endpoints:**
  - POST /products/{id}/reviews
  - GET /products/{id}/reviews
- **Data:**
  - Review (review_id, product_id, user_id, rating, comment, created_at)

### 1.8 Notification Service
- **Responsibilities:** Email/SMS/push notifications
- **Endpoints:**
  - POST /notifications
- **Integration:**
  - Email/SMS providers
- **Data:**
  - Notification (notification_id, user_id, type, content, sent_at)

### 1.9 Dashboard Service
- **Responsibilities:** Seller/admin dashboards, metrics
- **Endpoints:**
  - GET /dashboard
- **Data:**
  - Dashboard (dashboard_id, user_id, role, metrics)

## 2. Data Flows

### 2.1 User Journey
1. **Registration/Login:** User registers or logs in. Consent status is recorded.
2. **Product Search:** User searches and filters the catalog. Product data is cached.
3. **Cart Management:** User adds/removes items to/from cart. Cart is session-based or persistent.
4. **Checkout:** User proceeds to checkout, enters/validates address. Payment details are securely handled.
5. **Order Processing:** Upon payment success, order is created, tracked, and notification is sent.
6. **Review/Feedback:** User can review purchased products.
7. **Seller/Admin:** Access dashboards for analytics and management.

### 2.2 System Interactions
- API Gateway routes all requests to appropriate services
- Services communicate via REST APIs (internal/external)
- Database writes/reads for transactional data (PostgreSQL)
- Caching via Redis for catalog and session data
- Object storage (S3) for images/assets

## 3. Sequence Diagrams

### 3.1 Checkout and Payment Sequence
```
User -> Frontend: Initiates checkout
Frontend -> API Gateway: POST /checkout
API Gateway -> Checkout Service: Validate cart, address
Checkout Service -> Payment Service: Initiate payment
Payment Service -> Payment Gateway (Stripe/PayPal): Process payment
Payment Gateway -> Payment Service: Payment status
Payment Service -> Order Service: Create order
Order Service -> Notification Service: Send order confirmation
Notification Service -> User: Email/SMS confirmation
```

### 3.2 Product Search Sequence
```
User -> Frontend: Search for product
Frontend -> API Gateway: GET /products?search=...
API Gateway -> Catalog Service: Query/search
Catalog Service -> Redis: Cache lookup
Redis -> Catalog Service: Cache hit/miss
Catalog Service -> Database: Query if cache miss
Catalog Service -> API Gateway: Return results
API Gateway -> Frontend: Return products
```

## 4. Implementation Details

- **Languages:** Node.js/Python for backend microservices; React/Vue for frontend
- **Database:** PostgreSQL (transactional), Redis (cache/session), S3 (assets)
- **API Gateway:** NGINX/Kong, enforcing rate limiting, authentication, and logging
- **Security:**
  - Input validation (server/client)
  - Output filtering
  - AES-256 encryption at rest, TLS 1.3 in transit
  - RBAC/ABAC at gateway and services
  - Audit logging for all critical actions
  - Secrets managed via Vault/cloud secret manager
- **Compliance:**
  - PCI DSS for payment
  - GDPR/CCPA for data privacy
  - WCAG 2.1 AA for accessibility
- **Error Handling:**
  - Retry logic for transient errors (payments, external APIs)
  - Circuit breakers for payment/logistics APIs
  - Centralized logging and alerting (ELK stack, cloud monitoring)
- **Deployment:**
  - Docker containers, orchestrated by Kubernetes
  - CI/CD via GitHub Actions, with automated tests and security scans

## 5. Compliance and Security
- PCI DSS for payment data
- GDPR/CCPA for user data
- Audit logs, consent management, and data retention
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Accessibility: WCAG 2.1 AA compliance

## 6. Appendix
- **Sample Audit Log Schema:** { event_id, user_id, action, timestamp, details }
- **Consent Tracking Workflow:** User consent recorded at registration and checkout
- **Data Retention:** Orders and user data retained per regulatory requirements; deletion on request

---

*This LLD is auto-generated from the HLD "TNSPRDAPP_HLD.md" in compliance with security and documentation standards.*
