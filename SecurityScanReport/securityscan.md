# Security Scan Report

**Repository:** APB_Demo
**Branch:** ccFraudAlert1809
**Scan Date:** 2025-07-14

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 5 |
| Low | 3 |
| Info | 2 |

---

## Findings

---

### 1. [HIGH] Token Stored in Mutable In-Memory Variable Without Expiry or Validation — CWE-522 / CWE-613

- **File:** `src/app/services/auth.service.js`
- **Lines:** 10–13
- **Vulnerable Code:**
```javascript
let authToken = null;
...
authToken = response.data.token;
return authToken;
```
- **Issue:** The auth token is stored in a plain mutable closure variable (`let authToken`). There is no token expiry check, no token format/signature validation, no scope binding to a user session, and no protection against token being overwritten by any caller via `setToken()`. Any code in the same AngularJS DI context can call `AuthService.setToken(arbitraryValue)` to inject a forged or attacker-controlled token, which is then blindly attached to every outgoing HTTP request by the interceptor.
- **Impact:** Token substitution / session hijacking. An attacker with JavaScript execution (e.g., via a third-party script or XSS in another module) can replace the token in memory, causing all subsequent API calls to be authenticated with an attacker-controlled credential. Additionally, absence of expiry means a stolen token remains valid in-memory indefinitely for the lifetime of the SPA session.
- **OWASP:** A07:2021 – Identification and Authentication Failures
- **Recommendation:**
  - Remove the public `setToken()` method or restrict it to internal/trusted callers only.
  - Validate the token format (e.g., JWT structure check) before storing.
  - Implement token expiry tracking and proactive refresh logic.
  - Consider using `$window.sessionStorage` with a short-lived token and clear on tab close — but **never** store tokens in `localStorage` for sensitive financial apps.

---

### 2. [HIGH] URL Parameter Injection via Unsanitised Filter Values in `getAlerts()` — CWE-89 / CWE-20

- **File:** `src/app/modules/fraud-detection/services/alert-creation.service.js`
- **Lines:** 51–62
- **Vulnerable Code:**
```javascript
if (filters.severity) params.push('severity=' + filters.severity);
if (filters.status)   params.push('status='   + filters.status);
if (filters.search)   params.push('search='   + filters.search);
...
url += '?' + params.join('&');
return $http.get(url)
```
- **Issue:** Filter values (`severity`, `status`, `search`) are concatenated directly into the URL string without encoding or sanitisation. A malicious or unexpected value such as `high&admin=true`, `resolved&role=admin`, or a URL-encoded injection payload will be forwarded verbatim to the backend API. The `search` field is particularly dangerous because it is driven by free-text user input (see `alert-dashboard.controller.js` line 32).
- **Impact:** Server-side query injection, parameter pollution, potential IDOR/BOLA if the backend uses these parameters to scope data access. A crafted `search` value could also leak data belonging to other customers if the backend does not independently enforce authorisation.
- **OWASP:** A03:2021 – Injection; A01:2021 – Broken Access Control
- **Recommendation:**
  - Use AngularJS `$http` `params` object instead of manual URL construction — `$http` will automatically URL-encode values:
    ```javascript
    return $http.get(API_CONFIG.alertsUrl, { params: { severity: filters.severity, status: filters.status, search: filters.search } });
    ```
  - Whitelist allowed values for `severity` and `status` on the client before sending.
  - Enforce server-side authorisation scoped to the authenticated user regardless of filter parameters.

---

### 3. [MEDIUM] Sensitive Customer and Transaction Data Logged to Browser Console — CWE-532 / CWE-200

- **File:** `src/app/services/audit.service.js`
- **Lines:** 18–19, 23–24
- **Vulnerable Code:**
```javascript
$log.info('Audit logged:', event.type);
$log.error('Audit logging failed:', error);
```
- **File:** `src/app/modules/fraud-detection/controllers/alert-dashboard.controller.js`
- **Line:** 33
- **Vulnerable Code:**
```javascript
console.error('Failed to load alerts:', error);
```
- **File:** `src/app/modules/fraud-detection/directives/alert-card.directive.js`
- **Line:** (link function, catch block)
- **Vulnerable Code:**
```javascript
console.error('Failed to resolve alert:', error);
```
- **Issue:** `$log.info`, `$log.error`, and `console.error` calls may emit HTTP error responses to the browser console. In a financial fraud application, HTTP error payloads can contain `customer_id`, `account_id`, `transaction_id`, `alert_id`, and risk scores. Browser console output is accessible to browser extensions, injected scripts, and developer tools in production.
- **Impact:** Sensitive PII and fraud-case metadata exposure via browser console; violates PRD §22 (Log security events without unnecessarily storing sensitive payment data).
- **OWASP:** A09:2021 – Security Logging and Monitoring Failures
- **Recommendation:**
  - Strip or sanitise error objects before logging; log only safe identifiers (e.g., error codes, not full response bodies).
  - Disable or suppress `$log` in production builds using AngularJS `$logProvider.debugEnabled(false)`.
  - Route audit events exclusively to the server-side audit endpoint; do not mirror them to the browser console.

