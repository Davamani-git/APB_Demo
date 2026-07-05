# Low-Level Design (LLD): Online Shopping Platform (Ami002)

---

## 1. Introduction
This Low-Level Design (LLD) document translates the High-Level Design (HLD) for the Online Shopping Platform into detailed implementation specifications. It covers each microservice/component, their APIs, data flows, sequence diagrams, and security/compliance controls, ensuring traceability to HLD requirements.

---

## 2. Component Specifications

### 2.1 User Management Service
- **Responsibilities:** Registration, authentication, profile management, RBAC/ABAC enforcement.
- **Key APIs:**
  - `POST /users/register` (input validation, password hashing, consent capture)
  - `POST /users/login` (JWT issuance, audit logging)
  - `GET /users/profile`
  - `PUT /users/profile`
- **Data Model:** User, Profile, Role, Consent
- **Security:**
  - Passwords hashed (bcrypt), JWT for sessions
  - Input/output validation, audit logging for sensitive actions
  - RBAC/ABAC enforced on all endpoints

### 2.2 Product Catalog Service
- **Responsibilities:** CRUD for products, search, filter, recommendations
- **Key APIs:**
  - `GET /products`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`
  - `GET /products/search`, `GET /products/recommendations`
- **Data Model:** Product, Category, Seller
- **Security:**
  - Only sellers/admins can create/update/delete
  - Input filtering, audit logs

### 2.3 Cart & Checkout Service
- **Responsibilities:** Cart management, order placement, secure checkout
- **Key APIs:**
  - `GET /cart`, `POST /cart/items`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}`
  - `POST /checkout`
- **Data Model:** Cart, CartItem, Order
- **Security:**
  - User authentication required
  - Input validation, audit logging

### 2.4 Payment Service
- **Responsibilities:** Payment processing, refunds, PCI DSS compliance
- **Key APIs:**
  - `POST /payments` (integrates with third-party gateway)
  - `POST /refunds`
- **Data Model:** Payment, Refund
- **Security:**
  - PCI DSS compliance, AES-256 encryption for payment data
  - TLS 1.3 for all payment flows
  - Secrets managed in vault

### 2.5 Order Service
- **Responsibilities:** Order lifecycle, tracking, status updates
- **Key APIs:**
  - `GET /orders`, `GET /orders/{id}`
  - `PUT /orders/{id}/status`
- **Data Model:** Order, OrderItem
- **Security:**
  - RBAC for order management
  - Audit logging for all updates

### 2.6 Notification Service
- **Responsibilities:** Email/SMS/push notifications
- **Key APIs:**
  - `POST /notifications/email`, `POST /notifications/sms`, `POST /notifications/push`
- **Data Model:** Notification
- **Security:**
  - Asynchronous messaging, audit logging

### 2.7 Review & Rating Service
- **Responsibilities:** Product reviews, moderation
- **Key APIs:**
  - `POST /reviews`, `GET /reviews/{product_id}`
- **Data Model:** Review
- **Security:**
  - Input validation, moderation workflow

### 2.8 Admin & Seller Dashboards
- **Responsibilities:** Analytics, management, reporting
- **Key APIs:**
  - `GET /admin/analytics`, `GET /seller/dashboard`
- **Data Model:** Aggregated analytics
- **Security:**
  - RBAC enforced, audit logging

### 2.9 Audit Logging Service
- **Responsibilities:** Tracks all sensitive/critical actions
- **Key APIs:**
  - `POST /auditlog`
- **Data Model:** AuditLog
- **Security:**
  - Immutable logs, GDPR/CCPA ready

---

## 3. Data Flows

### 3.1 User Journey
1. **Registration/Login:** User registers/logs in → JWT issued → profile created/updated.
2. **Product Browsing:** Authenticated/guest user fetches product catalog, searches, filters.
3. **Cart Operations:** User adds/removes items to/from cart.
4. **Checkout:** User initiates checkout (input validation, RBAC enforced).
5. **Payment:** Payment processed (PCI DSS, encryption, TLS 1.3).
6. **Order Creation:** Order created, order items linked.
7. **Notification:** Notification sent (email/SMS/push) for order status.
8. **Review/Refund:** User submits review or requests refund.
9. **Audit Logging:** All sensitive actions logged (user management, payments, orders).

