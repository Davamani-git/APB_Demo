# Security Scan Report

**Repository:** APB_Demo

**Branch:** creditCardDocTest

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 2     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [MEDIUM] Sensitive Data Exposure — Full Credit Card Number (PAN) Rendered in UI — CWE-311 / CWE-359

- **File:** `src/app/modules/dashboard/views/dashboard.html`
- **Line:** 66 (`<td>{{card.cardNumber}}</td>`)
- **Vulnerable Code:**
  ```html
  <td>{{card.cardNumber}}</td>
  ```
- **Issue:** The `cardNumber` field is bound and displayed directly in the credit card overview table without any masking. If the API returns full Primary Account Numbers (PAN), the entire number is rendered in the DOM.
- **Impact:** Displaying unmasked PAN violates PCI-DSS Requirement 3.3 (masking of PAN when displayed). Shoulder-surfing, screenshots, browser cache, and DOM inspection can leak cardholder data.
- **Recommendation:** Mask the PAN so that at most the last 4 digits are visible (e.g., `**** **** **** 1234`). Implement masking server-side and/or via an AngularJS filter, and ensure the backend never returns full PAN to the client unless strictly required and authorized.

---

### 2. [MEDIUM] Missing Authentication / Authorization & Route Protection — CWE-306 / CWE-862

- **File:** `src/app/app.config.js` and `src/app/modules/dashboard/factories/creditCardDataFactory.js`, `src/app/modules/dashboard/factories/transactionDataFactory.js`
- **Line:** app.config.js (routeProvider `/dashboard`); factory `$http.get` calls
- **Vulnerable Code:**
  ```js
  $http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.creditCards)
  $http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.transactions)
  ```
- **Issue:** The `/dashboard` route has no `resolve` guard, and the `$http` calls to sensitive financial endpoints include no visible authentication token, `Authorization` header, or credential handling. There is no route protection, role validation, or session enforcement in the supplied client code.
- **Impact:** Sensitive credit card and transaction data may be requested without an authenticated/authorized session in the client layer. While enforcement should ultimately be server-side, the absence of any client-side auth handling suggests potential unauthenticated data access (IDOR/BOLA risk if endpoints are user-scoped by unenforced parameters).
- **Recommendation:** Add route guards (`resolve` with an auth check) and an HTTP interceptor that attaches the auth token to requests. Confirm the backend enforces authentication, authorization, and object-level access control on `/api/creditcards` and `/api/transactions`. Do not rely on client-side checks alone.

---

### 3. [LOW] Missing HTTP Security Headers / CSRF Token Configuration — CWE-352

- **File:** `src/app/modules/dashboard/factories/creditCardDataFactory.js`, `src/app/modules/dashboard/factories/transactionDataFactory.js`
- **Line:** `$http.get(...)` calls
- **Vulnerable Code:**
  ```js
  $http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.creditCards)
  ```
- **Issue:** No explicit XSRF token configuration (`$httpProvider.defaults.xsrfHeaderName` / `xsrfCookieName`) is present. Although only GET calls are shown, there is no evidence of CSRF protection configuration for the app.
- **Impact:** If state-changing requests are added later, the app would lack CSRF protection. Currently low risk since only read operations are present.
- **Recommendation:** Configure AngularJS XSRF defaults and ensure the backend issues and validates anti-CSRF tokens for any state-changing endpoints.

---

### 4. [LOW] Cross-Origin Request Without Explicit CORS/Credentials Handling — CWE-346

- **File:** `src/app/app.config.js`
- **Line:** `constant('API_ENDPOINTS',{baseUrl:'https://api.creditcard.example.com', ...})`
- **Vulnerable Code:**
  ```js
  .constant('API_ENDPOINTS',{baseUrl:'https://api.creditcard.example.com',...})
  ```
- **Issue:** The frontend calls a cross-origin API base URL with no explicit `withCredentials` policy or CORS assumption documented. The security posture depends entirely on server CORS configuration.
- **Impact:** Misconfigured CORS on the server could permit unauthorized origins to read sensitive financial responses.
- **Recommendation:** Verify the server enforces a strict allow-list CORS policy (no wildcard `*` with credentials). Set `$http` `withCredentials` intentionally only when required.

---

### 5. [INFO] Positive Security Observations

- **Files:** All reviewed files
- **Issue:** No hardcoded credentials, API keys, tokens, or secrets were detected. No use of `ng-bind-html`, `$sce.trustAsHtml`, `$compile`, `$parse`, `$eval`, `eval()`, `innerHTML`, or `.html()` — all output uses safe interpolation (`{{ }}`) which is auto-escaped by AngularJS. The API base URL uses HTTPS. No sensitive data is written to `localStorage`, `sessionStorage`, cookies, or logs in the supplied code.
- **Impact:** None (informational).
- **Recommendation:** Maintain these practices; avoid introducing `$sce.trustAsHtml` or raw DOM injection in future changes.

---

## Notes on Completeness

- **Dependency review:** No `package.json`, `bower.json`, or dependency manifest was supplied. The AngularJS version (module `ngRoute`) could not be verified. AngularJS 1.x is end-of-life (no official security patches since Dec 2021). This could not be confirmed from the supplied code — recommend confirming the AngularJS version and migration plan.
- **Backend enforcement:** Authentication/authorization on the API endpoints cannot be verified from frontend code alone.

---

## Final Decision

**Reason:** **PASS_WITH_WARNINGS.** No CRITICAL or HIGH findings, no exposed credentials, and no authentication-bypass or XSS vulnerabilities were detected in the supplied AngularJS code. All output uses AngularJS auto-escaped interpolation, and no secrets are hardcoded. The remaining issues are non-blocking MEDIUM/LOW concerns: unmasked credit card number display (PCI-DSS masking — MEDIUM), absence of client-side auth/route protection and token handling (MEDIUM), and missing CSRF/CORS hardening (LOW). These should be remediated before production but do not block progression to unit testing. Note that dependency (AngularJS version) and backend authorization enforcement could not be assessed from the supplied artifacts.