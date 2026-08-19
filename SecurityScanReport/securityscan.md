# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlertQAETest3

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

### 1. [CRITICAL] Missing Authentication & Authorization / Broken Access Control — CWE-306, CWE-862

- **File:** `src/app/app.config.js`
- **Line:** 15–20 (`/admin` route)
- **Vulnerable Code:**
  ```js
  .when('/admin', {
    templateUrl: 'src/app/fraud-detection/views/threshold-admin.view.html',
    controller: 'ThresholdAdminController',
    controllerAs: 'vm'
  })
  ```
- **Issue:** No route guards, `resolve` blocks, authentication checks, or role validation exist for any route. The privileged `/admin` route (threshold administration, which controls fraud decision logic) is fully accessible to any user who can load the SPA. There is no `$routeChangeStart` interceptor, no `AuthService`, no token/session validation, and no role enforcement anywhere in the codebase.
- **Impact:** Any unauthenticated/unauthorized actor can access the admin panel and create/edit/delete fraud thresholds via `ThresholdConfigFactory`, effectively disabling fraud detection (e.g., setting all actions to `approve`) or triggering mass declines. This is a direct fraud-control bypass and privilege escalation.
- **Recommendation:** Implement an authentication service and enforce access control via route `resolve`/`$routeChangeStart` guards. Validate authenticated session and required admin role for `/admin`, `/dashboard`, and sensitive actions. Enforce authorization server-side as the authoritative control (never rely on client-side guards alone).

---

### 2. [HIGH] Insecure Direct Object Reference (IDOR/BOLA) — CWE-639, CWE-284

- **File:** `src/app/services/alert.service.js`
- **Line:** 60–71 (`confirmTransaction`, `reportTransaction`)
- **Vulnerable Code:**
  ```js
  this.confirmTransaction = function(alertId, customerId) {
    return $http.post(API_BASE + '/' + alertId + '/confirm', { customerId: customerId })...
  };
  this.reportTransaction = function(alertId, customerId) {
    return $http.post(API_BASE + '/' + alertId + '/report', { customerId: customerId })...
  };
  ```
- **Issue:** `alertId` and `customerId` are supplied client-side and passed directly to the API. The customer identity is taken from the alert object rendered in the browser rather than derived from an authenticated session/token. There is no ownership binding between the caller and the target alert/customer.
- **Impact:** A user can confirm or report transactions belonging to other customers by manipulating `alertId`/`customerId`, and `reportTransaction` triggers `/api/protection/initiate` — allowing an attacker to lock other customers' accounts (denial of service) or fraudulently confirm suspicious transactions.
- **Recommendation:** Derive `customerId` from the authenticated session server-side and enforce object-level authorization on every alert operation. Do not trust client-supplied identifiers for ownership decisions.

---

### 3. [HIGH] Sensitive Cardholder/PII Data Exposed in Client Storage & Client-Side Fraud Logic — CWE-312, CWE-522, CWE-602

- **File:** `src/app/services/storage.service.js`, `src/app/services/idempotency.service.js`, `src/app/services/fraud-risk.service.js`
- **Line:** storage.service.js 2 (`window.localStorage`); idempotency.service.js 3 & 11–24; fraud-risk.service.js 26–48 (`evaluateSignals`)
- **Vulnerable Code:**
  ```js
  var storage = window.localStorage;
  // ...
  StorageService.set(STORAGE_KEY, stored); // processedTransactions transaction IDs
  // ...
  this.evaluateSignals = function(transaction) { ... if (transaction.amount > 5000) {...} suspiciousCountries = ['XX','YY']; ... }
  ```
- **Issue:** Transaction identifiers are persisted unencrypted in `localStorage` (readable by any script/XSS and persistent across sessions). Additionally, core fraud-detection signal evaluation and thresholds run entirely client-side, exposing detection rules and allowing tampering.
- **Impact:** Sensitive transaction/idempotency data is exposed to XSS and local inspection; client-side fraud logic and thresholds are visible and can be manipulated by attackers to evade detection.
- **Recommendation:** Avoid storing transaction/PII data in `localStorage`; use secure, `HttpOnly` server-side session state where possible. Move fraud signal evaluation and thresholding to the server as the authoritative source. Encrypt/minimize any required client-side data.

---

### 4. [HIGH] Missing CSRF/XSRF Protection Configuration — CWE-352

- **File:** `src/app/app.module.js`, `src/app/app.config.js`, all `$http` services
- **Line:** app.module.js 1; multiple state-changing `$http.post/put/patch/delete` calls (e.g., alert.service.js 25, 62, 68, 75; threshold-config.factory.js 24, 31, 38)
- **Vulnerable Code:**
  ```js
  angular.module('fraudDetectionApp', ['ngRoute']);
  // No $httpProvider.defaults xsrf configuration; no interceptors
  return $http.post(API_BASE, threshold)...
  ```
