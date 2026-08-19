# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlertQAETest

**Scan Date:** 2025-06-13

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 4     |
| Medium   | 4     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [CRITICAL] Hardcoded Authentication Token / Broken Authentication — CWE-798, CWE-259

- **File:** `src/app/services/auth.interceptor.js`
- **Line:** ~24 (`AuthService.getToken`)
- **Vulnerable Code:**
  ```js
  this.getToken = function() {
    return sessionStorage.getItem('authToken') || 'mock-token-12345';
  };
  ```
- **Issue:** A hardcoded fallback bearer token (`mock-token-****45`, masked) is returned whenever no session token exists. This token is embedded in client-side source and is automatically attached to every `$http` request via the `AuthInterceptor`.
- **Impact:** Any user (including unauthenticated ones) automatically presents a valid-looking bearer credential to the fraud-risk, alerts, audit, and config APIs. If the backend accepts it, this is a complete authentication bypass allowing access to sensitive fraud/PII endpoints. Hardcoded secrets in shipped JS are trivially extractable.
- **Recommendation:** Remove the hardcoded fallback entirely. Return `null`/`undefined` when no token is present and block authenticated requests. Obtain tokens only via a proper authentication flow, and never embed static credentials in front-end code.

---

### 2. [HIGH] Missing Route Protection / Authorization Controls — CWE-862, CWE-306

- **File:** `src/app/app.module.js`
- **Line:** ~5–15 (`$routeProvider` config)
- **Vulnerable Code:**
  ```js
  .when('/dashboard', {
    templateUrl: 'src/app/fraud-alert/views/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'vm'
  })
  ```
- **Issue:** No `resolve`/authentication guard, role check, or route-level authorization exists on the fraud dashboard route. There is no `AuthService.isAuthenticated()` gate before rendering sensitive fraud/PII data.
- **Impact:** Unauthenticated or unauthorized users can reach the dashboard UI and trigger fraud-risk, alert, and audit API calls. Combined with Finding #1, this permits privilege-agnostic access to sensitive workflows.
- **Recommendation:** Add a route `resolve` that verifies authentication and required role before loading the dashboard; redirect unauthenticated users to `/login`. Enforce authorization server-side as the primary control.

---

### 3. [HIGH] Sensitive Cardholder Data (PAN/PII) Exposed in Client & Transmitted in Payloads — CWE-311, CWE-359

- **File:** `src/app/fraud-alert/services/fraud-risk.service.js` (line ~7, `cardNumber: transaction.cardNumber`), `src/app/fraud-alert/services/alert.service.js` (line ~14, `cardNumber: transaction.cardNumber`), `src/app/fraud-alert/controllers/dashboard.controller.js` (line ~34, `cardNumber: transaction.cardNumber`)
- **Vulnerable Code:**
  ```js
  // fraud-risk.service.js
  cardNumber: transaction.cardNumber,
  // alert.service.js -> transactionDetails
  cardNumber: transaction.cardNumber,
  ```
- **Issue:** Full card numbers are passed through client-side objects, embedded in alert payloads, and stored in client-held view models (`vm.transactions`). Card data is rendered directly in the UI (`alert-modal.html`, `dashboard.html`). Even though the demo simulator masks the value, the code path handles and displays raw `cardNumber` values with no enforced masking/tokenization.
- **Impact:** Potential exposure of PAN (PCI-DSS scope). Sensitive cardholder data held in browser memory, transmitted in multiple request bodies, and displayed in the DOM increases the attack surface for theft and violates PCI-DSS data-minimization requirements.
- **Recommendation:** Never transmit or render full PANs on the client. Tokenize/mask PANs server-side (e.g., last 4 digits only) before they ever reach the browser. Remove `cardNumber` from alert and risk client payloads unless it is a masked token.

---

### 4. [HIGH] Sensitive Data Written to Browser Storage (sessionStorage) — CWE-522, CWE-312

- **File:** `src/app/services/auth.interceptor.js` (line ~28), `src/app/fraud-alert/services/transaction-ingestion.service.js` (line ~11)
- **Vulnerable Code:**
  ```js
  // auth.interceptor.js
  return sessionStorage.getItem('authToken') ...
  sessionStorage.removeItem('authToken');
  // transaction-ingestion.service.js
  sessionStorage.setItem('idempotency_' + idempotencyKey, 'processed');
  ```
