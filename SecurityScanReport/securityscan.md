# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlert1908R2

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 3     |
| Medium   | 3     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [CRITICAL] Hardcoded Credential / Authentication Bypass — CWE-798, CWE-287

- **File:** `src/app/services/auth.service.js`
- **Line:** 7
- **Vulnerable Code:**
  ```js
  return $window.localStorage.getItem('authToken') || 'mock-auth-token';
  ```
- **Issue:** A hardcoded fallback token `'mock-****-token'` is returned whenever no real token is present in `localStorage`. The interceptor (`fraud-api.interceptor.js`) then attaches this value as a `Bearer` token on every `/api/` request. Combined with `isAuthenticated()` returning `!!this.getToken()`, the fallback guarantees `isAuthenticated()` is **always true**, effectively disabling authentication.
- **Impact:** Any unauthenticated user is treated as authenticated. If the backend accepts the mock token (or if any environment shares it), this constitutes a full authentication bypass allowing access to fraud alerts, customer PII, card data, and protection/response actions (card blocking, fraud reporting).
- **Recommendation:** Remove the hardcoded fallback token entirely. Return `null`/empty when no token exists and have `isAuthenticated()` validate a real, server-issued token (expiry, signature). Never ship mock credentials in production code paths.

---

### 2. [HIGH] Sensitive Cardholder Data (PAN) Handled and Exposed Client-Side — CWE-311, CWE-312, OWASP A02:2021

- **File:** `src/app/views/fraud-detection/alert-detail.html` (Line 15), `src/app/views/fraud-detection/alert-list.html` (Line 22), `src/app/models/fraud-models.js` (Line 8)
- **Vulnerable Code:**
  ```html
  {{vm.alert.transaction.cardId.slice(-4)}}
  ```
  ```js
  this.cardId = data.cardId || null;
  ```
- **Issue:** The full `cardId` (PAN) is transmitted to and stored within the browser model, then masked only at the presentation layer via `.slice(-4)`. Masking in the view does not protect the underlying data, which remains fully available in the JS scope, network responses, and browser memory/DOM inspection.
- **Impact:** Full card numbers are exposed to the client, violating PCI-DSS. An attacker with XSS, browser access, or network visibility can retrieve complete PANs. This is a serious data-exposure risk for a fraud/payments system.
- **Recommendation:** Never send the full PAN to the client. The backend should return only a pre-masked value (last 4 digits) or a tokenized reference. Ensure PCI-DSS scope is minimized by keeping PAN server-side only.

---

### 3. [HIGH] Broken Object-Level Authorization (IDOR/BOLA) — CWE-639, CWE-284, OWASP A01:2021

- **File:** `src/app/modules/fraud-detection/response/alert-response.controller.js` (Lines 8–14, 22–33), `src/app/modules/fraud-detection/alerts/alert.service.js`
- **Vulnerable Code:**
  ```js
  vm.alertId = $routeParams.alertId;
  AlertService.getAlertById(vm.alertId) ...
  ResponseService.submitResponse(vm.alertId, 'confirmed')
  ```
- **Issue:** `alertId` is taken directly from the route (`/alerts/:alertId`) and used to fetch alert details and submit confirm/report responses without any client-side ownership or authorization check. There is no verification that the authenticated customer owns the referenced alert.
- **Impact:** If the backend relies on the client (or lacks per-object checks), an attacker can enumerate/guess `alertId` values to view other customers' transaction alerts (merchant, amount, card, location) and to confirm or report transactions on behalf of other customers — triggering card blocks and fraud cases for arbitrary accounts (privilege escalation / abuse).
- **Recommendation:** Enforce server-side object-level authorization on every alert `GET`/`PUT`/response endpoint, binding the alert to the authenticated principal. Use unguessable identifiers and reject requests where the caller does not own the object.

---

### 4. [HIGH] Missing Route Protection / Authorization Guards — CWE-862, OWASP A01:2021

- **File:** `src/app/app.module.js` (Lines 15–34)
- **Vulnerable Code:**
  ```js
  .when('/alerts', { ... controller: 'AlertController' ... })
  .when('/alerts/:alertId', { ... controller: 'AlertDetailController' ... })
  ```
- **Issue:** No `resolve` guard, authentication check, or role validation is applied to any route. Sensitive routes displaying customer transaction and card data are reachable without an enforced authentication resolve. Combined with Finding #1 (always-true `isAuthenticated()`), route access is effectively open.
- **Impact:** Unauthorized navigation to alert views exposing PII and card data; no defense-in-depth against unauthenticated access on the client.
- **Recommendation:** Add `resolve` blocks that verify a valid, server-validated session before route activation, and redirect unauthenticated users to login. Never rely solely on client-side guards — enforce equally on the backend.

---

### 5. [MEDIUM] Sensitive Data Persisted in Browser localStorage — CWE-522, CWE-539

- **File:** `src/app/services/auth.service.js` (Line 7)
- **Vulnerable Code:**
  ```js
  $window.localStorage.getItem('authToken')
  ```
- **Issue:** Authentication tokens are stored in `localStorage`, which is accessible to any JavaScript on the origin and has no expiry/HttpOnly protection.
- **Impact:** Any XSS or malicious third-party script can steal the auth token, enabling session hijacking against a fraud-management system.
- **Recommendation:** Prefer secure, `HttpOnly`, `SameSite` cookies for session tokens. If token-in-JS is unavoidable, use short-lived tokens, strict CSP, and robust XSS prevention.

