# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlert2008R4

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 4     |
| Low      | 3     |
| Info     | 2     |

## Findings

### 1. [MEDIUM] Token Stored in localStorage (Insecure Client-Side Storage) — CWE-522 / CWE-922

- **File:** `src/app/shared/interceptors/authInterceptor.js`
- **Line:** 6 (`var token=$window.localStorage.getItem('authToken');`)
- **Issue:** The bearer authentication token is read from `localStorage`. Tokens persisted in `localStorage` are accessible to any JavaScript running in the page and are not protected by the `HttpOnly` flag.
- **Impact:** If any XSS vector is present (see other findings), an attacker can steal the `authToken` from `localStorage`, enabling full session hijacking and impersonation of the fraud-analyst user. Persistent storage also survives browser restarts, widening the exposure window.
- **Recommendation:** Prefer storing session tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed by the server. If client-side storage is unavoidable, use `sessionStorage` (shorter lifetime), enforce short token TTLs, and pair with a strict Content Security Policy.

---

### 2. [MEDIUM] Missing CSRF/XSRF Protection on State-Changing $http Calls — CWE-352

- **File:** `src/app/modules/fraud-detection/services/policyDecisionService.js`
- **Line:** 39 (`$http.post(fraudConstants.API_ENDPOINTS.UPDATE_THRESHOLD,threshold)`)
- **Issue:** State-changing POST requests (`UPDATE_THRESHOLD`, `TRANSACTION_INGEST`, `RISK_SCORE`, `AUDIT_LOG`) rely solely on a bearer token added by the interceptor. No CSRF token (`X-XSRF-TOKEN` / `xsrfHeaderName`) is configured, and no server-side anti-CSRF mechanism is evidenced. `$httpProvider` only registers `authInterceptor`.
- **Impact:** If the token were ever transmitted via a mechanism accessible cross-origin, or cookies are introduced later, threshold configuration (a high-value security control that governs fraud decline actions) could be modified by a forged request, weakening fraud protection.
- **Recommendation:** Enable AngularJS XSRF support (`$httpProvider.defaults.xsrfHeaderName`/`xsrfCookieName`) and validate an anti-CSRF token server-side for all state-changing endpoints. Enforce `SameSite` cookies.

---

### 3. [MEDIUM] Missing Client-Side Authorization / Route Protection (Broken Access Control) — CWE-862 / CWE-284

- **File:** `src/app/app.module.js`
- **Line:** 6-9 (route definitions for `/dashboard` and `/config`)
- **Issue:** Routes are defined without any `resolve` guard, role check, or authentication verification. The sensitive `/config` route (which edits fraud risk thresholds and decline actions) is reachable by any user who can load the SPA. There is no role validation before rendering `fraudConfigController`.
- **Impact:** Any authenticated (or unauthenticated, prior to a 401) user can navigate to the threshold configuration screen and attempt privileged operations, creating a privilege-escalation / BOLA risk against fraud policy. Client-side gating is defense-in-depth; its total absence is a weakness.
- **Recommendation:** Add `resolve` blocks that verify authentication and required roles (e.g., `fraud-admin`) before activating privileged routes, and ensure the server independently enforces authorization on `/api/policy/threshold/update`. Never rely on the UI alone.

---

### 4. [MEDIUM] Sensitive Card/Transaction Data Logged to Browser Console — CWE-532 / CWE-359

- **File:** `src/app/modules/fraud-detection/services/fraudRiskService.js`
- **Line:** 30 (`console.error('Risk scoring failed:',error);`)
- **Additional:** `policyDecisionService.js` lines 33 & 42, `transactionIngestionService.js`, `auditFactory.js` line 18
- **Issue:** Error objects returned from `$http` calls that carry card identifiers, amounts, merchant, device, and location data may be written to the browser console via `console.error`. Console logs can be captured by browser extensions, shared devices, or aggregated logging tools.
- **Impact:** Potential exposure of PCI-relevant / PII data (card identifier, geolocation, device ID) through client-side logs, which may breach PCI-DSS logging requirements.
- **Recommendation:** Remove or gate `console.error` behind a debug flag disabled in production. Never log raw transaction/error payloads; log sanitized correlation IDs only.

---

### 5. [LOW] Weak, Predictable Identifier Generation Using Math.random — CWE-330 / CWE-338

