# Security Scan Report

**Repository:** APB_Demo
**Branch:** ccFraudAlertCredit1709
**Scan Date:** 2025-07-14

---

## Security Gate Decision

**Status:** 🔴 FAIL

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 4 |
| Medium | 3 |
| Low | 3 |
| Info | 1 |

---

## Findings

---

### 1. [CRITICAL] Hardcoded Mock Credential / Secret Token — CWE-798

- **File:** `src/app/services/auth.service.js`
- **Line:** 7
- **Vulnerable Code:**
```javascript
return localStorage.getItem('auth_token') || 'mock-jwt-token-*****';
```
- **Issue:** A hardcoded fallback credential (`mock-jwt-token-*****`) is embedded directly in source code. If `localStorage` returns null (unauthenticated user), the application silently falls back to this static token, meaning `isAuthenticated()` will always return `true` and every outbound HTTP request via the interceptor will carry this hardcoded bearer token.
- **Security Impact:** Authentication bypass — any unauthenticated user is treated as authenticated. The hardcoded token may be accepted by backend services if not properly validated, enabling full unauthorized access to fraud alert, transaction, and audit APIs. This is a direct violation of PRD §22 ("Use secure authentication before sensitive fraud-response actions").
- **OWASP:** A07:2021 – Identification and Authentication Failures
- **Recommended Fix:**
  - Remove the hardcoded fallback entirely. Return `null` when no token is present.
  - Redirect unauthenticated users to a proper login/authentication flow.
  - Implement token expiry validation (JWT `exp` claim check) before trusting the stored token.
```javascript
self.getToken = function() {
  return localStorage.getItem('auth_token'); // No hardcoded fallback
};
self.isAuthenticated = function() {
  const token = self.getToken();
  if (!token) return false;
  // Optionally: validate JWT expiry here
  return true;
};
```

---

### 2. [CRITICAL] Authentication Bypass on Sensitive Fraud Actions — CWE-306 / CWE-862

- **File:** `src/app/fraud-alert/controllers/transaction-detail.controller.js`
- **Lines:** 22–45 (`confirmTransaction`, `reportTransaction`)
- **Vulnerable Code:**
```javascript
vm.confirmTransaction = function() {
  ...
  AlertRecordService.updateAlert(alert.alertId, { status: 'Confirmed', resolvedBy: 'customer' })
  ...
};
vm.reportTransaction = function() {
  ...
  AlertRecordService.updateAlert(alert.alertId, { status: 'Reported', resolvedBy: 'customer' })
  ...
};
```
- **Issue:** The `confirmTransaction()` and `reportTransaction()` functions — which are security-critical actions (confirming or denying fraud, triggering account protection workflows) — execute with **zero authentication or authorization checks** at the controller level. There is no step-up authentication, no identity verification, no ownership check confirming the acting user owns the alert or the transaction. The `resolvedBy` field is hardcoded to the string `'customer'` rather than a verified user identity.
- **Security Impact:** Any user who can navigate to `/transaction/:id` can confirm or report any alert by ID. This enables: (1) an attacker confirming fraudulent transactions to suppress fraud reports; (2) unauthorized account protection triggers (card blocking) against any victim's account — a severe IDOR/BOLA. Directly violates PRD §10 ("Customer responses must be authenticated and authorized") and §22.
- **OWASP:** A01:2021 – Broken Access Control; A07:2021 – Identification and Authentication Failures
- **Recommended Fix:**
  - Require step-up authentication (re-prompt credentials or MFA) before executing either action.
  - Verify that the authenticated user's identity matches the `customer_id` on the alert before allowing the update.
  - Replace hardcoded `resolvedBy: 'customer'` with the verified authenticated user ID from `AuthService`.
  - Implement server-side ownership validation on the `updateAlert` endpoint.
```javascript
vm.confirmTransaction = function() {
  AuthService.requireStepUpAuth().then(function(verifiedUserId) {
    if (verifiedUserId !== vm.alerts[0].customerId) {
      ToastService.error('Unauthorized action.');
      return;
    }
    AlertRecordService.updateAlert(alert.alertId, {
      status: 'Confirmed',
      resolvedAt: new Date().toISOString(),
      resolvedBy: verifiedUserId
    });
  });
};
```

---

### 3. [HIGH] Insecure Token Storage in localStorage — CWE-922

