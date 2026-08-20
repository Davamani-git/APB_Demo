# Security Scan Report

**Repository:** APB_Demo

**Branch:** ccFraudAlertTest1908

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** FAIL

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 3     |
| Medium   | 3     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [CRITICAL] Hardcoded Authentication Token / Fallback Credential — CWE-798

- **File:** `src/app/shared/interceptors/httpInterceptor.js`
- **Line:** 9 (`const token = sessionStorage.getItem('authToken') || 'demo-token-12345';`)
- **Vulnerable Code:**
  ```js
  const token = sessionStorage.getItem('authToken') || 'demo-token-12345';
  config.headers['Authorization'] = 'Bearer ' + token;
  ```
- **Issue:** A hardcoded fallback bearer token (`demo-****-****`) is embedded in the client-side source. When no session token exists, every outbound `$http` request is sent authenticated with a static, attacker-visible credential.
- **Impact:** Any user (or attacker) reading the shipped JS obtains a valid-looking bearer token that is silently attached to all API calls (`/transactions/events`, `/fraud/risk-score`, `/policy/thresholds`, `/audit/risk-decisions`). This can enable unauthenticated API access, authentication bypass, and forged audit/risk decisions if the backend accepts the token. Maps to OWASP A07:2021 (Identification & Authentication Failures) and A02 (Cryptographic/Secret handling).
- **Recommendation:** Remove the hardcoded fallback entirely. If no token is present, do NOT inject an `Authorization` header; instead reject the request or redirect to authentication. Never ship static tokens/secrets in front-end code. Tokens must be issued server-side and stored in secure, HttpOnly cookies where feasible.

---

### 2. [HIGH] Insecure Fail-Open Security Controls (Fraud Bypass) — CWE-636 / CWE-703

- **File:** `src/app/fraud-detection/factories/fraudRiskScoringFactory.js`
- **Line:** ~48–58 (`.catch(...)` fallback resolving with client-side `mockRiskEngine`)
- **Vulnerable Code:**
  ```js
  .catch(function(error) {
    console.warn('Risk scoring API unavailable, using fallback engine:', error);
    const fallbackResult = mockRiskEngine.calculateScore(transaction);
    deferred.resolve({ riskScore: fallbackResult.score, ... });
  });
  ```
- **Issue:** When the authoritative risk-scoring API fails (including on `401/403` auth failures), the app silently falls back to a **client-side risk engine** that even uses `Math.random()` as a fraud signal. The same fail-open pattern exists in `policyDecisionService.getPolicyThresholds()` (defaults to hardcoded thresholds) and `transactionIngestionService.fetchTransactionEvents()` (falls back to mock data).
- **Impact:** An attacker who blocks or degrades the scoring/policy API (or forces a 401) can force the fraud engine into a predictable, manipulable client-side mode, effectively bypassing server-side fraud controls and influencing block/allow/review decisions. This is a business-logic security control weakness — a fraud-detection system should fail closed, not open.
- **Recommendation:** Fraud/authorization decisions must fail **closed**. On API failure or auth error, surface an error and block/queue the transaction rather than substituting client-side scoring. Never compute authoritative risk decisions in the browser; the client should only render decisions returned by the trusted backend.

---

### 3. [HIGH] Sensitive Data (PAN/Card Identifier & Transaction Data) Held Client-Side and Logged — CWE-532 / CWE-312

- **File:** `src/app/fraud-detection/models/transactionModel.js` (fields `cardIdentifier`, full transaction) and `src/app/services/auditTrailService.js` (in-memory `auditLog`, `console.warn`)
- **Line:** `transactionModel.js` ~10 & `toJSON()`; `auditTrailService.js` ~11–24, 29–31 (`console.warn('Audit trail API unavailable, logged locally:', error)`)
- **Vulnerable Code:**
  ```js
  this.cardIdentifier = data.cardIdentifier || '';
  ...
  console.warn('Audit trail API unavailable, logged locally:', error);
  deferred.resolve({ status: 'logged_locally', entry: auditEntry });
  ```
