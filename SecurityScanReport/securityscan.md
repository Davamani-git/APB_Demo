# Security Scan Report

**Repository:** APB_Demo

**Branch:** smartHomeQATest

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 3     |
| Low      | 3     |
| Info     | 2     |

## Findings

### 1. [MEDIUM] Sensitive Authentication Token Stored in localStorage — CWE-522 / CWE-539

- **File:** `src/app/app.config.js`
- **Line:** 22 (`const token = localStorage.getItem('authToken');`)
- **Vulnerable Code:**
  ```js
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The bearer authentication token is read from `localStorage`. Data in `localStorage` is accessible via JavaScript and persists indefinitely, making it retrievable by any XSS payload or malicious third-party script running in the page context.
- **Impact:** If any XSS or supply-chain compromise occurs, the attacker can exfiltrate the `authToken` and impersonate the user (session hijacking / account takeover).
- **Recommendation:** Store session tokens in a `HttpOnly`, `Secure`, `SameSite=Strict` cookie handled server-side, or use short-lived in-memory tokens with silent refresh. Avoid persisting long-lived credentials in `localStorage`/`sessionStorage`.

---

### 2. [MEDIUM] Missing Route/Authorization Protection & No Role Validation — CWE-862 (Missing Authorization) / CWE-284

- **File:** `src/app/app.config.js`
- **Line:** 5–20 (`$routeProvider` route definitions)
- **Vulnerable Code:**
  ```js
  .when('/dashboard', { ... controller: 'EnergyDashboardController', ... })
  .when('/devices', { ... controller: 'DeviceListController', ... })
  .otherwise({ redirectTo: '/dashboard' });
  ```
- **Issue:** Routes have no `resolve` guard, authentication check, or role validation. There is no client-side gate ensuring the user is authenticated before rendering protected views. Authorization decisions appear to rely solely on the presence of a token that may or may not be set.
- **Impact:** Unauthenticated or unauthorized users can navigate to application views. While client-side guards are not a substitute for server-side authorization, the total absence of route protection increases exposure to unauthorized data rendering and weakens defense-in-depth.
- **Recommendation:** Add `resolve` blocks that verify authentication/role prior to route activation, and confirm that all backend endpoints enforce server-side authorization (RBAC). Do not rely on client-side checks alone.

---

### 3. [MEDIUM] Potential IDOR / BOLA on Device Data Endpoint — CWE-639 (Authorization Bypass Through User-Controlled Key)

- **File:** `src/app/services/energyData.service.js`
- **Line:** 30 (`return $http.get(API_BASE + '/api/energy/device/' + deviceId)...`)
- **Vulnerable Code:**
  ```js
  this.fetchDeviceData = function(deviceId) {
    return $http.get(API_BASE + '/api/energy/device/' + deviceId).then(...)
  };
  ```
- **Issue:** `deviceId` is concatenated directly into the URL path with no validation or encoding, and there is no evidence of object-level authorization. A user could substitute another tenant's/device's identifier.
- **Impact:** If the backend does not enforce ownership checks, an attacker could enumerate or access energy data belonging to other users/devices (Broken Object Level Authorization). Unencoded path segments may also enable path traversal or injection depending on server handling.
- **Recommendation:** Enforce object-level authorization on the server for every `deviceId` request. On the client, validate/whitelist `deviceId` format and use `encodeURIComponent(deviceId)` when constructing the URL.

---

### 4. [LOW] Verbose Error Logging to Browser Console — CWE-532 (Insertion of Sensitive Information into Log File)

- **File:** `src/app/services/energyData.service.js` (lines 13, 24, 34); `src/app/services/alert.service.js` (line 18); `src/app/services/utilityPricing.factory.js` (line 24); `src/app/app.config.js` (lines 32, 34)
- **Vulnerable Code:**
  ```js
  console.error('Failed to fetch real-time data:', error);
  console.error('Failed to fetch device data:', error);
  console.error('Server error:', rejection.statusText);
  ```
- **Issue:** Full error/rejection objects are logged to the browser console. These may contain response bodies, headers, or backend detail that aids reconnaissance.
- **Impact:** Information disclosure to anyone with access to the browser (e.g., shared/kiosk devices or via injected scripts). Low direct risk but aids attackers.
- **Recommendation:** Log generic messages in production; strip or gate detailed error logging behind a debug flag disabled in production builds.

---

### 5. [LOW] Hardcoded API Base URLs — CWE-547 (Use of Hard-coded, Security-relevant Constants)

- **File:** `src/app/services/energyData.service.js` (line 6), `src/app/services/alert.service.js` (line 6), `src/app/services/utilityPricing.factory.js` (line 7)
- **Vulnerable Code:**
  ```js
  const API_BASE = 'https://api.smarthome.example.com';
  const API_BASE = 'https://api.utility.example.com';
  ```
- **Issue:** API endpoints are hardcoded in source rather than injected via configuration/environment. No credentials or secrets are hardcoded (endpoints only), so severity is low. Positively, all endpoints use HTTPS.
- **Impact:** Reduced maintainability and environment portability; increases risk of accidentally shipping non-production endpoints. No direct exploitable exposure.
- **Recommendation:** Externalize endpoints into an AngularJS `constant`/config service or build-time environment configuration.

---

### 6. [LOW] Unvalidated Third-Party Chart Rendering Dependency (`Chart`) — CWE-1104 (Use of Unmaintained Third-Party Components)

- **File:** `src/app/energy-monitoring/directives/energyChart.directive.js`
- **Line:** 25 (`chart = new Chart(ctx, {...})`)
- **Vulnerable Code:**
  ```js
  chart = new Chart(ctx, { type: 'line', data: {...}, options: {...} });
  ```
- **Issue:** The directive uses a global `Chart` object (Chart.js) that is not declared as a managed dependency in the supplied code, and no version/integrity information is available. Data (`labels`, `values`) is derived from API responses and passed into the chart without sanitization of label content.
- **Impact:** Cannot verify the library version for known CVEs. Untrusted `item.label` values rendered by the chart library could be a vector if the library version mishandles HTML in tooltips/labels.
- **Recommendation:** Pin and audit the Chart.js version (check for known CVEs), enforce Subresource Integrity for the CDN include, and sanitize/whitelist label strings coming from API responses.

---

### 7. [INFO] No Dangerous DOM/HTML Sinks Detected — CWE-79 (Positive Finding)

- **Files:** All templates and directives (`dashboard.view.html`, `devices.view.html`, `deviceConsumption.directive.js`, `energyChart.directive.js`)
- **Issue / Observation:** No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$parse`, `$eval`, or `eval()` was found. All dynamic values are rendered via AngularJS interpolation (`{{ }}`), which auto-escapes output. `ng-click` handlers bind to controller functions, not string expressions.
- **Impact:** No client-side XSS injection sinks identified in the reviewed code. This is a positive security posture.
- **Recommendation:** Maintain this practice; continue to avoid `trustAsHtml`/`$compile` on user- or API-supplied content.

