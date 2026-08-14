# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccAnalysisApp

**Scan Date:** 2025-06-13

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 3     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [MEDIUM] Sensitive Data in Browser Storage — CWE-522 / CWE-539

- **File:** `src/app/shared/interceptors/httpInterceptor.js`
- **Line:** 7 (`var token = localStorage.getItem('authToken');`)
- **Vulnerable Code:**
  ```js
  var token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The authentication bearer token is stored in and read from `localStorage`. `localStorage` is accessible to any JavaScript running in the origin and persists indefinitely, making the token readable by any successful XSS payload or third-party script.
- **Impact:** If any XSS or malicious injected script executes, the bearer token can be exfiltrated, leading to full session/account takeover. Token also survives browser restarts, extending the attack window.
- **Recommendation:** Store session tokens in a `HttpOnly`, `Secure`, `SameSite` cookie managed server-side, or use short-lived tokens with refresh handled server-side. Avoid persisting bearer tokens in `localStorage`/`sessionStorage`.

---

### 2. [MEDIUM] Sensitive Financial Data (PCI) Rendered Unmasked — CWE-311 / CWE-359

- **File:** `src/app/modules/creditCardDashboard/views/dashboard.html`
- **Line:** ~74 (`<td>{{card.cardNumber}}</td>`)
- **Vulnerable Code:**
  ```html
  <tr ng-repeat="card in vm.dashboardData.cards">
    <td>{{card.cardNumber}}</td>
  ```
- **Issue:** The full credit card number (`card.cardNumber`) is bound directly and displayed in the UI without masking. This is a PCI-DSS concern (PAN should be masked, e.g., show only last 4 digits).
- **Impact:** Displaying the full PAN exposes cardholder data to shoulder-surfing, screen capture, and client-side scraping, violating PCI-DSS Requirement 3.3 and increasing regulatory/data-breach risk.
- **Recommendation:** Mask the PAN before rendering (display only last 4 digits, e.g., `**** **** **** 1234`). Ensure the backend also returns only masked/tokenized PAN to the client.

---

### 3. [MEDIUM] No CSRF/XSRF Protection Configured — CWE-352

- **File:** `src/app/app.module.js` / `src/app/shared/interceptors/httpInterceptor.js`
- **Line:** app.module.js line 4–15 (`$httpProvider` config); interceptor `request` handler
- **Vulnerable Code:**
  ```js
  $httpProvider.interceptors.push('httpInterceptor');
  ```
  ```js
  request: function(config) {
    var token = localStorage.getItem('authToken');
    if (token) { config.headers.Authorization = 'Bearer ' + token; }
    return config;
  }
  ```
- **Issue:** No XSRF token handling is present (no `$httpProvider.defaults.xsrfHeaderName`/`xsrfCookieName` configuration and no CSRF token added in the interceptor). While bearer-token-in-header auth mitigates classic CSRF, the pattern is not explicitly enforced and there is no defense-in-depth CSRF control.
- **Impact:** If authentication ever falls back to cookies, or a mixed auth model is introduced, state-changing requests could be forged. Currently only informational-to-medium because the app appears read-only (GET dashboard).
- **Recommendation:** Explicitly configure AngularJS XSRF protection (`xsrfHeaderName`/`xsrfCookieName`) and ensure the server enforces CSRF tokens for any state-changing (POST/PUT/DELETE) endpoints introduced later.

---

### 4. [LOW] Missing Input/Response Validation on API Data — CWE-20

- **File:** `src/app/services/CreditCardService.js`
- **Line:** 9–24 (`var cards = response.data; angular.forEach(cards, ...)`)
- **Vulnerable Code:**
  ```js
  var cards = response.data;
  ...
  angular.forEach(cards, function(card) {
    dashboardKPI.totalCreditLimit += card.creditLimit || 0;
  });
  ```
- **Issue:** The service consumes `response.data` and iterates without validating that it is an array or that numeric fields are actually numbers. Non-numeric/malformed responses could produce incorrect KPI values or runtime errors.
- **Impact:** Low direct security impact (read-only, no code execution), but weak trust boundary handling; malformed/hostile backend data is processed without validation.
- **Recommendation:** Validate response shape (`Array.isArray(cards)`) and coerce/validate numeric fields before arithmetic. Fail safely on unexpected structures.

---

### 5. [LOW] Open Redirect Risk / Hardcoded Redirect on Auth Failure — CWE-601 (Low)

- **File:** `src/app/shared/interceptors/httpInterceptor.js`
- **Line:** 15–18 (`$location.path('/login');`)
- **Vulnerable Code:**
  ```js
  if (rejection.status === 401 || rejection.status === 403) {
    var $location = $injector.get('$location');
    $location.path('/login');
  }
  ```
- **Issue:** The redirect target is a fixed internal path (`/login`), which is safe, but note the route `/login` is not defined in `$routeProvider` (only `/dashboard` and `otherwise -> /dashboard`), so unauthenticated users are looped back to the dashboard rather than a real login/authorization gate. There is no client-side route protection or role validation.
- **Impact:** No enforced authentication/authorization at the route layer; the app relies entirely on the backend to reject requests. Not directly exploitable client-side, but weak defense-in-depth (no `resolve`/route guard, no role check).
- **Recommendation:** Define a real `/login` route and add route `resolve` guards to verify authentication/role before loading protected views. Ensure the server remains the authoritative authorization enforcement point.

---

### 6. [INFO] Dependency Inventory Not Available — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` provided)
- **Line:** N/A
- **Issue:** No dependency manifest (package.json/bower.json) was supplied, so AngularJS/npm/Bower versions could not be assessed for known CVEs. Note: AngularJS 1.x is End-of-Life (LTS ended Dec 2021) and receives no security patches.
- **Impact:** Cannot confirm the AngularJS version or third-party library patch level; use of EOL AngularJS is a general risk requiring migration planning.
- **Recommendation:** Provide `package.json`/`bower.json` for dependency scanning. Plan migration away from EOL AngularJS 1.x; run `npm audit`/Snyk on the manifest when available.

---

## Positive Observations (No Findings)

- **No hardcoded credentials, API keys, tokens, or secrets** were found in the supplied source.
- **No XSS sink misuse detected** — no use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$parse`, `$eval`, or `eval()`. All bindings use safe interpolation (`{{ }}`) which is auto-escaped by AngularJS.
- **`$http` endpoint** uses a relative same-origin path (`/api/creditcards/dashboard`) — no hardcoded insecure (HTTP) external URLs and no token leakage in URL parameters.
- **No debug flags, disabled security controls, or unsafe TLS handling** found in the provided code.

---

## Final Decision

**Reason:** **PASS_WITH_WARNINGS.** No Critical or High-severity vulnerabilities, no exposed credentials, no authentication-bypass, no exploitable XSS/injection, and no serious authorization flaws were identified in the supplied code. The remaining issues are non-blocking Medium/Low findings: storing the bearer token in `localStorage` (XSS-exfiltration hardening), rendering unmasked full credit card numbers (PCI-DSS masking), absence of explicit CSRF configuration, weak client-side route/auth guarding, and lack of response validation. These should be remediated but do not block progression. **The code is SAFE TO PROCEED TO UNIT TESTING**, with the noted Medium findings (token storage and PAN masking) tracked for remediation before production release. Dependency scanning remains incomplete pending a `package.json`/`bower.json` manifest.