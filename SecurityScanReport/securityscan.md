# Security Scan Report

**Repository:** APB_Demo
**Branch:** HGAzets
**Scan Date:** 2025-07-14
**Product Context:** Automated Ledger Mapping Tool (AAVA™) — Azets/Muldoon M&A Integration Platform

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 3 |
| Medium | 5 |
| Low | 4 |
| Info | 2 |

---

## Findings

---

### 1. [HIGH] Insecure Token Storage — CWE-922 / OWASP A02:2021

- **File:** `src/app/services/auth.service.js`
- **Line:** 10–11
- **Vulnerable Code:**
```javascript
return $window.sessionStorage.getItem('authToken') ||
       $window.localStorage.getItem('authToken');
```
- **Issue:** The authentication token (`authToken`) is read from and written to both `sessionStorage` and `localStorage`. `localStorage` persists indefinitely across browser sessions and is accessible to any JavaScript on the same origin, making it a prime XSS exfiltration target. There is no fallback justification for storing a bearer token in `localStorage`.
- **Security Impact:** If any XSS vector is exploited (even transiently), the bearer token can be silently exfiltrated, enabling full session hijacking and unauthorized access to the Cozone ledger integration, audit logs, and financial mapping data — all of which are classified as sensitive under GDPR per the PRD.
- **Recommended Fix:** Remove `localStorage` as a token store entirely. Use only `sessionStorage` (or, preferably, in-memory storage with a `HttpOnly` cookie-based session managed server-side). Update `clearToken` to only remove from `sessionStorage`:
```javascript
this.getToken = function() {
    return $window.sessionStorage.getItem('authToken');
};
this.setToken = function(token) {
    $window.sessionStorage.setItem('authToken', token);
};
this.clearToken = function() {
    $window.sessionStorage.removeItem('authToken');
};
```

---

### 2. [HIGH] Sensitive Session Data in sessionStorage Without Integrity Protection — CWE-922 / OWASP A02:2021

- **Files:** `src/app/modules/upload/upload.controller.js` (line ~22), `src/app/modules/review/review.controller.js` (line ~6), `src/app/modules/approval/approval.controller.js` (line ~6), `src/app/modules/reports/report.controller.js` (line ~6), `src/app/services/audit-logging.service.js` (lines ~14–15)
- **Vulnerable Code:**
```javascript
sessionStorage.setItem('sessionId', response.sessionId);
sessionStorage.setItem('userId', ...);
vm.sessionId = sessionStorage.getItem('sessionId') || '';
approvedBy: sessionStorage.getItem('userId') || 'anonymous'
```
- **Issue:** `sessionId` and `userId` are stored in and retrieved from `sessionStorage` without any integrity validation, HMAC, or server-side binding. The `userId` is directly used as the `approvedBy` field in approval payloads and audit log events. A client-side manipulation of `sessionStorage` (e.g., via browser devtools or XSS) allows an attacker to impersonate any user in audit trails and approval workflows.
- **Security Impact:** Privilege escalation and audit log tampering. An attacker could substitute their `userId` with a privileged user's ID, causing fraudulent ledger approvals to be attributed to finance managers — a direct compliance violation under the PRD's GDPR and audit requirements.
- **Recommended Fix:** Never trust client-supplied identity for authorization or audit attribution. The `approvedBy` and `userId` fields must be resolved server-side from the validated session/token. Remove client-side `userId` from approval payloads; let the API derive identity from the `Authorization: Bearer` header.

---

### 3. [HIGH] Unvalidated `sessionId` Used Directly in API URL Path — CWE-20 / CWE-918 / OWASP A01:2021 (IDOR/BOLA)

