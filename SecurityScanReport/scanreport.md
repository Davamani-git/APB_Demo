# Security Scan Report

**Repository:** APB_Demo  
**Branch:** Davhardening01  
**Scan Date:** 2026-08-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 3     |
| Low      | 4     |

## Findings

### 1. [MEDIUM] Use of `sessionStorage` for auth token and seller ID — CWE-922 (Insecure Storage of Sensitive Information)

- **File:** `src/app/app.config.js`
- **Line:** ~33
- **Vulnerable Code:**
  ```javascript
  var token = sessionStorage.getItem('authToken');
  ```
  and
  ```javascript
  var token = sessionStorage.getItem('authToken');
  var publicPages = ['/login', '/register'];
  var restrictedPage = publicPages.indexOf($location.path()) === -1;
  if (restrictedPage && !token) {
    $location.path('/login');
  }
  ```
- **Issue:** The application stores the authentication token (`authToken`) in `sessionStorage`. Web storage is accessible to any JavaScript running in the page, so a successful XSS attack would allow an attacker to read and exfiltrate the token. `sellerId` is also stored in `sessionStorage` and used as an identifier in subsequent API calls.
- **Impact:** If an attacker can inject JavaScript (e.g., via an unaddressed XSS in this or another part of the app/back-end), they can retrieve `authToken` and `sellerId` from `sessionStorage`, hijack the seller session, perform actions on behalf of the seller, or pivot to other attacks. This weakens overall defense-in-depth.
- **Recommendation:**
  - Prefer using secure, HTTP-only cookies for auth tokens so they are not accessible to JavaScript.
  - Treat `sellerId` as server-side data derived from the authenticated session rather than client-controlled storage wherever possible.
  - If `sessionStorage` must be used, ensure strong XSS protections (CSP, strict templating, server-side HTML escaping) and consider token binding or short-lived tokens with refresh mechanisms.

---

### 2. [MEDIUM] Client-side route protection based only on presence of token — CWE-284 (Improper Access Control)

- **File:** `src/app/app.config.js`
- **Line:** ~51
- **Vulnerable Code:**
  ```javascript
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    var token = sessionStorage.getItem('authToken');
    var publicPages = ['/login', '/register'];
    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if (restrictedPage && !token) {
      $location.path('/login');
    }
  });
  ```
- **Issue:** Route protection is implemented entirely on the client by checking only for the presence of an `authToken` in `sessionStorage`. There is no validation of token freshness, revocation, or roles, and no server-side enforcement visible from this code. An attacker could manually set `sessionStorage.authToken` and `sessionStorage.sellerId` in the browser to bypass this client-side check.
- **Impact:** If server-side APIs are not enforcing authentication and authorization independently (unknown from this code alone), this pattern can lead to authentication bypass and unauthorized access to sensitive seller operations (product management, inventory, orders). Even if the server is secure, this client logic gives a false sense of security and may lead to incomplete server-side checks.
- **Recommendation:**
  - Ensure that all `/api/*` endpoints enforce authentication and authorization on the server, ignoring client-side route checks.
  - Treat client-side checks as usability enhancements only, not security controls.
  - Optionally, enhance the interceptor to validate token expiry/claims (e.g., decode JWT) and clear invalid tokens.

---

### 3. [MEDIUM] Unvalidated use of `prompt()` for tracking ID input — CWE-79 / CWE-20 (Input Validation / XSS Risk)

- **File:** `src/app/modules/seller/views/orders.view.html`
- **Line:** ~44
- **Vulnerable Code:**
  ```html
  <button class="btn btn-sm btn-info" ng-click="vm.updateShippingInfo(order.orderId, prompt('Enter tracking ID'))">Add Tracking</button>
  ```
- **Issue:** The `prompt()` value is passed directly as `trackingId` into `vm.updateShippingInfo`, which calls `OrderService.updateShippingInfo`. While this front-end code does not itself render the tracking ID, it forwards raw, unvalidated user input to the back-end. If the tracking ID is later displayed without proper escaping elsewhere, this becomes an XSS vector.
- **Impact:** Potential stored XSS if the back-end stores the tracking ID and another view renders it unsafely. Additionally, using `prompt()` for business data entry is brittle and makes input validation and UX control difficult.
- **Recommendation:**
  - Replace `prompt()` with a dedicated form field in the UI where Angular can apply standard validation and sanitization.
  - Apply client-side validation (pattern/length) before sending to the API.
  - Ensure server-side validation and output encoding when rendering tracking IDs.

