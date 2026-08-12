# Security Scan Report

**Repository:** APB_Demo

**Branch:** Davhardening01

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 5     |
| Low      | 4     |
| Info     | 2     |

## Findings

### 1. [MEDIUM] Insecure WebSocket Transport (Cleartext `ws://`) — CWE-319

- **File:** `src/app/services/inventory.service.js`
- **Line:** ~47 (`ws = new WebSocket('ws://localhost:8080/inventory/' + sellerId);`)
- **Issue:** The inventory real-time channel uses the unencrypted `ws://` protocol instead of `wss://`. The `sellerId` is also concatenated directly into the WebSocket URL path without validation/encoding.
- **Impact:** Data transmitted over the channel (inventory updates, seller identifiers) is sent in cleartext and is subject to interception and tampering on the network (MITM). No authentication token is presented on the WebSocket handshake, so the endpoint relies solely on a client-supplied `sellerId`, enabling potential subscription to another seller's channel (BOLA/IDOR-style exposure).
- **Recommendation:** Use `wss://` in all non-local environments, source the host from configuration (not hardcoded), pass the auth token during the handshake (subprotocol or short-lived ticket), and enforce server-side authorization that the authenticated user owns the requested `sellerId`.

---

### 2. [MEDIUM] Insecure WebSocket Transport (Cleartext `ws://`) — CWE-319

