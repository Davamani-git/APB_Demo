# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlert2008R3

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 3     |
| Medium   | 4     |
| Low      | 2     |
| Info     | 2     |

---

## Findings

### 1. [CRITICAL] Sensitive Cardholder Data (PAN) Sent in Alert Payload — CWE-311 / CWE-359 (OWASP A02:2021 – Cryptographic Failures)

- **File:** `src/app/services/alert-notification.service.js`
- **Line:** 8–17 (`cardNumber: transaction.cardNumber` inside `alertPayload`)
- **Vulnerable Code:**
  ```js
  const alertPayload = {
    transactionId: transaction.transactionId,
    cardNumber: transaction.cardNumber,   // full PAN transmitted
    amount: transaction.amount,
    ...
  };
  return $http.post(apiConfig.baseUrl + apiConfig.endpoints.alertNotify, alertPayload, {...});
  ```
- **Issue:** The full credit card number (PAN) is included in the alert notification payload and transmitted to the `/alerts/notify` endpoint. Cardholder data is being propagated from the client to notification services with no masking/truncation.
- **Impact:** Direct PCI-DSS violation (Requirements 3.3 / 3.4). Full PAN may be logged, forwarded to third-party notification channels (email/SMS/webhooks), cached, or exposed in transit/browser memory, enabling card fraud and large-scale data breach. This is the most severe finding.
- **Recommendation:** Never transmit or handle full PAN on the client. Use a server-issued surrogate token or masked PAN (e.g., last 4 digits only). Remove `cardNumber` from the payload; the backend should correlate by `transactionId`. Enforce PCI-DSS masking rules server-side.

---

### 2. [HIGH] Bearer Token Attached to All Requests Without Endpoint/Origin Validation — CWE-522 / CWE-201 (OWASP A07:2021 – Identification & Authentication Failures)

