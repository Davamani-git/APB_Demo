# High-Level Design (HLD) – Online Shopping Platform

## 1. Domain Model (UML/ERD)

### Entities & Relationships
- **User** (user_id, email, password_hash, role, registration_date, last_login, status)
- **Profile** (profile_id, user_id, name, address, phone, preferences)
- **Product** (product_id, seller_id, name, description, category, price, stock, images, status)
- **Seller** (seller_id, user_id, store_name, rating, onboarding_date, kyc_status)
- **Order** (order_id, user_id, order_date, status, payment_id, shipping_address, total_amount)
- **OrderItem** (order_item_id, order_id, product_id, quantity, price)
- **Cart** (cart_id, user_id, created_at, updated_at)
- **CartItem** (cart_item_id, cart_id, product_id, quantity)
- **Payment** (payment_id, order_id, method, status, amount, payment_date, transaction_ref)
- **Notification** (notification_id, user_id, type, message, status, created_at)
- **Review** (review_id, user_id, product_id, rating, comment, created_at)
- **Refund** (refund_id, order_id, amount, status, processed_at)
- **Role** (role_id, name, permissions)

#### Relationships
- User 1—* Profile
- User 1—* Order
- User 1—* Cart
- User 1—* Notification
- User 1—* Review
- User 1—* Seller (if role=Seller)
- Seller 1—* Product
- Product 1—* Review
- Order 1—* OrderItem
- Cart 1—* CartItem
- Order 1—1 Payment
- Order 1—* Refund

### UML/ERD (Text Representation)
```plaintext
[User] 1---* [Profile]
[User] 1---* [Order] 1---* [OrderItem]
[User] 1---* [Cart] 1---* [CartItem]
[User] 1---* [Notification]
[User] 1---* [Review]
[User] 1---* [Seller]
[Seller] 1---* [Product] 1---* [Review]
[Order] 1---1 [Payment]
[Order] 1---* [Refund]
```

## 2. Architecture Overview

### Major Components
- **Frontend**: Web app (React/Angular) – user, seller, admin dashboards.
- **API Gateway**: Central entry point, throttling, authentication, request routing.
- **Authentication Service**: Registration, login, RBAC, JWT tokens, MFA.
- **Catalog Service**: Product search, filter, detail, inventory management.
- **Order Service**: Cart, checkout, order management, refunds.
- **Payment Service**: Payment processing, PCI DSS compliance, fraud checks.
- **Notification Service**: Emails, push notifications.
- **Admin Service**: Platform metrics, user/seller management, compliance reporting.
- **Database Layer**: RDBMS (PostgreSQL/MySQL), encrypted at rest.
- **Object Storage**: Product images, documents.
- **Monitoring & Logging**: Audit logs, metrics, error tracking.

### Integration Points
- Payment Gateway (PCI DSS compliant, external API)
- Email/SMS Provider (notifications)
- KYC/Identity Verification (seller onboarding)

### Security & Compliance Features
- **Input Validation**: Strict schema validation at API endpoints.
- **Output Filtering**: Prevent XSS/Injection.
- **Encryption**: AES-256 at rest, TLS 1.3 in transit.
- **RBAC/ABAC**: Role/attribute-based access control for all endpoints.
- **Audit Logging**: All sensitive operations logged.
- **Secrets Management**: Vault/managed secrets store.
- **PCI DSS**: Payment data isolation, regular compliance checks.
- **GDPR/CCPA**: Consent management, data retention, data subject rights.
- **Data Lineage**: Track data flows for compliance.
- **Compliance Reporting**: Admin dashboards for reporting.

### Data Flow
1. User registers/logins → JWT issued.
2. Browses/searches products → Catalog Service.
3. Adds items to cart → Cart Service.
4. Initiates checkout → Order & Payment Services.
5. Payment processed (external gateway) → PCI DSS flows.
6. Order confirmed, notifications dispatched.
7. Seller/admins manage products/orders via dashboards.

### Error Handling
- **Retry Logic**: For transient payment/API failures.
- **Circuit Breakers**: On external integrations.
- **Comprehensive Logging**: Errors, retries, and failures.
- **Graceful Degradation**: Fallback UIs for partial outages.

## 3. Validation Report

### Requirements Coverage Checklist
- [x] Registration/Login (User, Seller, Admin)
- [x] Product Catalog/Search/Filter
- [x] Shopping Cart
- [x] Secure Checkout
- [x] Order Tracking
- [x] RBAC
- [x] Seller/Admin Dashboards
- [x] Notifications
- [x] Multiple Payment Methods
- [x] Reviews/Refunds
- [x] Recommendations (extensible)
- [x] Wishlist (extensible)
- [x] Logistics Integration (future)

### Compliance & Security Checklist
- [x] Input validation/output filtering
- [x] Encryption (AES-256/TLS 1.3)
- [x] PCI DSS payment compliance
- [x] RBAC/ABAC
- [x] Audit logging
- [x] Secrets management
- [x] Data retention, consent management, lineage
- [x] Compliance reporting

### Error Handling Checklist
- [x] Retry logic for payment/API
- [x] Logging and monitoring
- [x] Circuit breaker for integrations
- [x] Graceful payment failure handling

---

## Architecture Diagram (Textual)
```plaintext
[Frontend] <-> [API Gateway] <-> [Auth Service]
                                 |-> [Catalog Service] <-> [DB]
                                 |-> [Order Service] <-> [DB]
                                 |-> [Payment Service] <-> [Payment Gateway]
                                 |-> [Notification Service] <-> [Email/SMS]
                                 |-> [Admin Service] <-> [DB]
                                 |-> [Object Storage]
                                 |-> [Monitoring/Logging]
```

## Notes
- All sensitive data encrypted at rest and in transit.
- PCI DSS and GDPR/CCPA compliance enforced.
- Audit trails for all critical actions.
- User consent and data retention policies managed per regulation.
- Scalability to 100,000 concurrent users; 99.9% uptime.
- Accessibility: WCAG 2.1 AA compliance.
