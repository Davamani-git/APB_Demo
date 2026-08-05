# Low-Level Design (LLD) – Online Shopping Platform

## Component Specifications

### 1. Authentication Service
- **Framework:** Node.js/Express with JWT/OAuth2
- **Endpoints:** `/register`, `/login`, `/logout`, `/refresh-token`
- **RBAC/ABAC:** Role-based and attribute-based access enforced at middleware level
- **Password Hashing:** bcrypt/argon2
- **Session Management:** Stateless (JWT); refresh tokens stored in Redis
- **Admin Actions:** ABAC checks for privilege validation
- **Audit Logging:** All authentication events logged

### 2. Product Catalog Service
- **Framework:** Spring Boot (Java)
- **Endpoints:** `/products`, `/catalog`, `/search`, `/filter`, `/recommendations`
- **Database:** PostgreSQL (products, catalogs), Redis (caching)
- **Featured Flag:** Boolean for catalog items
- **Recommendations:** ML-driven, fallback to rule-based
- **Search:** Full-text, category and price filters

### 3. Cart/Order Service
- **Framework:** Python (FastAPI)
- **Endpoints:** `/cart`, `/cart/items`, `/order`, `/order/items`, `/order/track`
- **Atomic Transactions:** ACID guarantees via DB transactions
- **Order Tracking:** Status updates, notifications

### 4. Payment Service
- **Framework:** Java (Spring Boot)
- **Endpoints:** `/pay`, `/refund`, `/payment/status`
- **PCI DSS:** Tokenization, no card data stored
- **Integrations:** Stripe/PayPal APIs
- **Refund Handling:** Automated workflow, status tracking

### 5. Notification Service
- **Framework:** Node.js
- **Endpoints:** `/notify`, `/notifications`, `/notifications/read`
- **Multichannel:** Email, SMS, Web push
- **Retry Logic:** Exponential backoff for failed sends

### 6. Review/Rating Service
- **Framework:** Python (Flask)
- **Endpoints:** `/review`, `/product/:id/reviews`, `/review/fraud-check`
- **Fraud Detection:** ML model scoring, manual review flags

### 7. Dashboard Service
- **Framework:** React (Seller/Admin), Angular (Consumer)
- **Views:** Custom analytics, order history, product management

### 8. Audit Logging Service
- **Framework:** Go
- **Endpoints:** `/audit/log`, `/audit/report`
- **Immutable Logs:** Write-only, versioned
- **Compliance Reports:** Export for GDPR/CCPA

### 9. Secrets Management
- **Vault:** HashiCorp Vault/KMS
- **Isolation:** Environment-based secret segregation

### 10. Consent & Data Retention Management
- **Framework:** Node.js
- **Endpoints:** `/consent`, `/data-retention`, `/lineage`
- **Policies:** Configurable retention, auto-delete/anonymize

## Data Flows

1. **User Registration/Login:**
   - User submits form → Authentication Service → DB write → Audit Log → Notification (welcome email)
2. **Product Search/Filter:**
   - User query → Catalog Service → DB/Redis → Response
3. **Add to Cart/Checkout:**
   - Cart Service → DB → Order Service → Payment Service → Notification → Audit Log
4. **Refund Request:**
   - Order Service → Payment Service → Refund workflow → Notification → Audit Log
5. **Review Submission:**
   - Review Service → Fraud Detection → DB → Notification

## Sequence Diagrams

### Registration & Login
```
User → Auth Service: Submit registration/login
Auth Service → DB: Store/validate credentials
Auth Service → Audit Log: Log event
Auth Service → Notification: Send welcome/login alert
```

### Order Placement
```
User → Cart Service: Add items
Cart Service → Order Service: Create order
Order Service → Payment Service: Process payment
Payment Service → DB: Record transaction
Order Service → Notification: Send order confirmation
Order Service → Audit Log: Log order event
```

## Implementation Details

- **Frontend:** React/Angular, WCAG 2.1 AA, responsive layouts
- **Backend:** Microservices, REST APIs, circuit breaker for external APIs
- **Database:** PostgreSQL for core entities, Redis for caching/session
- **Security:** AES-256 at rest, TLS 1.3 in transit, input validation, output filtering (XSS/CSRF), RBAC/ABAC
- **Compliance:** PCI DSS for payments, GDPR/CCPA for data retention, consent management, audit logging
- **Monitoring:** ELK/CloudWatch, APM, health checks
- **Error Handling:** Retry logic, centralized logging, graceful fallback
- **Accessibility:** WCAG 2.1 AA compliance across all UI components

## Compliance Mapping

| Feature                | Compliance Standard |
|------------------------|--------------------|
| Payment Processing     | PCI DSS            |
| Data Retention/Consent | GDPR, CCPA         |
| Audit Logging          | GDPR, CCPA         |
| Accessibility          | WCAG 2.1 AA        |
| Encryption             | PCI DSS, GDPR      |

## Out-of-Scope
- Logistics integration, advanced ML recommendations (noted as nice-to-have)

---
# Architecture Diagram
(Refer to HLD for visual diagram.)