---

### 4. [LOW] Use of `sessionStorage` for seller ID — CWE-359 (Exposure of Sensitive Information)

- **File:** `src/app/modules/seller/controllers/analytics.controller.js`
- **Line:** ~9
- **Vulnerable Code:**
  ```javascript
  vm.sellerId = sessionStorage.getItem('sellerId');
  ```
  Similar patterns appear in:
  - `inventory.controller.js`
  - `order.controller.js`
  - `product.controller.js`
- **Issue:** `sellerId` is read from `sessionStorage` and used to scope all API calls. While an ID alone may not be highly sensitive, treating it as client-controlled state can lead to inconsistencies and makes it easier for an attacker with console access to impersonate another seller in the UI (assuming server-side APIs do not strictly bind the seller to the authenticated principal).
- **Impact:** If server-side APIs rely on the `sellerId` from request parameters instead of deriving it from the authenticated token, an attacker could modify `sessionStorage.sellerId` to view or manipulate another seller's data (IDOR/BOLA). The front-end code itself does not prove such a flaw, but the pattern is risky.
- **Recommendation:**
  - Ensure the back-end ignores client-supplied `sellerId` and instead derives it from the authenticated token/session.
  - Keep `sellerId` usage in the front end for display only; avoid using it as a trust anchor.
  - Consider not storing `sellerId` in web storage at all; retrieve it from a trusted API on login and keep it in memory.

---

### 5. [LOW] Lack of explicit CSRF/XSRF protection configuration in `$http` — CWE-352 (Cross-Site Request Forgery)

- **File:** `src/app/app.config.js`
- **Line:** ~20
- **Relevant Code:**
  ```javascript
  $httpProvider.interceptors.push('AuthInterceptor');
  ```
  and in services, standard `$http` calls to `/api/...`.
- **Issue:** The AngularJS configuration does not show any explicit CSRF/XSRF protection (such as setting `xsrfCookieName` and `xsrfHeaderName` to align with server expectations) beyond the default behavior. Without server-side CSRF tokens and validation, authenticated requests using cookies could be vulnerable to CSRF. In this app, tokens are in `sessionStorage` and sent via `Authorization` header, which mitigates many CSRF risks, but if cookies are also used on the same domain, CSRF may still be relevant.
- **Impact:** If the back-end uses cookies for any authenticated endpoints, an attacker could trick users into performing state-changing actions via cross-site requests.
- **Recommendation:**
  - Confirm that authentication is performed solely via `Authorization` header with bearer tokens and that no sensitive operations rely on cookies.
  - If cookies are used, implement CSRF tokens server-side and configure AngularJS to send them (e.g., via `$httpProvider` defaults for XSRF).
  - Consider enabling a strict Content Security Policy and same-site cookies (`SameSite=Lax/Strict`) to reduce CSRF risk.

---

### 6. [LOW] Unencrypted WebSocket endpoints (`ws://`) — CWE-319 (Cleartext Transmission of Sensitive Information)

- **File:** `src/app/services/inventory.service.js`
- **Line:** ~23
- **Vulnerable Code:**
  ```javascript
  ws = new WebSocket('ws://localhost:8080/inventory/' + sellerId);
  ```
- **File:** `src/app/services/notification.service.js`
- **Line:** ~24
- **Vulnerable Code:**
  ```javascript
  ws = new WebSocket('ws://localhost:8080/notifications/' + sellerId);
  ```
- **Issue:** WebSocket connections are created over plain `ws://`. While the host is `localhost` in this code (likely for development), deploying similar code in production (e.g., with a non-localhost URL) over `ws://` would transmit data in cleartext.
- **Impact:** In non-local environments, unencrypted WebSocket traffic could be intercepted or modified by network attackers, exposing inventory updates and notifications, and potentially allowing message injection.
- **Recommendation:**
  - Use `wss://` for all non-local environments and ensure TLS is properly configured on the server.
  - Consider externalizing the WebSocket base URL into configuration so that production builds enforce secure endpoints.

