# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlert2008R4

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 4     |
| Medium   | 5     |
| Low      | 3     |
| Info     | 2     |

## Findings

### 1. [CRITICAL] Missing Route/Authorization Protection — Broken Access Control (CWE-862 / OWASP A01:2021)

- **File:** `src/app/app.config.js`
- **Line:** 4–7 (`$routeProvider` route definitions)
- **Vulnerable Code:**
```js
$routeProvider
.when('/dashboard',{templateUrl:'...',controller:'ActionRouterController',controllerAs:'vm'})
.when('/config',{templateUrl:'...',controller:'ThresholdConfigController',controllerAs:'vm'})
.otherwise({redirectTo:'/dashboard'});
```
- **Issue:** The `/config` route (threshold configuration — a privileged fraud-operations function) has **no route-level authentication or role guard** (`resolve` block, `requireRole`, or auth check). Any user reaching the SPA can navigate to `#/config`, load `ThresholdConfigController`, and invoke `ConfigService.updateThresholds()` / `policyDecisionService.updateThreshold()`. The PRD-derived automation tests (TC-016, TC-017, TC-018) explicitly require that unauthorized, unauthenticated, and read-only users be prevented from modifying thresholds, yet **no client-side enforcement exists** for this in the AngularJS routing/controllers.
- **Impact:** Privilege escalation and unauthorized modification of fraud-detection thresholds. An attacker could lower/disable fraud thresholds (e.g., set `isActive=false` or widen score ranges), effectively disabling fraud protection across all transactions — direct financial-loss and compliance impact for a payments system.
- **Recommendation:** Add a `resolve` guard on the `/config` route that verifies an authenticated session and validates the user role (e.g., "Fraud Operations Manager") before controller instantiation. Server-side authorization on `/api/config/thresholds` and `/api/policy/threshold/update` remains mandatory (defense in depth) since client controls are bypassable.

---

### 2. [HIGH] Sensitive Authentication Token Stored in localStorage (CWE-522 / CWE-922 — OWASP A07:2021)

- **File:** `src/app/shared/interceptors/authInterceptor.js` (Line 6) and `src/app/app.config.js` (Line 13)
- **Vulnerable Code:**
```js
var token=$window.localStorage.getItem('authToken');
if(token){ config.headers.Authorization='Bearer '+token; }
```
- **Issue:** The bearer authentication token is read from `localStorage`. `localStorage` is JavaScript-accessible and persistent, making it directly readable by any XSS payload and not cleared on session end.
- **Impact:** If any XSS vector executes (see Findings 3/8), the attacker can exfiltrate the `authToken` and fully impersonate the user, including a privileged fraud-ops user, enabling threshold tampering and account takeover.
- **Recommendation:** Store session tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies handled by the server rather than `localStorage`. If tokens must remain client-side, use short-lived tokens with in-memory storage and clear them on logout/expiry.

---

### 3. [HIGH] Sensitive PII / Card Data Cached in localStorage via Generic Cache (CWE-312 / CWE-922 — OWASP A02:2021)

- **File:** `src/app/services/cache.service.js` (Lines: `set`/`get`/`clear`) used by `src/app/services/event-ingestion.service.js` (`deduplicateEvents`) and `src/app/services/config.service.js` (`getThresholds`/`updateThresholds`)
- **Vulnerable Code:**
```js
function set(key,value){ $window.localStorage.setItem(key,JSON.stringify(value)); }
...
CacheService.set('processedEventIds',seen);              // event-ingestion.service.js
$window.localStorage.setItem('alertThresholds',JSON.stringify(response.data)); // config.service.js
```
- **Issue:** Transaction event identifiers and fraud-configuration data (alert thresholds) are persisted to `localStorage`. In a credit-card fraud platform this constitutes sensitive/regulated data stored in an unencrypted, JS-accessible, persistent store. `clear()` also wipes all keys indiscriminately.
- **Impact:** Sensitive fraud metadata and threshold configuration are exposed to XSS-based theft and remain readable on shared/compromised devices, aiding attacker reconnaissance and threshold-tampering. Potential PCI-DSS/compliance exposure.
- **Recommendation:** Do not persist transaction or fraud-config data in `localStorage`. Use in-memory caching (Angular `$cacheFactory`) with server-side revalidation, and avoid caching authorization-sensitive configuration on the client.

---

### 4. [HIGH] Client-Side-Only Threshold Authorization — Broken Object/Function Level Authorization (CWE-639 / CWE-285 — OWASP A01:2021)