- **Files:** `src/app/factories/ai-mapping.factory.js` (line ~4), `src/app/modules/review/review.controller.js`, `src/app/modules/approval/approval.controller.js`, `src/app/modules/reports/report.controller.js`
- **Vulnerable Code:**
```javascript
return $http.get('/api/mapping/results/' + sessionId)
```
- **Issue:** The `sessionId` is taken directly from `sessionStorage` (client-controlled) and interpolated into a URL path without any format validation, sanitization, or server-enforced ownership check visible on the client. There is no evidence of route guards or authorization checks verifying that the authenticated user owns the requested session. This constitutes a classic BOLA (Broken Object Level Authorization) / IDOR pattern.
- **Security Impact:** Any authenticated user who guesses or enumerates a valid `sessionId` can retrieve another firm's mapping results, financial account data, and audit history — a critical data confidentiality breach in an M&A context where data segregation between firms (e.g., Muldoon vs. other acquired firms) is mandatory.
- **Recommended Fix:** Validate `sessionId` format client-side (e.g., UUID regex) before use. Critically, enforce server-side ownership validation: the API must confirm the authenticated user's identity (from the JWT) owns the requested session. Add a route guard/interceptor that rejects requests with malformed session identifiers.

---

### 4. [MEDIUM] `$scope.$eval` Used in Custom Directives — CWE-94 / OWASP A03:2021

- **File:** `src/app/app.controller.js`
- **Lines:** ~5, ~14, ~22
- **Vulnerable Code:**
```javascript
scope.$eval(attrs.ngDrop, {$event: e});
scope.$eval(attrs.ngDragover, {$event: e});
scope.$eval(attrs.ngDragleave, {$event: e});
```
- **Issue:** `$scope.$eval` evaluates an AngularJS expression string from the DOM attribute value. While AngularJS sandboxes `$eval` to some degree, the sandbox was broken in multiple CVEs (e.g., CVE-2016-9879, multiple sandbox escapes in AngularJS < 1.6.x). If the AngularJS version in use is outdated (no `package.json`/`bower.json` visible to confirm), this is a direct code injection vector. Even in patched versions, `$eval` on attribute values is an unnecessary risk surface.
- **Security Impact:** If the AngularJS sandbox is bypassable in the deployed version, an attacker who can influence the HTML attribute (e.g., via a stored XSS elsewhere, or a DOM clobbering attack) could execute arbitrary JavaScript in the user's browser context.
- **Recommended Fix:** Replace `$scope.$eval` with a named function reference pattern. Define the handler function on the scope explicitly and invoke it directly:
```javascript
// Instead of: scope.$eval(attrs.ngDrop, {$event: e})
// Bind a specific handler: scope.onDrop({$event: e})
// And use '&' binding in an isolate scope directive
```

---

### 5. [MEDIUM] Sensitive Financial Data Transmitted Without Explicit Authorization Header Enforcement — CWE-306 / OWASP A07:2021

- **Files:** `src/app/factories/ai-mapping.factory.js`, `src/app/factories/cozone-api.factory.js`, `src/app/services/rule-engine.service.js`, `src/app/services/master-ledger.service.js`, `src/app/modules/approval/approval.controller.js`
- **Vulnerable Code:**
```javascript
return $http.post('/api/mapping/ai', {accounts: accounts})
return $http.post('/api/cozone/v1/ledger/update', payload, {headers: {'X-API-Version':'v1', ...}})
$http.get('/api/mapping/history')
```
- **Issue:** Multiple `$http` calls to sensitive financial endpoints (AI mapping, Cozone ledger update, mapping history, rule engine) do not explicitly attach the `Authorization: Bearer` token. While AngularJS `$http` interceptors may handle this globally (no interceptor configuration is visible in the codebase), the absence of a confirmed interceptor means these calls may be unauthenticated in certain states (e.g., if the interceptor is not registered, or during session edge cases).
- **Security Impact:** Unauthenticated access to ledger update and mapping endpoints would allow unauthorized financial data manipulation and exfiltration.
- **Recommended Fix:** Implement a global `$http` interceptor in `app.module.js` that attaches the `Authorization` header to all outbound API requests. Confirm and document this pattern:
```javascript
$httpProvider.interceptors.push('AuthInterceptor');
```
Alternatively, add explicit headers to each sensitive call as a defence-in-depth measure.

---

### 6. [MEDIUM] Report Generation Exposes `userId` from Client Storage in Request Body — CWE-284 / OWASP A01:2021

