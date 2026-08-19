# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlertTest

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 4     |
| Low      | 3     |
| Info     | 2     |

## Findings

### 1. [MEDIUM] Sensitive Token Stored in localStorage — CWE-522 (Insufficiently Protected Credentials) / OWASP A07:2021

- **File:** `src/app/app.config.js`
- **Line:** 15 (`var token = localStorage.getItem('authToken');`)
- **Vulnerable Code:**
  ```js
  var token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The bearer/authentication token is retrieved from `localStorage`. Data in `localStorage` is accessible to any JavaScript running in the same origin and persists indefinitely with no `HttpOnly`/`Secure` protections.
- **Impact:** If an XSS vulnerability is ever introduced, the auth token can be exfiltrated, enabling full session hijacking. Tokens in `localStorage` are also not cleared on browser close.
- **Recommendation:** Prefer storing session tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed by the server. If client storage is mandatory, use short-lived tokens with strict rotation and never persist long-lived credentials.

---

### 2. [MEDIUM] Missing CSRF/XSRF Protection on State-Changing Requests — CWE-352 / OWASP A01:2021

- **File:** `src/app/app.config.js` (interceptor) and all POST/PUT services
- **Line:** 12–35 (interceptor block) — affects `src/app/services/config.service.js` (line ~34 `$http.put`), `src/app/services/alert-notification.service.js` (line ~22 `$http.post`), `src/app/services/audit-trail.service.js` (lines ~28 & ~48 `$http.post`)
- **Vulnerable Code:**
  ```js
  $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
    return {
      request: function(config) {
        var token = localStorage.getItem('authToken');
        ...
      }
    };
  }]);
  ```
- **Issue:** State-changing endpoints (`PUT /api/config/thresholds`, `POST /api/alerts/fraud`, `POST /api/audit/fraud-decision`) rely solely on a bearer header. No anti-CSRF token (`X-XSRF-TOKEN`) handling or explicit CSRF defense is configured. Because auth relies on a bearer header injected from `localStorage`, if any cookie-based session is also present, or if the header is manipulable, cross-site state changes may be possible.
- **Impact:** Attackers could potentially trigger unauthorized threshold modifications (weakening fraud detection) or forged audit entries.
- **Recommendation:** Ensure the server issues and validates an XSRF token via the standard AngularJS `XSRF-TOKEN` cookie / `X-XSRF-TOKEN` header pattern, and enforce `SameSite` cookies. Validate CSRF tokens server-side for all state-changing operations.

---

### 3. [MEDIUM] No Client-Side Authorization / Route Protection — CWE-862 (Missing Authorization) / OWASP A01:2021

- **File:** `src/app/app.routes.js`
- **Line:** 5–20 (route definitions for `/dashboard` and `/config`)
- **Vulnerable Code:**
  ```js
  .when('/config', {
    templateUrl: 'src/app/views/threshold-config.html',
    controller: 'ThresholdConfigController',
    controllerAs: 'vm'
  })
  ```
- **Issue:** The sensitive `/config` (threshold configuration) route has no `resolve` guard, role check, or authentication verification. Any user reaching the SPA can load the threshold editor UI. The `updatedBy` field is also sourced from `localStorage.getItem('userId')` (config.service.js line ~30), which is client-controlled and spoofable.
- **Impact:** Weak client-side gating around a security-critical function (fraud thresholds). If server-side authorization is not enforced, this enables privilege escalation / tampering with fraud thresholds. The spoofable `userId` undermines audit integrity.
- **Recommendation:** Add route `resolve` guards that verify authentication and role (e.g., fraud-admin) before loading the config view, and — critically — enforce server-side RBAC on `PUT /api/config/thresholds`. Derive `updatedBy` from the server-side authenticated identity, never from client storage.

---

### 4. [MEDIUM] Client-Trusted User Identity Used for Audit Attribution — CWE-565 (Reliance on Untrusted Inputs) / OWASP A08:2021

- **File:** `src/app/services/audit-trail.service.js`
- **Line:** ~22 and ~44 (`userId: localStorage.getItem('userId') || 'system'`)
- **Vulnerable Code:**
  ```js
  userId: localStorage.getItem('userId') || 'system'
  ```
- **Issue:** Audit trail records attribute the acting user based on a value read from `localStorage`, which is fully attacker-controllable in the browser.
- **Impact:** Audit logs — a compliance and forensic control for a fraud system — can be forged or repudiated, undermining non-repudiation and regulatory (e.g., PCI-DSS logging) requirements.
- **Recommendation:** Server must derive and record the acting `userId` from the authenticated session/token server-side. Never accept the actor identity from the client payload.

---

### 5. [LOW] Sensitive/Diagnostic Data Written to Browser Console — CWE-532 (Insertion of Sensitive Information into Log File) / OWASP A09:2021

- **File:** `src/app/app.config.js`
- **Line:** ~26 (`console.error('Server error:', rejection.data);`)
- **Vulnerable Code:**
  ```js
  } else if (rejection.status === 500) {
    console.error('Server error:', rejection.data);
  }
  ```
- **Issue:** Full server error response bodies (`rejection.data`) are logged to the browser console. Similar `console.error` logging of raw errors exists across services (fraud-risk, config, alert, audit, ingestion).
- **Impact:** Server error payloads may contain stack traces, transaction data, or internal details visible in the client console/dev tools, aiding an attacker.
- **Recommendation:** Log only sanitized, non-sensitive error identifiers on the client. Disable verbose logging in production builds.

---

### 6. [LOW] PAN (Card Number) Forwarded to Risk API — CWE-311 (Missing Encryption of Sensitive Data) / PCI-DSS

- **File:** `src/app/services/fraud-risk.service.js`
- **Line:** ~13 (`cardNumber: transactionEvent.cardNumber` within the evaluate payload)
- **Vulnerable Code:**
  ```js
  var payload = {
    transactionId: transactionEvent.transactionId,
    cardNumber: transactionEvent.cardNumber,
    ...
  };
  return $http.post(API_ENDPOINTS.FRAUD_RISK_EVALUATE, payload)
  ```
- **Issue:** The full `cardNumber` is included in the request body to the fraud-risk evaluation endpoint. Although the ingestion service masks the card number (`transaction-ingestion.service.js` `maskCardNumber`), the fraud-risk service payload can still carry an unmasked PAN if a caller supplies one. Transport security depends on relative URLs (`/api/...`) inheriting the page scheme — no explicit HTTPS enforcement.
- **Impact:** Potential exposure of cardholder PAN in transit/logs; PCI-DSS scope concern if TLS is not strictly enforced.
- **Recommendation:** Ensure only tokenized/masked card references are sent from the client, enforce HTTPS/HSTS end-to-end, and confirm the backend never logs raw PAN. Confirm the evaluate endpoint requires TLS.

---

### 7. [LOW] Unauthenticated/Unthrottled Polling Loop — CWE-770 (Allocation of Resources Without Limits or Throttling)

- **File:** `src/app/services/transaction-ingestion.service.js`
- **Line:** ~29–33 (`$interval(... , 5000)` calling `fetchTransactions`)
- **Vulnerable Code:**
  ```js
  self.startPolling = function() {
    pollingInterval = $interval(function() {
      self.fetchTransactions();
    }, 5000);
  };
  ```
- **Issue:** Continuous polling of `/api/transactions` every 5s with no backoff on repeated errors and no explicit authorization check at the client. `processedTransactions` grows unbounded (minor memory growth), and error responses do not stop polling.
- **Impact:** On backend failure or auth loss, the client keeps hitting the endpoint, potentially amplifying load and leaking transaction data if the endpoint is not properly authorized server-side.
- **Recommendation:** Implement exponential backoff / circuit breaking on errors, cap `processedTransactions` size, and ensure the transactions endpoint enforces server-side authorization.

---

### 8. [INFO] Data Binding — No Unsafe HTML Sinks Detected — CWE-79 (XSS) — Not Present

- **File:** `src/app/views/fraud-dashboard.html`, `src/app/views/threshold-config.html`, `src/app/directives/transaction-event.directive.js`
- **Line:** N/A
- **Issue:** All dynamic values use safe AngularJS interpolation (`{{ }}`) and `ng-bind`-style class binding. No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$eval`, `$parse`, or `eval()` was found. Directive template is static; `link` uses `addClass`/`removeClass` only.
- **Impact:** No client-side XSS sink identified in the supplied code.
- **Recommendation:** Maintain current safe binding practices; avoid introducing `trustAsHtml`/`ng-bind-html` for user-influenced data.