---

### 7. [LOW] Console logging of WebSocket errors — CWE-532 (Information Exposure Through Log Files)

- **File:** `src/app/services/inventory.service.js`
- **Line:** ~32
- **Vulnerable Code:**
  ```javascript
  ws.onerror = function(error) {
    console.error('WebSocket error:', error);
  };
  ```
- **File:** `src/app/services/notification.service.js`
- **Line:** ~34
- **Vulnerable Code:**
  ```javascript
  ws.onerror = function(error) {
    console.error('WebSocket error:', error);
  };
  ```
- **Issue:** Errors are logged directly to the console. While this is common during development, in production it may leak internal error details to any user with browser console access.
- **Impact:** Information in error objects can include stack traces, internal URLs, or other implementation details that aid attackers in reconnaissance.
- **Recommendation:**
  - For production builds, minimize or centralize logging and avoid logging full error objects in the client.
  - Replace with user-friendly notifications and, if needed, send sanitized error telemetry to a secure logging backend.

---

### 8. [LOW] No explicit dependency vulnerability management visible — CWE-1104 (Use of Unmaintained Third Party Components)

- **Files:** Not present in the provided snippet (e.g., no `package.json`, `bower.json`, or `lib` references were included).
- **Issue:** Dependency manifests (npm, Bower, etc.) are not visible in the provided `src` snapshot, so it is not possible to confirm whether AngularJS or other libraries are up to date and free from known vulnerabilities.
- **Impact:** If outdated AngularJS or other libraries are used (e.g., AngularJS <1.7.9), known XSS, sandbox escape, or prototype-pollution vulnerabilities may exist.
- **Recommendation:**
  - Ensure AngularJS is updated to the latest 1.7.x LTS release and that all third-party libraries are regularly scanned with tools like `npm audit`, OWASP Dependency-Check, or Snyk.
  - Maintain and review `package.json`/`bower.json` and lockfiles, and integrate dependency checks into CI.

---

## Areas Checked with No Issues Found (Given Available Code)

Based on the provided `src` tree, the following areas were specifically reviewed and no concrete vulnerabilities were identified from this code alone:

- **Hardcoded secrets/credentials:** No API keys, passwords, tokens, or secrets were hardcoded in the front-end code.
- **XSS sinks:** No use of `ng-bind-html`, `$sce.trustAsHtml`, `$compile`, `$parse`, `eval`, `innerHTML`, or jQuery `.html()` was observed. Angular templates use standard `{{ }}` bindings, which are escaped by default.
- **Direct DOM manipulation:** No direct use of low-level DOM APIs that would bypass Angular's escaping was seen.
- **Insecure HTTP endpoints:** `$http` calls target relative `/api/...` paths; no use of `http://` external endpoints was observed.
- **File uploads:** No file upload handling is present in the provided code.
- **CSRF tokens in headers:** Not applicable for token-based auth in this code, but see the CSRF note above.

## Final Decision

**Security Gate:** PASS_WITH_WARNINGS

**Reason:**
- No Critical or High-severity vulnerabilities or exposed credentials were identified in the provided AngularJS front-end code.
- Several Medium and Low issues were found, primarily related to:
  - Use of `sessionStorage` for auth tokens and seller IDs (CWE-922 / CWE-359).
  - Client-side-only route protection (CWE-284) that must not be relied upon as a security control.
  - Unvalidated use of `prompt()` for tracking IDs (potential input-validation/XSS concern).
  - Use of non-TLS WebSocket URLs and verbose console logging.
- These issues are important but do not, by themselves (given the limited front-end context), demonstrate an immediately exploitable, high-impact vulnerability. They should be addressed as part of ongoing hardening and in coordination with back-end controls.

The code is considered **safe to proceed to unit testing**, with the above recommendations tracked for remediation and with a strong expectation that server-side authentication, authorization, and validation are robustly implemented.