- **File:** `src/app/factories/report-generator.factory.js`
- **Line:** ~9
- **Vulnerable Code:**
```javascript
requestedBy: sessionStorage.getItem('userId') || 'anonymous'
```
- **Issue:** The `requestedBy` field in the report generation request is populated from client-controlled `sessionStorage`. This value is included in the POST body to `/api/reports/generate`. If the server uses this field for access control decisions or audit attribution without re-validating against the authenticated session, it is exploitable.
- **Security Impact:** Audit log falsification; a malicious user could attribute report generation to another user's identity, undermining the audit compliance requirements explicitly stated in the PRD (FR4, AC4).
- **Recommended Fix:** Remove `requestedBy` from the client-side request payload. The server must derive the requesting user's identity exclusively from the validated `Authorization` header/JWT claims.

---

### 7. [MEDIUM] No Route/Navigation Guards — Missing Authentication Enforcement — CWE-306 / OWASP A07:2021

- **File:** `src/app/app.module.js`
- **Vulnerable Code:**
```javascript
angular.module('app', ['toastr']).config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]).run(['AuthService', '$window', function(AuthService, $window) {
    AuthService.validateSession().catch(function() {
        console.warn('Session validation failed');
    });
}]);
```
- **Issue:** Session validation failure is only logged as a `console.warn` — there is no redirect to a login page, no state invalidation, and no route guard (`$routeProvider` / `ui-router` state resolve with auth check) visible anywhere in the codebase. A user with an expired or invalid token can continue navigating the application and triggering API calls.
- **Security Impact:** Unauthorized access to all application views and functionality. An attacker with a stale/forged token that fails server validation would still see the full UI and could attempt API calls. This is especially critical given the financial and M&A-sensitive nature of the data.
- **Recommended Fix:** Implement route-level authentication guards. On `validateSession` rejection, redirect to the login page and clear all stored tokens/session data:
```javascript
AuthService.validateSession().catch(function() {
    AuthService.clearToken();
    $window.location.href = '/login';
});
```
Add `resolve` blocks on all protected routes to enforce authentication before rendering.

---

### 8. [MEDIUM] Approval Workflow Has No Client-Side Authorization Role Check — CWE-285 / OWASP A01:2021

- **File:** `src/app/modules/approval/approval.controller.js`, `src/app/modules/review/review.controller.js`
- **Vulnerable Code:**
```javascript
vm.syncToCozone = function() { ... IntegrationOrchestratorService.approveMappings(vm.sessionId) ... }
vm.approveAll = function() { ... }
```
- **Issue:** The approval and sync-to-Cozone actions have no client-side role validation. Any authenticated user who reaches the approval view can trigger ledger synchronization. The PRD defines distinct personas (Finance Manager vs. Accountant) with different authorization levels — Finance Managers approve, Accountants review. There is no enforcement of this separation.
- **Security Impact:** Privilege escalation — an Accountant-role user could approve and push mappings to the Cozone ledger, bypassing the Finance Manager approval requirement. This violates the PRD's authorization model and could result in unauthorized financial data being committed to the master ledger.
- **Recommended Fix:** Implement role-based access control (RBAC) checks. Retrieve the user's role from the validated server-side session and conditionally render/enable approval actions. Enforce the same check server-side on the `/api/cozone/v1/ledger/update` endpoint.

---

### 9. [LOW] Sensitive Data Logged to Browser Console — CWE-532 / OWASP A09:2021

- **Files:** `src/app/services/audit-log.service.js` (line ~9), `src/app/services/audit-logging.service.js` (line ~12), `src/app/app.module.js` (line ~5)
- **Vulnerable Code:**
```javascript
console.error('Audit log failed:', error);
console.warn('Session validation failed');
```
- **Issue:** Error objects from failed audit log and authentication calls are logged to the browser console. Depending on the error response from the server, these may contain stack traces, internal API URLs, session tokens, or user data. Browser console output is accessible to any JavaScript running on the page and to anyone with devtools access.
- **Security Impact:** Information disclosure. In a shared workstation environment (common in accounting firms), console logs could expose session or API details to the next user.
- **Recommended Fix:** Remove `console.error`/`console.warn` from production builds. Use a build-time flag (e.g., `NODE_ENV`) to strip console statements, or replace with a controlled internal logging service that suppresses output in production.

---

