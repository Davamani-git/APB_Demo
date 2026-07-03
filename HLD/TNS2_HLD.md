# High-Level Design (HLD): Online Shopping Platform (TNS2)

## 1. Domain Model (ERD/UML Class Diagram)

**Entities & Relationships**
- **User** (`user_id`, `email`, `password_hash`, `role`, `created_at`, `last_login`)
    - *Relationships*: 1 User → N Orders, 1 User → N Carts, 1 User → N Reviews
- **Profile** (`profile_id`, `user_id`, `name`, `address`, `phone`, `preferences`)
    - *Relationships*: 1:1 with User
- **Role** (`role_id`, `role_name`, `permissions`)
    - *Relationships*: 1 Role → N Users
- **Product** (`product_id`, `seller_id`, `name`, `description`, `price`, `inventory`, `category`, `status`)
    - *Relationships*: 1 Seller → N Products
- **Cart** (`cart_id`, `user_id`, `created_at`)
    - *Relationships*: 1 Cart → N CartItems
- **CartItem** (`cart_item_id`, `cart_id`, `product_id`, `quantity`)
- **Order** (`order_id`, `user_id`, `order_status`, `order_date`, `payment_id`, `total`)
    - *Relationships*: 1 Order → N OrderItems
- **OrderItem** (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`)
- **Payment** (`payment_id`, `order_id`, `payment_method`, `amount`, `status`, `transaction_date`)
- **Review** (`review_id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`)
- **Notification** (`notification_id`, `user_id`, `message`, `type`, `read`, `created_at`)
- **Refund** (`refund_id`, `order_id`, `amount`, `status`, `requested_at`, `processed_at`)

**Diagram**: (UML/ERD not visual here, but described above for GitHub Markdown)

## 2. Architecture Overview

### Major Components
- **Web Frontend**: Responsive UI (WCAG 2.1 AA compliant)
- **API Gateway**: Routes requests, enforces RBAC/ABAC
- **User Service**: Registration, authentication, profile
- **Catalog Service**: Product listings, search, filter
- **Cart/Order Service**: Cart management, order placement, order tracking
- **Payment Service**: Payment processing, refunds (PCI DSS compliant)
- **Notification Service**: Email/SMS/push notifications
- **Admin/Seller Dashboards**: Management interfaces
- **Audit Logging Service**: Centralized logging
- **Security & Compliance Layer**: Encryption, fraud detection, consent management
- **Database(s)**: Relational (Products, Orders, Users), NoSQL (Sessions, Notifications)

### Integration Points
- **Payment Gateway(s)**: Multiple providers (PCI DSS)
- **Email/SMS Providers**: For notifications
- **Fraud Detection**: 3rd party or in-house
- **Authentication**: OAuth2.0, SSO (optional)

### Security/Compliance Features
- **Input Validation/Output Filtering**: Strict schema validation, escaping
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **RBAC/ABAC**: Role-based/attribute-based access control
- **Audit Logging**: All sensitive actions logged
- **Secrets Management**: Vault/HSM for credentials
- **PCI DSS Compliance**: Payment data separation, tokenization
- **Data Retention/Consent**: User consent flows, retention policies
- **Data Lineage**: Traceability of data changes
- **Compliance Reporting**: Automated audit reports

### Data Flow
1. User registers/logs in (authentication service, encrypted data flow)
2. Browses catalog (catalog service, search/filter, caching)
3. Adds items to cart (cart service)
4. Proceeds to checkout (order/payment services, payment gateway)
5. Receives notifications (notification service)
6. Seller/admin manages products/orders (dashboard, RBAC enforced)

### Error Handling/Resilience
- **Retries**: On payment/notification failures (with backoff)
- **Logging**: Centralized, structured logs
- **Circuit Breaker Pattern**: On 3rd party integrations (e.g., payment)
- **Graceful Degradation**: Read-only mode under failure

## 3. Validation Report

### Requirements Coverage
- [x] Registration/Login
- [x] Product Catalog
- [x] Search & Filter
- [x] Shopping Cart
- [x] Secure Checkout
- [x] Order Tracking
- [x] RBAC
- [x] Seller/Admin Dashboards
- [x] Notifications
- [x] Multiple Payment Methods
- [x] Reviews
- [x] Refunds
- [x] Recommendations (noted as nice-to-have)
- [x] Wishlist (noted as nice-to-have)
- [x] Logistics Integration (noted as nice-to-have)

### Compliance
- [x] PCI DSS for payments
- [x] Encryption (AES-256/TLS 1.3)
- [x] Accessibility (WCAG 2.1 AA)
- [x] Consent management
- [x] Data retention policies
- [x] Audit logging
- [x] Data lineage & compliance reporting

### Error Handling
- [x] Retry mechanisms for external failures
- [x] Logging and monitoring
- [x] Circuit breaker for integrations
- [x] Graceful handling of payment failures

---

**End of HLD for TNS2 Online Shopping Platform**
