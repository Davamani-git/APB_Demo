# Security Scan Report

**Repository:** APB_Demo
**Branch:** APPMRN80
**Scan Date:** 2025-07-14

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 3 |
| Info | 2 |

---

## Findings

---

### 1. [MEDIUM] Sensitive Data in localStorage — CWE-922 / OWASP A02:2021

- **File:** `src/app/common/interceptors/AuthInterceptor.js`
- **Line:** 7
- **Vulnerable Code:**
```javascript
const token = $window.localStorage.getItem('jwtToken');
```
- **Issue:** JWT token is retrieved from `localStorage`. Data stored in `localStorage` is accessible to any JavaScript running on the same origin, making it vulnerable to theft via XSS attacks. Unlike `HttpOnly` cookies, `localStorage` offers no protection against script-based exfiltration.
- **Security Impact:** If an XSS vulnerability exists anywhere on the same origin, an attacker can steal the JWT token, leading to full session hijacking and unauthorized access to credit card and transaction data.
- **Recommendation:** Store authentication tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed server-side. If `localStorage` must be used, ensure a robust Content Security Policy (CSP) is enforced and all XSS vectors are eliminated. Consider short-lived tokens with refresh rotation.

---

### 2. [MEDIUM] Missing Authorization / User-Scoping on API Calls — CWE-639 / OWASP A01:2021 (IDOR/BOLA)

- **File:** `src/app/modules/dashboard/services/CreditCardService.js`
- **Line:** 6
- **Vulnerable Code:**
```javascript
return $http.get('/api/creditcards')
```
- **File:** `src/app/modules/dashboard/services/TransactionService.js`
- **Line:** 6
- **Vulnerable Code:**
```javascript
return $http.get('/api/transactions')
```
- **Issue:** Both API endpoints `/api/creditcards` and `/api/transactions` are called without any explicit user-scoping parameters (e.g., `userId`, `accountId`). While the JWT interceptor attaches a Bearer token, there is no client-side evidence that the API enforces per-user data isolation. If the backend does not strictly scope responses to the authenticated user's identity derived from the token, an IDOR/BOLA vulnerability exists.
- **Security Impact:** An attacker who manipulates the request (e.g., replays a token or exploits a backend flaw) could retrieve credit card details and transaction history belonging to other users — a critical data-exposure risk in a financial application.
- **Recommendation:** Confirm server-side that all `/api/creditcards` and `/api/transactions` responses are strictly scoped to the authenticated user's identity extracted from the validated JWT. Do not rely on client-supplied user IDs. Implement integration tests that verify cross-user data isolation.

---

### 3. [MEDIUM] Sensitive Financial Data Rendered Without Output Encoding Verification — CWE-116 / OWASP A03:2021

- **File:** `src/app/modules/dashboard/views/dashboard.html`
- **Lines:** 37–52
- **Vulnerable Code:**
```html
<div class="card-number">{{card.cardHolderName}}</div>
<div class="card-detail"><strong>Card Number:</strong> ****{{card.cardNumber.slice(-4)}}</div>
<div class="card-detail"><strong>Current Balance:</strong> {{card.currentBalance | number:2}}</div>
```
- **Issue:** AngularJS double-curly `{{ }}` interpolation auto-escapes HTML by default, which is correct. However, `card.cardNumber.slice(-4)` is called directly in the template on a value sourced from the API. If `card.cardNumber` is `null` or `undefined` (e.g., due to a malformed API response or injection of unexpected data types), this will throw a runtime JavaScript error. Additionally, `cardHolderName` is rendered without any length or character-set validation, which, while escaped by Angular, may expose unexpected data if the API is compromised.
- **Security Impact:** Potential runtime errors that could expose stack traces or crash the view. In a compromised-API scenario, unexpected content could be surfaced to users.
- **Recommendation:** Add null-safe guards: `{{card.cardNumber ? ('****' + card.cardNumber.slice(-4)) : 'N/A'}}`. Validate and sanitize all API response fields in the service layer before binding to the view. Confirm no `ng-bind-html` or `$sce.trustAsHtml` is used elsewhere in the application for these fields.