### 10. [LOW] `getMappings` Returns Hardcoded Stub Data in Production Service — CWE-547 / OWASP A05:2021

- **File:** `src/app/services/integration-orchestrator.service.js`
- **Lines:** ~16–20
- **Vulnerable Code:**
```javascript
this.getMappings = function(sessionId) {
    return $q.resolve([{
        accountCode: '1000', masterAccountCode: 'M1000',
        firmId: 'F001', effectiveDate: new Date().toISOString()
    }]);
};
```
- **Issue:** `getMappings` returns a hardcoded stub array instead of fetching real mappings from the API. This means `approveMappings` always syncs the same hardcoded account to Cozone, regardless of the actual session's mapping data. This appears to be test/development code left in production.
- **Security Impact:** Data integrity failure — real mapping data is never actually sent to Cozone during approval. This could result in incorrect ledger entries being committed, which is a significant financial integrity risk. It also masks the true data flow, making security review of the approval chain incomplete.
- **Recommended Fix:** Replace the stub with a real API call:
```javascript
this.getMappings = function(sessionId) {
    return $http.get('/api/mapping/results/' + sessionId)
                .then(function(r) { return r.data.mappings; });
};
```

---

### 11. [LOW] Document Cache Has No TTL Enforcement for Report Download URLs — CWE-525 / OWASP A02:2021

- **File:** `src/app/services/document-storage.service.js`
- **Lines:** ~6–14
- **Vulnerable Code:**
```javascript
var cached = cache.get('previousReports');
if (cached) { return Promise.resolve(cached); }
```
- **Issue:** The `previousReports` cache has no TTL. Once populated, it persists for the lifetime of the AngularJS application instance. If report download URLs are pre-signed (e.g., AWS S3 presigned URLs) or time-limited, the cached URLs may expire but still be served to users, causing failures. More critically, if a report is deleted or access is revoked server-side, the cached entry will still show it as accessible.
- **Security Impact:** Stale access references; potential for serving revoked or expired download links, undermining access control on sensitive financial reports.
- **Recommended Fix:** Implement TTL-based cache invalidation consistent with the `MasterLedgerService` pattern already used in the codebase (timestamp + TTL check).

---

### 12. [LOW] File Upload Does Not Validate File Content (Magic Bytes) — CWE-434 / OWASP A04:2021

- **File:** `src/app/services/file-parser.service.js`
- **Lines:** ~8–14
- **Vulnerable Code:**
```javascript
var validTypes = ['text/csv', 'application/vnd.ms-excel', ...];
if (validTypes.indexOf(file.type) === -1 && !file.name.match(/\.(csv|xlsx|xml)$/i)) {
    deferred.reject('Invalid file type...');
}
```
- **Issue:** File type validation relies solely on `file.type` (MIME type from the browser, easily spoofed) and file extension (trivially renamed). The file content (magic bytes) is never inspected. A malicious file (e.g., an XML with XXE payloads, or a crafted XLSX with macro content) can bypass this check.
- **Security Impact:** Malicious file upload bypass. While server-side validation should be the primary control, the absence of client-side content inspection means malicious files are submitted to the server without any pre-screening, increasing the server's attack surface.
- **Recommended Fix:** Add client-side magic byte validation using `FileReader` to read the first bytes and confirm the file signature matches the declared type. Ensure server-side validation independently performs the same check (primary control).

---

### 13. [INFO] No `$http` Interceptor for CSRF Token Handling Visible — CWE-352 / OWASP A01:2021

- **File:** `src/app/app.module.js`
- **Issue:** No CSRF/XSRF token interceptor is configured in the application module. AngularJS has built-in XSRF support via `$http` using the `XSRF-TOKEN` cookie and `X-XSRF-TOKEN` header, but this requires server-side cookie setting and is not confirmed as active. For a financial application making state-changing POST requests (ledger updates, approvals), CSRF protection is mandatory.
- **Security Impact:** If CSRF protection is not active, a cross-site request forgery attack could trick an authenticated Finance Manager into approving and syncing malicious mappings to the Cozone ledger.
- **Recommended Fix:** Confirm that the backend sets the `XSRF-TOKEN` cookie and that AngularJS's default XSRF handling is not disabled. If using a custom API, explicitly configure `$httpProvider.defaults.xsrfCookieName` and `$httpProvider.defaults.xsrfHeaderName`.

