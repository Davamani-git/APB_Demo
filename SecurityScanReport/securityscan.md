# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccAppNewTest

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 2     |
| Medium   | 2     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [CRITICAL] Hardcoded Fallback Authentication Token — CWE-798

- **File:** `src/app/shared/factories/AuthFactory.js`
- **Line:** 5
- **Vulnerable Code:**
  ```javascript
  factory.getToken = function() {
    return $window.localStorage.getItem('authToken') || 'demo-token-****';
  };
  ```
- **Issue:** A hardcoded authentication token (`demo-token-*****`, masked) is embedded as a fallback in the source code. Whenever no token exists in `localStorage`, this static credential is used and attached as a `Bearer` token on every outbound `$http` request via the interceptor.
- **Impact:** Anyone with access to the client bundle can extract this static token. Because `isAuthenticated()` returns `true` as long as `getToken()` returns any truthy value, the hardcoded fallback guarantees the app is *always* "authenticated," effectively bypassing authentication and potentially granting unauthorized access to the `/api/creditcards/summary` endpoint and any sensitive cardholder data it returns. This is an authentication-bypass / hardcoded-credential flaw.
- **Recommendation:** Remove the hardcoded fallback token entirely. `getToken()` should return `null`/`undefined` when no valid token is present, and `isAuthenticated()` must validate a real, server-issued token (including expiry). Never ship demo/test credentials in production code.

---

### 2. [HIGH] Insecure Storage of Auth Token in localStorage — CWE-522 / CWE-539

- **File:** `src/app/shared/factories/AuthFactory.js`
- **Line:** 4–14
- **Vulnerable Code:**
  ```javascript
  factory.getToken = function() {
    return $window.localStorage.getItem('authToken') || 'demo-token-****';
  };
  factory.setToken = function(token) {
    $window.localStorage.setItem('authToken', token);
  };
  ```
- **Issue:** Bearer authentication tokens are persisted in `localStorage`, which is accessible to any JavaScript running in the page (including injected/XSS payloads and third-party scripts) and has no expiry or `HttpOnly`/`Secure` protection.
- **Impact:** A single XSS or malicious dependency can exfiltrate the token and impersonate the user, enabling account takeover and unauthorized access to credit-card data. Tokens in `localStorage` also persist indefinitely across sessions.
- **Recommendation:** Store session tokens in `HttpOnly`, `Secure`, `SameSite` cookies managed by the server, or use short-lived in-memory tokens with silent refresh. Avoid `localStorage`/`sessionStorage` for sensitive credentials.

---

### 3. [HIGH] Sensitive Cardholder Data Exposed / Full Card Number Rendered — CWE-311 / CWE-359

- **File:** `src/app/modules/creditCardDashboard/directives/creditSummary.js`
- **Line:** 21 (`<td>{{card.cardNumber}}</td>`)
- **Vulnerable Code:**
  ```javascript
  '            <td>{{card.cardNumber}}</td>' +
  ```
- **Issue:** The directive renders `card.cardNumber` directly to the DOM with no masking. If the API returns full or partial PAN (Primary Account Number) data, it is displayed in clear text. This is a data-exposure concern regardless of the (safe) Angular binding.
- **Impact:** Displaying unmasked card numbers violates PCI-DSS requirements (masking of PAN) and increases the risk of sensitive financial data leaking via shoulder-surfing, screenshots, browser history, or client-side logging.
- **Recommendation:** Ensure the backend returns only masked PANs (e.g., `**** **** **** 1234`). Apply masking client-side as defense-in-depth and confirm the field never contains a full PAN. Align rendering with PCI-DSS masking rules.

---

### 4. [MEDIUM] No Route Protection / Authorization on Dashboard Route — CWE-862

- **File:** `src/app/app.module.js`
- **Line:** 4–9
- **Vulnerable Code:**
  ```javascript
  .when('/dashboard', {
    templateUrl: 'src/app/modules/creditCardDashboard/views/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'vm'
  })
  ```
- **Issue:** The `/dashboard` route (which loads sensitive credit-card data) has no `resolve` guard or authentication/authorization check. Any user can navigate to the route; access control depends entirely on the backend and the flawed `isAuthenticated()` logic.
- **Impact:** Missing client-side route protection combined with the hardcoded-token issue (Finding 1) increases the likelihood of unauthorized access to a sensitive financial dashboard. There is also no role/permission validation (potential BOLA/IDOR if the API relies on client trust).
- **Recommendation:** Add a `resolve` block that verifies authentication (and role/authorization) before activating the route, redirect unauthenticated users to login, and enforce authorization server-side per resource.