- **Issue:** The bearer auth token is stored in `sessionStorage`, which is fully readable by any JavaScript running in the origin (no `HttpOnly`/`Secure` protection). Transaction idempotency keys derived from transaction identifiers are also persisted in `sessionStorage`.
- **Impact:** Tokens in web storage are exposed to XSS-based theft; a single script injection compromises the credential. Persisted transaction identifiers may leak transaction metadata to any script in the origin.
- **Recommendation:** Store session tokens in `HttpOnly`, `Secure`, `SameSite` cookies rather than web storage. Keep idempotency state server-side or in-memory only; avoid persisting transaction-linked identifiers in `sessionStorage`.

---

### 5. [HIGH] Sensitive Fraud Data / PII Logged to Browser Console — CWE-532

- **File:** `src/app/fraud-alert/services/fraud-risk.service.js` (line ~30), `src/app/fraud-alert/services/alert.service.js` (lines ~27, ~38, ~48), `src/app/fraud-alert/services/policy-decision.service.js` (line ~40), `src/app/fraud-alert/services/transaction-ingestion.service.js` (lines ~9, ~26), `src/app/services/audit.service.js` (lines ~16, ~33)
- **Vulnerable Code:**
  ```js
  console.error('Fraud risk evaluation failed:', error);
  console.log('Duplicate transaction detected, skipping:', idempotencyKey);
  console.error('Alert creation failed:', error);
  ```
- **Issue:** Numerous `console.log`/`console.error` statements emit fraud-decision context, error objects (which may contain response bodies with PII/card data), and transaction identifiers to the browser console in what appears to be production code.
- **Impact:** Sensitive fraud/PII data and internal error details are disclosed in client logs, aiding attacker reconnaissance and violating data-handling controls. Error objects may include full server responses.
- **Recommendation:** Remove or gate all `console` logging behind a debug flag disabled in production. Never log raw error objects or transaction/card identifiers on the client; route diagnostics to a controlled server-side logger.

---

### 6. [MEDIUM] Failed Fraud Evaluation Silently Defaults to Zero Risk / Approve — CWE-754, CWE-390

- **File:** `src/app/fraud-alert/services/fraud-risk.service.js`
- **Line:** ~28–39 (`.catch` block)
- **Vulnerable Code:**
  ```js
  .catch(function(error) {
    return { transactionId: ..., riskScore: 0, riskBand: 'unknown', signals: {}, ... };
  });
  ```
- **Issue:** When the risk-evaluation API fails, the service returns `riskScore: 0`. In `PolicyDecisionService`, a score of `0` falls below all thresholds and yields `decision: 'approve'`. This is a fail-open behavior for a security-critical fraud control.
- **Impact:** An attacker able to force the risk API to error (network manipulation, DoS of the risk endpoint) can cause fraudulent transactions to be auto-approved, bypassing the fraud control entirely.
- **Recommendation:** Fail closed — on risk-evaluation failure, force a `hold`/manual-review decision rather than an approvable score of 0. Distinguish "unknown/error" from "low risk" in the policy engine.

---

### 7. [MEDIUM] Broken/Reversed Dependency Injection Annotation (Fragile Auth-Sensitive Service) — CWE-1104

- **File:** `src/app/fraud-alert/services/fraud-risk.service.js`
- **Line:** ~2
- **Vulnerable Code:**
  ```js
  .service('FraudRiskService', ['$http', '$q', 'API_CONFIG',
     function($http, API_CONFIG, $q) {
  ```
- **Issue:** The DI annotation order (`['$http', '$q', 'API_CONFIG']`) does not match the function parameter order (`$http, API_CONFIG, $q`). `API_CONFIG` receives `$q` and `$q` receives `API_CONFIG`, meaning the fraud-risk request is posted to the wrong/undefined URL and the security control may silently misbehave.
- **Impact:** The core fraud-risk evaluation call is broken and will error, triggering the fail-open path in Finding #6 — effectively disabling fraud scoring. A disabled security control is a security concern.
- **Recommendation:** Correct the annotation to match parameters: `['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG){...}]`.

---

### 8. [MEDIUM] No Explicit CSRF/XSRF Protection Configuration — CWE-352

