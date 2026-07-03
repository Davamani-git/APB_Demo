# Low-Level Design (LLD): Online Shopping Platform (TNS2)

## 1. Component Specifications

### 1.1 Web Frontend
- **Tech Stack:** ReactJS, Redux, Bootstrap (WCAG 2.1 AA compliant)
- **Responsibilities:**
    - User registration/login forms
    - Product catalog browsing/search/filter
    - Cart management UI
    - Checkout flow
    - Order tracking
    - Seller/admin dashboards
    - Error and notification display
- **Security:**
    - Input validation (client-side)
    - HTTPS enforced
    - XSS/CSRF protection

### 1.2 API Gateway
- **Tech Stack:** Node.js + Express or NGINX (with JWT/OAuth2 middleware)
- **Responsibilities:**
    - Routing to microservices
    - Enforce RBAC/ABAC via middleware
    - Rate limiting, request/response logging
- **Security:**
    - JWT validation
    - TLS 1.3
    - API throttling

### 1.3 User Service
- **Tech Stack:** Node.js/Express, PostgreSQL
- **Responsibilities:**
    - Registration/login
    - Profile CRUD
    - Password hashing (bcrypt)
    - Role management
- **Security:**
    - Password hashing (bcrypt)
    - Account lockout on repeated failures
    - Email verification

### 1.4 Catalog Service
- **Tech Stack:** Node.js/Express, PostgreSQL
- **Responsibilities:**
    - Product CRUD
    - Search/filter/sort
    - Inventory management
- **Security:**
    - RBAC (seller/admin rights)
    - Input validation

### 1.5 Cart/Order Service
- **Tech Stack:** Node.js/Express, PostgreSQL
- **Responsibilities:**
    - Cart CRUD
    - Order creation/tracking
    - Order item management
    - Refund initiation
- **Security:**
    - User authorization
    - Data integrity checks

### 1.6 Payment Service
- **Tech Stack:** Node.js/Express, Integration with Stripe/PayPal
- **Responsibilities:**
    - Payment processing
    - Refunds
    - PCI DSS compliance
- **Security:**
    - Tokenization of payment data
    - Separation of payment data from core DB
    - Webhook signature validation

### 1.7 Notification Service
- **Tech Stack:** Node.js/Express, RabbitMQ, Integration with SendGrid/Twilio
- **Responsibilities:**
    - Email/SMS/push notifications
    - Notification queue management
    - Read/unread tracking

### 1.8 Audit Logging Service
- **Tech Stack:** Node.js/Express, ELK Stack (Elasticsearch, Logstash, Kibana)
- **Responsibilities:**
    - Centralized structured logging
    - Sensitive action audit
    - Log retention and export

### 1.9 Security & Compliance Layer
- **Tech Stack:** Vault/HashiCorp, Custom middleware
- **Responsibilities:**
    - Secrets management
    - Data encryption
    - Consent management
    - Compliance reporting

### 1.10 Database(s)
- **Relational:** PostgreSQL for products, orders, users
- **NoSQL:** MongoDB/Redis for sessions, notifications


## 2. Data Flows

### 2.1 User Registration/Login
1. User submits registration/login form (Frontend)
2. API Gateway routes to User Service
3. User Service validates input, hashes password, stores/retrieves user
4. JWT issued on successful login
5. JWT returned to frontend for secure session

### 2.2 Browsing Catalog
1. User requests product list/search (Frontend)
2. API Gateway routes to Catalog Service
3. Catalog Service fetches products, applies filters
4. Results returned to frontend

### 2.3 Cart Management
1. User adds/removes items (Frontend)
2. API Gateway routes to Cart/Order Service
3. Cart/Order Service updates cart in DB
4. Updated cart returned

### 2.4 Checkout/Order Placement
1. User checks out cart (Frontend)
2. API Gateway routes to Order Service
3. Order Service creates order, reserves inventory
4. Order Service calls Payment Service
5. Payment Service processes payment (external gateway)
6. Payment status returned to Order Service
7. Order status updated; confirmation sent via Notification Service

### 2.5 Refunds
1. User requests refund (Frontend)
2. API Gateway routes to Order/Payment Service
3. Refund processed, status updated

### 2.6 Notifications
1. Events (order placed, shipped, etc.) sent to Notification Service
2. Notification Service queues and sends email/SMS/push


## 3. Sequence Diagrams (Textual)

### 3.1 Registration/Login
```
User -> Frontend: Enter credentials
Frontend -> API Gateway: POST /register or /login
API Gateway -> User Service: Forward request
User Service -> DB: Store/Retrieve user
User Service -> API Gateway: JWT or error
API Gateway -> Frontend: JWT or error
```

### 3.2 Place Order
```
User -> Frontend: Click checkout
Frontend -> API Gateway: POST /checkout
API Gateway -> Order Service: Forward request
Order Service -> DB: Create order
Order Service -> Payment Service: Process payment
Payment Service -> Payment Gateway: External call
Payment Gateway -> Payment Service: Payment status
Payment Service -> Order Service: Status
Order Service -> Notification Service: Send confirmation
Notification Service -> User: Email/SMS
```


## 4. Implementation Details

### 4.1 Security
- All endpoints behind API Gateway with JWT authentication
- Sensitive data encrypted at rest (AES-256) and in transit (TLS 1.3)
- PCI DSS separation for payment data
- Role-based/attribute-based access enforced in all services

### 4.2 Error Handling
- Retry logic for payment/notification failures (exponential backoff)
- Circuit breaker pattern for external integrations
- Centralized logging for all errors/events
- Graceful degradation: read-only mode on critical failures

### 4.3 Compliance
- Audit logs for all sensitive actions
- Consent management and data retention policies enforced
- Automated compliance reporting (export logs, lineage tracing)

### 4.4 Deployment
- Microservices deployed as Docker containers (Kubernetes)
- CI/CD pipeline with automated testing and security scanning
- Secrets managed via Vault/HSM
- Monitoring via Prometheus/Grafana

---

**End of LLD for TNS2 Online Shopping Platform**