---

### 14. [INFO] No Dependency Manifest Available for Vulnerability Scanning — OWASP A06:2021

- **Files:** No `package.json`, `bower.json`, or `package-lock.json` present in the scanned `src/` directory.
- **Issue:** The AngularJS version, `toastr` version, and all other dependencies cannot be assessed for known CVEs (e.g., AngularJS sandbox escapes, prototype pollution in lodash/jQuery, etc.). The PRD references Cozone integration and AI mapping — any third-party libraries used for these are unverifiable.
- **Security Impact:** Unknown. Outdated AngularJS versions (< 1.8.x) have multiple known sandbox bypass CVEs. The `$scope.$eval` usage (Finding #4) is significantly more dangerous if an unpatched AngularJS version is in use.
- **Recommended Fix:** Include `package.json` / `bower.json` in the repository and run automated dependency scanning (e.g., `npm audit`, Snyk, OWASP Dependency-Check) as part of the CI/CD pipeline.

---

## Summary Table

| # | Severity | File | Issue | CWE | OWASP |
|---|----------|------|-------|-----|-------|
| 1 | HIGH | `auth.service.js` | Auth token stored in localStorage | CWE-922 | A02:2021 |
| 2 | HIGH | Multiple controllers/services | Client-controlled userId in audit/approval | CWE-922 | A02:2021 |
| 3 | HIGH | `ai-mapping.factory.js` + controllers | IDOR/BOLA via unvalidated sessionId in URL | CWE-20/918 | A01:2021 |
| 4 | MEDIUM | `app.controller.js` | `$scope.$eval` on DOM attributes | CWE-94 | A03:2021 |
| 5 | MEDIUM | Multiple factories | Missing explicit Authorization headers | CWE-306 | A07:2021 |
| 6 | MEDIUM | `report-generator.factory.js` | Client-supplied `requestedBy` in report request | CWE-284 | A01:2021 |
| 7 | MEDIUM | `app.module.js` | No route guards on auth failure | CWE-306 | A07:2021 |
| 8 | MEDIUM | `approval.controller.js` | No role-based authorization on approval actions | CWE-285 | A01:2021 |
| 9 | LOW | Multiple services | Sensitive error data in console logs | CWE-532 | A09:2021 |
| 10 | LOW | `integration-orchestrator.service.js` | Hardcoded stub data in production approval flow | CWE-547 | A05:2021 |
| 11 | LOW | `document-storage.service.js` | No cache TTL for report URLs | CWE-525 | A02:2021 |
| 12 | LOW | `file-parser.service.js` | File type validation by MIME/extension only | CWE-434 | A04:2021 |
| 13 | INFO | `app.module.js` | CSRF/XSRF protection not confirmed | CWE-352 | A01:2021 |
| 14 | INFO | N/A | No dependency manifest for CVE scanning | — | A06:2021 |

---

## Final Decision

**Status: ⚠️ PASS_WITH_WARNINGS**

**Reason:** No Critical severity vulnerabilities were detected. No hardcoded credentials, API keys, or secrets were found in the codebase. The three High severity findings — auth token exposure via `localStorage`, client-controlled identity in audit/approval workflows, and IDOR/BOLA risk via unvalidated `sessionId` path parameters — are serious architectural concerns for a financial M&A platform handling GDPR-regulated data, but they are remediable without a fundamental redesign and do not constitute a confirmed exploitable authentication bypass in isolation (server-side controls may compensate). However, **all three High findings MUST be remediated before production deployment**, and the hardcoded stub data in `getMappings` (Finding #10) must be resolved before any end-to-end testing of the approval workflow is meaningful. The code may proceed to **unit testing with the explicit condition** that the High findings are tracked as blocking items for the subsequent security review cycle prior to staging/production promotion. The absence of a dependency manifest (Finding #14) must be resolved immediately to enable full vulnerability assessment.

---

*Report generated by AAVA™ Security Review — CISSP/OSCP Certified AngularJS Security Analysis*
*Classification: CONFIDENTIAL — Internal Use Only*