# Security Scan Report

**Repository:** APB_Demo

**Branch:** creditcardQAETest

**Scan Date:** 2026-01-13

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 3     |
| Low      | 2     |
| Info     | 2     |

## Findings

### 1. [MEDIUM] Sensitive Data Exposure — Full Credit Card Number Rendered in UI — CWE-311 / CWE-359

- **File:** `src/app/modules/dashboard/views/dashboard.html`
- **Line:** ~46 (`<td>{{card.cardNumber}}</td>`); also `src/app/modules/transactions/views/transaction-list.html` (`<td><span class="card-badge">{{txn.cardNumber}}</span></td>`), `transaction-list-directive.html`, `transaction-detail.html`, and `transaction-detail-directive.html` (`<strong>Card Number:</strong> {{transaction.cardNumber}}`).
- **Issue:** The application binds and displays `cardNumber` directly. If the API returns a full PAN (Primary Account Number), the full card number is rendered in the DOM.
- **Impact:** Displaying full PANs violates PCI-DSS Requirement 3.3 (mask PAN, showing at most first 6 / last 4 digits). Exposes cardholder data via shoulder-surfing, DOM inspection, screenshots, and browser caching.
- **Recommendation:** Ensure the backend returns only masked PANs (e.g., `**** **** **** 1234`). If unmasked data can be received, apply a client-side masking filter before rendering. Confirm PCI masking policy with the data-source team.

---

### 2. [MEDIUM] Client-Side Search/Filter Applied to Sensitive Card ID — CWE-200

- **File:** `src/app/modules/transactions/views/transaction-list.html`
- **Line:** ~35 (`| filter:{merchantName: vm.filters.searchText, cardId: vm.filters.cardId}`)
- **Issue:** All transactions are fetched to the client (`/api/transactions` returns the full set) and filtered client-side by `cardId`. There is no server-side scoping to the authenticated user's cards.
- **Impact:** If the endpoint returns transactions beyond the current user's ownership, this constitutes an IDOR/BOLA-style exposure (OWASP API1:2023 – Broken Object Level Authorization). Sensitive financial data of other users may be present in the browser even if visually filtered out.
- **Recommendation:** Enforce object-level authorization server-side so `/api/transactions` and `/api/creditcards` return only records owned by the authenticated principal. Do not rely on client-side filtering for access control.

---

### 3. [MEDIUM] No Authentication / Authorization / Route Protection — CWE-306 / CWE-862

- **File:** `src/app/app.config.js`
- **Line:** ~8–24 (route definitions) and `.run()` interceptor block ~26–36
- **Issue:** Routes (`/dashboard`, `/transactions`) have no `resolve` guard, role check, or authentication gate. The HTTP interceptor only logs errors (`responseError`) and does not attach auth tokens, handle 401/403 redirects, or enforce session state.
- **Impact:** No client-side session enforcement. On a 401/403 the user is not redirected to login; sensitive views may briefly load. Authorization is entirely assumed to be handled elsewhere. (Client-side guards are defense-in-depth; the server remains the true enforcement point.)
- **Recommendation:** Add route `resolve` guards that verify an authenticated session/role, and enhance the interceptor to redirect to login on `401`/`403`. Ensure server-side authorization is authoritative regardless.

---

### 4. [LOW] Error Details Logged to Browser Console — CWE-532

- **File:** `src/app/app.config.js`
- **Line:** ~31 (`console.error('API Error:', rejection.status, rejection.statusText);`)
- **Issue:** API error metadata is written to the browser console. While status/statusText are low-sensitivity, verbose error logging can leak backend details in production.
- **Impact:** Information disclosure via developer console/logs; aids reconnaissance.
- **Recommendation:** Suppress or gate console logging behind a debug/environment flag; avoid logging response bodies or headers that may contain sensitive data.

---

### 5. [LOW] Relative API Endpoint Without Explicit TLS/Base Enforcement — CWE-319

- **File:** `src/app/app.config.js`
- **Line:** ~4 (`.constant('API_ENDPOINT', '/api')`)
- **Issue:** The API base is a relative path (`/api`). This inherits the page scheme, which is acceptable, but there is no explicit enforcement of HTTPS or HSTS at the app layer, and no XSRF token configuration for `$http` state-changing requests (currently only GET calls exist).
- **Impact:** If the app is ever served over HTTP, all card/transaction data traverses in cleartext. Absence of CSRF/XSRF token setup would matter once mutating endpoints are added.
- **Recommendation:** Enforce HTTPS/HSTS at the hosting layer. When POST/PUT/DELETE endpoints are introduced, configure `$httpProvider` `xsrfHeaderName`/`xsrfCookieName` and ensure the server validates anti-CSRF tokens.

---

### 6. [INFO] No Hardcoded Secrets Detected — CWE-798

- **File:** Entire `src/` tree
- **Issue:** No hardcoded passwords, API keys, tokens, or credentials were found in any reviewed file.
- **Impact:** None.
- **Recommendation:** No action required. Maintain secret hygiene as new code is added.

---

### 7. [INFO] No Unsafe XSS Sinks Detected — CWE-79

- **File:** All views and directives
- **Issue:** No use of `ng-bind-html`, `$sce.trustAsHtml`, `.html()`, `innerHTML`, `$compile`, `$parse`, `$eval`, or `eval()`. All dynamic data uses AngularJS interpolation (`{{ }}`), which auto-escapes output. Directive templates are static.
- **Impact:** None. Standard AngularJS contextual escaping mitigates reflected/stored XSS for the reviewed bindings.
- **Recommendation:** No action required. Avoid introducing HTML-trusting sinks; keep Strict Contextual Escaping (SCE) enabled.

---

## Additional Observations (Not Blocking)

- **Dependencies:** No `package.json`, `bower.json`, or lockfile was supplied in `src/`, so AngularJS/library versions and known CVEs (e.g., AngularJS 1.x is End-of-Life and unsupported since Jan 2022) could not be verified. Recommend supplying dependency manifests for a complete assessment. **Note:** AngularJS itself being EOL is a real supply-chain concern (CWE-1104 – Use of Unmaintained Third-Party Components) once the framework version is confirmed.
- **Prototype pollution:** No unsafe recursive merge/`angular.merge` on untrusted input detected.
- **Storage:** No use of `localStorage`, `sessionStorage`, or `document.cookie` with sensitive data was found.

## Final Decision

**Reason:** PASS_WITH_WARNINGS. No CRITICAL or HIGH findings, no exposed credentials, no authentication-bypass or exploitable injection/XSS sinks were identified in the supplied code. The remaining issues are MEDIUM/LOW and non-blocking at the code level: potential full-PAN display (PCI masking depends on API response), reliance on client-side filtering for card scoping (server must enforce object-level authorization), and absence of client-side route/auth guards. These should be remediated but do not block progression to unit testing.

**Note on completeness:** Dependency manifests were not provided, so third-party/AngularJS-version CVE analysis (item 10) is incomplete. If confirmation of the AngularJS version and API PAN-masking behavior is required for a definitive gate, treat those items as SECURITY_REVIEW_INCOMPLETE pending that evidence — otherwise the code-level gate is **PASS_WITH_WARNINGS** and cleared for unit testing.