---

### 5. [MEDIUM] Missing CSRF/XSRF Protection & CORS/Endpoint Hardening on $http — CWE-352

- **File:** `src/app/modules/creditCardDashboard/services/CreditCardDataService.js`, `src/app/shared/factories/AuthFactory.js`
- **Line:** Service line 8 (`$http.get('/api/creditcards/summary')`); interceptor config
- **Vulnerable Code:**
  ```javascript
  $http.get('/api/creditcards/summary')
  ...
  config.headers.Authorization = 'Bearer ' + AuthFactory.getToken();
  ```
- **Issue:** No XSRF token handling is configured, and the `Authorization` header is attached to *all* outbound requests by the interceptor without restricting to trusted/same-origin endpoints. If a request is ever sent cross-origin, the Bearer token would leak to that host.
- **Impact:** Token leakage to untrusted origins and lack of CSRF defenses for any state-changing endpoints introduced later.
- **Recommendation:** Restrict the interceptor to attach the token only to whitelisted trusted domains, configure AngularJS `xsrfHeaderName`/`xsrfCookieName` (or server-side CSRF tokens), and enforce a strict same-origin/CORS policy.

---

### 6. [LOW] Client-Side Error Logging May Leak Sensitive Response Data — CWE-532

- **File:** `src/app/modules/creditCardDashboard/services/CreditCardDataService.js`
- **Line:** 12
- **Vulnerable Code:**
  ```javascript
  console.error('Error fetching credit card summary:', error);
  ```
- **Issue:** The full error object (which may include response bodies, headers, or tokens) is logged to the browser console.
- **Impact:** Sensitive data or tokens could be exposed in browser console/logs, aiding attackers or leaking into log-collection tools.
- **Recommendation:** Log only a sanitized, generic message in production and strip sensitive fields; disable verbose logging in production builds.

---

### 7. [LOW] Debug/Compilation Optimizations Not Enabled ($compileProvider debugInfo / SCE) — CWE-489

- **File:** `src/app/app.module.js` (module config)
- **Line:** Module-wide config
- **Vulnerable Code:** *No explicit `$compileProvider.debugInfoEnabled(false)` or SCE hardening configured.*
- **Issue:** The application does not disable Angular debug info for production, and there is no explicit Strict Contextual Escaping (SCE) configuration confirmation. Debug info exposes internal scope/binding data to the DOM.
- **Impact:** Increased information disclosure surface in production and easier reconnaissance of application internals.
- **Recommendation:** Set `$compileProvider.debugInfoEnabled(false)` for production builds and keep SCE enabled (Angular default) — do not disable it.

---

### 8. [INFO] Dependency Versions Not Pinned / Unverifiable — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` supplied)
- **Line:** N/A
- **Issue:** The provided source references AngularJS with `ngRoute` but no dependency manifest was supplied, so AngularJS version and third-party library versions cannot be assessed. AngularJS (1.x) is End-of-Life and no longer receives security patches.
- **Impact:** Potential use of an EOL/vulnerable AngularJS version and untracked transitive dependencies cannot be validated.
- **Recommendation:** Provide `package.json`/`bower.json` and lockfiles for SCA. Note that AngularJS 1.x is EOL — plan migration; in the interim ensure a maintained/extended-support build is used.

---

## Final Decision

**Reason:** The scan identified a **CRITICAL hardcoded fallback authentication token** (`demo-token-*****`, masked) in `AuthFactory.js` that, combined with a permissive `isAuthenticated()` check and an interceptor that attaches it as a Bearer token, results in an effective **authentication bypass** and exposed credential. This is compounded by **HIGH-risk insecure token storage in `localStorage`** and **unmasked cardholder (PAN) rendering** with PCI-DSS implications. Per the gating policy (FAIL on Critical issues, exposed credentials, or authentication bypass), the code is **NOT safe to proceed to unit testing**. Remediate Findings 1–3 (remove hardcoded token, move tokens to secure HttpOnly storage, mask PAN) and re-submit for review. Note: `INFO` dependency assessment is incomplete because no dependency manifest was supplied — provide it for a complete SCA.