---

### 4. [LOW] Error Details Logged to Console — CWE-532 / OWASP A09:2021

- **File:** `src/app/common/interceptors/AuthInterceptor.js`
- **Lines:** 13–19
- **Vulnerable Code:**
```javascript
console.error('Unauthorized access - please login');
console.error('Server error - please try again later');
console.error('Network error - please check your connection');
```
- **File:** `src/app/modules/dashboard/services/CreditCardService.js`
- **Line:** 10
```javascript
console.error('Error fetching credit cards:', error);
```
- **File:** `src/app/modules/dashboard/services/TransactionService.js`
- **Line:** 10
```javascript
console.error('Error fetching transactions:', error);
```
- **File:** `src/app/modules/dashboard/controllers/DashboardController.js`
- **Line:** 33
```javascript
console.error('Dashboard initialization error:', error);
```
- **Issue:** Raw error objects are logged to the browser console across multiple files. In production, these logs may expose internal API error structures, stack traces, HTTP response details, or partial financial data to anyone with browser DevTools access.
- **Security Impact:** Information disclosure. An attacker with physical or remote access to a browser session (e.g., via shared workstation, screen sharing, or browser extension) can harvest internal system details to aid further attacks.
- **Recommendation:** Remove or gate all `console.error` / `console.log` calls behind a build-time flag (e.g., `NODE_ENV !== 'production'`). Use a centralized, sanitized logging service that strips sensitive fields before logging. Never log raw `error` objects that may contain response payloads in production builds.

---

### 5. [LOW] No Route Guard / Authentication Check Visible at Module Level — CWE-306 / OWASP A07:2021

- **File:** `src/app/app.module.js`
- **Lines:** 1–8
- **Vulnerable Code:**
```javascript
angular.module('creditCardDashboardModule', ['ngRoute', 'ngResource', 'dashboard'])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);
```
- **Issue:** The application uses `ngRoute` but no route configuration with authentication guards (e.g., `resolve` blocks checking login state, or `$routeChangeStart` event handlers) is present in the reviewed codebase. The `AuthInterceptor` only attaches a token if one exists in `localStorage` — it does not redirect unauthenticated users or block access to protected views.
- **Security Impact:** If a user navigates directly to the dashboard URL without a valid token, the view may partially render before API calls fail with 401. There is no enforced redirect to a login page, which could expose the UI structure and trigger unnecessary API calls.
- **Recommendation:** Implement a route-level authentication guard using `$routeProvider`'s `resolve` property or a `$rootScope.$on('$routeChangeStart')` listener that checks for a valid token and redirects to the login route if absent. The `AuthInterceptor`'s `responseError` handler for 401 should also trigger a redirect: e.g., `$location.path('/login')`.

---

### 6. [LOW] Full Card Number Available in DOM Scope — CWE-312 / OWASP A02:2021

- **File:** `src/app/modules/dashboard/views/dashboard.html`
- **Line:** 38
- **Vulnerable Code:**
```html
<div class="card-detail"><strong>Card Number:</strong> ****{{card.cardNumber.slice(-4)}}</div>
```
- **Issue:** While only the last 4 digits are displayed in the template, the full `card.cardNumber` value is bound to the AngularJS `$scope` / controller model (`vm.cards`). This means the complete card number is present in the JavaScript heap and AngularJS's `$scope` tree, accessible via browser DevTools (`angular.element(...).scope()`), memory inspection, or any injected script.
- **Security Impact:** Any XSS payload or malicious browser extension can enumerate `angular.element(document.body).scope()` and extract full card numbers from the in-memory model, even though they are not visibly rendered.
- **Recommendation:** The API should return only masked card numbers (e.g., `****1234`) for display purposes. Full card numbers should never be sent to the frontend unless strictly required for a specific user action (e.g., a "reveal card" flow with step-up authentication). Apply the principle of data minimization at the API response layer.

---