- **File:** `src/app/services/auth.service.js`
- **Lines:** 8–10
- **Vulnerable Code:**
```javascript
self.setToken = function(token) {
  localStorage.setItem('auth_token', token);
};
```
- **Issue:** The JWT authentication token is stored in `localStorage`, which is accessible to any JavaScript running on the page, including injected scripts from XSS attacks. For a fraud alert application handling sensitive financial data and security-critical actions (card blocking, fraud reporting), this is a significant risk.
- **Security Impact:** If any XSS vulnerability exists (see Finding #4), an attacker can trivially exfiltrate the auth token via `localStorage.getItem('auth_token')` and impersonate the cardholder to confirm or suppress fraud alerts, or trigger account protection workflows.
- **OWASP:** A02:2021 – Cryptographic Failures; A05:2021 – Security Misconfiguration
- **CWE:** CWE-922 (Insecure Storage of Sensitive Information)
- **Recommended Fix:**
  - Store authentication tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies, which are not accessible to JavaScript.
  - If `localStorage` must be used, implement short token lifetimes and refresh token rotation.
  - Never store tokens in `localStorage` for security-critical financial applications.

---

### 4. [HIGH] DOM-Based XSS via Unsafe `onclick` with Interpolated Data — CWE-79

- **File:** `src/app/fraud-alert/views/transaction-dashboard.view.html`
- **Line:** 21
- **Vulnerable Code:**
```html
<button ... onclick="window.location.href='#/transaction/'+this.getAttribute('data-id')"
  data-id="{{txn.transactionId}}">View Details</button>
```
- **Issue:** The `data-id` attribute is populated with `{{txn.transactionId}}` (AngularJS interpolation from server data), and a raw inline `onclick` handler reads this attribute and constructs a URL for `window.location.href`. If `txn.transactionId` contains a value such as `'; alert(1);//` or a `javascript:` payload, this results in DOM-based XSS. Furthermore, mixing AngularJS `ng-click` with a raw `onclick` is an anti-pattern that bypasses Angular's security context. The `ng-click="vm.viewDetail(txn.transactionId)"` is also present but `viewDetail` is not defined in the controller, making the `onclick` the effective handler.
- **Security Impact:** Stored/reflected XSS via transaction data from the API. An attacker who can influence transaction IDs or merchant data returned by the API can execute arbitrary JavaScript in the cardholder's browser, steal the auth token from `localStorage`, and perform account takeover.
- **OWASP:** A03:2021 – Injection (XSS)
- **CWE:** CWE-79
- **Recommended Fix:**
  - Remove the raw `onclick` entirely. Use only `ng-click` with AngularJS routing.
  - Implement `vm.viewDetail` in the controller using `$location.path()`.
  - Never construct URLs from unvalidated data in inline event handlers.
```html
<!-- HTML -->
<button class="btn btn-primary" ng-click="vm.viewDetail(txn.transactionId)">View Details</button>
```
```javascript
// Controller
vm.viewDetail = function(transactionId) {
  $location.path('/transaction/' + encodeURIComponent(transactionId));
};
```

---

### 5. [HIGH] Full Transaction Object Logged to Audit — Sensitive Data Exposure — CWE-532 / CWE-359

- **File:** `src/app/services/audit-log.service.js`
- **Lines:** 7–9
- **Vulnerable Code:**
```javascript
const auditData = {
  ...
  eventData: { decision: decision, riskScore: riskScore, transaction: transaction },
  ...
};
return $http.post(AUDIT_API_ENDPOINT, auditData);
```
- **Issue:** The entire `transaction` object is serialized and posted to the audit endpoint. The transaction object (per PRD §15) contains `account_id`, `card_id`, `merchant`, `amount`, `currency`, `timestamp`, and `channel`. Posting the full object to an audit log endpoint without field-level filtering risks over-exposure of sensitive PAN-adjacent data, card identifiers, and account identifiers in audit stores that may have broader access than transactional systems.
- **Security Impact:** Violation of PCI-DSS data minimization requirements. Audit logs accessible to operations staff or leaked via misconfigured log aggregation could expose card identifiers and account data. Directly violates PRD §22 ("Log security events without unnecessarily storing sensitive payment data").
- **OWASP:** A02:2021 – Cryptographic Failures
- **CWE:** CWE-532, CWE-359
- **Recommended Fix:**
  - Log only a minimal, pre-approved set of fields (e.g., `transactionId`, `riskBand`, `decision`, `timestamp`). Never log full card or account objects.
```javascript
eventData: {
  transactionId: transaction.transactionId,
  decision: decision.action,
  riskBand: riskScore.riskLevel,
  modelVersion: riskScore.modelVersion
}
```

---

### 6. [HIGH] Unparameterized URL Construction — IDOR / Path Traversal Risk — CWE-22 / CWE-639

- **File:** `src/app/services/audit-log.service.js`
- **Line:** 24
- **Vulnerable Code:**
```javascript
return $http.get(AUDIT_API_ENDPOINT + '?transactionId=' + transactionId);
```
- **File:** `src/app/services/alert-record.service.js`
- **Lines:** 19, 24
- **Vulnerable Code:**
```javascript
$http.get(API_CONFIG.baseUrl + API_CONFIG.alertsEndpoint + '/' + alertId)
$http.put(API_CONFIG.baseUrl + API_CONFIG.alertsEndpoint + '/' + alertId, updateData)
```
- **File:** `src/app/services/transaction-ingestion.service.js`
- **Line:** 11
- **Vulnerable Code:**
```javascript
$http.get(API_CONFIG.baseUrl + API_CONFIG.transactionsEndpoint + '/' + transactionId)
```
- **Issue:** Route parameters (`transactionId`, `alertId`) sourced from `$routeParams` (user-controlled URL) are concatenated directly into API URLs without encoding or validation. This enables IDOR — a user can enumerate any `alertId` or `transactionId` by manipulating the URL. It also creates a path traversal risk (e.g., `alertId = '../admin/users'`).
- **Security Impact:** Horizontal privilege escalation — any authenticated user can read or modify any other user's fraud alerts, transaction details, or audit logs by changing the ID in the URL. This is a direct BOLA (Broken Object Level Authorization) vulnerability.
- **OWASP:** A01:2021 – Broken Access Control
- **CWE:** CWE-639 (IDOR), CWE-22 (Path Traversal)
- **Recommended Fix:**
  - Use `encodeURIComponent()` on all user-supplied parameters before URL construction.
  - Enforce server-side ownership validation — the API must verify the requesting user owns the resource.
  - Validate `transactionId` and `alertId` against a strict allowlist pattern (e.g., UUID regex) before use.
```javascript
self.getTransactionById = function(transactionId) {
  if (!/^[a-f0-9\-]{36}$/.test(transactionId)) {
    return $q.reject('Invalid transaction ID');
  }
  return $http.get(API_CONFIG.baseUrl + API_CONFIG.transactionsEndpoint + '/' + encodeURIComponent(transactionId));
};
```

---

### 7. [MEDIUM] No Route Guards / Authentication Enforcement on Routes — CWE-862

- **File:** `src/app/app.module.js`
- **Lines:** 9–13
- **Vulnerable Code:**
```javascript
$routeProvider
  .when('/dashboard', { templateUrl: '...', controller: 'TransactionDashboardController', ... })
  .when('/transaction/:id', { templateUrl: '...', controller: 'TransactionDetailController', ... })
  .otherwise({ redirectTo: '/dashboard' });
```
- **Issue:** Neither route has a `resolve` guard that checks authentication before rendering. Any unauthenticated user who navigates directly to `/#/dashboard` or `/#/transaction/123` will have the controller instantiated and API calls fired. Combined with the hardcoded fallback token (Finding #1), this means all routes are effectively open.
- **Security Impact:** Unauthenticated access to fraud alert dashboards and transaction detail screens. Violates PRD §22 ("Use secure authentication").
- **OWASP:** A01:2021 – Broken Access Control
- **Recommended Fix:**
  - Add a `resolve` block to each route that calls `AuthService.isAuthenticated()` and redirects to login if false.
```javascript
.when('/dashboard', {
  templateUrl: '...',
  controller: 'TransactionDashboardController',
  resolve: {
    auth: ['AuthService', '$location', function(AuthService, $location) {
      if (!AuthService.isAuthenticated()) { $location.path('/login'); }
    }]
  }
})
```

---

### 8. [MEDIUM] Sensitive Error Details Exposed via `alert()` Toast — CWE-209

- **File:** `src/app/services/toast.service.js`
- **Lines:** 5–7
- **Vulnerable Code:**
```javascript
self.show = function(message, type) {
  alert((type || 'INFO') + ': ' + message);
};
```
- **File:** `src/app/shared/interceptors/http.interceptor.js`
- **Line:** 14
- **Vulnerable Code:**
```javascript
const errorMsg = 'API Error: ' + (rejection.data && rejection.data.message || rejection.statusText || 'Unknown error');
ToastService.error(errorMsg);
```
- **Issue:** The `ToastService` uses the browser's native `alert()` dialog, which (1) exposes raw API error messages including server-side error details, stack traces, or internal URLs to the user and (2) is a blocking UI call that can be used for UI redress attacks. Additionally, `AuditLogService.logEvent('api_error', { url: rejection.config.url })` logs the full request URL, which may contain sensitive query parameters (e.g., `?transactionId=...`).
- **Security Impact:** Information disclosure of internal API structure, error messages, and endpoint URLs. The full URL logged in audit events may expose sensitive identifiers.
- **OWASP:** A05:2021 – Security Misconfiguration
- **CWE:** CWE-209
- **Recommended Fix:**
  - Replace `alert()` with a proper non-blocking UI notification component.
  - Display only generic, user-safe error messages to the UI; log detailed errors server-side only.
  - Sanitize URLs before logging — strip query parameters containing sensitive identifiers.

---

### 9. [MEDIUM] Audit Log `userId` Hardcoded to `'system'` — CWE-284 / CWE-778

- **File:** `src/app/services/audit-log.service.js`
- **Lines:** 8, 18
- **Vulnerable Code:**
```javascript
userId: 'system'
```
- **Issue:** All audit log entries — including fraud decisions, alert confirmations, and unauthorized reports — are attributed to the hardcoded string `'system'` rather than the authenticated user's identity. This makes the audit trail non-attributable and non-repudiable, meaning it is impossible to determine which cardholder performed which action.
- **Security Impact:** Violates PRD §7 FR-09 ("System must record alert creation, delivery, customer response, and resulting action") and §10 ("Fraud-alert decisions must be auditable"). Compliance failure for PCI-DSS Requirement 10 (audit trails must identify the user). An attacker performing unauthorized actions cannot be traced.
- **OWASP:** A09:2021 – Security Logging and Monitoring Failures
- **CWE:** CWE-778 (Insufficient Logging)
- **Recommended Fix:**
  - Inject `AuthService` into `AuditLogService` and use the authenticated user's ID for all log entries.
```javascript
userId: AuthService.getCurrentUserId() || 'unauthenticated'
```

---

### 10. [LOW] `$scope.$apply()` Called Unsafely Inside Promise Callbacks — CWE-362

- **File:** `src/app/fraud-alert/controllers/transaction-dashboard.controller.js`
- **Lines:** 20, 27
- **Vulnerable Code:**
```javascript
$scope.$apply();
```
- **Issue:** `$scope.$apply()` is called directly inside `$http` promise callbacks. Since `$http` already resolves within the Angular digest cycle, this will throw `$apply already in progress` errors in certain race conditions, potentially causing the application to enter an inconsistent state or silently swallow errors.
- **Security Impact:** Low direct security impact, but application instability during fraud evaluation could result in incorrect risk decisions being silently discarded, partially evaluated, or displayed incorrectly — undermining the reliability of the fraud alert system.
- **Recommended Fix:** Remove the manual `$scope.$apply()` calls. Use `$scope.$applyAsync()` if digest triggering is genuinely needed, or restructure to use `$q` promises throughout.

---

### 11. [LOW] Insecure Direct Object Reference via `$routeParams.id` Without Validation — CWE-20

- **File:** `src/app/fraud-alert/controllers/transaction-detail.controller.js`
- **Line:** 9
- **Vulnerable Code:**
```javascript
vm.transactionId = $routeParams.id;
```
- **Issue:** The `transactionId` is taken directly from the URL route parameter with no format validation, length check, or sanitization before being passed to service calls and embedded in API URLs.
- **Security Impact:** Enables path traversal and IDOR attacks as described in Finding #6. A malformed ID could also cause unexpected application behavior.
- **Recommended Fix:** Validate `$routeParams.id` against a strict UUID or expected format regex before use. Redirect to an error page if validation fails.

---

### 12. [LOW] Missing XSRF/CSRF Token Configuration — CWE-352

- **File:** `src/app/app.module.js` / `src/app/shared/interceptors/http.interceptor.js`
- **Issue:** While `$httpProvider.interceptors` is configured, there is no explicit CSRF/XSRF token setup. AngularJS provides built-in XSRF protection via `$http` (reads `XSRF-TOKEN` cookie and sends `X-XSRF-TOKEN` header), but this requires the server to set the cookie. There is no evidence this is configured, and the interceptor does not enforce or validate XSRF tokens for state-changing requests (`POST`, `PUT`).
- **Security Impact:** If the backend does not set the `XSRF-TOKEN` cookie, all state-mutating API calls (alert updates, audit log writes) are vulnerable to CSRF attacks.
- **OWASP:** A01:2021 – Broken Access Control
- **CWE:** CWE-352
- **Recommended Fix:**
  - Confirm the backend sets the `XSRF-TOKEN` cookie on session establishment.
  - Explicitly configure `$httpProvider.defaults.xsrfCookieName` and `$httpProvider.defaults.xsrfHeaderName`.
  - Add CSRF validation in the HTTP interceptor for mutating requests.

---

### 13. [INFO] No Dependency Manifest Present (package.json / bower.json) — Dependency Audit Incomplete

- **File:** N/A (not present in `src/`)
- **Issue:** No `package.json`, `bower.json`, or equivalent dependency manifest was found in the scanned repository folder. The AngularJS version in use, `ngRoute`, `ngResource`, and all transitive dependencies cannot be assessed for known CVEs.
- **Security Impact:** AngularJS (1.x) reached end-of-life on December 31, 2021 and receives no further security patches. Multiple known XSS and prototype pollution vulnerabilities exist in older 1.x versions (e.g., CVE-2022-25844, CVE-2023-26116). Without a manifest, the exact version and its vulnerability status cannot be confirmed.
- **Recommended Fix:** Provide `package.json` or `bower.json` for a complete dependency vulnerability scan. Strongly consider migrating from AngularJS 1.x to a supported framework (Angular 17+, React, Vue).

---

## Summary Table

| # | Severity | File | Issue | OWASP | CWE |
|---|----------|------|-------|-------|-----|
| 1 | CRITICAL | `auth.service.js` | Hardcoded fallback credential + auth bypass | A07:2021 | CWE-798 |
| 2 | CRITICAL | `transaction-detail.controller.js` | No auth/authz on confirm/report fraud actions | A01, A07:2021 | CWE-306, CWE-862 |
| 3 | HIGH | `auth.service.js` | JWT stored in `localStorage` | A02:2021 | CWE-922 |
| 4 | HIGH | `transaction-dashboard.view.html` | DOM XSS via inline `onclick` + interpolated data | A03:2021 | CWE-79 |
| 5 | HIGH | `audit-log.service.js` | Full transaction object in audit log | A02:2021 | CWE-532, CWE-359 |
| 6 | HIGH | Multiple services | Unencoded URL params — IDOR/BOLA/Path Traversal | A01:2021 | CWE-639, CWE-22 |
| 7 | MEDIUM | `app.module.js` | No route guards — unauthenticated route access | A01:2021 | CWE-862 |
| 8 | MEDIUM | `toast.service.js`, `http.interceptor.js` | API errors exposed via `alert()` | A05:2021 | CWE-209 |
| 9 | MEDIUM | `audit-log.service.js` | Hardcoded `userId: 'system'` in all audit logs | A09:2021 | CWE-778 |
| 10 | LOW | `transaction-dashboard.controller.js` | Unsafe `$scope.$apply()` in promise callbacks | — | CWE-362 |
| 11 | LOW | `transaction-detail.controller.js` | No `$routeParams.id` format validation | — | CWE-20 |
| 12 | LOW | `app.module.js` / interceptor | CSRF/XSRF token not explicitly configured | A01:2021 | CWE-352 |
| 13 | INFO | N/A | No dependency manifest — AngularJS EOL version unconfirmed | — | — |

---

## Final Decision

**Status: 🔴 FAIL**

**Reason:** The codebase contains **2 Critical** and **4 High** severity vulnerabilities that individually and collectively constitute blocking security defects for a security-critical financial application:

1. **[CRITICAL — CWE-798]** A hardcoded fallback mock JWT token in `auth.service.js` causes `isAuthenticated()` to always return `true`, resulting in a complete **authentication bypass** for all unauthenticated users. Every outbound HTTP request carries this static bearer token.

2. **[CRITICAL — CWE-306/862]** The `confirmTransaction()` and `reportTransaction()` controller functions — which trigger fraud suppression and account protection workflows — execute with **zero authentication verification and no ownership/authorization checks**, enabling any user to manipulate any cardholder's fraud alerts (IDOR/BOLA).

3. **[HIGH — CWE-79]** A DOM-based XSS vector exists in the dashboard view via an inline `onclick` handler constructing `window.location.href` from server-supplied, interpolated transaction data.

4. **[HIGH — CWE-922]** Auth tokens stored in `localStorage` are fully exfiltrable via XSS, compounding Finding #3 into a complete account takeover chain.

These findings represent **exploitable authentication bypass, authorization failure, and XSS vulnerabilities** in a P0 security-critical fraud management system. The code **must not proceed to unit testing** until all Critical and High findings are remediated and a follow-up security review is completed.