---

### 6. [MEDIUM] Insecure Automatic Request Retry May Replay Sensitive/State-Changing Calls — CWE-799, CWE-441

- **File:** `src/app/shared/interceptors/fraud-api.interceptor.js` (Lines 15–24)
- **Vulnerable Code:**
  ```js
  if (rejection.status === 500 || rejection.status === 503) {
    if (retryCount < maxRetries) { retryCount++; return $http(rejection.config); }
  }
  ```
- **Issue:** The interceptor blindly retries any failed request (including non-idempotent `POST` actions such as protection/card-block, response submission, and audit logging). The `retryCount` is a shared module-level variable across all requests, causing race conditions and unbounded retries under concurrency.
- **Impact:** Duplicate execution of state-changing operations (e.g., duplicate fraud responses, protection actions, notifications), inconsistent state, and potential denial-of-service amplification against the backend.
- **Recommendation:** Only retry idempotent (`GET`) requests, track retry count per-request (via `config`), add exponential backoff, and honor idempotency keys for all mutating operations.

---

### 7. [MEDIUM] Missing Input Validation / Sanitization on Ingested Transaction Data — CWE-20

- **File:** `src/app/modules/fraud-detection/ingestion/transaction-ingestion.service.js` (Lines 20–47)
- **Vulnerable Code:**
  ```js
  var required = ['transactionId', 'accountId', 'cardId', ...];
  for (var i = 0; i < required.length; i++) { if (!transaction[required[i]]) { ... } }
  amount: parseFloat(transaction.amount),
  ```
- **Issue:** Validation only checks for presence (truthiness), not type, format, range, or content. `amount` is parsed without validating it is a positive finite number; `merchant`, `location`, and `currency` are accepted as-is and later rendered in views. No sanitization is performed before display or transmission.
- **Impact:** Malformed/hostile input (negative amounts, invalid currency, oversized strings, injection payloads) can flow into risk scoring, storage, and DOM rendering, potentially corrupting fraud decisions or enabling stored-content issues.
- **Recommendation:** Enforce strict schema validation (types, ranges, allowed values, length limits) and reject non-conforming input. Validate `amount` is a positive finite number and `currency` against an allowlist. Rely on server-side validation as the authoritative control.

---

### 8. [LOW] Sensitive Payload Logged via $log — CWE-532

- **File:** `src/app/modules/fraud-detection/risk-engine/risk-scoring.service.js` (Line 11)
- **Vulnerable Code:**
  ```js
  $log.error('Risk scoring failed', error);
  ```
- **Issue:** Error objects (which may contain request/response bodies including transaction identifiers) are logged to the browser console. In fraud workflows, error payloads can carry sensitive context.
- **Impact:** Sensitive information may be exposed in browser console/log aggregation, aiding attackers with local/console access.
- **Recommendation:** Log only sanitized, non-sensitive error metadata (status, correlation ID). Disable verbose logging in production via `$logProvider.debugEnabled(false)`.

---

### 9. [LOW] No Explicit XSRF/CSRF Protection Configuration — CWE-352

- **File:** `src/app/app.module.js` (Lines 12–37), `src/app/shared/interceptors/fraud-api.interceptor.js`
- **Vulnerable Code:** *(absence of `$httpProvider.defaults.xsrfHeaderName / xsrfCookieName` customization; state-changing POST/PUT/DELETE endpoints)*
- **Issue:** The app performs multiple state-changing requests (response submission, protection initiation, alert updates) but relies solely on a `Bearer` token from `localStorage`. AngularJS default XSRF cookie/header protection is not explicitly configured or verified.
- **Impact:** If any state-changing endpoint accepts ambient credentials (cookies), CSRF could be possible; even with bearer tokens, lack of defense-in-depth is a weakness.
- **Recommendation:** Confirm/enable anti-CSRF tokens (`XSRF-TOKEN` cookie + `X-XSRF-TOKEN` header) and ensure the backend requires them for all mutating endpoints.

---

### 10. [INFO] Dependency Inventory Not Provided — Cannot Assess Vulnerable Packages

- **File:** *(no `package.json` / `bower.json` supplied)*
- **Line:** N/A
- **Issue:** The supplied `src` folder contains no dependency manifest. AngularJS 1.x itself is end-of-life (no security patches). `ngRoute`, `ngResource`, and `ui.bootstrap` versions are unknown.
- **Impact:** Unable to verify whether obsolete/vulnerable framework or third-party library versions are in use. AngularJS EOL implies unpatched risk over time.
- **Recommendation:** Provide `package.json`/`bower.json` for dependency scanning. Plan migration off end-of-life AngularJS 1.x and pin/patch all third-party libraries.

---

## Final Decision

**Reason:** **FAIL.** The review identified one **CRITICAL** authentication-bypass issue — a hardcoded fallback token (`'mock-****-token'`) in `auth.service.js` that forces `isAuthenticated()` to always return true and is auto-attached as a Bearer credential — alongside three **HIGH** findings: full card PAN (`cardId`) exposed to the client, broken object-level authorization (IDOR/BOLA) on alert view and confirm/report actions, and completely unprotected routes. These are exploitable, blocking security defects for a credit-card fraud system handling PII and payment data. Per gate policy, the presence of a Critical issue, an authentication bypass, and serious authorization flaws mandates a **FAIL**. The code must **not** proceed to unit testing until Findings #1–#4 are remediated. (Note: a dependency manifest was not provided, limiting third-party vulnerability assessment.)