---

### 4. [MEDIUM] Audit Log Contains Full Alert and Transaction Objects Including `customer_id` — CWE-200 / CWE-532

- **File:** `src/app/modules/fraud-detection/services/alert-creation.service.js`
- **Lines:** 30–35
- **Vulnerable Code:**
```javascript
AuditService.logAlertCreation(alert);
const analyticsEvent = AnalyticsEventFactory.createFraudAlertEvent(alert);
AuditService.log({
  type: 'analytics_event',
  data: analyticsEvent
});
```
- **File:** `src/app/modules/fraud-detection/factories/analytics-event.factory.js`
- **Lines:** 15–20
- **Vulnerable Code:**
```javascript
createFraudAlertEvent: function(alert) {
  return this.createEvent('fraud_alert_created', {
    alert_id: alert.alert_id,
    transaction_id: alert.transaction_id,
    severity: alert.severity,
    customer_id: alert.customer_id   // ← PII in analytics event
  });
}
```
- **Issue:** `customer_id` is embedded in analytics events that are posted to the audit endpoint. If analytics events are forwarded to third-party analytics pipelines (common in financial apps), `customer_id` will be transmitted externally. Additionally, the full `alert` object (including `expires_at`, `created_at`) is sent via `logAlertCreation`, which may contain more fields than necessary.
- **Impact:** PII leakage to analytics/audit infrastructure; violates PRD §22 (Minimize sensitive data exposure) and data minimisation principles.
- **OWASP:** A02:2021 – Cryptographic Failures (data exposure); Privacy
- **Recommendation:**
  - Remove `customer_id` from analytics events; use a pseudonymous or hashed identifier for analytics.
  - Apply data minimisation: send only fields required for the specific audit event type.
  - Ensure the audit endpoint is distinct from any third-party analytics endpoint.

---

### 5. [MEDIUM] No CSRF Protection on State-Mutating HTTP Calls — CWE-352

- **File:** `src/app/shared/interceptors/auth.interceptor.js` (interceptor covers all requests)
- **Files affected:** `alert-creation.service.js` (POST, PATCH), `audit.service.js` (POST), `fraud-risk-engine.service.js` (POST)
- **Issue:** The `AuthInterceptor` attaches a Bearer token to all requests but does **not** attach an anti-CSRF token (e.g., `X-XSRF-TOKEN` header). AngularJS provides built-in XSRF/CSRF cookie-to-header support via `$http`'s `xsrfCookieName` / `xsrfHeaderName` configuration, but this is not configured anywhere in `app.module.js` or the interceptor. All POST and PATCH calls (alert creation, alert resolution, audit logging, risk evaluation) are therefore potentially vulnerable to CSRF if the API relies solely on cookie-based session state in any flow.
- **Impact:** Cross-site request forgery on fraud alert creation, resolution, and audit endpoints. An attacker could trigger alert resolution (closing a legitimate fraud alert) from a malicious page if the victim is authenticated.
- **OWASP:** A01:2021 – Broken Access Control; CSRF (CWE-352)
- **Recommendation:**
  - Configure AngularJS XSRF support in `app.module.js`:
    ```javascript
    $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
    $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
    ```
  - Ensure the backend sets a `XSRF-TOKEN` cookie and validates the `X-XSRF-TOKEN` header on all state-mutating endpoints.
  - Confirm Bearer token usage is the **sole** authentication mechanism (stateless JWT); if so, document this explicitly and ensure cookies are not used for session state.

---

### 6. [MEDIUM] `resolveAlert()` Directive Performs Privileged Action Without Client-Side Role/Authorization Check — CWE-285 / CWE-862

- **File:** `src/app/modules/fraud-detection/directives/alert-card.directive.js`
- **Lines:** (link function, `resolveAlert`)
- **Vulnerable Code:**
```javascript
scope.resolveAlert = function() {
  AlertCreationService.resolveAlert(scope.alertData.alert_id)
    ...
};
```
- **Issue:** Any user who can render an `<alert-card>` component can call `resolveAlert()` regardless of their role. There is no client-side check for whether the current user is a fraud operations analyst or the owning cardholder. While server-side enforcement is the authoritative control, the absence of any client-side role guard means the UI presents the "Resolve Alert" button to all users, violating the principle of least privilege and potentially enabling privilege escalation through UI manipulation.
- **Impact:** A cardholder could resolve a fraud alert that should only be resolved by a fraud operations analyst, potentially suppressing a legitimate fraud investigation. Violates PRD §14 (Operations visibility for authorized fraud operations users only).
- **OWASP:** A01:2021 – Broken Access Control
- **Recommendation:**
  - Inject `AuthService` or a `RoleService` into the directive and conditionally render the Resolve button based on role:
    ```javascript
    scope.canResolve = RoleService.hasRole('fraud_analyst');
    ```
  - Add `ng-if="canResolve"` to the resolve button in the template.
  - Enforce role-based access control server-side on the PATCH endpoint as the authoritative control.