- **File:** `src/app/app.module.js`
- **Line:** ~2–16 (`$httpProvider` config)
- **Issue:** State-changing requests (`POST`/`PUT` to `/api/alerts`, `/api/audit/log`) rely on a bearer token attached via interceptor. There is no explicit configuration or verification of AngularJS's `$http` XSRF token handling (`xsrfHeaderName`/`xsrfCookieName`), and no anti-CSRF token is set.
- **Impact:** If any endpoint also accepts cookie-based auth, state-changing operations (creating/acknowledging alerts) could be vulnerable to CSRF.
- **Recommendation:** Confirm APIs authenticate solely via the `Authorization` header (immune to CSRF) or configure AngularJS XSRF token propagation and enforce anti-CSRF tokens server-side.

---

### 9. [MEDIUM] Unrestricted Broadcast of Sensitive Transaction Data via $rootScope — CWE-201

- **File:** `src/app/fraud-alert/services/transaction-ingestion.service.js` (line ~19), `src/app/fraud-alert/services/alert.service.js` (line ~24)
- **Vulnerable Code:**
  ```js
  $rootScope.$broadcast('transaction:processed', { transaction: transactionEvent, decision: decision });
  ```
- **Issue:** Full transaction objects (including `cardNumber`, `ipAddress`, `deviceId`, `location`) are broadcast application-wide over `$rootScope`, making them accessible to any listening controller/directive.
- **Impact:** Increases exposure surface for sensitive data; any injected or third-party component listening on the event can harvest PII/card data.
- **Recommendation:** Broadcast only non-sensitive, minimized data (IDs and decision outcome). Keep full transaction context confined to the owning service.

---

### 10. [LOW] Overly Permissive Logout Redirect via window.location — CWE-601

- **File:** `src/app/services/auth.interceptor.js`
- **Line:** ~31 (`AuthService.logout`)
- **Vulnerable Code:**
  ```js
  window.location.href = '/login';
  ```
- **Issue:** Redirect target is currently a hardcoded relative path (acceptable), but there is no return-URL validation pattern established for future use. Flagged as a hardening note; direct `window.location` assignment bypasses Angular routing.
- **Impact:** Low as-is; becomes an open-redirect risk if the target ever derives from user-controlled input.
- **Recommendation:** Centralize redirects through `$location` with an allow-list; never build redirect targets from untrusted input.

---

### 11. [LOW] Client-Trusted Fail-Safe Decision Without Integrity Guarantee — CWE-602

- **File:** `src/app/fraud-alert/services/policy-decision.service.js`
- **Line:** ~35–48 (`.catch` fail-safe block)
- **Issue:** Policy decisions (approve/hold) are computed client-side. While the fail-safe here correctly defaults to `hold`, the entire authorization decision resides in the browser and could be tampered with by a malicious client.
- **Impact:** A modified client could override decisions; server-side enforcement is required as the authoritative control.
- **Recommendation:** Treat all client-side policy decisions as advisory only; enforce and re-validate every fraud decision server-side.

---

### 12. [INFO] Dependency Inventory Not Available for Vulnerability Assessment — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` supplied)
- **Issue:** AngularJS 1.x, `ui.bootstrap`, and `ngRoute` are used, but no dependency manifest or version pins were provided in the supplied `src` folder. AngularJS 1.x is end-of-life and no longer receives security patches.
- **Impact:** Cannot verify library versions against known CVEs. Note: AngularJS 1.x being EOL is itself a supply-chain risk.
- **Recommendation:** Supply `package.json`/`bower.json` with pinned versions for a full SCA scan. Plan migration off end-of-life AngularJS 1.x.

---

## Final Decision

**Status: FAIL**

**Reason:** The code contains a **CRITICAL** hardcoded fallback authentication token (`mock-token-****45`) that is auto-attached to every API request, constituting an authentication-bypass risk (Finding #1). This is compounded by **HIGH**-severity issues: missing route/authorization guards on sensitive fraud dashboards (#2), transmission and rendering of full cardholder PAN/PII data (#3, PCI-DSS impact), auth tokens stored in XSS-accessible browser storage (#4), and pervasive logging of fraud/PII data to the client console (#5). A fail-open fraud-scoring path (#6) combined with a broken DI annotation that disables the core risk service (#7) means the primary fraud control can be silently bypassed. Per policy, the presence of a Critical finding, exposed credentials, and authentication-bypass conditions mandates a **FAIL**. The code is **NOT safe to proceed to unit testing** until Findings #1–#5 are remediated and re-scanned.

*(No XSS via `ng-bind-html`/`$sce.trustAsHtml`/`$compile`/`eval` was detected; all template bindings use safe interpolation. No credentials beyond the masked mock token were found.)*