- **File:** `src/app/services/notification.service.js`
- **Line:** ~30 (`ws = new WebSocket('ws://localhost:8080/notifications/' + sellerId);`)
- **Issue:** Notification stream uses unencrypted `ws://`, concatenates `sellerId` into the path, and immediately renders server-provided `data.message` via `showNotification(data.message, data.type)` without transport authentication.
- **Impact:** Cleartext transport enables interception/tampering. The unauthenticated, ID-in-path subscription model risks cross-tenant notification disclosure (IDOR/BOLA). Untrusted server/MITM content is fed into the notification pipeline.
- **Recommendation:** Switch to `wss://`, drive host from environment configuration, authenticate the socket, enforce ownership of `sellerId` server-side, and treat inbound message content as untrusted (see Finding #9 regarding rendering).

---

### 3. [MEDIUM] Client-Trusted Authorization Identifier (IDOR/BOLA via client-supplied `sellerId`) — CWE-639 / CWE-284

- **File:** `src/app/modules/seller/controllers/product.controller.js` (also `analytics.controller.js`, `order.controller.js`, `inventory.controller.js`)
- **Line:** `vm.sellerId = sessionStorage.getItem('sellerId');` and subsequent service calls (e.g., `ProductService.getProducts(vm.sellerId)`)
- **Issue:** The tenant scoping identifier (`sellerId`) is read from client-side `sessionStorage` and passed directly into API query strings (`/api/products?sellerId=<value>`). The value is fully client-controlled and can be modified in the browser.
- **Impact:** If the backend trusts this parameter instead of deriving the seller from the authenticated token, an attacker can enumerate/modify another seller's products, orders, inventory, and analytics (Broken Object Level Authorization). This is a serious authorization risk **whose exploitability depends on the (unavailable) backend**.
- **Recommendation:** Never rely on a client-supplied `sellerId` for authorization. Derive the seller identity server-side from the authenticated token and ignore/validate any client-supplied identifier against it. Frontend should not use `sellerId` as an authorization boundary.

---

### 4. [MEDIUM] Token/Sensitive Identity Stored in Web Storage — CWE-522 / CWE-539

- **File:** `src/app/services/seller.service.js`
- **Line:** `sessionStorage.setItem('authToken', response.data.authToken);` and `sessionStorage.setItem('sellerId', response.data.sellerId);`
- **Issue:** The bearer authentication token is persisted in `sessionStorage`, which is accessible to any JavaScript running in the page.
- **Impact:** Any XSS or malicious third-party script can read the token from `sessionStorage` and hijack the session (token theft). Web storage provides no protection against script-based exfiltration.
- **Recommendation:** Prefer storing session tokens in `HttpOnly`, `Secure`, `SameSite` cookies managed by the backend. If web storage must be used, minimize token lifetime, and strictly enforce a Content Security Policy and rigorous output encoding to reduce XSS risk.

---

### 5. [MEDIUM] Missing CSRF/XSRF Protection Configuration — CWE-352

- **File:** `src/app/app.config.js`
- **Line:** `AuthInterceptor` factory / `$httpProvider` configuration block
- **Issue:** Authentication uses a `Bearer` token added by an interceptor; however, no anti-CSRF handling is configured (`$httpProvider.defaults.xsrfHeaderName` / `xsrfCookieName`) and no explicit CSRF strategy is defined. State-changing endpoints (`POST/PUT/PATCH/DELETE` to products, orders, inventory, sellers) rely entirely on the token model.
- **Impact:** If any auth material is ever carried by cookies (or the backend accepts ambient credentials), the app is exposed to cross-site request forgery on state-changing operations. As-is it is a defense-in-depth gap.
- **Recommendation:** Explicitly define the CSRF posture: if cookie-based auth is used, configure Angular XSRF token names and require the backend to validate a CSRF token on state-changing requests; document that pure `Authorization` header tokens are not auto-sent cross-site.

---

### 6. [LOW] Unvalidated User Input via `prompt()` Passed Directly to API — CWE-20

- **File:** `src/app/modules/seller/views/orders.view.html`
- **Line:** `ng-click="vm.updateShippingInfo(order.orderId, prompt('Enter tracking ID'))"`
- **Issue:** A raw `prompt()` value (tracking ID) is passed straight into an API update call with no client-side validation or format checking (controller only checks truthiness).
- **Impact:** Unvalidated/malformed input is forwarded to the backend and later rendered in tables; weak validation increases the attack surface for injection/stored-content issues if the backend/rendering is not strict.
- **Recommendation:** Move input capture into the controller, validate/whitelist the tracking ID format (length, allowed characters), and reject invalid values before calling the service.

---

### 7. [LOW] Reflected Backend Error Messages Rendered to User — CWE-209

- **File:** `src/app/modules/seller/controllers/*.controller.js` (e.g., `analytics`, `product`, `order`, `inventory`, `auth`)
- **Line:** `error.data?.message` concatenated into `NotificationService.showNotification(...)`
- **Issue:** Raw server error messages are surfaced directly to the UI.
- **Impact:** Verbose backend errors may leak internal details (stack traces, identifiers, backend structure) aiding reconnaissance. Content is rendered via Angular interpolation (auto-escaped), so XSS risk is low, but information disclosure remains.
- **Recommendation:** Display generic, user-friendly messages; log detailed errors only to a secure channel. Do not echo raw backend error text to end users.

---

### 8. [LOW] Query-String Parameters Built by String Concatenation Without Encoding — CWE-20 / CWE-116

- **File:** `src/app/services/analytics.service.js`, `src/app/services/inventory.service.js`, `src/app/services/order.service.js`, `src/app/services/product.service.js`
- **Line:** e.g., `$http.get(apiBase + '/sales?sellerId=' + sellerId + '&period=' + period)`
- **Issue:** URL query parameters are assembled via raw string concatenation without `encodeURIComponent()` or use of `$http`'s `params` option.
- **Impact:** Special characters in `sellerId`/`period` can break the request or enable parameter/URL manipulation depending on backend parsing. Correctness and injection-surface concern.
- **Recommendation:** Use the `$http` `params` config object (e.g., `$http.get(url, { params: { sellerId, period } })`) which safely encodes values, or apply `encodeURIComponent()` to each value.

---

### 9. [LOW] Untrusted WebSocket Message Rendered in UI Notifications — CWE-79 (contextual)

- **File:** `src/app/services/notification.service.js`
- **Line:** `this.showNotification(data.message, data.type);`
- **Issue:** Message text arriving over the (unauthenticated, cleartext) WebSocket is displayed in the notification UI. Rendering is via Angular interpolation which auto-escapes, so direct DOM/HTML injection is not present in the supplied code.
- **Impact:** Low as currently coded (no `ng-bind-html`/`$sce.trustAsHtml`/`.html()` used), but combined with an untrusted transport this is a content-trust concern; risk would escalate if any template later renders it as HTML.
- **Recommendation:** Continue to render all such content only through auto-escaped interpolation; never pass server/socket-provided content to `ng-bind-html`, `$sce.trustAsHtml`, `element.html()`, `$compile`, or `eval`. Validate/sanitize message content server-side.

---

### 10. [INFO] Hardcoded Endpoint Host in Client Code — CWE-547

- **File:** `src/app/services/inventory.service.js`, `src/app/services/notification.service.js`
- **Line:** `'ws://localhost:8080/...'`
- **Issue:** Environment-specific host/port hardcoded in source.
- **Impact:** Not a direct vulnerability, but hinders secure per-environment configuration (e.g., enforcing `wss://` in production) and can cause insecure defaults to ship.
- **Recommendation:** Externalize endpoints into environment configuration/constants and default to secure transports.

---

### 11. [INFO] No Dependency Manifest Available for SCA — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` present in `src`)
- **Issue:** Dependency information (AngularJS version, npm/Bower packages) was not supplied in the scanned folder, so vulnerable/obsolete component analysis could not be performed. Note: AngularJS (1.x) itself is end-of-life and unsupported.
- **Impact:** Undetected vulnerable/EOL dependencies (including the AngularJS framework version) may be present but cannot be confirmed from the supplied code.
- **Recommendation:** Provide dependency manifests and run SCA. Plan migration off end-of-life AngularJS 1.x, and pin/patch all libraries.

---

## Final Decision

**Reason:** **PASS_WITH_WARNINGS.** No hardcoded credentials, secrets, API keys, or tokens were found (login/registration credentials are user-supplied form inputs, not embedded secrets). No exploitable XSS was identified in the supplied code — all dynamic content is rendered through Angular's auto-escaping interpolation, with no use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `$compile`, `$parse`, or `eval()`. Route protection and a 401 interceptor are present. No Critical or High findings, no authentication bypass, and no definitively exploitable authorization flaw were confirmed from the frontend alone.

The remaining issues are non-blocking Medium/Low concerns: cleartext `ws://` WebSocket transport, token/identity stored in `sessionStorage`, client-trusted `sellerId` used for tenant scoping (a potential IDOR/BOLA **whose exploitability depends on unavailable backend logic**), missing explicit CSRF configuration, unvalidated `prompt()` input, reflected backend error messages, and unencoded query-string construction.

**Note:** The IDOR/BOLA concern (Finding #3) and CSRF posture (Finding #5) cannot be fully adjudicated without backend authorization code, which was outside the supplied `src` folder. Frontend-only evidence yields no confirmed Critical/High issue, so the gate is **PASS_WITH_WARNINGS** and the code may proceed to unit testing, provided the Medium findings are triaged and the backend enforces token-derived authorization for `sellerId`.