- **Issue:** Card identifiers, amounts, merchant, and location data are modeled and serialized client-side. Audit entries (containing risk decisions and transaction IDs) are stored in an in-memory `auditLog` array and, on failure, "logged locally" with sensitive context echoed to the browser console. Errors throughout controllers/services log full payloads via `console.error`/`console.warn`.
- **Impact:** Sensitive financial data (PCI-relevant) is exposed in browser memory and console/log output, readable by any script (including malicious extensions/XSS) and captured in client logging tools. Maps to OWASP A09:2021 (Security Logging/Monitoring Failures) and PCI-DSS data-handling concerns.
- **Recommendation:** Do not persist authoritative audit logs client-side; audit must be recorded server-side only. Ensure card data is always masked (the mock masks with `****`, but the model accepts raw `cardIdentifier`). Strip sensitive payloads from all `console.*` statements and disable verbose logging in production.

---

### 4. [HIGH] Missing Authentication, Authorization & Route Protection — CWE-862 / CWE-306

- **File:** `src/app/app.module.js`, `src/app/fraud-detection/controllers/fraudDashboardController.js`
- **Line:** `app.module.js` module definition (`angular.module('fraudDetectionApp', [])`); controller `vm.init()` auto-loads data with no auth guard
- **Vulnerable Code:**
  ```js
  angular.module('fraudDetectionApp', [])  // no ngRoute/route resolves/auth guards
  ...
  vm.init = function() { vm.loadTransactions(); $interval(...); };
  ```
- **Issue:** There is no route protection, role validation, session verification, or authorization check anywhere in the codebase. The dashboard controller loads sensitive fraud/transaction data immediately on init with no gate. No RBAC or role check exists before displaying high-risk fraud decisions.
- **Impact:** Any user reaching the app can trigger retrieval and display of fraud risk decisions and transaction data without authentication/authorization — enabling unauthorized access to sensitive fraud intelligence (OWASP A01:2021 Broken Access Control). Combined with Finding #1, this is exploitable.
- **Recommendation:** Introduce authenticated route guards (e.g., `resolve` blocks / `$routeChangeStart` checks) that verify a valid session and required role before loading data. Enforce server-side authorization on every endpoint (never rely on client checks alone).

---

### 5. [MEDIUM] Predictable / Weak Randomness Used in Security Logic — CWE-330 / CWE-338

- **File:** `src/app/fraud-detection/factories/fraudRiskScoringFactory.js` and `src/app/services/transactionIngestionService.js`
- **Line:** `fraudRiskScoringFactory.js` ~27 (`if (Math.random() > 0.8)`); ingestion mock generation using `Math.random()`
- **Vulnerable Code:**
  ```js
  if (Math.random() > 0.8) { score += 30; signals.push('velocity_check_failed'); }
  ```