- **File:** `src/app/services/http-interceptor.service.js`
- **Line:** 9–14 (`request` handler)
- **Vulnerable Code:**
  ```js
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The interceptor blindly attaches the `Authorization: Bearer` token to **every** outbound `$http` request regardless of the target URL/origin. There is no allow-list restricting the token to the trusted API base URL. Combined with storage of the token in `sessionStorage` (accessible to any JS via XSS).
- **Impact:** If any request is made to a third-party/attacker-controlled URL (or via a maliciously altered config), the bearer token leaks cross-origin, enabling account/session takeover. Token in `sessionStorage` is fully readable by injected scripts (token theft).
- **Recommendation:** Attach the token only when the request URL matches the trusted `apiConfig.baseUrl` (origin allow-list). Prefer `HttpOnly`, `Secure`, `SameSite` cookies for auth tokens instead of `sessionStorage`. Strengthen CSP to mitigate XSS-based token exfiltration.

---

### 3. [HIGH] Broken Object-Level Authorization / IDOR on Transaction & Audit Lookups — CWE-639 / CWE-284 (OWASP A01:2021 – Broken Access Control)

- **File:** `src/app/services/transaction-ingestion.service.js` (Line 22–29, `getTransactionById`) and `src/app/services/audit-trail.service.js` (Line 24–31, `getAuditHistory`)
- **Vulnerable Code:**
  ```js
  self.getTransactionById = function(transactionId) {
    return $http.get(apiConfig.baseUrl + apiConfig.endpoints.transactions + '/' + transactionId, {...});
  };
  // audit-trail.service.js
  self.getAuditHistory = function(transactionId) {
    return $http.get(apiConfig.baseUrl + apiConfig.endpoints.auditLog + '/' + transactionId, {...});
  };
  ```
- **Issue:** User-supplied `transactionId` is concatenated directly into the resource URL with no client-side authorization context, and there is no evidence of role/ownership checks. Sensitive fraud/audit records for **any** transaction ID can be requested. There is also no route-level protection (`resolve`/auth guard) in `app.config.js`.
- **Impact:** An authenticated (or unauthenticated, given no route guards) actor could enumerate transaction IDs to access other cardholders' fraud data and audit trails (BOLA/IDOR), leaking highly sensitive PII/financial data.
- **Recommendation:** Enforce server-side object-level authorization (verify caller owns/has role for the resource). URL-encode identifiers (`encodeURIComponent`). Add route guards (`resolve` with auth/role validation) in `$routeProvider`, especially for the `/config` administrative route.

---

### 4. [HIGH] Unprotected Administrative Threshold-Config Route — No Role/Privilege Validation — CWE-862 / CWE-269 (OWASP A01:2021 – Broken Access Control)

- **File:** `src/app/app.config.js` (Line 12–17, `/config` route) and `src/app/fraud-detection/threshold-config.controller.js` (Line 20–39, `saveConfig`)
- **Vulnerable Code:**
  ```js
  .when('/config', {
    templateUrl: 'src/app/fraud-detection/views/config.view.html',
    controller: 'thresholdConfigController',
    controllerAs: 'vm'
  })
  // no resolve/auth guard, no role check
  vm.config.modifiedBy = sessionStorage.getItem('username') || 'system';
  configService.updateThresholds(vm.config)...
  ```
- **Issue:** The fraud risk-threshold configuration (a high-privilege security control) is exposed on a client route with **no authentication guard and no role/privilege check**. `modifiedBy` is derived from a client-controlled `sessionStorage` value that can be spoofed, undermining the audit trail.
- **Impact:** Any user reaching `/config` can lower/raise fraud thresholds (privilege escalation / security-control tampering), effectively disabling fraud alerts. Spoofable `modifiedBy` defeats accountability.
- **Recommendation:** Protect the route with an auth/role `resolve` guard and enforce authorization server-side for `PUT /config/thresholds`. Derive `modifiedBy` from a server-validated identity/JWT claim, never from client storage. Log immutable server-side audit of config changes.

---

### 5. [MEDIUM] Sensitive Data Written to Browser Console Logs — CWE-532 (OWASP A09:2021 – Logging Failures)

- **File:** `src/app/fraud-detection/fraud-dashboard.controller.js`
- **Line:** 66 (`console.error('Error processing transaction:', error);`)
- **Vulnerable Code:**
  ```js
  }).catch(function(error) {
    console.error('Error processing transaction:', error);
  });
  ```
- **Issue:** Full error objects (which may embed transaction data, PAN, tokens, or backend responses) are logged to the browser console in what appears to be production code.
- **Impact:** Sensitive fraud/transaction/error data may persist in browser logs and be captured by browser extensions, shared debugging sessions, or crash reporters.
- **Recommendation:** Remove `console` logging in production or route through a sanitising logger that strips sensitive fields. Disable debug logging in production builds.

---

### 6. [MEDIUM] Sensitive/PII Data Cached in Client-Side Cache Without Sensitivity Controls — CWE-524 / CWE-312 (OWASP A04:2021)

- **File:** `src/app/services/transaction-ingestion.service.js` (Line 13–19) and `src/app/services/cache.service.js`
- **Vulnerable Code:**
  ```js
  cacheService.put(cacheKey, transactions, 30000); // full transaction list (incl. cardNumber) cached in-memory
  ```
- **Issue:** Full transaction objects (potentially containing `cardNumber`/PII) are stored in the application `$cacheFactory` cache. There is no distinction between sensitive and non-sensitive cache entries and no cache invalidation on logout.
- **Impact:** Sensitive cardholder data lingers in JS memory beyond need, increasing exposure to XSS-based exfiltration and cross-session data leakage on shared devices.
- **Recommendation:** Do not cache full PAN/PII. Cache only non-sensitive fields, minimise TTL, and explicitly clear the cache (`cacheService.clear()`) on logout/session termination.

---

### 7. [MEDIUM] Sensitive Parameters Passed as GET Query Parameters — CWE-598 (OWASP A04:2021)

- **File:** `src/app/services/policy-decision.service.js`
- **Line:** 12–18
- **Vulnerable Code:**
  ```js
  return $http.get(apiConfig.baseUrl + apiConfig.endpoints.policyDecision, {
    params: payload,   // riskScore, transactionId, thresholds sent in URL query string
    timeout: apiConfig.timeout
  });
  ```
- **Issue:** A policy decision is requested via `GET` with `riskScore`, `transactionId`, and full threshold configuration serialized into the URL query string. Sensitive/decisioning data placed in the URL is exposed in server logs, proxy logs, and browser history.
- **Impact:** Fraud risk parameters and identifiers leak into intermediary logs/history; also enables tampering with decision inputs.
- **Recommendation:** Use `POST` with a request body for decision inputs, or derive thresholds server-side rather than trusting client-supplied thresholds in the request.

---

### 8. [MEDIUM] Weak Auth Failure Handling / Open-Redirect-Style Hardcoded Navigation — CWE-601 / CWE-613 (OWASP A07:2021)

- **File:** `src/app/services/http-interceptor.service.js`
- **Line:** 25–28 (`responseError`)
- **Vulnerable Code:**
  ```js
  if (rejection.status === 401) {
    window.location.href = '/login';
    return $q.reject(rejection);
  }
  ```
- **Issue:** On 401, the app performs a hard redirect via `window.location.href` without clearing the stale `authToken` from `sessionStorage`. Server 500 errors are auto-retried up to 3 times reusing the same request/token, which can amplify load and replay auth-bearing requests.
- **Impact:** Stale token remains readable after auth failure (session fixation/leakage risk); blind retry of failed authenticated requests can worsen incidents.
- **Recommendation:** Clear `authToken` (and cached PII) on 401 before redirecting. Restrict automatic retries to safe/idempotent operations and add backoff.

---

### 9. [LOW] Third-Party/Framework Version Not Pinned & AngularJS End-of-Life Risk — CWE-1104 / CWE-937 (OWASP A06:2021 – Vulnerable & Outdated Components)

- **File:** `src/app/app.module.js` (Line 3) — `['ngRoute', 'ui.bootstrap']`
- **Issue:** The application is built on AngularJS (1.x), which is **end-of-life / no longer receiving security patches**, and depends on `ui.bootstrap`. No dependency manifest (package.json/bower.json) was supplied to confirm patched versions.
- **Impact:** Running on an unsupported framework leaves known, unpatched vulnerabilities (including expression-sandbox/XSS classes) exposed over time.
- **Recommendation:** Plan migration off AngularJS 1.x. Provide and audit `package.json`/`bower.json`, pin versions, and run `npm audit`/SCA scanning.

---

### 10. [LOW] Custom Filter Rendered via `ng-style` With Externally-Influenced Value — CWE-79 (defense-in-depth) (OWASP A03:2021)

- **File:** `src/app/fraud-detection/views/transaction-list.view.html`
- **Line:** ~35 (`<strong ng-style="{color: (txn.riskBand | riskBandColor)}">`)  
- **Issue:** `riskBand` (server-supplied) is passed through the `riskBandColor` filter into `ng-style`. The filter currently maps to a fixed color map (safe fallback `#777`), so it is **not currently exploitable**, but style-binding of server-driven values is a defense-in-depth concern if the filter is later changed to pass values through.
- **Impact:** Low; no injection today because output is constrained to a static allow-list. Flagged for hardening only.
- **Recommendation:** Keep the strict allow-list in `riskBandColor` (already present). Never return unsanitised/attacker-influenced strings from style-binding filters.