- **Issue:** Numerous state-changing requests (create/update/delete thresholds, confirm/report transactions, initiate account protection) are issued with no CSRF token configuration (`$httpProvider.defaults.xsrfHeaderName/xsrfCookieName`), no auth token interceptor, and no evidence of CSRF defense.
- **Impact:** If the API relies on cookie-based sessions, an attacker can forge cross-site requests to alter fraud thresholds or trigger account-protection workflows on behalf of a victim.
- **Recommendation:** Configure Angular XSRF cookie/header handling, add an `$http` interceptor to attach anti-CSRF tokens and auth bearer tokens, and enforce CSRF validation server-side. Prefer token-based auth over ambient cookies for state-changing operations.

---

### 5. [HIGH] Unprotected Analytics/Data Export of Sensitive Fraud Data — CWE-359, CWE-200

- **File:** `src/app/fraud-detection/controllers/analytics-dashboard.controller.js`
- **Line:** 57–66 (`exportData`)
- **Vulnerable Code:**
  ```js
  vm.exportData = function() {
    var dataStr = JSON.stringify(vm.analytics, null, 2);
    var dataBlob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(dataBlob);
    var link = document.createElement('a'); link.href = url;
    link.download = 'fraud-analytics-' + new Date().toISOString() + '.json';
    link.click();
  };
  ```
- **Issue:** The dashboard route has no authorization and exports the entire analytics dataset (alerts, transaction IDs, risk scores, statuses) to a downloadable file without access control or data minimization. Object URL is not revoked (`URL.revokeObjectURL`).
- **Impact:** Unauthorized users can exfiltrate bulk sensitive fraud/PII data. Combined with Finding #1, this is a mass data-disclosure vector.
- **Recommendation:** Enforce authentication/role checks on the dashboard route and export action, minimize/mask exported fields, and audit export events. Call `URL.revokeObjectURL(url)` after download.

---

### 6. [MEDIUM] Unsafe `setTimeout` DOM/Scope Update Pattern — CWE-664

- **File:** `src/app/fraud-detection/controllers/alert.controller.js`, `src/app/fraud-detection/controllers/threshold-admin.controller.js`
- **Line:** alert.controller.js 71–76; threshold-admin.controller.js 104–109 (`showSuccess`)
- **Vulnerable Code:**
  ```js
  setTimeout(function() {
    $scope.$apply(function() { vm.successMessage = null; });
  }, 3000);
  ```
- **Issue:** Uses native `setTimeout` with manual `$scope.$apply` instead of `$timeout`; the timer is not cancelled on `$destroy`, and `$apply` can throw `$digest already in progress`.
- **Impact:** Potential digest errors and lingering callbacks referencing destroyed scopes (minor resource/stability issue). Not directly exploitable but indicates weak lifecycle hygiene.
- **Recommendation:** Use Angular's `$timeout` service (auto-integrates with digest and is cancellable) and cancel on `$destroy`.

---

### 7. [MEDIUM] Client-Side-Only Input Validation — CWE-20, CWE-602

- **File:** `src/app/services/transaction-ingestion.service.js`, `src/app/fraud-detection/controllers/threshold-admin.controller.js`
- **Line:** transaction-ingestion.service.js 26–33 (`validateTransaction`); threshold-admin.controller.js 98–107 (`validateThreshold`)
- **Vulnerable Code:**
  ```js
  this.validateTransaction = function(transaction) { ... if (!transaction.amount || transaction.amount <= 0) errors.push('Invalid amount'); ... };
  vm.validateThreshold = function(threshold) { if (threshold.minScore < 0 || threshold.maxScore > 100 ...) return false; ... };
  ```
- **Issue:** All validation occurs client-side and is trivially bypassable. No sanitization/whitelisting of fields such as `merchantName`, `location`, or `action` before use/transmission.
- **Impact:** Malformed or malicious payloads (e.g., out-of-range thresholds, injection payloads in string fields) may reach the backend if server-side validation is absent, potentially corrupting fraud logic.
- **Recommendation:** Treat client validation as UX-only; enforce authoritative validation and input sanitization server-side. Apply strict whitelisting for enum fields (`action`, `level`).

---

### 8. [MEDIUM] Sensitive Data Reflected in UI Without Masking — CWE-200

- **File:** `src/app/fraud-detection/views/transaction-monitor.directive.html`, `src/app/fraud-detection/views/alerts.view.html`
- **Line:** transaction-monitor.directive.html 24 (`{{ txn.cardIdentifier }}`); alerts.view.html 33–34 (`Customer ID`, `Transaction ID`)
- **Vulnerable Code:**
  ```html
  <td>{{ txn.cardIdentifier }}</td>
  <p><strong>Customer ID:</strong> {{ alert.customerId }}</p>
  ```
