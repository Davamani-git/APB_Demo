# Security Scan Report

**Repository:** APB_Demo

**Branch:** foodDeliveryOrderTracking

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 4     |
| Medium   | 4     |
| Low      | 3     |
| Info     | 1     |

## Findings

### 1. [CRITICAL] Insecure WebSocket Transport (Cleartext Communication) — CWE-319

- **File:** `src/app/services/websocket.service.js`
- **Line:** 12 (`var wsUrl = 'ws://' + $window.location.host + '/ws/orders/' + orderId;`) and `src/app/services/location-tracking.service.js` Line 13 (`var wsUrl = 'ws://' + $window.location.host + '/ws/location/' + orderId;`)
- **Vulnerable Code:**
  ```js
  var wsUrl = 'ws://' + $window.location.host + '/ws/orders/' + orderId;
  ws = new WebSocket(wsUrl);
  ```
- **Issue:** WebSocket connections are hardcoded to the insecure `ws://` scheme instead of `wss://`. Live order status and real-time delivery partner GPS location data are transmitted over an unencrypted channel.
- **Impact:** Real-time location tracking (latitude/longitude of a delivery partner and, by extension, the customer's delivery address) and order status data are exposed to man-in-the-middle interception and tampering on any untrusted network (public Wi-Fi, compromised routers). Sensitive PII/geolocation leakage. Also note: the WebSocket handshake does NOT carry the Bearer token that the `AuthInterceptor` adds only to `$http` requests, so these channels may also be unauthenticated.
- **Recommendation:** Use `wss://` (TLS) for all WebSocket connections. Derive the scheme dynamically from the page protocol (e.g., `($window.location.protocol === 'https:' ? 'wss://' : 'ws://')` and enforce `wss` in production). Add authentication to the WebSocket handshake (token in a subprotocol/query param over TLS, or a signed short-lived ticket).

---

### 2. [HIGH] Broken Object Level Authorization / IDOR via `orderId` — CWE-639 (OWASP API1: BOLA)

- **File:** `src/app/services/order-status.service.js` (Line 12), `src/app/services/delivery-partner.service.js` (Line 11), `src/app/services/eta.service.js` (Line 9), `src/app/services/location-tracking.service.js` (Line 43)
- **Vulnerable Code:**
  ```js
  return $http.get('/api/orders/' + orderId + '/delivery-partner')
  return $http.get('/api/orders/' + orderId + '/status')
  return $http.get('/api/orders/' + orderId + '/location')
  ```
- **Issue:** The `orderId` is taken directly from the route (`$routeParams.orderId`) and passed to backend APIs with no ownership binding on the client, and the default route redirects to a guessable, sequential identifier (`/track/ORDER123`). If the backend does not enforce that the authenticated user owns the requested order, any user can enumerate order IDs to view another customer's order status, delivery partner details (name/phone), and live GPS location.
- **Impact:** Unauthorized disclosure of other customers' PII and real-time location — a serious authorization flaw and privacy breach.
- **Recommendation:** Enforce server-side object-level authorization on every `/api/orders/:orderId/*` endpoint (verify the order belongs to the authenticated principal). Use non-sequential, unguessable identifiers (UUIDs) instead of predictable `ORDER123` style IDs. This must be validated on the backend; the client alone cannot fix it.

---

### 3. [HIGH] Missing Route Protection / No Authentication Guard — CWE-306 (Missing Authentication for Critical Function)

- **File:** `src/app/app.module.js` (Lines 6–20)
- **Vulnerable Code:**
  ```js
  .when('/track/:orderId', { ... controller: 'OrderTrackingController' ... })
  .when('/delivery/:orderId', { ... controller: 'DeliveryTrackingController' ... })
  .otherwise({ redirectTo: '/track/ORDER123' });
  ```
- **Issue:** Routes have no `resolve` guard, no authentication check, and no role validation. The `AuthInterceptor` only *attaches* a token if one exists; it never blocks navigation for unauthenticated users. There is no client-side gate preventing access to tracking views before login.
- **Impact:** Combined with the IDOR above, unauthenticated/unauthorized users can load tracking views and trigger API/WebSocket calls. Enables reconnaissance and privilege-escalation attempts.
- **Recommendation:** Add a `resolve` block to protected routes that verifies an authenticated session, and redirect to `/login` when absent. Enforce authorization server-side as the primary control.

---

### 4. [HIGH] Dynamically Injected Third-Party Script Without Integrity Controls — CWE-829 (Inclusion of Functionality from Untrusted Control Sphere)

- **File:** `src/app/services/map.service.js` (Lines 13–20)
- **Vulnerable Code:**
  ```js
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY';
  script.async = true;
  document.head.appendChild(script);
  ```
- **Issue:** A remote script is injected into the DOM at runtime with no Subresource Integrity (SRI) and (implicitly) no Content Security Policy restricting script sources. Any compromise or MITM of the loaded resource results in arbitrary JavaScript execution in the app context. The API key placeholder (`YOUR_API_KEY`) also indicates an unconfigured/hardcoded key pattern (see Finding 8).
- **Impact:** Supply-chain / third-party script injection risk leading to full client-side compromise (session/token theft from localStorage, DOM manipulation).
- **Recommendation:** Load the Maps SDK via a controlled, CSP-allowlisted source, apply a strict Content-Security-Policy (`script-src`), and where feasible use SRI or a vetted loader. Store/configure API keys server-side and restrict the key by HTTP referrer/domain in the Google Cloud console.

---

### 5. [HIGH] Sensitive Bearer Token Stored in localStorage — CWE-522 / CWE-1004

- **File:** `src/app/shared/interceptors/auth.interceptor.js` (Lines 6–14)
- **Vulnerable Code:**
  ```js
  var token = $window.localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The authentication token is persisted in `localStorage`, which is readable by any JavaScript running in the origin and is not protected by `HttpOnly`/`Secure` cookie flags. Any XSS or malicious injected script (see Finding 4) can exfiltrate the token.
- **Impact:** Token theft leads to full session hijacking / account takeover. localStorage persists across sessions, widening the exposure window.
- **Recommendation:** Prefer storing session tokens in `HttpOnly`, `Secure`, `SameSite` cookies managed by the server. If a JS-accessible token is unavoidable, use short-lived tokens, tight CSP, and ensure the app is XSS-hardened. Clear tokens aggressively on logout/401 (currently done only on 401).

---

### 6. [MEDIUM] Open Redirect on 401 via `$window.location.href` — CWE-601

- **File:** `src/app/shared/interceptors/auth.interceptor.js` (Lines 15–20)
- **Vulnerable Code:**
  ```js
  if (rejection.status === 401) {
    $window.localStorage.removeItem('authToken');
    $window.location.href = '/login';
  }
  ```
- **Issue:** The redirect target is a hardcoded relative path (`/login`), which is safe here; however the pattern of direct `$window.location.href` assignment is flagged because there is no CSRF/XSRF token handling anywhere in the app and 401 handling assumes a specific route. Any future move to a dynamic/return-URL based redirect would become an open-redirect risk.
- **Impact:** Currently low exploitability (static target), but the codebase has no XSRF token configuration (`$httpProvider.xsrfHeaderName`/`xsrfCookieName` not set), so state-changing requests would be unprotected if added.
- **Recommendation:** Keep the redirect target static/allowlisted. Configure Angular XSRF protection (`$httpProvider.defaults.xsrfHeaderName`/`xsrfCookieName`) to align with server double-submit cookie protection before adding any write operations.

---

### 7. [MEDIUM] Unvalidated / Untrusted WebSocket Message Deserialization — CWE-20 (Improper Input Validation)

- **File:** `src/app/services/websocket.service.js` (Line 19), `src/app/services/location-tracking.service.js` (Line 22)
- **Vulnerable Code:**
  ```js
  var data = JSON.parse(event.data);
  $rootScope.$broadcast('websocket:message', data);
  ...
  var locationData = JSON.parse(event.data);
  ```
- **Issue:** Incoming WebSocket payloads are `JSON.parse`d and broadcast without schema validation or type checking. Because the channel is `ws://` (unauthenticated, cleartext — Finding 1), an attacker can inject arbitrary `status`, `latitude`, `longitude`, or `eventId` values that are rendered in the UI and drive state transitions. A malformed payload also causes an uncaught exception in `onmessage`.
- **Impact:** UI spoofing (fake statuses/locations), potential state manipulation, and denial-of-view via unhandled parse errors.
- **Recommendation:** Wrap `JSON.parse` in try/catch, validate the message against an expected schema (allowed status enum, numeric bounded lat/lng), and reject unexpected fields before broadcasting.

---

### 8. [MEDIUM] Hardcoded / Placeholder API Key in Client Source — CWE-798 (Use of Hard-coded Credentials)

- **File:** `src/app/services/map.service.js` (Line 15)
- **Vulnerable Code:**
  ```js
  script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_****';   // key masked
  ```
- **Issue:** The Google Maps API key is embedded in the URL directly in front-end code. Even the placeholder demonstrates the anti-pattern; any real key placed here is fully public and can be scraped and abused (quota theft / billing abuse).
- **Impact:** API key abuse, unexpected billing, and quota exhaustion if a live key is used.
- **Recommendation:** Restrict the Maps key by HTTP referrer and API in Google Cloud, keep it environment-injected at build/deploy time, and never commit real keys. Rotate any key that has been committed. *(Key value masked in this report.)*

---

### 9. [MEDIUM] Sensitive Data Cached Client-Side Indefinitely — CWE-524 (Use of Cache Containing Sensitive Information)

- **File:** `src/app/services/delivery-partner.service.js` (Line 7, 15), `src/app/services/location-tracking.service.js` (`locationCache`), `src/app/services/order-status.service.js` (`cache`), `src/app/services/eta.service.js` (`etaCache`)
- **Vulnerable Code:**
  ```js
  cache[orderId] = partner;   // includes name, phone, photoUrl
  locationCache[orderId] = locationData;  // real-time GPS
  ```
- **Issue:** Delivery partner PII (name, phone, photo) and precise geolocation are cached in in-memory JS objects with no invalidation/TTL. While phone is masked, the location and identity data persist for the page lifetime and are accessible to any script in the origin.
- **Impact:** Sensitive PII/geolocation is readily accessible to injected scripts (compounds Findings 4/5) and remains stale/valid even after backend revocation.
- **Recommendation:** Add TTL/invalidation to caches, minimize cached PII, and clear caches on logout/`$destroy`.

---

### 10. [LOW] Phone Number Masking Performed Client-Side Only — CWE-201 (Insertion of Sensitive Information Into Sent Data)

- **File:** `src/app/services/delivery-partner.service.js` (Lines 12–14)
- **Vulnerable Code:**
  ```js
  partner.phone = partner.phone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3');
  ```
- **Issue:** The backend returns the full unmasked phone number and masking is applied only in the browser. The complete number is present in the network response and DevTools, so the masking provides no real protection. The regex also silently fails to mask non-standard/international formats.
- **Impact:** PII (full phone number) is exposed to anyone inspecting network traffic despite the appearance of masking.
- **Recommendation:** Perform masking/tokenization server-side and only send the masked value to the client. Never rely on client-side transformation as a privacy control.

---

### 11. [LOW] `onerror` Inline Handler in Directive Template — CWE-79 (Reflected XSS surface, low risk)

- **File:** `src/app/modules/delivery-tracking/directives/partner-info.directive.js` (partner-photo `<img ... onerror="...">`)  
- **Vulnerable Code:**
  ```html
  <img ng-src="{{partner.photoUrl}}" ... onerror="this.src='data:image/svg+xml,...'">
  ```
- **Issue:** `partner.photoUrl` is server-controlled data bound via `ng-src`. AngularJS sanitizes `ng-src` URLs, so this is low risk, but the inline `onerror` JavaScript handler is an anti-pattern that conflicts with a strict CSP (`script-src`/`unsafe-inline` restrictions) and should be avoided.
- **Impact:** Low — no confirmed injection; primarily a CSP-compatibility and defense-in-depth concern.
- **Recommendation:** Replace the inline `onerror` handler with a directive/controller-based fallback so a strict CSP without `unsafe-inline` can be enforced. Validate that `photoUrl` is an allowlisted image origin.

---

### 12. [LOW] Verbose / Generic Error Handling Silently Serving Stale Data — CWE-388 (Error Handling)

- **File:** `src/app/services/eta.service.js` (Lines 16–19), `src/app/services/order-status.service.js`, `src/app/services/delivery-partner.service.js`
- **Issue:** On API failure the services silently fall back to cached data without signaling staleness or checking whether the failure was an authorization (401/403) event. A revoked/expired session could continue to display previously cached sensitive data.
- **Impact:** Stale sensitive data may be shown after access is revoked; masks security-relevant failures.
- **Recommendation:** Distinguish auth failures (401/403) from transient network errors and avoid serving cached PII on authorization failures.

---

### 13. [INFO] No Dependency Manifest Available for CVE Assessment

- **File:** N/A (no `package.json` / `bower.json` present in `src`)
- **Issue:** No dependency manifest was supplied, so AngularJS version and third-party library CVEs (e.g., end-of-life AngularJS 1.x — no longer maintained/patched) could not be verified. The app uses `ngRoute`, `ngAnimate`; AngularJS 1.x itself reached end-of-life (January 2022) and receives no security patches.
- **Impact:** Cannot assess dependency-level (SCA) risk; running EOL AngularJS is an inherent unpatched-framework risk.
- **Recommendation:** Provide `package.json`/`bower.json` and lockfiles for SCA. Plan migration off end-of-life AngularJS 1.x.

---

## Final Decision

**Reason:** **FAIL.** The submitted code contains one **CRITICAL** issue (real-time order/location data and unauthenticated WebSocket channels transmitted over cleartext `ws://` — CWE-319) and multiple **HIGH**-severity, exploitable authorization and supply-chain flaws: probable **IDOR/BOLA** on `/api/orders/:orderId/*` combined with a guessable default order ID (`ORDER123`), **missing route/authentication guards**, dynamic injection of a third-party script without CSP/SRI, and a Bearer token stored in `localStorage`. These represent serious authorization weaknesses and sensitive PII/geolocation exposure. Per the gating rules, the presence of Critical and exploitable High-risk issues mandates a **FAIL**. The code is **not safe to proceed to unit testing** until at minimum: (1) all WebSocket/API traffic uses TLS (`wss://`/`https://`) with authenticated handshakes, (2) server-side object-level authorization and unguessable IDs are enforced, (3) route auth guards are added, and (4) the Maps script loading and token storage are hardened. A dependency manifest should also be supplied to complete the SCA portion of this review.