### 3.2 Sequence Diagram (Text)

```
User → Web/App → API Gateway → Microservices

1. Registration/Login:
User → API Gateway: POST /users/register or /users/login
API Gateway → User Management Service
User Management Service → DB: Create/Verify User
User Management Service → Audit Logging Service

2. Product Search/Browse:
User → API Gateway: GET /products
API Gateway → Product Catalog Service
Product Catalog Service → DB: Fetch Products

3. Cart/Checkout:
User → API Gateway: POST /cart/items, POST /checkout
API Gateway → Cart & Checkout Service
Cart & Checkout Service → Order Service
Order Service → Payment Service (if payment)
Payment Service → Payment Gateway
Order Service → Notification Service
All → Audit Logging Service
```

---

## 4. Security & Compliance Implementation
- **Input Validation:** All endpoints enforce strict schema validation.
- **Output Filtering:** Sensitive fields removed from API responses.
- **Encryption:**
  - AES-256 for data at rest (PII, payment)
  - TLS 1.3 for all data in transit
- **RBAC/ABAC:** Applied at API gateway and microservice level
- **Audit Logging:** All sensitive/critical actions logged with user/session context
- **Secrets Management:** All credentials managed via HashiCorp Vault
- **PCI DSS Compliance:** Payment flows isolated, no card data stored
- **Consent Management:** User consent tracked, opt-in/out endpoints
- **Data Retention & Purging:** Automated purging policies, configurable per compliance
- **Accessibility:** All UI components WCAG 2.1 AA compliant

---

## 5. Error Handling
- **Centralized Error Handler:** All API errors handled centrally, user-friendly messages
- **Retry Logic:** For transient external failures (payments, notifications)
- **Circuit Breakers:** For external integrations (payment, notifications)
- **Logging & Alerting:** All failures logged; alerts for critical errors

---

## 6. Traceability Matrix (HLD → LLD)
| HLD Requirement                   | LLD Mapping                            |
|-----------------------------------|----------------------------------------|
| Registration, authentication      | User Management Service                |
| Product catalog, search/filter    | Product Catalog Service                |
| Cart, checkout, order tracking    | Cart & Checkout, Order Services        |
| Seller/admin dashboards           | Admin & Seller Dashboards              |
| Notifications                     | Notification Service                   |
| Reviews, refunds                  | Review & Rating, Payment Services      |
| PCI DSS, GDPR/CCPA                | Payment, Audit Logging, Consent Mgmt   |
| Encryption, validation, RBAC      | Security & Compliance Implementation   |
| Data retention, consent           | Consent Mgmt, Data Retention Policies  |
| Error handling                    | Error Handling Section                 |

---

## 7. Implementation Details
- **Tech Stack:**
  - Backend: Node.js/Python microservices (Dockerized)
  - API Gateway: Kong/NGINX
  - Database: PostgreSQL (RDBMS), Redis (cache)
  - Messaging: RabbitMQ/Kafka (async notifications)
  - CI/CD: GitHub Actions, Docker, Kubernetes
  - Secrets: HashiCorp Vault
  - Monitoring: Prometheus, Grafana, ELK stack
- **Deployment:**
  - All microservices containerized, deployed via Kubernetes
  - Blue/green deployments for zero downtime
- **Testing:**
  - Unit, integration, security, and compliance tests automated
- **Documentation:**
  - OpenAPI/Swagger for all APIs
  - Compliance and audit reports generated automatically

---

## 8. Appendix
- **UML/ERD Diagrams:** See HLD for visual models
- **API Specs:** Detailed in OpenAPI/Swagger docs (repo: `/api-specs`)
- **Compliance Checklists:** PCI DSS, GDPR, CCPA attached in `/compliance` folder

---

*End of Document*