---

### 7. [MEDIUM] `ingestTransaction()` Exposes Raw Error Details to the UI — CWE-209

- **File:** `src/app/modules/fraud-detection/controllers/alert-management.controller.js`
- **Lines:** 27–29
- **Vulnerable Code:**
```javascript
.catch(function(error) {
  vm.ingestionStatus = 'Error: ' + (error.error || 'Unknown error');
});
```
- **Issue:** The error message from the backend (or internal processing) is directly interpolated into `vm.ingestionStatus`, which is rendered in the UI. If the backend returns verbose error messages (e.g., stack traces, internal service names, database errors), these will be displayed to the end user and potentially to an attacker probing the ingestion endpoint.
- **Impact:** Information disclosure; internal architecture details exposed via UI error messages.
- **OWASP:** A05:2021 – Security Misconfiguration (CWE-209)
- **Recommendation:**
  - Map backend errors to generic, user-safe messages on the client:
    ```javascript
    vm.ingestionStatus = 'An error occurred processing the transaction. Please try again.';
    ```
  - Log detailed error information server-side only; never relay raw backend error strings to the UI.

---

### 8. [LOW] In-Memory Duplicate Transaction Set (`processedTransactions`) Is Not Persistent or Distributed — CWE-362

- **File:** `src/app/modules/fraud-detection/services/transaction-ingestion.service.js`
- **Lines:** 8, 14–16
- **Vulnerable Code:**
```javascript
const processedTransactions = new Set();
...
if (this.isDuplicate(transactionEvent.transaction_id)) {
  return $q.reject({ error: 'Duplicate transaction' });
}
processedTransactions.add(transactionEvent.transaction_id);
```
- **Issue:** The deduplication set lives only in browser memory for the current SPA session. It is cleared on page refresh, tab close, or navigation. A duplicate transaction submitted across two browser tabs, after a page reload, or via a direct API call will bypass this check entirely. This is a client-side-only control for a server-side concern.
- **Impact:** Duplicate fraud alerts or duplicate ingestion events could be created, violating PRD FR-10 (Idempotency). Could also be exploited to flood the alert system.
- **OWASP:** A04:2021 – Insecure Design
- **Recommendation:**
  - Idempotency must be enforced server-side using a durable store (e.g., database unique constraint on `transaction_id`).
  - The client-side check is acceptable as a UX optimisation only; document it as such and do not rely on it for security.

---

### 9. [LOW] `alert_id` Generated Client-Side Using `Date.now()` + `Math.random()` — CWE-330