- **Issue:** Card identifiers and customer identifiers are rendered in full with no masking and behind unprotected routes.
- **Impact:** Potential PII/PCI exposure to unauthorized viewers, especially given the absence of route protection (Finding #1).
- **Recommendation:** Mask card identifiers (e.g., show last 4 digits) and restrict display of customer identifiers to authorized roles. Ensure PCI-DSS-compliant handling of card data.

---

### 9. [MEDIUM] Weak Identifier Generation Using `Math.random()` / `Date.now()` — CWE-330, CWE-338

- **File:** `src/app/services/alert.service.js`, `src/app/fraud-detection/controllers/threshold-admin.controller.js`
- **Line:** alert.service.js 16 (`'ALT-' + Date.now() + '-' + Math.random().toString(36)...`); threshold-admin.controller.js 61 (`'THR-' + Date.now()`)
- **Vulnerable Code:**
  ```js
  alertId: 'ALT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
  vm.currentThreshold.thresholdId = 'THR-' + Date.now();
  ```
- **Issue:** Non-cryptographic, predictable identifiers generated client-side. `Math.random()` is not suitable for security-relevant identifiers, and `THR-Date.now()` can collide.
- **Impact:** Predictable IDs increase risk when combined with IDOR (Finding #2) and may cause collisions/overwrites of threshold configurations.
- **Recommendation:** Generate resource identifiers server-side using cryptographically secure randomness (UUID v4 / `crypto.getRandomValues`).

---

### 10. [LOW] Error Messages Reflect Backend Details to UI — CWE-209

- **File:** Multiple controllers (`alert.controller.js` 30, 55, 63; `analytics-dashboard.controller.js` 37; `threshold-admin.controller.js` 24, 73, 92)
- **Line:** e.g., alert.controller.js 30
- **Vulnerable Code:**
  ```js
  vm.error = 'Failed to load alerts: ' + (error.data ? error.data.message : error.statusText);
  ```
- **Issue:** Raw backend error messages/status text are surfaced directly to the user.
- **Impact:** Potential leakage of backend implementation/error details aiding reconnaissance.
- **Recommendation:** Display generic user-facing messages; log detailed errors securely on the server side only.

---

### 11. [LOW] No Transport Security / Endpoint Hardening Assurance — CWE-319 (context-dependent)

- **File:** All `$http` services (relative `/api/...` base paths)
- **Line:** e.g., alert.service.js 3; audit.service.js 2; fraud-risk.service.js 3
- **Vulnerable Code:**
  ```js
  var API_BASE = '/api/alerts';
  ```
- **Issue:** Endpoints are relative (inherits page scheme), and there is no evidence of HSTS/TLS enforcement, secure cookie flags, or `$http` security defaults in the SPA config.
- **Impact:** If the app is served over HTTP anywhere, sensitive fraud/PII traffic could be exposed. This is dependent on deployment configuration not present in the supplied code.
- **Recommendation:** Enforce HTTPS/HSTS at the server/CDN, set `Secure`/`HttpOnly`/`SameSite` on cookies, and confirm TLS is mandatory for all `/api` traffic.

---

### 12. [INFO] Dependency Manifest Not Provided — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` supplied)
- **Line:** N/A
- **Issue:** No dependency manifest or lockfile was provided; AngularJS (1.x) is itself End-of-Life (unsupported since Jan 2022) based on the `ngRoute`/`controllerAs` usage patterns observed.
- **Impact:** Cannot assess third-party vulnerabilities. AngularJS EOL means no security patches for framework-level vulnerabilities.
- **Recommendation:** Provide `package.json`/`bower.json` + lockfiles for SCA scanning. Plan migration off End-of-Life AngularJS; if retained, apply a supported LTS/commercial patch stream.

---

## Positive Observations (No XSS Sink Findings)

No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `$compile`, `$parse`, `$eval`, `eval()`, or raw `innerHTML` was detected. All templates use safe interpolation (`{{ }}`), which AngularJS auto-escapes. No hardcoded passwords, API keys, tokens, or secrets were found in the supplied source. **No XSS or hardcoded-secret findings are reported** (per instruction #15 — only evidence-backed issues are listed).

---

## Final Decision

**Reason:** **FAIL.** The codebase contains a **CRITICAL** Broken Access Control issue — no authentication, authorization, route guards, or role validation exist anywhere, leaving the privileged `/admin` threshold-administration route (which governs fraud-decision logic) fully exposed to any user. This is compounded by **HIGH** severity IDOR/BOLA in alert confirm/report/protection operations (client-supplied `customerId`), unprotected bulk data export, sensitive data in `localStorage` with client-side fraud logic, and absent CSRF/token protections on state-changing requests. Per the gating rules, the presence of a Critical finding, authentication/authorization bypass, and exploitable High-risk issues mandates a **FAIL**. The code is **NOT safe to proceed to unit testing** until the authentication/authorization layer, object-level access control, CSRF protection, and server-side validation are implemented and re-reviewed.