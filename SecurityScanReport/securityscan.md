# Security Scan Report

**Repository:** APB_Demo

**Branch:** VIN10

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
- **Line:** 7 (`return $window.sessionStorage.getItem('authToken') || 'mock-token-12345';`)
- **Vulnerable Code:**
  ```js
  self.getToken = function() {
    return $window.sessionStorage.getItem('authToken') || 'mock-token-12345';
  };
  ```
- **Issue:** A hardcoded fallback bearer token (`mock-token-********`) is returned whenever no session token exists. This value is embedded in client-side source and is served to all users.
- **Impact:** Any unauthenticated user automatically obtains a usable bearer token, which `app.module.js` injects into every `$http` request via the default `Authorization` header. If the backend accepts this token (or any environment where it is valid), this constitutes a complete authentication bypass. The secret is also masked here but is fully visible in the shipped JavaScript bundle.
- **Recommendation:** Remove the hardcoded fallback entirely. Return `null`/empty when no token exists and block API calls / redirect to login. Never embed static tokens or secrets in client-side code. Enforce token validation server-side.

---

### 2. [HIGH] Broken Session Validation — CWE-287, CWE-613

- **File:** `src/app/services/auth.service.js`
- **Line:** 10–13
- **Vulnerable Code:**
  ```js
  self.validateSession = function() {
    var token = self.getToken();
    return !!token;
  };
  ```
- **Issue:** `validateSession()` only checks for the *presence* of a token, never its validity, expiry, or signature. Because `getToken()` always returns at least the hardcoded mock token, `validateSession()` will **always return `true`**.
- **Impact:** The dashboard's session gate (`DashboardController.loadDashboardData`) can never fail, so "Session expired" protection is effectively dead code. Combined with Finding #1, this permits access with no valid authenticated session.
- **Recommendation:** Validate token expiry/signature (e.g., decode JWT `exp`, or verify against the server). Do not rely on mere presence. Fail closed when validation cannot be confirmed.

---

### 3. [HIGH] Token Read at Bootstrap / Token Leakage into Default Headers — CWE-522, CWE-200

- **File:** `src/app/app.module.js`
- **Line:** 24–26
- **Vulnerable Code:**
  ```js
  .run(['$http', 'AuthService', function($http, AuthService) {
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();
  }]);
  ```
- **Issue:** The Authorization header is set **once at app startup** using `getToken()`, which returns the hardcoded fallback when no real token is present. The header is applied to **all** outbound `$http` requests globally, with no host restriction.
- **Impact:** (a) The static/mock token is sent on every request; (b) because it is a global default, any request to a non-first-party/relative-turned-absolute or misconfigured CORS endpoint would leak the bearer token; (c) the header is never refreshed after login/`refreshToken()`, causing stale-token behavior. Sensitive credential exposure risk.
- **Recommendation:** Use an HTTP interceptor that attaches a freshly validated token only to trusted API origins, and only when a real token is available. Do not set credentials as global defaults at bootstrap.

---

### 4. [HIGH] Missing Route Protection / Authorization (Broken Access Control) — CWE-862, CWE-639 (IDOR/BOLA)

- **File:** `src/app/app.module.js` (routes) and `src/app/services/creditCard.service.js` / `card.service.js` / `transaction.service.js`
- **Line:** `app.module.js` 6–20 (route config); `creditCard.service.js` `getCardById` line ~40 (`$http.get('/api/creditcards/' + cardId)`)
- **Vulnerable Code:**
  ```js
  .when('/dashboard', { ... })   // no resolve/auth guard
  .when('/transactions', { ... })
  ...
  self.getCardById = function(cardId) {
    return $http.get('/api/creditcards/' + cardId) ...
  };
  ```
- **Issue:** Routes have no `resolve`-based authentication/authorization guard, and object-scoped endpoints (`/api/creditcards/{cardId}`, `/api/cards?ids=...`) accept client-supplied identifiers with no client-side role/ownership indication. For a credit-card/financial application this is a classic IDOR/BOLA surface.
- **Impact:** Unauthenticated navigation to sensitive views is possible; server-side must enforce ownership on every `cardId`/`ids` lookup or an attacker can enumerate other users' card and transaction data (sensitive financial PII).
- **Recommendation:** Add route `resolve` guards that verify a valid session before controller load. Ensure the backend enforces per-object ownership/authorization for all `cardId`/`ids` parameters (do not trust client input). Validate `cardId` format before use.

---

### 5. [MEDIUM] Sensitive Financial Data Cached in Browser Memory Without Controls — CWE-524, CWE-312

- **File:** `src/app/services/card.service.js` (line ~9, `$cacheFactory('cardCache')`) and `src/app/services/creditCard.service.js` (line ~7, `$cacheFactory('creditCardCache')`)
- **Vulnerable Code:**
  ```js
  var cache = $cacheFactory('cardCache');
  ...
  cache.put('card_' + card.cardId, card);   // full card object incl. cardNumber
  ```
- **Issue:** Full card objects, including `cardNumber`, are cached client-side. While `$cacheFactory` is in-memory, card numbers flow through the UI and cache unmasked.
- **Impact:** Sensitive cardholder data (PAN) is retained in the client and rendered directly (`{{card.cardNumber}}`). If PANs are unmasked, this raises PCI-DSS exposure concerns.
- **Recommendation:** Ensure the backend returns only masked PANs (e.g., last 4 digits). Avoid caching sensitive fields; set explicit cache limits/expiry and clear caches on logout/session end.

