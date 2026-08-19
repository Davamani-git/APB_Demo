# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlertQAETest2

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

### 1. [MEDIUM] Sensitive Data Exposure in Client-Side Logs — CWE-532

- **File:** `src/app/services/auditService.js`
- **Line:** 24–25, 39, 53 (`$log.error(message, details)` / `$log.info(message, details)`)
- **Issue:** The audit service writes arbitrary `details` payloads (which include full transaction context, `transactionId`, risk scores, and error objects) to the browser console via `$log.error`/`$log.info`. Error objects propagated from `$http` failures can contain request/response bodies and headers.
- **Impact:** Sensitive transaction and fraud-decision data may be persisted in browser console logs, DevTools history, or client-side log collectors, enabling information disclosure to anyone with access to the client environment. This is a PCI-relevant concern for a card-fraud system.
- **Recommendation:** Remove or gate verbose client-side logging behind a production flag. Sanitize `details` to strip HTTP payloads/headers before logging. Never log full error objects on the client for a financial application.

---

### 2. [MEDIUM] Cardholder Data Held in Client Model / Rendered in UI — CWE-311

- **File:** `src/app/models/transactionModel.js` (Line: 5 `this.cardNumber = data.cardNumber || '';`) and `src/app/modules/fraud-detection/directives/transactionMonitor.js` (Line: `<strong>Card:</strong> {{item.transaction.cardNumber | limitTo: -4}}`)
- **Issue:** The full card number (PAN) is received from the API and stored in a client-side model. Although a `maskCardNumber()` helper exists, the directive relies on `limitTo: -4` for display, meaning the complete PAN remains resident in browser memory/scope and is exposed to any XSS, memory-dump, or DevTools inspection.
- **Impact:** Storing/transmitting full PAN to the client violates PCI-DSS data-minimization (Req. 3). Full card data in client scope significantly increases the blast radius of any client-side compromise.
- **Recommendation:** The backend should send only a masked PAN (last 4 digits) or a token. Do not transmit full PAN to the AngularJS client. If unavoidable, mask at the model boundary using the existing `maskCardNumber()` and never bind the raw `cardNumber`.

---

### 3. [MEDIUM] No Explicit CSRF/XSRF Token Handling on State-Changing Requests — CWE-352

- **File:** `src/app/services/alertService.js` (Lines: `$http.post`, `$http.put`), `src/app/services/auditService.js` (`$http.post`), `src/app/factories/fraudRiskEngineFactory.js` (`$http.post`)
- **Issue:** State-changing `POST`/`PUT` calls rely solely on AngularJS's default XSRF cookie/header convention (`XSRF-TOKEN` → `X-XSRF-TOKEN`). There is no explicit configuration confirming the backend issues/validates this token, and no interceptor is defined.
- **Impact:** If the backend does not enforce token validation, state-changing operations (triggering/updating fraud alerts) could be susceptible to CSRF, allowing forged alert manipulation.
- **Recommendation:** Verify backend CSRF validation and configure `$httpProvider.xsrfHeaderName`/`xsrfCookieName` explicitly, or add an `$http` interceptor attaching an anti-CSRF token to all mutating requests.

---

### 4. [LOW] Unauthenticated / Unauthorized Access Assumptions — CWE-306

- **File:** `src/app/factories/fraudRiskEngineFactory.js`, `src/app/services/transactionIngestionService.js`, `src/app/services/alertService.js` (all `$http` calls)
- **Issue:** No client-side route protection, authentication guard, role validation, or authorization check is present. `getTransactionById(transactionId)` builds the URL directly from an ID with no ownership check on the client, an IDOR/BOLA pattern that depends entirely on server enforcement.
- **Impact:** If server-side authorization is weak, an attacker could enumerate `transactionId` values to access other users' fraud/transaction data (IDOR/BOLA).
- **Recommendation:** Ensure the backend enforces object-level authorization for every transaction/alert endpoint. Add authenticated route guards on the client as defense-in-depth. Treat this as a required server-side control.

---

### 5. [LOW] `updateThresholds` Allows Unrestricted Runtime Policy Modification — CWE-284

- **File:** `src/app/services/policyDecisionService.js`
- **Line:** `this.updateThresholds = function(newThresholds) { Object.assign(thresholds, newThresholds); ... }`
- **Issue:** Fraud-detection risk thresholds can be mutated at runtime through a public service method with no role/authorization check and no input validation on the supplied values.
- **Impact:** If reachable from any authenticated context, an attacker could relax thresholds to suppress fraud alerts (security-control tampering / privilege abuse).
- **Recommendation:** Restrict threshold updates to authorized admin roles enforced server-side, validate the numeric ranges/ordering (low < medium < high), and audit each change (audit is present — add validation and authZ).

---

### 6. [LOW] Client-Side Debug Logging Left in Production Code — CWE-489

- **File:** `src/app/modules/fraud-detection/directives/transactionMonitor.js`
- **Line:** `console.log('Transaction monitor updated with', newVal.length, 'transactions');`
- **Issue:** Residual `console.log` debug statement in a directive watcher.
- **Impact:** Minor information leakage and noise; indicates debug code shipped to clients.
- **Recommendation:** Remove `console.log` or replace with a gated logging utility disabled in production builds.

---

### 7. [INFO] No Hardcoded Secrets Detected — (No CWE)

- **File:** All reviewed files under `src/`
- **Issue:** No hardcoded passwords, API keys, tokens, or credentials were found. API base paths are relative (`/api/...`) and no secrets are embedded.
- **Impact:** None.
- **Recommendation:** Continue to keep secrets out of client-side AngularJS code.

---

### 8. [INFO] No Direct DOM/HTML Injection Sinks Detected — CWE-79 (Not Present)

- **File:** All reviewed files under `src/`
- **Issue:** No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$parse`, `$eval`, or `eval()` was found. All bindings use standard AngularJS interpolation (`{{ }}`), which is auto-escaped.
- **Impact:** None — XSS surface via HTML injection is minimal in the supplied code.
- **Recommendation:** Maintain the current escaped-binding approach; avoid introducing `trustAsHtml`/`$compile` on user-controlled data.

---

## Dependency & Configuration Note

Only `src/` application source was supplied. `package.json`, `bower.json`, and the AngularJS runtime version were **not** available, so obsolete/vulnerable dependency and prototype-pollution assessment could not be completed. Note the app declares `angular.module('fraudDetectionApp', [])` — legacy AngularJS (1.x) is End-of-Life; verify the exact version separately.

---

## Final Decision

**Reason:** No CRITICAL findings, no exposed credentials, no authentication-bypass, and no exploitable HIGH-risk issues were identified in the supplied client-side code. All XSS-sensitive sinks are absent and bindings are auto-escaped. However, several non-blocking MEDIUM/LOW issues remain — sensitive transaction/PAN data resident on the client and in console logs (PCI-relevant), reliance on unverified CSRF and server-side authorization (potential IDOR/BOLA), an unprotected runtime threshold-modification method, and residual debug logging. These should be remediated but do not block progression to unit testing. **Gate: PASS_WITH_WARNINGS.** Dependency and AngularJS-version checks remain incomplete because build/manifest files were not provided.