- **File:** `src/app/modules/fraud-detection/services/policyDecisionService.js` (`updateThreshold`) and `src/app/services/config.service.js` (`updateThresholds`)
- **Line:** `updateThreshold` / `updateThresholds` functions
- **Vulnerable Code:**
```js
this.updateThreshold=function(threshold){
 if(!threshold||!threshold.riskLevel){ return $q.reject({error:'Invalid threshold configuration'}); }
 return $http.post(fraudConstants.API_ENDPOINTS.UPDATE_THRESHOLD,threshold)...
```
- **Issue:** Threshold update requests are issued with **no role validation, no object-ownership check, and only trivial field-presence validation**. There is no evidence of any client-side role gating on this privileged operation, and the controllers (`fraudConfigController`, `ThresholdConfigController`) expose it to any rendered user.
- **Impact:** A non-privileged authenticated user (or a request replayed with a stolen token) can modify fraud thresholds — a function-level authorization flaw (BFLA) with direct financial-fraud impact.
- **Recommendation:** Enforce server-side RBAC for threshold updates (definitive control), and add client-side role checks to hide/disable the update path for non-authorized roles. Validate threshold value ranges and monotonic ordering server-side.

---

### 5. [HIGH] Missing CSRF/XSRF Protection Configuration on State-Changing $http Requests (CWE-352 — OWASP A01:2021)

- **File:** `src/app/app.config.js` / `src/app/shared/interceptors/authInterceptor.js` (interceptor definitions); affects all POST/PUT services (`config.service.js`, `policyDecisionService.js`, `transactionIngestionService.js`, `auditFactory.js`, `audit-trail.service.js`, `policy-engine.service.js`)
- **Issue:** Authentication relies on a bearer token attached from `localStorage`. There is **no XSRF token handling** (no `$httpProvider.defaults.xsrfHeaderName`/`xsrfCookieName` configuration and no CSRF token injected on state-changing calls). Numerous state-changing endpoints exist (`/api/policy/threshold/update`, `/api/config/thresholds` PUT, `/api/transactions/hold`, `/api/transactions/decline`, `/api/alerts/send`).
- **Impact:** If any authentication is cookie-assisted or the token model changes, state-changing fraud operations (threshold updates, transaction hold/decline) are exposed to CSRF. Even with bearer tokens, the absence of explicit CSRF configuration is a hardening gap for a financial application.
- **Recommendation:** Configure Angular's XSRF defaults (`xsrfHeaderName`, `xsrfCookieName`) and enforce anti-CSRF tokens server-side on all state-changing endpoints. Ensure the token model is not ambient-cookie based without CSRF defenses.

---

### 6. [MEDIUM] Unauthenticated / Insecure Redirect via location.href Fragment (CWE-601 — OWASP A01:2021)

- **File:** `src/app/app.config.js` (Line ~24) and `src/app/shared/interceptors/authInterceptor.js`
- **Vulnerable Code:**
```js
responseError:function(rejection){
 if(rejection.status===401){ $window.location.href='#/login'; }
 return $q.reject(rejection);
}
```
- **Issue:** On 401 the app redirects to `#/login`, but there is **no `/login` route defined** in `app.config.js` (only `/dashboard` and `/config`; `otherwise` → `/dashboard`). The failed 401 therefore falls through to the unprotected dashboard rather than a genuine auth boundary, and no session/token cleanup occurs on 401.
- **Impact:** Broken authentication-failure handling; users landing back on the unprotected dashboard after auth failure, and stale tokens are not cleared, weakening the auth state machine.
- **Recommendation:** Define a proper `/login` route with an authentication controller, clear `authToken` from storage on 401, and ensure the fallback route is not an authenticated view.

---

### 7. [MEDIUM] Duplicated / Conflicting Auth & Audit Implementations Across Two Modules (CWE-710 — OWASP A04:2021 Insecure Design)

- **File:** `FraudAlertModule` (`app.config.js`, `services/*`) vs `fraudDetection`/`fraudDetectionModule` (`modules/fraud-detection/*`, `shared/interceptors/authInterceptor.js`, `services/auditFactory.js`)
- **Issue:** Two parallel implementations of the same domain exist with duplicated auth interceptors and audit services, and inconsistent module names (`fraudDetection` vs `fraudDetectionModule` — the tests/`fraudConstants`/`auditFactory` register on `fraudDetectionModule` while controllers/services use `fraudDetection`). This inconsistent wiring can silently disable the auth interceptor for one module and produce an inconsistent security posture.
- **Impact:** Security controls (auth interceptor, audit logging) may not be applied uniformly; a request path may execute without the intended `Authorization` header or audit trail, undermining accountability and access control.
- **Recommendation:** Consolidate to a single module with one canonical auth interceptor and audit service. Fix module-name mismatches so the interceptor is registered and applied to every `$http` call.