### 7. [INFO] No Content Security Policy (CSP) Observed — OWASP A05:2021

- **File:** Application-wide (no CSP meta tag or header configuration found in reviewed source)
- **Issue:** No Content Security Policy header or `<meta http-equiv="Content-Security-Policy">` tag is present in the reviewed codebase. CSP is a critical defence-in-depth control against XSS in AngularJS applications.
- **Security Impact:** Without CSP, any successful XSS attack has unrestricted ability to execute scripts, exfiltrate data, and interact with the DOM.
- **Recommendation:** Implement a strict CSP header at the server/web-server level. For AngularJS, use `default-src 'self'`, restrict `script-src` to known hashes/nonces, and avoid `unsafe-inline` and `unsafe-eval`. Reference the [AngularJS CSP guide](https://docs.angularjs.org/api/ng/directive/ngCsp).

---

### 8. [INFO] Dependency Versions Not Available for Review — OWASP A06:2021

- **File:** No `package.json`, `bower.json`, or dependency manifest found in `src/`
- **Issue:** No dependency manifest was present in the scanned folder. The AngularJS version, `ngRoute`, `ngResource`, and any third-party libraries cannot be assessed for known CVEs (e.g., AngularJS versions prior to 1.8.x have known XSS vulnerabilities; AngularJS itself reached End-of-Life on December 31, 2021).
- **Security Impact:** Use of an EOL AngularJS version means no further security patches will be issued. Known vulnerabilities in older versions (e.g., CVE-2019-14863, CVE-2020-7676) may be exploitable.
- **Recommendation:** Provide `package.json` / `bower.json` for a complete dependency audit. Strongly consider migrating from AngularJS (1.x) to a supported framework (Angular 2+, React, Vue). At minimum, ensure AngularJS 1.8.3 (final release) is in use and apply all available mitigations.

---

## Summary Table

| # | Severity | File | Issue | OWASP | CWE |
|---|----------|------|-------|-------|-----|
| 1 | MEDIUM | `AuthInterceptor.js` | JWT stored in localStorage | A02:2021 | CWE-922 |
| 2 | MEDIUM | `CreditCardService.js`, `TransactionService.js` | No user-scoping / IDOR risk on API calls | A01:2021 | CWE-639 |
| 3 | MEDIUM | `dashboard.html` | Unsafe card data rendering / null-safety | A03:2021 | CWE-116 |
| 4 | LOW | Multiple files | Sensitive error details in console logs | A09:2021 | CWE-532 |
| 5 | LOW | `app.module.js` | No route authentication guard | A07:2021 | CWE-306 |
| 6 | LOW | `dashboard.html` | Full card number in JS memory scope | A02:2021 | CWE-312 |
| 7 | INFO | App-wide | No Content Security Policy | A05:2021 | — |
| 8 | INFO | App-wide | Dependency versions unavailable | A06:2021 | — |

---

## Final Decision

**Status: ⚠️ PASS_WITH_WARNINGS**

**Reason:** No Critical or exploitable High-severity vulnerabilities were identified in the reviewed codebase. The application correctly uses AngularJS's built-in HTML auto-escaping (`{{ }}`), avoids dangerous sinks such as `ng-bind-html`, `$sce.trustAsHtml()`, `$compile`, or `eval()`, and implements a JWT-based HTTP interceptor for outbound request authentication.

However, **three Medium-severity issues** require remediation before production deployment:

1. **JWT in localStorage** exposes the authentication token to XSS-based theft — migrate to `HttpOnly` cookies.
2. **IDOR/BOLA risk** on `/api/creditcards` and `/api/transactions` must be verified and enforced server-side with strict user-identity scoping.
3. **Full card numbers in the AngularJS model** violate data minimization principles — the API must return only masked values for display.

The **three Low-severity issues** (console logging, missing route guards, card number in memory) and **two Informational findings** (CSP absence, unreviewed dependencies) should be addressed in the current sprint as part of security hardening. The code may proceed to unit testing with the understanding that the Medium findings above are tracked as mandatory pre-production security fixes.