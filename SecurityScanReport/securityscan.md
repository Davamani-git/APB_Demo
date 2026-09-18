# Security Scan Report

**Repository:** APB_Demo
**Branch:** ccCreditCardFraudAlert1809
**Scan Date:** 2025-01-31
**Scanned By:** Senior Security & Compliance Engineer (CISSP, OSCP)

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 3 |
| Medium | 5 |
| Low | 4 |
| Info | 2 |

> **Note:** No Critical findings detected. Three High-severity findings require remediation before production release but are assessed as non-blocking for unit testing given their dependency on server-side controls. Proceed to unit testing with mandatory remediation tracked.

---

## Findings

---

### 1. [HIGH] Sensitive Token Retrieved from localStorage — CWE-922 / OWASP A02:2021

- **File:** `src/app/fraud-alert/fraud-alert.module.js`
- **Line:** 37
- **Vulnerable Code:**
```javascript
const token = $window.localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = 'Bearer ' + token;
}
```
- **Issue:** The JWT/auth token is stored in and retrieved from `localStorage`. `localStorage` is accessible to any JavaScript running on the page, making the token vulnerable to theft via XSS attacks. For a security-critical fraud alert application handling financial data, this is a significant risk.
- **Security Impact:** If an XSS vulnerability exists anywhere on the same origin, an attacker can exfiltrate the `authToken` and impersonate the authenticated user, gaining full access to fraud alert data, audit logs, and card management actions.
- **Recommended Fix:** Store authentication tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed server-side. If client-side token storage is architecturally required, use `sessionStorage` as a minimum improvement, but prefer HttpOnly cookies for this security-critical domain.

---

### 2. [HIGH] Missing Authorization / Role Validation on Sensitive Operations — CWE-862 / OWASP A01:2021

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 52–65
- **Vulnerable Code:**
```javascript
vm.updateAlert = function() {
  const updates = {
    status: vm.alert.status,
    notes: vm.notes,
    reviewedBy: 'current_user'   // <-- hardcoded placeholder
  };
  alertRecordService.updateAlert(vm.alert.alertId, updates)
    .then(function(updatedAlert) { ... });
};
```
- **Issue:** (a) The `reviewedBy` field is hardcoded as the string `'current_user'` rather than being populated from an authenticated identity provider or session. This means audit records will contain a meaningless, non-attributable actor. (b) There is no client-side role check before allowing status updates (e.g., only `fraud_analyst` or `operations` roles should be able to resolve or mark false-positive). While server-side enforcement is expected, the absence of any client-side guard means the UI presents sensitive controls to all authenticated users indiscriminately.
- **Security Impact:** Audit trail integrity is broken — fraudulent or erroneous updates cannot be attributed to a real user. Privilege escalation risk if role enforcement is also absent server-side (IDOR/BOLA pattern — any authenticated user can update any alert by knowing the `alertId`).
- **Recommended Fix:** (a) Inject the authenticated user identity from a trusted session/identity service and populate `reviewedBy` dynamically. (b) Add a route resolve guard that checks the user's role before activating the detail controller. (c) Ensure the backend enforces ownership and role-based access control on `PUT /api/fraud-alerts/:alertId`.

---