---

### 6. [MEDIUM] Sensitive Data Written to Browser Console Logs — CWE-532

- **File:** `dashboard.controller.js` (line ~28), `transaction.controller.js` (line ~45), `card.service.js` (line ~30), `creditCard.service.js` (line ~30), `transaction.service.js` (line ~26)
- **Vulnerable Code:**
  ```js
  console.error('Error fetching card details:', error);
  console.error('Dashboard error:', error);
  ```
- **Issue:** Error objects from `$http` (which may include request URLs, parameters such as `ids`, and response bodies) are logged to the browser console in production code.
- **Impact:** Sensitive request/response details and identifiers can be exposed to anyone with browser access or client-side log collectors.
- **Recommendation:** Remove/guard `console.error` behind a debug flag; log only generic, non-sensitive messages in production. Route diagnostics to a controlled logging service that strips sensitive fields.

---

### 7. [MEDIUM] No CSRF/XSRF Token Handling on State-Changing Request — CWE-352

- **File:** `src/app/services/auth.service.js`
- **Line:** ~15 (`$http.post('/api/auth/refresh', {})`)
- **Vulnerable Code:**
  ```js
  self.refreshToken = function() {
    return $http.post('/api/auth/refresh', {}).then(...)
  };
  ```
- **Issue:** A state-changing POST is issued with no explicit CSRF/XSRF token strategy, and there is no evidence of AngularJS `$http` XSRF cookie/header configuration. The global bearer-header approach (Finding #3) also bypasses Angular's default XSRF cookie protection.
- **Impact:** If cookie-based auth is present alongside this, the token-refresh and other POST endpoints may be vulnerable to CSRF.
- **Recommendation:** Adopt the standard `XSRF-TOKEN`/`X-XSRF-TOKEN` pattern or an anti-CSRF token issued per session, and enforce it server-side on all state-changing endpoints.

---

### 8. [LOW] Unsafe/Unvalidated Query Parameter Construction — CWE-20

- **File:** `src/app/services/card.service.js` (line ~24, `params: { ids: uncachedIds.join(',') }`) and `src/app/services/creditCard.service.js` (`'/api/creditcards/' + cardId`)
- **Issue:** Client-supplied `cardId`/`ids` values are concatenated/joined into request parameters and URL paths without client-side type/format validation.
- **Impact:** Low on the client alone (Angular URL-encodes params), but unvalidated identifiers increase the attack surface for backend injection/enumeration if the server does not sanitize.
- **Recommendation:** Validate identifiers against an expected format (e.g., numeric/GUID allowlist) before issuing requests; ensure the backend parameterizes queries.

---

### 9. [LOW] Missing Explicit TLS/HTTPS Enforcement Assumption — CWE-319

- **File:** All services (`/api/...` relative endpoints)
- **Issue:** API calls use relative paths, so transport security depends entirely on how the app is served. There is no client-side enforcement/assertion that the app runs over HTTPS.
- **Impact:** If the app is ever served over HTTP, the bearer token and financial data transit in cleartext.
- **Recommendation:** Enforce HTTPS at the server/host (HSTS), and ensure deployment guarantees TLS. Add a runtime check/redirect if served over HTTP.

---

### 10. [INFO] Dependency Inventory Not Available for Vulnerability Assessment — CWE-1104 / CWE-1035

- **File:** N/A (no `package.json` / `bower.json` provided; `angular`, `ngRoute` referenced)
- **Issue:** AngularJS 1.x is used (`angular.module`, `ngRoute`). AngularJS reached End-of-Life (LTS ended Dec 2021) and no longer receives security patches. No dependency manifest was supplied to pin/verify versions.
- **Impact:** Cannot confirm exact framework/library versions or known CVEs. Running EOL AngularJS carries inherent, unpatched risk over time.
- **Recommendation:** Provide `package.json`/`bower.json` and lockfiles for a complete dependency scan (e.g., `npm audit`/SCA). Plan migration off EOL AngularJS.

---

## XSS / Template Review Note

No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$parse`, `$eval`, or `eval()` was found. All dynamic values in `dashboard.html` and `transactions.html` use standard interpolation (`{{ }}`) and directive templates use static markup, which AngularJS auto-escapes. **No XSS finding is reported** as none is supported by the supplied code.

---

## Final Decision

**Status: FAIL**

**Reason:** The code is **NOT safe to proceed to unit testing**. A CRITICAL hardcoded fallback authentication token (`src/app/services/auth.service.js`) combined with a presence-only `validateSession()` produces an effective **authentication bypass**, and the token is broadcast globally on every request via `$http.defaults` at bootstrap. Additionally, routes lack authentication guards and object-scoped card/transaction endpoints present IDOR/BOLA risk for sensitive financial data. Per the gate policy, exposed credentials, authentication bypass, and serious authorization flaws mandate a **FAIL**. These blocking issues (Findings #1–#4) must be remediated and re-scanned before this code advances to unit testing.

---

*Note: The uploaded file `CreditCardAnalysisDashboard 4.docx` was referenced but not required for this source-code security review; the assessment is based solely on the AngularJS source retrieved from `APB_Demo` branch `VIN10`.*