- **File:** `src/app/modules/fraud-detection/controllers/fraudAlertController.js`
- **Line:** 47-53 (`idempotencyKey:'IDEM-'+Date.now()+'-'+Math.random()`, plus merchant/device IDs)
- **Issue:** Identifiers, including the idempotency key, are generated with `Math.random()` and `Date.now()`, which are not cryptographically secure and are predictable.
- **Impact:** Predictable idempotency keys could allow an attacker to guess/collide keys and interfere with de-duplication logic in the ingestion service. This is a simulation/demo path, limiting severity.
- **Recommendation:** Use `window.crypto.getRandomValues()` or a UUID v4 generator for any identifier that has security or integrity significance.

---

### 6. [LOW] Client-Side-Only Input Validation on Threshold Configuration — CWE-20 / CWE-602

- **File:** `src/app/modules/fraud-detection/views/fraud-config.html`
- **Line:** 27-28 (`<input type="number" ... min="0" max="100">`) and `policyDecisionService.updateThreshold` (line 34)
- **Issue:** Threshold min/max scores are validated only by HTML attributes and a minimal `riskLevel` presence check. `min`/`max` HTML constraints are trivially bypassed. No range/overlap/logical validation (e.g., minScore ≤ maxScore) exists before the values are POSTed.
- **Impact:** Malformed or malicious threshold values could disable fraud decline logic (e.g., set decline range to an unreachable band), degrading fraud protection. Server-side validation is not evidenced.
- **Recommendation:** Enforce robust validation both client-side (range, ordering, overlap) and authoritatively server-side. Reject invalid or security-weakening threshold configurations.

---

### 7. [LOW] Trust in Server-Controlled Data Rendered via ng-bind Interpolation — CWE-79 (residual)

- **File:** `src/app/modules/fraud-detection/views/fraud-dashboard.html`
- **Line:** 26-46 (`{{txn.merchant}}`, `{{alert.signals.merchantRisk}}`, `{{alert.signals.velocityPattern}}`, etc.)
- **Issue:** Server-returned fields (merchant, signals, risk metadata) are rendered through Angular interpolation. This is auto-escaped by AngularJS, so it is NOT a direct XSS. No `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `$compile`, `$eval`, or `eval()` usage was found — a positive result. Flagged only as residual defense-in-depth: correctness depends on Angular's escaping remaining enabled and no future migration to `trustAsHtml`.
- **Impact:** Low; no exploitable XSS in the current code. Included for INFO/traceability.
- **Recommendation:** Maintain output encoding, avoid `$sce.trustAsHtml` for server data, and add a Content Security Policy header as defense-in-depth.

---

### 8. [INFO] No Hardcoded Secrets Detected

- **File:** `src/app/shared/constants/fraudConstants.js` (and all files)
- **Line:** N/A
- **Issue:** A scan for hardcoded passwords, API keys, tokens, and credentials found **none**. Endpoints are relative paths (`/api/...`); the `cardIdentifier` seen in the simulation path is masked (`****1234`).
- **Impact:** None.
- **Recommendation:** Continue to source all secrets server-side; keep credentials out of client bundles.

---

### 9. [INFO] Dependency Versions Not Verifiable

- **File:** `src/app/app.module.js` (`ngRoute`, `ui.bootstrap`)
- **Line:** 3
- **Issue:** No `package.json` / `bower.json` was supplied, so AngularJS core, `ngRoute`, and `ui.bootstrap` versions cannot be assessed for known CVEs (AngularJS 1.x is End-of-Life since Jan 2022 and receives no security patches).
- **Impact:** Cannot confirm/deny use of vulnerable dependency versions.
- **Recommendation:** Provide dependency manifests. Be aware AngularJS 1.x is EOL; plan migration and apply an extended-support/patched build if remaining on 1.x.

---

## Final Decision

**Reason:** **PASS_WITH_WARNINGS.** No CRITICAL findings, no exposed/hardcoded credentials, no authentication bypass, and no exploitable High-risk vulnerabilities were identified. Notably, no dangerous XSS sinks (`ng-bind-html`, `$sce.trustAsHtml`, `$compile`, `$eval`, `eval`, `innerHTML`, `.html()`) are present, and all secrets are handled server-side. The remaining issues are non-blocking MEDIUM/LOW concerns — token stored in `localStorage`, absent CSRF configuration, missing client-side route/role guards on the sensitive `/config` route, console logging of sensitive payloads, weak identifier generation, and client-only validation. These should be remediated and are recommended for hardening, but they do not individually or collectively constitute an immediately exploitable blocking flaw in the supplied client code. The code is **safe to proceed to unit testing**, with the MEDIUM findings tracked for remediation before production release.

*Note: Dependency manifests (`package.json`/`bower.json`) and server-side authorization/CSRF implementation were not supplied; conclusions about dependency CVEs and server-enforced access control are therefore limited to the client evidence available.*