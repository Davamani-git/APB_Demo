# High-Level Design (HLD): Online Shopping Platform

## 1. Domain Model (UML Class Diagram - Text Representation)

### Entities & Relationships
- **User**: user_id, name, email, password_hash, phone, role (Consumer, Seller, Admin), status, created_at, updated_at
- **Profile**: profile_id, user_id (FK), address, preferences, avatar_url
- **Product**: product_id, seller_id (FK), name, description, price, quantity, category, images, status, created_at
- **Catalog**: catalog_id, name, description, products (1..*)
- **Cart**: cart_id, user_id (FK), created_at, status
- **CartItem**: cart_item_id, cart_id (FK), product_id (FK), quantity, price
- **Order**: order_id, user_id (FK), total, status, payment_id (FK), created_at, updated_at
- **OrderItem**: order_item_id, order_id (FK), product_id (FK), quantity, price
- **Payment**: payment_id, order_id (FK), method, amount, status, transaction_reference, created_at
- **Review**: review_id, user_id (FK), product_id (FK), rating, comment, created_at
- **Notification**: notification_id, user_id (FK), type, message, status, created_at

**Relationships:**
- User (1) — (0..1) Profile
- User (1) — (0..*) Cart
- User (1) — (0..*) Order
- User (1) — (0..*) Review
- User (1) — (0..*) Notification
- Seller (User) (1) — (0..*) Product
- Product (1) — (0..*) Review
- Cart (1) — (1..*) CartItem
- Order (1) — (1..*) OrderItem
- Order (1) — (1) Payment

## 2. Architecture Overview
- **Frontend**: Web SPA (React/Angular, WCAG 2.1 AA compliant)
- **Backend**: RESTful APIs (Node.js/Java/Spring), microservices
- **Database**: Relational DB (PostgreSQL/MySQL)
- **Caching**: Redis/Memcached
- **Messaging/Notifications**: Kafka/RabbitMQ, Email/SMS service
- **Authentication**: OAuth2/JWT, RBAC/ABAC
- **Payments**: PCI DSS compliant third-party gateways (Stripe/PayPal)
- **Infrastructure**: Cloud-based (AWS/Azure), Docker, Kubernetes, CI/CD pipelines

## 3. Major Components
- **User Management**: Registration, login, profile, RBAC, ABAC
- **Product Catalog**: CRUD, search, filter, category management
- **Shopping Cart**: Add/remove items, manage quantities
- **Checkout & Payments**: Secure payment integration, order placement
- **Order Management**: Tracking, refunds, order history
- **Seller/Admin Dashboards**: Analytics, product management, order management
- **Notifications**: Email, SMS, in-app messages

## 4. Integration Points
- Payment Gateway APIs (PCI DSS compliant)
- Email/SMS Providers
- Third-party Fraud Detection Services
- Cloud Monitoring & Logging (CloudWatch, ELK)

## 5. Security & Compliance Features
- **Input Validation**: Client/server-side, strict schemas
- **Output Filtering**: Prevent XSS/CSRF, sanitize data
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **RBAC/ABAC**: Role & attribute-based access control for all APIs
- **Audit Logging**: All critical actions (auth, payment, admin changes)
- **Secrets Management**: Vault/KMS for credentials & keys
- **PCI DSS**: Cardholder data never stored; tokenization for payment info
- **Data Retention & Deletion**: Compliant with GDPR/CCPA, user consent management
- **Data Lineage**: Traceability for sensitive operations
- **Compliance Reporting**: Automated reports for audits

## 6. Data Flow (Simplified)
1. User registers/login (OAuth2/JWT) → Profile created/loaded
2. User searches/browses products (Catalog Service)
3. Adds products to cart (Cart Service)
4. Proceeds to checkout (Checkout Service)
5. Payment processed (PCI DSS gateway)
6. Order created, inventory updated
7. Notifications sent (Order Confirmation, etc.)
8. Seller/Admin manage products/orders via dashboard

## 7. Error Handling & Resilience
- **Retries**: Idempotent APIs for payments/orders
- **Logging**: Centralized, structured logs (Cloud/ELK)
- **Circuit Breaker**: For external calls (payments, notifications)
- **Graceful Degradation**: User-friendly messages, fallback mechanisms

---

# Validation Report
- [x] Registration/Login
- [x] Product Catalog/Search/Filter
- [x] Shopping Cart & Checkout
- [x] Order Tracking & Management
- [x] RBAC/ABAC, Seller/Admin Dashboards
- [x] Notifications, Multiple Payments, Reviews, Refunds
- [x] Security: Encryption, PCI DSS, Fraud Detection
- [x] Scalability & Performance (100,000 users, 2s/5s targets)
- [x] Accessibility (WCAG 2.1 AA)
- [x] Compliance: GDPR/CCPA, Data Retention, Consent, Lineage, Audit Logging
- [x] Error Handling: Retries, Logging, Circuit Breaker
- [x] Acceptance: Registration, secure checkout, tracking, refunds, accessibility, peak-load