- **File:** `src/app/modules/fraud-detection/services/alert-creation.service.js`
- **Lines:** 9–10
- **Vulnerable Code:**
```javascript
alert_id: 'ALERT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
```
- **Issue:** `Math.random()` is not a cryptographically secure random number generator (CSPRNG). Client-side ID generation using predictable entropy (`Date.now()` is millisecond-precision and observable) means `alert_id` values are guessable. If the backend accepts client-supplied `alert_id` values without overriding them, an attacker could predict or enumerate alert IDs and use them for IDOR attacks (e.g., resolving or querying another customer's alert).
- **Impact:** Predictable identifiers enabling IDOR/BOLA on alert endpoints.
- **OWASP:** A01:2021 – Broken Access Control; CWE-330 (Use of Insufficiently Random Values)
- **Recommendation:**
  - Generate `alert_id` server-side using a CSPRNG (e.g., UUID v4).
  - The client should not supply or pre-generate alert IDs; the server should assign and return the canonical ID in the response.
  - If client-side generation is required for optimistic UI, use `crypto.getRandomValues()` instead of `Math.random()`.

---

### 10. [LOW] `session_id` Generated Using `Math.random()` — CWE-330

- **File:** `src/app/modules/fraud-detection/factories/analytics-event.factory.js`
- **Lines:** 17–19
- **Vulnerable Code:**
```javascript
generateSessionId: function() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```
- **Issue:** Same weak entropy issue as Finding 9. Session IDs generated with `Math.random()` are predictable and should not be used as security-relevant identifiers.
- **Impact:** Predictable session identifiers in analytics events; low direct exploitability but violates secure coding standards for financial applications.
- **OWASP:** CWE-330
- **Recommendation:**
  - Use `crypto.getRandomValues()` for any identifier used in a security or audit context.
  - Prefer server-assigned session identifiers tied to the authenticated session.

---

### 11. [INFO] No Route Guards or `$routeProvider` / `ui-router` State Authorization Visible in Codebase

- **Files:** All reviewed files
- **Issue:** No routing configuration, route guards, or state-level authorization checks are present in the reviewed source. It cannot be confirmed whether protected routes (e.g., fraud operations dashboard) enforce authentication and role checks before rendering. This may be out of scope for this branch but is noted for completeness.
- **Impact:** If routing is unguarded, unauthenticated users may access fraud alert screens directly.
- **OWASP:** A01:2021 – Broken Access Control
- **Recommendation:** Ensure route-level guards validate authentication and role before activating any fraud-related state. Review routing configuration files if not included in this branch.

---

### 12. [INFO] No AngularJS, npm, or Bower Dependency Manifest Present in Reviewed Source

- **Files:** No `package.json`, `bower.json`, or `angular.json` found in `src/`
- **Issue:** Dependency files were not included in the reviewed branch. Vulnerable or outdated AngularJS versions (e.g., AngularJS < 1.8.x has known XSS/prototype-pollution CVEs) and third-party npm/Bower packages cannot be assessed.
- **Impact:** Unknown; potentially HIGH if an EOL AngularJS version or vulnerable dependency is in use.
- **OWASP:** A06:2021 – Vulnerable and Outdated Components
- **Recommendation:** Include `package.json` / `bower.json` in the next scan. Run `npm audit` or equivalent. Note that AngularJS (1.x) reached End-of-Life on December 31, 2021 — migration to Angular (2+) or an actively maintained framework should be planned.

---

## Summary Table

| # | Severity | File | Issue | OWASP / CWE |
|---|----------|------|-------|-------------|
| 1 | HIGH | `auth.service.js` | Mutable token storage; public `setToken()` enables token substitution | CWE-522, CWE-613 |
| 2 | HIGH | `alert-creation.service.js` | Unsanitised filter values concatenated into URL (injection + IDOR risk) | CWE-89, CWE-20 |
| 3 | MEDIUM | `audit.service.js`, controllers, directive | Sensitive data in browser console logs | CWE-532, CWE-200 |
| 4 | MEDIUM | `alert-creation.service.js`, `analytics-event.factory.js` | `customer_id` PII in analytics audit events | CWE-200 |
| 5 | MEDIUM | `auth.interceptor.js`, `app.module.js` | No CSRF/XSRF token configuration | CWE-352 |
| 6 | MEDIUM | `alert-card.directive.js` | No client-side role check on Resolve Alert action | CWE-285, CWE-862 |
| 7 | MEDIUM | `alert-management.controller.js` | Raw backend error message exposed in UI | CWE-209 |
| 8 | LOW | `transaction-ingestion.service.js` | Client-only deduplication; no server-side idempotency guarantee | CWE-362 |
| 9 | LOW | `alert-creation.service.js` | Client-side `alert_id` using `Math.random()` (predictable) | CWE-330 |
| 10 | LOW | `analytics-event.factory.js` | `session_id` using `Math.random()` (weak entropy) | CWE-330 |
| 11 | INFO | All files | No route guards visible in reviewed scope | A01:2021 |
| 12 | INFO | N/A | No dependency manifests; AngularJS EOL risk unverifiable | A06:2021 |

---

## Final Decision

**Status: ⚠️ PASS_WITH_WARNINGS**

**Reason:**
No Critical severity findings were identified. No hardcoded credentials, secrets, or API keys were detected in the codebase. No direct XSS vectors (`ng-bind-html`, `$sce.trustAsHtml`, `innerHTML`, `eval()`, `$compile` with untrusted input) were found. The two HIGH findings — token substitution via public `setToken()` and URL parameter injection in `getAlerts()` — are exploitable but require either co-located malicious JavaScript execution or a cooperative/vulnerable backend. They do not constitute an authentication bypass or direct credential exposure on their own.

The five MEDIUM findings (console log exposure, PII in analytics events, missing CSRF configuration, missing role guard on alert resolution, and raw error message disclosure) are non-blocking but must be remediated before production deployment given the security-critical, P0 nature of this fraud alert feature as defined in the PRD.

**Required actions before progressing to production:**
1. Fix HIGH findings (URL injection and token storage) — these must be resolved before the next security review cycle.
2. Address MEDIUM findings, particularly CSRF configuration and role-based access control on alert resolution, as these directly violate PRD §22 security requirements.
3. Provide dependency manifests (`package.json` / `bower.json`) for a complete dependency vulnerability assessment.
4. Confirm server-side enforcement of all access control, idempotency, and input validation controls — client-side controls alone are insufficient for a P0 security-critical feature.

The code **may proceed to unit testing** with the above findings tracked as mandatory remediation items prior to any staging or production deployment.