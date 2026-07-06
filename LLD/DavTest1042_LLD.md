# Low-Level Design (LLD) – Online Shopping Platform

## 1. Component Specifications

### 1.1 Frontend (Web Application)
- **Framework**: React (preferred) or Angular.
- **Role-based Views**: User, Seller, Admin dashboards.
- **Authentication**: JWT-based session management, MFA prompts on login.
- **State Management**: Redux/MobX for app state, Context API for auth.
- **API Integration**: Axios/Fetch with API Gateway, token refresh logic.
- **Accessibility**: WCAG 2.1 AA compliance, ARIA roles, color contrast checks.

### 1.2 API Gateway
- **Technology**: NGINX/Express.js API Gateway.
- **Responsibilities**: Routing, throttling, authentication (JWT), CORS, request logging.
- **Security**: Rate limiting, schema validation (OpenAPI), IP whitelisting for admin endpoints.

### 1.3 Authentication Service
- **Stack**: Node.js/Express, Passport.js, JWT, bcrypt for password hashing.
- **Features**:
  - Registration/login for all roles.
  - RBAC/ABAC enforcement middleware.
  - MFA via TOTP/email OTP.
  - Password reset (email link, expiring token).
  - Secure session token storage (httpOnly, SameSite cookies).

### 1.4 Catalog Service
- **Stack**: Node.js/Express, Sequelize ORM.
- **Endpoints**: Product search, filter, detail, inventory update.
- **Features**: Pagination, full-text search, category filter, image upload (to Object Storage).
- **Inventory Management**: Optimistic locking, stock threshold alerts.

### 1.5 Order Service
- **Stack**: Node.js/Express, Sequelize ORM.
- **Endpoints**: Cart management, checkout, order creation, refund initiation.
- **Features**: Atomic order placement, rollback on payment failure, order status tracking.
- **Cart**: Redis-backed session carts for performance.

### 1.6 Payment Service
- **Stack**: Node.js/Express, Stripe/PayPal SDKs.
- **Features**: PCI DSS-compliant tokenization, payment status polling, webhook handling.
- **Fraud Checks**: Velocity checks, IP/geolocation validation, 3DS support.

### 1.7 Notification Service
- **Stack**: Node.js, Nodemailer, Twilio SDK.
- **Features**: Email/push/SMS notifications, templated messages, retry queue (RabbitMQ).

### 1.8 Admin Service
- **Stack**: Node.js/Express, React Admin dashboard.
- **Features**: User/seller management, compliance reporting, audit log review.

### 1.9 Database Layer
- **Database**: PostgreSQL (preferred) or MySQL.
- **Security**: AES-256 encryption at rest, row-level security, audit triggers.
- **Backup**: Nightly backups, PITR enabled.

### 1.10 Object Storage
- **Provider**: AWS S3/Azure Blob.
- **Usage**: Product images, KYC documents, with signed URLs for access.

### 1.11 Monitoring & Logging
- **Stack**: ELK (Elasticsearch, Logstash, Kibana), Prometheus, Grafana.
- **Features**: Centralized logging, alerting on error spikes, compliance dashboards.


## 2. Data Flows

### 2.1 User Registration/Login
1. User submits registration/login via frontend.
2. API Gateway routes to Auth Service.
3. Auth Service validates, issues JWT, records audit log.
4. JWT sent to frontend, stored in httpOnly cookie.

### 2.2 Product Browsing/Search
1. User queries frontend (search/filter).
2. Frontend calls API Gateway → Catalog Service.
3. Catalog Service queries DB, returns paginated results.

### 2.3 Cart & Checkout
1. User adds items to cart (frontend → API Gateway → Order Service).
2. Cart stored in Redis (session cart) or DB (persistent cart).
3. On checkout, Order Service validates stock, locks inventory.
4. Order Service calls Payment Service for payment initiation.
5. On payment success, order persisted, notification sent.
6. On failure, rollback and user notified.

### 2.4 Payment Processing
1. Order Service sends payment request to Payment Service.
2. Payment Service tokenizes card details, calls external gateway (Stripe/PayPal).
3. Payment status (success/failure) received via webhook.
4. Payment result updated in DB, audit log created.

### 2.5 Notifications
1. Order/Payment/Refund events trigger Notification Service.
2. Service sends email/SMS/push as appropriate.