---

### 8. [INFO] No Hardcoded Secrets, Credentials, or Tokens Detected — CWE-798 (Positive Finding)

- **Files:** All source files
- **Issue / Observation:** No hardcoded passwords, API keys, secret tokens, or credentials were found in the supplied source. Authentication relies on a runtime-retrieved `authToken` (see Finding #1). Only public HTTPS endpoint URLs are present.
- **Impact:** No embedded-secret exposure.
- **Recommendation:** No action required; keep secrets out of source and continue enforcing HTTPS.

---

## Final Decision

**Reason:** No CRITICAL findings, no hardcoded credentials/secrets, no exploitable High-risk issues, and no authentication-bypass or dangerous XSS sinks were detected in the supplied code. The identified issues are non-blocking: token storage in `localStorage` (MEDIUM), absent client-side route/role guards (MEDIUM), and a potential IDOR on the device endpoint (MEDIUM) that depends on backend enforcement not visible in this client codebase, along with low-severity logging, hardcoded-URL, and third-party-dependency concerns. Because only non-blocking MEDIUM/LOW issues remain, the security gate is **PASS_WITH_WARNINGS** — the code may proceed to unit testing, but the MEDIUM findings (especially token storage and object-level authorization) should be remediated before production release.

*Note: Backend authorization enforcement, dependency manifests (package.json/bower.json), and TLS server configuration were not part of the supplied client-side code; the assessment of IDOR/BOLA (Finding #3) and dependency CVEs (Finding #6) is therefore limited to what is observable in the client. If a definitive verdict on those areas is required, provide the backend authorization logic and dependency manifest files.*