---

### 11. [INFO] No XSS Sink Abuse Detected

- **Files:** All views and controllers
- **Detail:** No usage of `ng-bind-html`, `$sce.trustAsHtml`, `$compile`, `$parse`, `$eval`, `eval()`, `innerHTML`, or `element.html()` was found. All bindings use auto-escaped Angular interpolation (`{{ }}`). This is a positive finding.
- **Recommendation:** Maintain this practice; enforce via lint rules.

---

### 12. [INFO] No Hardcoded Secrets/Credentials Detected in Supplied Code

- **Files:** All service/config files
- **Detail:** No hardcoded API keys, passwords, tokens, or secrets were found in the reviewed `src` files. Auth token is obtained at runtime from `sessionStorage` (see Finding #2 for storage concern). Note: server-side code, environment/config files, and dependency manifests were **not supplied** and could not be reviewed.
- **Recommendation:** Confirm no secrets exist in build/config files outside `src`.

---

## Final Decision

**Reason:** **FAIL.** The review identified a **CRITICAL** issue — full credit card PAN (`cardNumber`) transmitted client-side in the alert notification payload (PCI-DSS violation), plus **three HIGH** issues: unscoped bearer-token attachment with `sessionStorage` token storage (token leakage / theft), IDOR/BOLA on transaction and audit-history lookups, and an unprotected administrative threshold-configuration route with no authentication/role validation (privilege escalation / security-control tampering). These constitute exposed sensitive data, authorization flaws, and exploitable high-risk conditions. Per policy, any Critical issue, sensitive-data exposure, or serious authorization flaw mandates a **FAIL** gate. The code is **NOT safe to proceed to unit testing** until the Critical and High findings are remediated and re-reviewed.

> **Note:** Server-side code, dependency manifests (`package.json`/`bower.json`), and environment/build configuration were not provided; findings are based solely on the supplied AngularJS `src` codebase. Detected sensitive fields (e.g., PAN) have been referenced by field name only and not exposed.