### 2.6 Admin Operations
1. Admin logs in, accesses dashboards.
2. Admin Service fetches metrics, logs, compliance data from DB/log store.


## 3. Sequence Diagrams (Textual)

### 3.1 User Registration
```plaintext
User → Frontend: Enter registration details
Frontend → API Gateway: POST /register
API Gateway → Auth Service: POST /register
Auth Service → DB: Create user, hash password
Auth Service → API Gateway: JWT token
API Gateway → Frontend: JWT token
```

### 3.2 Product Purchase
```plaintext
User → Frontend: Add to cart
Frontend → API Gateway: POST /cart
API Gateway → Order Service: Add item
Order Service → Redis/DB: Store cart item
User → Frontend: Checkout
Frontend → API Gateway: POST /checkout
API Gateway → Order Service: Create order
Order Service → Payment Service: Initiate payment
Payment Service → Payment Gateway: Process payment
Payment Gateway → Payment Service: Webhook (status)
Payment Service → Order Service: Update status
Order Service → DB: Persist order
Order Service → Notification Service: Notify user
Notification Service → Email/SMS: Send notification
```


## 4. Implementation Details

### 4.1 Security
- All endpoints: Input validation (Joi/express-validator), output sanitization.
- JWT tokens: Expiry, rotation, blacklist on logout.
- Passwords: bcrypt (min 12 rounds), password policy enforced.
- TLS 1.3 enforced for all traffic.
- PCI DSS: Payment data never stored, only tokens.
- GDPR/CCPA: Consent banner, data export/delete APIs, audit trails.
- Secrets in Vault/managed secrets store, rotated quarterly.
- Audit logging: All sensitive actions, access attempts.

### 4.2 Compliance
- Data retention: 7 years for transactions, 1 year for logs.
- Consent management: User portal for data rights.
- Compliance dashboards: Admin access only.
- Regular vulnerability scans, penetration testing.

### 4.3 Error Handling
- Retry logic: Exponential backoff for payment/API failures.
- Circuit breakers: Open on external dependency failure.
- Graceful degradation: Fallback UIs, error banners.
- Centralized error logging, alerting on critical failures.

### 4.4 Scalability & Reliability
- API stateless, horizontal scaling (Kubernetes/containers).
- Redis for session/cart caching.
- Load balancer: HAProxy/ALB for frontend/API.
- DB replication, failover setup, PITR.
- Object Storage: Multi-region replication.

### 4.5 Monitoring
- Metrics: API latency, error rate, order/payment volumes.
- Alerts: Slack/email on error spikes, failed payments, suspicious logins.
- Dashboards: Grafana/Kibana for ops/admins.


## 5. Compliance Mapping

| Requirement                   | LLD Coverage                                              |
|-------------------------------|----------------------------------------------------------|
| Registration/Login            | Auth Service, JWT, MFA, audit logs                       |
| Product Catalog/Search/Filter | Catalog Service, API endpoints, pagination               |
| Shopping Cart                 | Order Service, Redis/DB, session management              |
| Secure Checkout               | Order/Payment Service, PCI DSS, rollback on failure      |
| Order Tracking                | Order Service, status updates, notifications             |
| RBAC                          | Auth Service, middleware, role checks                    |
| Seller/Admin Dashboards       | Admin Service, React Admin, compliance reporting         |
| Notifications                 | Notification Service, templated emails/SMS               |
| Multiple Payment Methods      | Payment Service, Stripe/PayPal SDKs                      |
| Reviews/Refunds               | Order Service, endpoints, audit logs                     |
| Recommendations/Wishlist      | Extensible endpoints, DB schema                          |
| Logistics Integration         | API, future extensibility                                |
| Input validation/output filter| Joi/express-validator, output sanitization               |
| Encryption (AES-256/TLS 1.3)  | DB encryption, TLS, at-rest/in-transit coverage          |
| PCI DSS payment compliance    | Tokenization, gateway integration, no card storage       |
| RBAC/ABAC                     | Middleware, endpoint protection                          |
| Audit logging                 | Centralized, all sensitive ops                           |
| Secrets management            | Vault, quarterly rotation                                |
| Data retention, consent mgmt  | Retention policy, user portal, GDPR/CCPA APIs            |
| Compliance reporting          | Admin dashboards, logs                                   |
| Error handling                | Retry, circuit breaker, alerting                         |

---

# End of LLD