---

### 9. [INFO] No Hardcoded Secrets Detected — CWE-798 (Use of Hard-coded Credentials) — Not Present

- **File:** Entire `src/` tree
- **Line:** N/A
- **Issue:** No hardcoded passwords, API keys, tokens, or secrets were found. Endpoints are relative paths in `API_ENDPOINTS`; no credentials embedded.
- **Impact:** None.
- **Recommendation:** Continue keeping secrets server-side. Note: dependency manifests (`package.json`/`bower.json`) were **not** supplied, so third-party dependency/CVE analysis could not be performed.

---

## Final Decision

**Reason:** No CRITICAL findings, no exposed/hardcoded credentials, no authentication bypass, no confirmed XSS sinks, and no exploitable HIGH-risk issues were identified in the supplied source. The remaining issues are non-blocking MEDIUM/LOW concerns — primarily reliance on client-controlled values (`localStorage` auth token and `userId`) for authentication attribution, missing explicit client-side CSRF and route-authorization controls, and verbose error logging. These are defense-in-depth weaknesses that assume (and depend on) proper server-side enforcement of authentication, authorization, and CSRF, which cannot be verified from client code alone. As all findings are Medium or lower and none are directly exploitable from the provided client code, the gate result is **PASS_WITH_WARNINGS**. The code may proceed to unit testing, but the MEDIUM findings (localStorage token handling, CSRF protection, route/role guards, and server-derived audit identity) should be tracked and remediated before production release.

> **Note:** No dependency manifest (`package.json` / `bower.json`) or backend/server code was provided, so third-party vulnerable-dependency scanning and server-side authorization/CSRF/TLS enforcement could not be fully validated. If a definitive full-stack assessment is required, supply these artifacts.