---

### 8. [MEDIUM] Unsanitized/Reflected Data Rendered in DOM (Potential Stored/Reflected XSS) (CWE-79 — OWASP A03:2021)

- **File:** `src/app/fraud-alert/views/transaction-monitor.template.html` (merchant/txn fields), `src/app/modules/fraud-detection/views/fraud-dashboard.html` (`{{alert.signals.merchantRisk}}`, `{{txn.merchant}}`), and error surfaces (`{{vm.error}}`)
- **Vulnerable Code:**
```html
<td>{{txn.event.merchantId}}</td>
...
<li ng-if="alert.signals.merchantRisk">Merchant Risk: {{alert.signals.merchantRisk}}</li>
```
- **Issue:** Server-originated fields (merchant identifiers, risk signals, error messages) are interpolated into the view. While AngularJS `{{ }}` auto-escapes HTML (mitigating classic XSS), error messages are also built from raw server `error.data.message`/`error.statusText` and echoed back; if any of these values are later routed through `$sce.trustAsHtml`, `ng-bind-html`, or `.html()` in future changes, they become injectable. No output-encoding validation exists on ingested merchant/signal data.
- **Impact:** Low-to-moderate residual XSS risk given current auto-escaping; elevated risk if any binding is later switched to HTML binding. Reflected error text could enable UI redressing/information disclosure.
- **Recommendation:** Keep bindings as text interpolation (never `ng-bind-html`/`trustAsHtml` for server or user data). Sanitize/validate merchant and signal fields server-side; avoid echoing raw backend error text to the UI.

---

### 9. [MEDIUM] Sensitive Data Written to Browser Console Logs (CWE-532 — OWASP A09:2021)

- **File:** `src/app/services/auditFactory.js` (`console.error('Audit logging failed:',error)`), `src/app/modules/fraud-detection/services/fraudRiskService.js`, `policyDecisionService.js`, `cache.service.js`
- **Vulnerable Code:**
```js
console.error('Risk scoring failed:',error);
console.error('Failed to fetch thresholds, using defaults:',error);
console.error('Audit logging failed:',error);
```
- **Issue:** Full error objects (which may contain response payloads including transaction/risk data or backend detail) are logged to the browser console.
- **Impact:** Sensitive fraud/transaction data and backend internals may be exposed in browser dev-tools and any log-forwarding, aiding attacker reconnaissance.
- **Recommendation:** Remove verbose `console.error(error)` in production, or log only sanitized, non-sensitive correlation IDs. Gate logging behind a debug flag disabled in production builds.

---

### 10. [MEDIUM] Weak / Trivial Input Validation on Financial Data (CWE-20 — OWASP A03:2021)

- **File:** `src/app/modules/fraud-detection/services/transactionIngestionService.js` (`ingestTransaction`) and `src/app/services/event-ingestion.service.js` (`validateEvent`)
- **Vulnerable Code:**
```js
if(!transactionEvent.transactionId||!transactionEvent.cardIdentifier||!transactionEvent.amount){
 return $q.reject({error:'Missing required transaction fields'});
}
```
- **Issue:** Validation is presence-only. `amount` is not type/range checked (a `0` amount is treated as "missing"; strings/negative/NaN are not rejected), and no format validation is applied to identifiers, currency, or location before forwarding to backend APIs. The dedup `processedKeys` map is unbounded in-memory.
- **Impact:** Malformed/injected financial payloads may reach backend risk-scoring, potentially skewing decisions or triggering injection at the API layer; unbounded map is a minor DoS/memory concern.
- **Recommendation:** Enforce strict client-side validation (numeric positive `amount`, whitelisted currency, format-checked IDs) as UX defense, and mandate authoritative server-side validation. Bound the dedup cache.

---

### 11. [LOW] Card Data Handled Client-Side / Displayed (CWE-311 — OWASP A02:2021)

- **File:** `src/app/services/event-ingestion.service.js` (`maskCardNumber`) and `src/app/fraud-alert/views/transaction-monitor.template.html` (`{{txn.event.cardNumber}}`)
- **Issue:** Card numbers are received in the browser and masked client-side (`maskCardNumber`), meaning the **full PAN transits to the client** before masking. The template then renders the masked `cardNumber`. Masking should occur server-side; the client should never receive the full PAN.
- **Impact:** PCI-DSS scope expansion and PAN exposure risk in browser memory/network responses.
- **Recommendation:** Mask/tokenize PAN server-side; never transmit full card numbers to the AngularJS client.