- **Issue:** `Math.random()` (non-cryptographic, predictable) is used within fraud scoring logic and identifier generation. It influences a security-relevant fraud signal.
- **Impact:** Fraud scoring becomes non-deterministic and predictable, undermining detection reliability and allowing an attacker to anticipate/game outcomes when the fallback engine is active (see Finding #2).
- **Recommendation:** Remove randomness from any authoritative security decision. Velocity checks must be computed server-side against real data. Use `crypto.getRandomValues()` only where genuine randomness (non-security display data) is required.

---

### 6. [MEDIUM] No Explicit CSRF/XSRF Protection Configuration — CWE-352

- **File:** `src/app/shared/interceptors/httpInterceptor.js`, `src/app/app.module.js`
- **Line:** Interceptor `request` handler (sets only `Authorization` and `Content-Type`)
- **Issue:** The interceptor overwrites headers but does not attach any anti-CSRF token, and there is no configuration of `$httpProvider.defaults.xsrfHeaderName`/`xsrfCookieName`. State-changing POSTs (`/audit/risk-decisions`, `/fraud/risk-score`) rely solely on a bearer token.
- **Impact:** If any tokens are cookie-based, or if the API accepts session context, state-changing requests could be vulnerable to CSRF. Maps to OWASP A01/A05.
- **Recommendation:** Configure AngularJS XSRF token handling and ensure the backend validates a per-session CSRF token on all state-changing requests. Confirm token transport strategy (header vs cookie) and align protections accordingly.

---

### 7. [MEDIUM] Insufficient Input Validation on API Response Data — CWE-20

- **File:** `src/app/services/transactionIngestionService.js`, `src/app/services/policyDecisionService.js`
- **Line:** `fetchTransactionEvents` (`response.data.transactions || []`); `getPolicyThresholds` (`response.data.thresholds`)
- **Issue:** Server responses are trusted and mapped directly into models with only minimal `isValid()` checks. Policy thresholds and risk scores are consumed without type/range validation before driving block/allow decisions.
- **Impact:** Malformed or tampered API responses (e.g., via MITM if TLS assumptions fail, or a compromised endpoint) could distort thresholds/scores and manipulate fraud decisions.
- **Recommendation:** Validate and sanitize all inbound data (types, numeric ranges for scores/thresholds, allowed enum values for `riskBand`/`action`) before use in decision logic.

---

### 8. [LOW] Sensitive Data Retained in Long-Lived In-Memory Structures — CWE-312

- **File:** `src/app/services/transactionIngestionService.js` (`processedTransactions` Set), `src/app/services/auditTrailService.js` (`auditLog` array)
- **Line:** `const processedTransactions = new Set();`, `const auditLog = [];`
- **Issue:** Transaction IDs and audit entries accumulate in memory for the session lifetime with no bounds or clearing on logout.
- **Impact:** Sensitive data lingers in browser memory, increasing exposure window and enabling memory-scraping via XSS.
- **Recommendation:** Bound/clear these structures, clear on logout/session end, and avoid retaining sensitive audit data client-side.

---

### 9. [LOW] Verbose Error Logging to Console — CWE-209

- **File:** Multiple (`fraudDashboardController.js`, `httpInterceptor.js`, `auditTrailService.js`, `policyDecisionService.js`, `transactionIngestionService.js`)
- **Line:** Various `console.error` / `console.warn` calls
- **Issue:** Errors including request context and authentication-failure statuses are logged to the browser console.
- **Impact:** Aids reconnaissance and may leak operational/sensitive details in production.
- **Recommendation:** Gate logging behind an environment flag; suppress verbose/error logging in production builds.

---

### 10. [INFO] Dependency & TLS Assessment Not Possible — CWE-1104

- **File:** N/A (no `package.json` / `bower.json` / `index.html` supplied)
- **Issue:** No dependency manifest or AngularJS version information was provided in the `src` folder. The relative API base URL (`/api`) means TLS enforcement depends on hosting configuration, which is not visible here.
- **Impact:** Cannot verify AngularJS version for known CVEs (e.g., prototype-pollution/sandbox issues in older 1.x), nor confirm HTTPS enforcement.
- **Recommendation:** Supply `package.json`/`bower.json` and hosting/TLS config for a complete dependency-vulnerability and transport-security assessment.

---

## Final Decision

**Reason:** **FAIL.** The code contains a **CRITICAL hardcoded fallback bearer token** (`demo-****-****`) shipped in client-side source and attached to all API requests (Finding #1 — CWE-798), constituting exposed credentials and a potential authentication bypass. This is compounded by **HIGH-severity fail-open fraud/policy controls** that let an attacker force predictable client-side scoring (Finding #2), **absent authentication/authorization and route protection** exposing sensitive fraud data (Finding #4), and **client-side handling/logging of sensitive financial data** (Finding #3). Per the gating rules, any Critical issue, exposed credentials, authentication-bypass, or serious authorization flaw mandates a **FAIL**. The code is **NOT safe to proceed to unit testing** until at minimum Findings #1–#4 are remediated. Note: a full dependency/TLS review remains incomplete (Finding #10) due to missing manifests.