### 3. [HIGH] Insecure Direct Object Reference (IDOR/BOLA) on Alert Retrieval — CWE-639 / OWASP A01:2021

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 20–22
- **Vulnerable Code:**
```javascript
vm.init = function() {
  const alertId = $routeParams.alertId;
  vm.loadAlert(alertId);
```
- **File:** `src/app/services/alert-record.service.js`
- **Lines:** 18–21
- **Vulnerable Code:**
```javascript
self.getAlertById = function(alertId) {
  return $http.get(API_ENDPOINTS.fraudAlerts + '/' + alertId)
```
- **Issue:** The `alertId` is taken directly from the URL route parameter and passed to the API without any client-side ownership or authorization check. A user who can guess or enumerate `alertId` values (which are time-based — see Finding #8) can access any fraud alert record.
- **Security Impact:** Unauthorized disclosure of sensitive fraud alert data including `cardId`, `riskScore`, `riskLevel`, `transactionId`, and audit history for other customers' accounts.
- **Recommended Fix:** The backend API must enforce that the requesting user owns or is authorized to access the requested `alertId`. On the client, add a route resolve that validates the user's session before loading. Consider opaque, non-guessable UUIDs for alert identifiers (see also Finding #8).

---

### 4. [MEDIUM] Predictable / Enumerable ID Generation — CWE-330 / OWASP A04:2021

- **File:** `src/app/services/alert-record.service.js`
- **Lines:** 52–54
- **Vulnerable Code:**
```javascript
self.generateAlertId = function() {
  return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
```
- **File:** `src/app/services/audit.service.js`
- **Lines:** 47–49
- **Vulnerable Code:**
```javascript
self.generateId = function() {
  return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
```
- **Issue:** IDs are generated client-side using `Date.now()` (millisecond timestamp) combined with `Math.random()`, which is not a cryptographically secure random number generator. The timestamp component makes IDs partially predictable and enumerable. IDs should be generated server-side.
- **Security Impact:** Facilitates IDOR attacks (Finding #3). An attacker can narrow the search space for valid `alertId` values using the timestamp prefix. `Math.random()` is not CSPRNG and can be predicted in some browser environments.
- **Recommended Fix:** Generate all IDs server-side using a cryptographically secure UUID (e.g., UUID v4). The client should never be responsible for generating resource identifiers for security-sensitive records.

---

### 5. [MEDIUM] Sensitive Financial Data Exposed in Audit Log Payload — CWE-532 / OWASP A09:2021

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 56–62
- **Vulnerable Code:**
```javascript
auditService.logDecision({
  transactionId: vm.alert.transactionId,
  eventType: 'alert_updated',
  payload: updates   // contains status, notes, reviewedBy
});
```
- **File:** `src/app/fraud-alert/services/policy-decision.service.js`
- **Lines:** 44–49
- **Vulnerable Code:**
```javascript
const auditData = {
  ...
  payload: {
    decision: decision,
    riskScore: riskScore   // full riskScore object including factors
  }
};
```
- **Issue:** Full decision objects including risk scores, risk factors, and internal model metadata are serialized into audit log payloads and sent to `/api/audit-logs`. These are also rendered directly in the UI via `{{log.payload | json}}` in `alert-detail.view.html` (line ~95). Exposing internal fraud model signals in the UI violates the PRD requirement: *"Expose internal fraud-model logic to customers."* (Section 3, Non-Goals).
- **Security Impact:** Internal fraud model signals could be exploited by fraudsters to tune attacks to avoid detection. Sensitive operational data is unnecessarily surfaced to UI users.
- **Recommended Fix:** Sanitize audit payloads before logging — strip internal model factors and scores. Apply field-level access control server-side so that model internals are never returned to the frontend. In the UI, restrict the `payload` display to non-sensitive fields only, or restrict the Audit History panel to authorized operations roles.

---

### 6. [MEDIUM] No Route Authentication Guard / Missing Resolve on Protected Routes — CWE-284 / OWASP A01:2021

- **File:** `src/app/fraud-alert/fraud-alert.module.js`
- **Lines:** 18–33
- **Vulnerable Code:**
```javascript
$routeProvider
  .when('/dashboard', {
    templateUrl: '...',
    controller: 'alertDashboardController',
    controllerAs: 'vm'
  })
  .when('/alert/:alertId', {
    templateUrl: '...',
    controller: 'alertDetailController',
    controllerAs: 'vm'
  })
```
- **Issue:** Neither route has a `resolve` guard to verify authentication before the controller activates. While the HTTP interceptor handles 401/403 responses reactively, the routes themselves are unprotected — controllers initialize, make API calls, and render partial data before any auth failure is detected and redirected.
- **Security Impact:** Unauthenticated users may briefly access route templates and any data cached client-side. Increases attack surface for timing-based information leakage.
- **Recommended Fix:** Add an `authGuard` resolve function to each protected route:
```javascript
.when('/dashboard', {
  resolve: {
    auth: ['authGuardService', function(authGuardService) {
      return authGuardService.requireAuthentication();
    }]
  },
  ...
})
```

---

### 7. [MEDIUM] Error Details Logged to Console — CWE-209 / OWASP A09:2021

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Line:** 35
- **Vulnerable Code:**
```javascript
console.error('Failed to load audit logs:', error);
```
- **File:** `src/app/services/audit.service.js`
- **Line:** 29
- **Vulnerable Code:**
```javascript
console.error('Audit log failed:', error);
```
- **Issue:** Raw error objects (which may contain HTTP response bodies, stack traces, API URLs, or partial sensitive data) are logged to the browser console. In production, this information is visible to anyone with DevTools access on a shared or compromised machine.
- **Security Impact:** Information disclosure — internal API structure, error messages, and potentially partial sensitive data may be exposed via browser console in production builds.
- **Recommended Fix:** Remove or gate all `console.error`/`console.log` calls behind a build-time environment flag (e.g., only active when `NODE_ENV !== 'production'`). Use a structured, server-side logging service for production error reporting.

---

### 8. [MEDIUM] Unvalidated `alertId` Route Parameter — CWE-20 / OWASP A03:2021

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 20–22
- **Vulnerable Code:**
```javascript
const alertId = $routeParams.alertId;
vm.loadAlert(alertId);
```
- **Issue:** The `alertId` from the URL is used directly in an API call without any format validation or sanitization. While AngularJS's `$http` service encodes URL parameters, the absence of input validation means malformed or malicious values are forwarded directly to the backend.
- **Security Impact:** Potential for path traversal or injection if the backend does not properly validate the parameter. Malformed IDs could trigger unhandled server errors that leak information.
- **Recommended Fix:** Validate `alertId` against an expected format (e.g., UUID regex or `alert_` prefix pattern) before use:
```javascript
const alertId = $routeParams.alertId;
if (!/^alert_[\w\-]+$/.test(alertId)) {
  vm.error = 'Invalid alert reference.';
  return;
}
vm.loadAlert(alertId);
```

---

### 9. [LOW] `deleteAlert` Function Exposed Without Authorization Check — CWE-862 / OWASP A01:2021

- **File:** `src/app/services/alert-record.service.js`
- **Lines:** 44–48
- **Vulnerable Code:**
```javascript
self.deleteAlert = function(alertId) {
  return $http.delete(API_ENDPOINTS.fraudAlerts + '/' + alertId)
    .then(function(response) {
      return response.data;
    });
};
```
- **Issue:** A `deleteAlert` function is defined and callable from any component that injects `alertRecordService`. The PRD (Section 10) states: *"Customer confirmation should not automatically erase the underlying transaction or audit record."* There is no authorization guard, confirmation dialog, or role check wrapping this function.
- **Security Impact:** If this function is inadvertently wired to a UI element or called programmatically, fraud alert records (which are audit-critical) could be deleted without proper authorization, violating audit trail integrity requirements.
- **Recommended Fix:** If deletion is not a valid operation for this domain, remove the function entirely. If required for administrative purposes, gate it behind a strict role check and require explicit server-side authorization. Add a soft-delete pattern (status flag) rather than hard deletion.

---

### 10. [LOW] `configCache` Stored In-Memory Without Integrity Validation — CWE-345

- **File:** `src/app/services/config.service.js`
- **Lines:** 8–16
- **Vulnerable Code:**
```javascript
let configCache = null;

self.getConfig = function() {
  if (configCache) {
    return $q.resolve(configCache);
  }
  return $http.get(API_ENDPOINTS.config)
    .then(function(response) {
      configCache = response.data;
      return configCache;
    });
};
```
- **Issue:** Risk threshold configuration is cached in a plain JavaScript variable (`configCache`). This cache can be tampered with by any code running in the same AngularJS scope or via browser DevTools. Manipulating thresholds (e.g., setting `high: 100`) could suppress fraud alerts entirely.
- **Security Impact:** An attacker with XSS or console access could manipulate cached thresholds to prevent fraud alerts from being generated, undermining the core security function of the application.
- **Recommended Fix:** Risk thresholds should be authoritative server-side only. The client should not cache them in mutable variables. If caching is needed for performance, use `Object.freeze()` on the cached object and validate the structure on retrieval. Thresholds should never be modifiable client-side.

---

### 11. [LOW] Polling Interval Accepts Caller-Supplied Value Without Bounds Checking — CWE-20

- **File:** `src/app/fraud-alert/services/transaction-ingestion.service.js`
- **Lines:** 30–38
- **Vulnerable Code:**
```javascript
self.startPolling = function(callback, interval) {
  interval = interval || 10000;
  ...
  pollingInterval = $interval(function() {
    self.fetchTransactions().then(callback);
  }, interval);
};
```
- **Issue:** The `interval` parameter is accepted from the caller without minimum/maximum bounds validation. A caller could pass `1` (1ms), causing a denial-of-service through API flooding, or `0`/negative values causing undefined behavior.
- **Security Impact:** Potential for self-inflicted DoS against the `/api/transactions` endpoint. Could also be exploited if the caller is influenced by attacker-controlled data.
- **Recommended Fix:** Enforce minimum and maximum bounds:
```javascript
const MIN_INTERVAL = 5000;
const MAX_INTERVAL = 60000;
interval = Math.min(Math.max(interval || 10000, MIN_INTERVAL), MAX_INTERVAL);
```

---

### 12. [LOW] `loadAuditLogs` Called Before Alert Is Loaded — CWE-362 (Race Condition)

- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 19–23
- **Vulnerable Code:**
```javascript
vm.init = function() {
  const alertId = $routeParams.alertId;
  vm.loadAlert(alertId);
  vm.loadAuditLogs();   // called immediately, vm.alert is null here
};
```
- **File:** `src/app/fraud-alert/controllers/alert-detail.controller.js`
- **Lines:** 28–34
- **Vulnerable Code:**
```javascript
vm.loadAuditLogs = function() {
  if (vm.alert && vm.alert.transactionId) {  // vm.alert is null at this point
    auditService.getAuditLogs(vm.alert.transactionId)...
  }
};
```
- **Issue:** `loadAuditLogs()` is called synchronously after `loadAlert()`, but `loadAlert()` is asynchronous. At the time `loadAuditLogs()` executes, `vm.alert` is always `null`, so audit logs are never fetched on initial load. This is a logic/race condition bug with a security implication: audit history silently fails to load, giving a false impression of no audit trail.
- **Security Impact:** Audit history is not displayed to the reviewer, potentially masking prior suspicious activity on the alert. This undermines the audit and accountability requirements of the PRD (FR-09).
- **Recommended Fix:** Chain `loadAuditLogs()` inside the `.then()` callback of `loadAlert()`:
```javascript
vm.loadAlert = function(alertId) {
  alertRecordService.getAlertById(alertId)
    .then(function(alert) {
      vm.alert = alert;
      vm.loadAuditLogs();  // called after alert is populated
      vm.loading = false;
    });
};
```

---

### 13. [INFO] No CSRF Token Handling in HTTP Interceptor — CWE-352 / OWASP A01:2021

- **File:** `src/app/fraud-alert/fraud-alert.module.js`
- **Lines:** 34–46
- **Issue:** The HTTP interceptor attaches a `Bearer` token but does not include any CSRF token header (e.g., `X-XSRF-TOKEN`). AngularJS has built-in XSRF protection via `$http` that reads from the `XSRF-TOKEN` cookie and sends `X-XSRF-TOKEN` header automatically — however, this only works if the server sets the `XSRF-TOKEN` cookie. There is no evidence in the codebase that this is configured.
- **Security Impact:** If the backend does not enforce CSRF tokens and relies solely on the `Authorization: Bearer` header (which is not automatically sent by cross-origin forms/requests), CSRF risk may be mitigated by the Bearer token pattern. However, this should be explicitly confirmed and documented.
- **Recommended Fix:** Confirm that the backend sets the `XSRF-TOKEN` cookie and validates the `X-XSRF-TOKEN` header on all state-changing requests. Document the CSRF mitigation strategy. If using Bearer tokens exclusively, ensure `SameSite` cookie policy is enforced.

---

### 14. [INFO] No Content Security Policy (CSP) Configuration Observed — CWE-693 / OWASP A05:2021

- **Files:** All view templates and `app.module.js`
- **Issue:** No Content Security Policy headers or meta tags are configured in the codebase. For an AngularJS application handling financial fraud data, a strict CSP is a critical defense-in-depth control against XSS.
- **Security Impact:** Without CSP, any XSS vulnerability (including future ones) has maximum impact — inline scripts, external script injection, and data exfiltration are all unrestricted.
- **Recommended Fix:** Configure a strict CSP at the server/infrastructure level:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none';
```
Note: AngularJS requires careful CSP configuration — use `ng-csp` directive and avoid `unsafe-eval` in production.

---

## Dependency & Configuration Notes

| Item | Status |
|------|--------|
| Hardcoded credentials/secrets | ✅ None detected |
| `ng-bind-html` / `$sce.trustAsHtml` | ✅ Not used |
| `eval()` / `$eval` / `$compile` with user input | ✅ Not detected |
| Insecure HTTP endpoints | ✅ All endpoints use relative paths (protocol-agnostic) |
| Sensitive data in cookies | ✅ Not set client-side |
| AngularJS version | ⚠️ Not specified in codebase — verify not EOL (AngularJS reached EOL Dec 2021) |
| npm/Bower dependency manifest | ⚠️ Not present in scanned folder — cannot assess package vulnerabilities |

---

## Final Decision

**Status: ⚠️ PASS_WITH_WARNINGS**

**Reason:** No Critical severity vulnerabilities were identified. No hardcoded credentials, secrets, or API keys were detected. No direct XSS vectors (`ng-bind-html`, `$sce.trustAsHtml`, `eval`) were found. All API endpoints use relative paths with no protocol downgrade risk.

Three **High** severity findings are present:
1. **Auth token in `localStorage`** — exploitable if any XSS is introduced; mitigated by absence of current XSS vectors but architecturally unsound for a financial security application.
2. **Hardcoded `reviewedBy: 'current_user'`** — breaks audit trail integrity and non-repudiation, a core PRD requirement (FR-09).
3. **IDOR on alert retrieval** — requires server-side enforcement to be confirmed; client provides no ownership validation.

These findings do **not** constitute an authentication bypass or exploitable credential exposure in the current codebase, and the application does not contain direct XSS sinks. The code is **cleared for unit testing** with the following mandatory conditions:

> ⚠️ **Mandatory Pre-Production Remediation Required:**
> - HIGH-1: Migrate `authToken` from `localStorage` to `HttpOnly` cookie
> - HIGH-2: Replace `reviewedBy: 'current_user'` with authenticated identity
> - HIGH-3: Confirm server-side IDOR/BOLA enforcement on all alert endpoints
> - MEDIUM-4: Move ID generation server-side using UUID v4
> - MEDIUM-6: Implement route authentication guards