# High-Level Design (HLD) – Online Shopping Platform

## 1. Domain Model (ERD/UML)

### Entities, Attributes, and Relationships

#### Entities
- **User** (Consumer, Seller, Administrator)
  - user_id (PK)
  - username
  - email
  - password_hash
  - role (RBAC)
  - registration_date
  - status

- **Profile**
  - profile_id (PK)
  - user_id (FK)
  - contact_info
  - address
  - preferences

- **Product**
  - product_id (PK)
  - seller_id (FK)
  - name
  - description
  - price
  - inventory_count
  - category
  - status

- **Catalog**
  - catalog_id (PK)
  - product_ids (list/FK)

- **Order**
  - order_id (PK)
  - user_id (FK)
  - order_date
  - status
  - payment_id (FK)
  - total_amount

- **ShoppingCart**
  - cart_id (PK)
  - user_id (FK)
  - product_ids (list/FK)
  - quantities
  - created_at
  - updated_at

- **Payment**
  - payment_id (PK)
  - order_id (FK)
  - payment_method
  - payment_status
  - transaction_id
  - amount
  - timestamp

- **Notification**
  - notification_id (PK)
  - user_id (FK)
  - type
  - content
  - sent_at

- **Review**
  - review_id (PK)
  - user_id (FK)
  - product_id (FK)
  - rating
  - comment
  - created_at

- **Refund**
  - refund_id (PK)
  - order_id (FK)
  - user_id (FK)
  - amount
  - reason
  - status
  - created_at

#### Relationships
- User 1..* Profile
- Seller 1..* Product
- User 1..* Order
- Order 1..1 Payment
- User 1..* ShoppingCart
- User 1..* Notification
- User 1..* Review
- Order 0..1 Refund

---

## 2. Architecture Overview

### Major Components
- **Frontend:** Web UI (React/Angular), accessible (WCAG 2.1 AA)
- **Backend:** Microservices (Node.js/Java/Spring Boot)
  - Authentication Service
  - Catalog Service
  - Order Service
  - Payment Service
  - Notification Service
  - Review & Refund Service
  - Dashboard Service
- **Database:** Relational DB (PostgreSQL/MySQL), NoSQL (Redis/MongoDB for cache/session)
- **Integration Points:**
  - Payment Gateway (PCI DSS)
  - Notification (Email/SMS/Push)
  - Recommendation Engine (optional)
  - Logistics API (optional)

### Data Flow
- User registration/login → authentication service (input validation, encrypted storage)
- Product discovery → catalog service (search/filter, performance)
- Shopping cart → cart service (session management, update)
- Secure checkout → order/payment service (TLS 1.3, AES-256 encryption)
- Order tracking → order service
- Seller dashboards → dashboard service
- Notifications → notification service
- Reviews/refunds → review/refund service

---

## 3. Security & Compliance Features

### Security
- **Input Validation:** All endpoints (frontend/backend)
- **Output Filtering:** Prevent XSS/CSRF
- **Encryption:** AES-256 for data at rest, TLS 1.3 for data in transit
- **RBAC/ABAC:** Role/Attribute-based access, enforced at API and DB
- **Audit Logging:** Centralized, immutable logs for all critical actions
- **Secrets Management:** Vault/Key Management Service, rotated regularly
- **Fraud Detection:** Monitoring anomalous transactions

### Compliance
- **PCI DSS:** Payment data handling
- **Data Retention:** Configurable policies, purge after period
- **Consent Management:** User consent for data usage (opt-in/out)
- **Data Lineage:** Tracking data origin/flow
- **Compliance Reporting:** Automated reports (GDPR, CCPA, PCI DSS)
- **Accessibility:** WCAG 2.1 AA compliance

---

## 4. Error Handling & Reliability
- **Retries:** Network/database operations with exponential backoff
- **Logging:** Structured logs, error and access logs
- **Circuit Breaker:** Prevent cascading failures (backend services)
- **Graceful Payment Failure:** User notification, retry options, refund process

---

## 5. Validation Report

### Requirements Coverage
- Registration/login ✔
- Product catalog ✔
- Search/filter ✔
- Shopping cart ✔
- Secure checkout ✔
- Order tracking ✔
- RBAC ✔
- Seller/admin dashboards ✔
- Notifications ✔
- Multiple payment methods ✔
- Reviews/refunds ✔
- Recommendations/wishlist (optional) ✔
- Logistics integration (optional) ✔

### Compliance
- PCI DSS ✔
- GDPR/CCPA ✔
- Accessibility (WCAG 2.1 AA) ✔
- Data retention/consent/data lineage ✔

### Error Handling
- Retries, logging, circuit breaker patterns ✔
- Graceful payment failure/refund handling ✔

---

## 6. Architecture Diagram (Textual)

```
[User] <-> [Frontend] <-> [API Gateway] <-> [Microservices]
    |               |               |            |
    |               |               |            |-- [Authentication Service]
    |               |               |            |-- [Catalog Service]
    |               |               |            |-- [Order Service]
    |               |               |            |-- [Payment Service]
    |               |               |            |-- [Notification Service]
    |               |               |            |-- [Review & Refund Service]
    |               |               |            |-- [Dashboard Service]
    |               |               |            |-- [Database (Relational, NoSQL)]
    |               |               |            |-- [Integration: Payment Gateway, Notification, Recommendation, Logistics]
```

---

## 7. Notes
- Out-of-scope features excluded (native apps, custom payment gateway, direct logistics)
- Key risks addressed via redundancy, monitoring, compliance updates