---

### 12. [LOW] Use of Non-Cryptographic Randomness for Identifiers (CWE-330)

- **File:** `src/app/modules/fraud-detection/controllers/fraudAlertController.js` (`simulateTransaction`)
- **Vulnerable Code:**
```js
idempotencyKey:'IDEM-'+Date.now()+'-'+Math.random()
```
- **Issue:** `Math.random()` is used to generate idempotency keys / identifiers. This is demo/simulation code, but non-crypto randomness for keys is a weak practice if reused in production paths.
- **Impact:** Predictable identifiers could enable idempotency-key collision/guessing in production contexts.
- **Recommendation:** Use `crypto.getRandomValues()` / server-generated UUIDs for any production identifier or idempotency key; keep simulation code out of production bundles.

---

### 13. [LOW] Client-Side Trust of Cached Thresholds / Fail-Open on Config Fetch Error (CWE-636)

- **File:** `src/app/modules/fraud-detection/services/policyDecisionService.js` (`getThresholds` catch → `DEFAULT_THRESHOLDS`) and `src/app/services/config.service.js` (localStorage-cached thresholds)
- **Issue:** On a threshold-fetch failure the service silently falls back to hardcoded `DEFAULT_THRESHOLDS`, and `config.service.js` trusts localStorage-cached thresholds without integrity validation. A user who tampers with `localStorage.alertThresholds` influences client-side policy display/decisions.
- **Impact:** Client-side fraud-policy decisions can be influenced by tampered cache or silent fail-open behavior. (Server remains authoritative if enforced.)
- **Recommendation:** Treat client thresholds as display-only; make the backend the sole authority for policy decisions. Do not fail-open on config fetch failure for security-relevant policy.

---

### 14. [INFO] Dependency Versions Not Pinned / Not Provided (CWE-1104 — OWASP A06:2021)

- **File:** `src/app/app.module.js` (`['ngRoute','ui.bootstrap']`)
- **Issue:** The app depends on AngularJS (1.x, end-of-life since Jan 2022), `ngRoute`, and `ui.bootstrap`, but **no `package.json`/`bower.json`** was supplied in `src`, so exact versions and known-vuln status cannot be verified. AngularJS 1.x is EOL and receives no security patches.
- **Impact:** Use of an EOL framework carries unpatched-vulnerability risk (potential prototype-pollution/sandbox-bypass in older builds). Assessment of transitive vulnerabilities is not possible without manifests.
- **Recommendation:** Provide `package.json`/`bower.json` and pinned versions; run `npm audit`/`retire.js`. Plan migration off EOL AngularJS.

---

### 15. [INFO] Use of `alert()` for User Notifications (CWE-1188 / Info)

- **File:** `src/app/fraud-alert/controllers/action-router.controller.js` (`confirmTransaction`, `reportTransaction`)
- **Issue:** Native `alert()` dialogs display transaction outcome messages including backend error text.
- **Impact:** Minor UX/security hygiene; error text surfaced via `alert()` could leak backend detail.
- **Recommendation:** Replace with in-app non-blocking notifications and avoid displaying raw backend error strings.

---

## Final Decision

**Reason:** **FAIL.** The code contains a **CRITICAL** broken-access-control issue — the privileged threshold-configuration route (`/config`) has no client-side authentication or role guard, and the threshold-update services perform no role validation (Findings 1 & 4). This directly contradicts the mandatory access-control requirements (unauthorized/unauthenticated/read-only users must be blocked, per TC-016/017/018) and would allow an attacker to disable or weaken fraud-detection thresholds in a payments system. This is compounded by multiple **HIGH** issues: bearer tokens and sensitive fraud/transaction data stored in JS-accessible `localStorage` (theft-via-XSS path), and absent CSRF/XSRF configuration on state-changing endpoints. Because exploitable authorization flaws and sensitive-data-in-localStorage exposure are present, the code is **NOT safe to proceed to unit testing** until the authorization guards, token/secret storage, and CSRF protections are remediated. Note: all backend enforcement (RBAC, PAN masking, threshold validation) must also be confirmed server-side — client-side fixes alone are insufficient. Credentials/secrets were masked where applicable; no plaintext hardcoded passwords or API keys were found in the supplied code.