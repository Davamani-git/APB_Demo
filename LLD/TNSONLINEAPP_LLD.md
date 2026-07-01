# TNSONLINEAPP Low-Level Design (LLD)

## 1. Component Specifications

### 1.1 Front End (Web/Mobile)
- **Frameworks:** React.js (Web), React Native (Mobile)
- **Accessibility:** WCAG 2.1 AA compliance, ARIA roles, keyboard navigation, color contrast
- **Authentication:** OAuth 2.0/JWT integration for secure login/registration
- **State Management:** Redux/Context API
- **API Integration:** RESTful endpoints via API Gateway (TLS 1.3 enforced)
- **Input Validation:** Client-side validation for all forms
- **Error Handling:** User-friendly error displays, retry for transient failures

### 1.2 API Gateway
- **Technology:** NGINX or AWS API Gateway
- **Security:** Enforces TLS 1.3, input validation, rate limiting, CORS
- **Logging:** Request/response logging with trace IDs
- **Circuit Breaker:** Hystrix/Resilience4j for upstream failures

### 1.3 Authentication & RBAC/ABAC
- **Service:** Dedicated microservice (Node.js/Express)
- **Password Storage:** bcrypt with salted hashes
- **Session Management:** JWT tokens, refresh tokens
- **RBAC/ABAC:** Role and attribute-based access enforced at API layer
- **Audit Logging:** All login/logout and privilege changes logged

### 1.4 Business Logic Services
- **Services:**
  - Catalog Service
  - Cart Service
  - Order Service
  - Payment Service
  - Review Service
  - Refund Service
  - Notification Service
- **Implementation:** Microservices (Node.js, Python, or Java Spring Boot)
- **Data Validation:** Server-side schema validation (e.g., Joi, Marshmallow)
- **Error Handling:** Graceful fallback, logging, retries

### 1.5 Payment Integration
- **PCI DSS Compliance:** Card data never stored; tokenization with external gateways
- **Providers:** Stripe, PayPal, Razorpay (abstracted via adapter pattern)
- **Encryption:** AES-256 for sensitive data, TLS 1.3 for transport
- **Fraud Detection:** Integration with third-party APIs, rule-based checks

### 1.6 Seller/Admin Dashboards
- **Analytics:** Real-time metrics (orders, revenue, inventory)
- **Management:** Product CRUD, order status updates, refund initiation
- **Security:** Access restricted to roles, audit logs for all admin actions

### 1.7 Notification Service
- **Channels:** Email (SMTP/API), SMS (Twilio), Push (Firebase)
- **Real-Time:** WebSockets for in-app notifications
- **Accessibility:** Alt text, readable messages

### 1.8 Data Services
- **Database:** PostgreSQL (RDS/Aurora), encrypted at rest
- **ORM:** Sequelize/SQLAlchemy/Hibernate
- **Audit Logging:** All sensitive operations logged (user, timestamp, action)
- **Data Retention:** Configurable policies per compliance
- **Consent Tracking:** GDPR/CCPA support, user consent logs

## 2. Data Flows

### 2.1 Registration/Login
1. User submits credentials via front end
2. API Gateway forwards to Authentication Service
3. Service validates, hashes, and verifies credentials
4. On success, JWT token issued; audit log entry created

### 2.2 Product Search & Catalog
1. User queries via front end
2. API Gateway routes to Catalog Service
3. Service queries DB, applies filters, returns product list

### 2.3 Cart & Checkout
1. Add-to-cart triggers Cart Service update
2. Checkout invokes Payment Service (PCI DSS, tokenization)
3. On payment success, Order Service records order, triggers Notification

### 2.4 Order Tracking & Notifications
1. Order status changes trigger Notification Service
2. Notifications sent via preferred channel (email/SMS/push)

### 2.5 Refunds
1. Refund request via dashboard
2. Refund Service validates, interacts with Payment Service
3. Status updated, notifications sent, audit log recorded

## 3. Sequence Diagrams (Text Representation)

### 3.1 User Registration
```
User -> Front End: Enter registration details
Front End -> API Gateway: POST /register
API Gateway -> Auth Service: Validate and create user
Auth Service -> DB: Store user (hashed password)
Auth Service -> Audit Log: Record registration event
Auth Service -> API Gateway: Success/failure
API Gateway -> Front End: Response
```

### 3.2 Product Purchase
```
User -> Front End: Add to cart, checkout
Front End -> API Gateway: POST /checkout
API Gateway -> Cart Service: Validate cart
Cart Service -> Payment Service: Process payment
Payment Service -> Payment Gateway: Tokenized payment
Payment Gateway -> Payment Service: Payment result
Payment Service -> Order Service: Create order
Order Service -> Notification Service: Send confirmation
Order Service -> Audit Log: Record order
Order Service -> API Gateway: Success/failure
API Gateway -> Front End: Response
```

## 4. Implementation Details

- **CI/CD:** GitHub Actions for build/test/deploy, secrets in GitHub Vault
- **Infrastructure:** Dockerized microservices, deployed via Kubernetes (EKS/AKS/GKE)
- **Monitoring:** Prometheus/Grafana, centralized logging (ELK/CloudWatch)
- **Error Handling:** Retry, circuit breaker, fallback patterns
- **Compliance:** Automated PCI DSS, GDPR/CCPA checks in CI; regular audit log reviews
- **Testing:** Unit, integration, and end-to-end tests; security scanning (Snyk, Trivy)

## 5. Security & Compliance Controls

- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Access Control:** RBAC/ABAC enforced at API and DB layers
- **Audit Logging:** Immutable logs, regular review
- **Data Privacy:** Consent management, data minimization, retention policies
- **Incident Response:** Automated alerts, runbooks, forensics-ready logging

---

This LLD is derived from the HLD and fulfills all specified requirements, including security, compliance, accessibility, and robust error handling for the TNSONLINEAPP online shopping platform.
