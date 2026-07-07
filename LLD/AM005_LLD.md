# Low Level Design (LLD) Document – Online Shopping Platform (AM005)

## 1. Introduction
This LLD provides a comprehensive technical specification for the Online Shopping Platform, detailing the implementation of core features, component interactions, data flows, and security requirements as derived from the HLD/Product Requirements.

---

## 2. Component Specifications

### 2.1 User Management
- **Registration/Login:**
  - RESTful APIs for user sign-up, login, password reset.
  - JWT-based authentication, HTTPS enforced.
  - RBAC (Role-Based Access Control) for Consumers, Sellers, Admins.
- **Data Model:**
  - User (id, name, email, password_hash, role, status, created_at)

### 2.2 Product Catalog
- **CRUD APIs** for product management (Admin/Seller).
- **Search & Filter:**
  - Full-text search (Elasticsearch or RDBMS FTS).
  - Faceted filters (category, price, brand, rating).
- **Data Model:**
  - Product (id, name, desc, price, seller_id, stock, images[], category, rating)

### 2.3 Shopping Cart
- **Session-based/DB-backed cart per user.**
- **APIs:** Add, update, remove items, retrieve cart.
- **Data Model:**
  - Cart (id, user_id, items[])
  - CartItem (product_id, quantity, price)

### 2.4 Secure Checkout & Payments
- **Integration with PCI DSS compliant payment gateway.**
- **Order placement with atomic transaction.**
- **Fraud detection hooks.**
- **Data Model:**
  - Order (id, user_id, items[], total, status, payment_id, created_at)
  - Payment (id, order_id, amount, status, method, transaction_ref)

### 2.5 Order Tracking
- **Order status updates:** Placed, Paid, Shipped, Delivered, Cancelled, Refunded.
- **Notifications via email/SMS/Push.**
- **Data Model:**
  - OrderStatusHistory (order_id, status, timestamp)

### 2.6 Dashboards
- **Seller Dashboard:** Product management, order status, analytics.
- **Admin Dashboard:** User management, catalog moderation, reports.

### 2.7 Notifications
- **Event-driven notification service.**
- **Supports email, SMS, in-app push.**

---

## 3. Data Flows

### 3.1 User Registration
1. User submits registration form (API).
2. Backend validates and hashes password.
3. User record created in DB.
4. Confirmation email sent.

### 3.2 Product Search & Checkout
1. User searches via UI/API.
2. Backend queries catalog with filters.
3. User adds products to cart.
4. Initiates checkout; payment gateway form displayed.
5. Payment processed; order created.
6. Confirmation & notifications sent.

### 3.3 Order Lifecycle
1. Order placed → paid → seller notified.
2. Seller ships → status updated.
3. User tracks order via dashboard.
4. Refunds processed via payment gateway integration.

---

## 4. Sequence Diagram (Textual)

**User Checkout Sequence:**
```
User → UI → Backend → Payment Gateway → Backend → Notification Service → User
```
1. User initiates checkout.
2. UI sends order to Backend.
3. Backend requests payment from Payment Gateway.
4. Payment Gateway confirms transaction.
5. Backend creates Order, updates inventory.
6. Notification Service sends confirmation to User.

---

## 5. Security & Compliance
- **All traffic encrypted (HTTPS/TLS).**
- **Sensitive data (passwords, payment info) encrypted at rest.**
- **PCI DSS compliance for payment flows.**
- **Fraud detection on checkout.**
- **Accessibility (WCAG 2.1 AA):** Semantic HTML, ARIA roles, contrast checks.

---

## 6. Non-Functional Implementation
- **Performance:** API response < 2s; async processing for notifications.
- **Scalability:** Stateless services, auto-scaling groups, caching.
- **Availability:** Multi-AZ deployment, health checks, failover.

---

## 7. Key Risks & Mitigations
- **Payment gateway outages:** Fallback & retry logic, status monitoring.
- **Fraudulent sellers:** KYC checks, anomaly detection.
- **Privacy compliance:** GDPR, audit logging, data minimization.
- **Peak load:** Load testing, auto-scaling.

---

## 8. Acceptance Criteria Mapping
- Registration, login, secure checkout, order tracking, seller product management, refund processing, accessibility, and performance validated via automated and manual QA.

---

## 9. Appendix
- API endpoint list, ER diagrams, and further implementation details available in supplementary docs.
