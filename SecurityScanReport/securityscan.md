# Security Scan Report

**Repository:** APB_Demo
**Branch:** APPMRN94
**Scan Date:** 2025-01-31
**Scanned By:** Senior Security & Compliance Engineer (CISSP, OSCP)
**PRD Reference:** MPSP PRD v1.1 — Merchant Payments & Settlement Platform

---

## Security Gate Decision

**Status:** ⚠️ FAIL

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 6 |
| Medium | 5 |
| Low | 4 |
| Info | 3 |

---

## Findings

---

### 1. [CRITICAL] Hardcoded Placeholder Identity in Audit Trail — CWE-287 / CWE-778

- **File:** `src/app/paymentAcceptance/services/payment.service.js`
- **Lines:** Multiple (auditTrail entries throughout `initiatePayment`, `capturePayment`, `voidPayment`, `refundPayment`)
- **Vulnerable Code:**
```javascript
auditTrail:[{event:'PAYMENT_INITIATED',state:'AUTHORIZED',
  timestamp:new Date().toISOString(),userId:'current_user'}]
```
```javascript
payment.auditTrail.push({event:'PAYMENT_CAPTURED',state:'CAPTURED',
  timestamp:new Date().toISOString(),userId:'current_user'});
```
- **Issue:** Every financial audit event is recorded with the literal static string `'current_user'` as the `userId`. No real authenticated identity is resolved from the JWT token or session context. This affects all payment lifecycle events: INITIATED, CAPTURED, VOIDED, REFUNDED.
- **Security Impact:** The audit trail — a hard regulatory requirement under **FR-LED-04**, **NFR-OBS-04**, **SOX §404**, and **PSD2** — is rendered completely non-attributable. An attacker or insider can perform any financial action (capture, void, refund, payout) and the audit log will never record their real identity. This constitutes an **authentication bypass of audit controls** and makes forensic investigation impossible. Directly violates AP-4.6, AP-9.10, and NFR-OBS-04 ("Sensitive data absent from logs" and "100% state journey" traceability).
- **OWASP:** A07:2021 – Identification and Authentication Failures; A09:2021 – Security Logging and Monitoring Failures
- **Recommended Fix:** Inject the `AuthInterceptor` or a dedicated `SessionService` to resolve the authenticated user's identity (from the validated JWT stored in `sessionStorage`) at the point of each audit event. The `userId` field must be populated from `$window.sessionStorage.getItem('jwt_token')` decoded claims (e.g., `sub` claim), never hardcoded. Example:
```javascript
// Inject a SessionService that decodes the JWT sub claim
userId: SessionService.getCurrentUserId() // resolves from JWT 'sub'
```

---

### 2. [CRITICAL] PAN Transmitted in Plain Text via AngularJS Model Before Tokenisation — CWE-312 / CWE-359

- **File:** `src/app/paymentAcceptance/views/payment-form.view.html` + `src/app/paymentAcceptance/controllers/payment.controller.js`
- **Lines:** `payment-form.view.html` (PAN input field); `payment.controller.js` (vm.payment object binding)
- **Vulnerable Code (view):**
```html
<input type="text" class="form-control" ng-model="payCtrl.payment.pan"
  maxlength="19" required>
```
- **Vulnerable Code (controller):**
```javascript
vm.payment={payerId:'',payeeId:'',amount:0,currency:'GBP',
  channel:'ONLINE',pan:'',state:'INITIATED'};
```
- **Issue:** The raw PAN (Primary Account Number) is bound directly to the AngularJS `$scope` model `vm.payment.pan` and held in the JavaScript heap in plaintext throughout the controller lifecycle. The PAN is passed as a property of the full `paymentData` object to `PaymentService.initiatePayment()`, meaning it traverses the entire AngularJS digest cycle, is accessible to any injected service, and persists in the idempotency cache object (`idempotencyCache`) as part of the payment record (the `panToken` field is stored but the original `paymentData.pan` is still accessible in the closure). Furthermore, the input field is `type="text"` rather than `type="tel"` or a masked input, meaning the PAN is visible on screen.
- **Security Impact:** Violates **PCI DSS Requirement 3** (protect stored cardholder data), **NFR-SEC-03** ("PAN never persisted downstream"), **FR-PAY-01 Security AC** ("PAN is tokenised at the edge and never persisted downstream"), and **C1** (architectural constraint). The PAN is exposed in the browser's memory, Angular's scope tree (inspectable via browser devtools in non-production), and potentially in Angular's `$watch` cycle logs. This is a **PCI DSS scope violation**.
- **OWASP:** A02:2021 – Cryptographic Failures; A04:2021 – Insecure Design
- **Recommended Fix:**
  1. Change input type to `type="tel"` with `autocomplete="cc-number"`.
  2. Do **not** bind the PAN to the AngularJS model at all. Instead, use a dedicated PCI-scoped iframe or a hosted fields solution so the PAN never enters the Angular scope.
  3. If inline capture is required, immediately call `TokenizationService.tokenizePAN()` on `blur` of the PAN field, store only the returned token in the model, and zero-out the raw PAN field value immediately.
  4. Ensure the `idempotencyCache` never stores raw `paymentData` objects containing PAN.

---

### 3. [HIGH] JWT Token Stored in `sessionStorage` — Accessible to XSS — CWE-922 / CWE-79

- **Files:** `src/app/shared/interceptors/auth.interceptor.js`, `src/app/main.controller.js`
- **Lines:** `auth.interceptor.js` (request function); `main.controller.js` (logout function)
- **Vulnerable Code:**
```javascript
// auth.interceptor.js
var token=$window.sessionStorage.getItem('jwt_token');
if(token){config.headers.Authorization='Bearer '+token;}

// main.controller.js
vm.logout=function(){$window.sessionStorage.removeItem('jwt_token');
```
- **Issue:** The JWT bearer token is stored in `sessionStorage` and retrieved on every HTTP request. `sessionStorage` is accessible to any JavaScript running in the same origin, meaning any XSS vulnerability — present or future — can trivially exfiltrate the token. The token is then attached as a `Bearer` token to **all** outgoing `$http` requests via the interceptor, including calls to financial endpoints (ledger, settlement, payouts, disputes).
- **Security Impact:** Violates **NFR-SEC-04** ("Short-lived JWTs, JWKS-validated"), **FR-IAM-01 Security AC**, and **AP-9.3**. A successful XSS attack (even a stored XSS via a merchant note or compliance case note — see Finding #5) would allow complete session hijacking and full access to all payment, settlement, and dispute APIs with the victim's privileges. The PRD requires **FR-IAM-01** backend session/token exchange — the current implementation appears to be a pure frontend token store without evidence of backend session management.
- **OWASP:** A02:2021 – Cryptographic Failures; A07:2021 – Identification and Authentication Failures
- **Recommended Fix:** Tokens should be stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed by the backend, not in `sessionStorage`. Implement backend session management per **FR-IAM-01** (OIDC backend token exchange). If `sessionStorage` must be used transitionally, enforce strict CSP headers server-side and ensure the 15-minute inactivity timeout (**FR-IAM-01 Security AC**) is enforced server-side, not just client-side.

---

### 4. [HIGH] No Route-Level Authentication Guards — Missing Authorization on All Routes — CWE-862

- **File:** `src/app/app.routes.js`
- **Vulnerable Code:**
```javascript
$stateProvider.state('onboarding',{url:'/onboarding',...})
  .state('onboardingCase',{url:'/onboarding/case/:caseId',...})
  .state('payments',{url:'/payments',...})
  .state('settlement',{url:'/settlement',...})
  .state('reconciliation',{url:'/reconciliation',...})
  .state('disputes',{url:'/disputes',...})
  .state('reports',{url:'/reports',...})
```
- **Issue:** None of the seven application routes define any authentication check, role guard, or `resolve` function that validates the presence of a valid JWT before rendering the route. There is no `$transitions.onBefore` hook, no `data.requiresAuth` property, and no `resolve` block checking `sessionStorage` for a valid token. Any unauthenticated user who navigates directly to `/payments`, `/settlement`, `/disputes`, or `/reports` will have the route rendered by the browser.
- **Security Impact:** Violates **FR-IAM-01** ("authenticate all users"), **FR-IAM-02** ("authorize actions by persona role"), **AP-9.1**, **AP-9.5**, and the PRD Security AC for FR-ONB-01 ("Given an unauthenticated caller, When they POST, Then 401 with no data leakage"). While the backend API calls will fail with 401 (handled by `AuthInterceptor`), the UI routes are fully accessible, potentially exposing UI structure, form fields, and error messages to unauthenticated users. For the compliance case route (`/onboarding/case/:caseId`), the `caseId` is a URL parameter with no client-side guard, enabling enumeration attempts.
- **OWASP:** A01:2021 – Broken Access Control; A07:2021 – Identification and Authentication Failures
- **Recommended Fix:** Implement a `$transitions.onBefore` hook in `app.routes.js` (or a `run` block) that checks for a valid token before allowing any protected state transition. Add `data: { requiresAuth: true, roles: ['DISPUTES_ANALYST'] }` metadata to each state and enforce role-based checks. Example:
```javascript
$transitions.onBefore({ to: '**' }, function(transition) {
  var token = $window.sessionStorage.getItem('jwt_token');
  if (!token) { return transition.router.stateService.target('login'); }
});
```

---

### 5. [HIGH] Stored XSS Risk via Unescaped Compliance Case Notes — CWE-79

- **File:** `src/app/merchantOnboarding/views/compliance-case.view.html`
- **Vulnerable Code:**
```html
<div ng-repeat="note in caseCtrl.complianceCase.notes" class="well well-sm">
  <p>{{note.text}}</p>
  <small>{{note.timestamp|date:'medium'}} - {{note.userId}}</small>
</div>
```
- **Issue:** While AngularJS double-curly `{{ }}` interpolation does auto-escape HTML entities by default (mitigating basic reflected XSS), the `note.text` content originates from user-supplied free-text input (`<textarea ng-model="caseCtrl.newNote">`), is POSTed to the backend, retrieved via `ComplianceCaseService.getCase()`, and rendered back. The risk is that if the backend does not sanitise or encode the stored note text, or if a future developer introduces `ng-bind-html` or `$sce.trustAsHtml()` for rich-text rendering of notes (a common pattern), this becomes a **stored XSS vector**. Additionally, `note.userId` is rendered without validation — if the `userId` field is ever populated from an external source (e.g., a sanctions hit notification), it could carry malicious content. Combined with Finding #3 (JWT in sessionStorage), a stored XSS here would enable full session hijacking.
- **Security Impact:** Compliance case notes are authored by Risk/Compliance Officers and Operations Analysts — high-privilege users. A stored XSS targeting these users could exfiltrate JWT tokens, perform CSRF-equivalent actions, or escalate to full account takeover. Violates **AP-9.1**, **NFR-SEC-09**.
- **OWASP:** A03:2021 – Injection (XSS)
- **Recommended Fix:** Explicitly validate and sanitise all note text server-side before storage. Ensure `ng-bind-html` is never used for note rendering without `$sanitize` (ngSanitize module). Add a Content Security Policy header. Consider limiting note length and character set (no HTML tags). Validate `note.userId` is always a system-generated identifier, never user-supplied content.

---

### 6. [HIGH] Insecure Direct Object Reference (IDOR) on Compliance Case Route — CWE-639 / CWE-284

- **File:** `src/app/app.routes.js` + `src/app/merchantOnboarding/controllers/compliance-case.controller.js`
- **Vulnerable Code:**
```javascript
// app.routes.js
.state('onboardingCase',{url:'/onboarding/case/:caseId',...,
  controller:'ComplianceCaseController',...})

// compliance-case.controller.js
vm.caseId=$stateParams.caseId;
vm.loadCase=function(){
  ComplianceCaseService.getCase(vm.caseId)...
```
- **Issue:** The `caseId` is taken directly from the URL parameter `$stateParams.caseId` and passed to `ComplianceCaseService.getCase()` without any client-side validation of whether the authenticated user has permission to access that specific case. There is no role check (is this user a Risk/Compliance Officer?), no ownership check (does this case belong to the user's merchant?), and no validation of the `caseId` format. The route has no authentication guard (see Finding #4). An authenticated user from one merchant could enumerate `caseId` values to access compliance cases belonging to other merchants.
- **Security Impact:** Violates **FR-REP-03 Security AC** ("results are scoped to their own MID only; cross-tenant attempt → 403, logged"), **FR-ONB-03 Security AC** ("access restricted to Risk/Compliance role"), **AP-9.5** (least privilege), and **AP-10.10** (tenant isolation). Compliance cases contain sanctions screening results, PEP data, and AML investigation notes — all classified **Restricted** under the PRD. This is a **BOLA (Broken Object Level Authorization)** vulnerability.
- **OWASP:** A01:2021 – Broken Access Control (IDOR/BOLA)
- **Recommended Fix:** Enforce authorization server-side on the `GET /compliance/cases/:caseId` endpoint (primary control). Client-side: add a route guard that validates the user holds the `RISK_COMPLIANCE` or `OPERATIONS_ANALYST` role before rendering the route. Validate `caseId` format (e.g., UUID regex) before making the API call. Log all access attempts server-side.

---

### 7. [HIGH] Hardcoded `'current_user'` in Break Queue Resolution — CWE-287 / CWE-778

- **File:** `src/app/reconciliation/services/break-queue.service.js`
- **Vulnerable Code:**
```javascript
service.resolveBreak=function(breakId){
  ...
  $http.put(API_CONFIG.baseUrl+'/reconciliation/breaks/'+breakId+'/resolve',
    {resolvedAt:new Date().toISOString(),resolvedBy:'current_user'})
```
- **Issue:** The `resolvedBy` field sent to the backend reconciliation API is hardcoded as the literal string `'current_user'`. This means the server-side audit record for every break resolution will record `'current_user'` as the responsible analyst, not the actual authenticated identity.
- **Security Impact:** Violates **FR-REC-04** ("resolution and actor are recorded immutably"), **FR-LED-04** (audit event with actor), **NFR-OBS-04**, and **SOX §404** (segregation of duties evidence). Reconciliation break resolution is a financial control action — the inability to attribute it to a real user undermines the entire SoD framework. This is the same class of defect as Finding #1 and compounds the audit trail integrity failure.
- **OWASP:** A09:2021 – Security Logging and Monitoring Failures; A07:2021 – Identification and Authentication Failures
- **Recommended Fix:** Same remediation pattern as Finding #1 — inject a `SessionService` and resolve the authenticated user's identity from the JWT `sub` claim. Pass the real `userId` as `resolvedBy`.

---

### 8. [HIGH] PAN Sent to Tokenisation Endpoint Over Relative URL — No TLS Enforcement Verified — CWE-319

- **File:** `src/app/paymentAcceptance/services/tokenization.service.js`
- **Vulnerable Code:**
```javascript
$http.post(API_CONFIG.baseUrl+'/tokenization/tokenize',{pan:pan})
```
- **Issue:** The raw PAN is POSTed to `API_CONFIG.baseUrl + '/tokenization/tokenize'`. The `baseUrl` is configured as the relative path `/api/v1` in `app.config.js`. A relative URL means the scheme (HTTP vs HTTPS) is inherited from the page's origin. If the application is ever served over HTTP (e.g., in development, staging without HTTPS enforcement, or due to a misconfiguration), the raw PAN will be transmitted in plaintext. There is no explicit TLS enforcement, HSTS header enforcement, or scheme validation in the client code.
- **Security Impact:** Violates **PCI DSS Requirement 4** (encrypt transmission of cardholder data across open networks), **NFR-SEC-01** (TLS 1.3), **FR-ONB-02 Security AC** ("TLS 1.3 and brokered credential"), and **C1**. In any non-production environment without HTTPS enforcement (violating **NFR-DP-05** and **C7**), this transmits the PAN in plaintext.
- **OWASP:** A02:2021 – Cryptographic Failures
- **Recommended Fix:** Enforce HTTPS at the infrastructure level (HSTS with `includeSubDomains; preload`). Add a client-side scheme check before any PAN transmission:
```javascript
if($window.location.protocol !== 'https:') {
  deferred.reject({data:{message:'Secure connection required'}});
  return deferred.promise;
}
```
Additionally, the tokenisation endpoint should be in a separate PCI-scoped zone, not under the same `/api/v1` base path as general application APIs.

---

### 9. [MEDIUM] Idempotency Cache Stored in JavaScript Heap (In-Memory) — CWE-311 / CWE-359

- **File:** `src/app/paymentAcceptance/services/payment.service.js`
- **Vulnerable Code:**
```javascript
var idempotencyCache={};
// ...
idempotencyCache[idempotencyKey]=payment;
```
- **Issue:** The idempotency cache is a plain JavaScript object stored in the AngularJS service's closure (heap memory). It stores complete payment objects including `panToken`, `payerId`, `payeeId`, `amount`, `currency`, `auditTrail`, `ledgerEntries`, and `railResponse` (containing `authCode` and `rrn`). This data persists for the entire browser session. The cache is accessible via browser devtools memory inspection and is not cleared on logout. Similarly, `BankAdapterService` maintains `executedPayouts` in-memory.
- **Security Impact:** Violates **NFR-FIN-02** (idempotency key retention should be server-side), **NFR-SEC-03** (PAN scope minimisation), and **AP-4.1**. The `authCode` and `rrn` in `railResponse` are sensitive payment rail data. A memory dump or XSS attack can extract all cached payment data. The cache is also not shared across browser tabs or sessions, making it unreliable for true idempotency (a core financial integrity requirement per **NFR-FIN-02**).
- **OWASP:** A02:2021 – Cryptographic Failures; A04:2021 – Insecure Design
- **Recommended Fix:** Idempotency must be enforced server-side (the backend API must store and check idempotency keys). The client-side cache should be removed entirely. If a client-side cache is retained for UX purposes, it must: (a) exclude sensitive fields (`authCode`, `rrn`, `panToken`), (b) be cleared on logout, and (c) not be relied upon for financial idempotency guarantees.

---

### 10. [MEDIUM] No CSRF Protection on State-Changing HTTP Requests — CWE-352

- **File:** `src/app/shared/interceptors/api-gateway.interceptor.js`
- **Vulnerable Code:**
```javascript
request:function(config){
  if(config.method==='POST'||config.method==='PUT'||config.method==='PATCH'){
    var idempotencyKey=...;
    config.headers['X-Idempotency-Key']=idempotencyKey;
  }
  return config;
}
```
- **Issue:** The `ApiGatewayInterceptor` adds an `X-Idempotency-Key` header to mutating requests but does **not** add an `X-XSRF-TOKEN` or equivalent CSRF token. AngularJS has built-in XSRF protection via `$http` that reads a `XSRF-TOKEN` cookie and sends it as `X-XSRF-TOKEN`, but this requires the server to set the `XSRF-TOKEN` cookie. There is no evidence in the codebase that this cookie is being set or that `$httpProvider.defaults.xsrfCookieName` / `xsrfHeaderName` are configured. Given that the JWT is in `sessionStorage` (not a cookie), CSRF is less of a direct risk for the JWT itself, but any cookie-based session management introduced in the future would be immediately vulnerable.
- **Security Impact:** Violates **AP-9.1** (authentication before business logic). If the application ever transitions to cookie-based session management (the recommended fix for Finding #3), all state-changing endpoints (payment initiation, capture, void, refund, settlement, dispute resolution) would be CSRF-vulnerable without this control.
- **OWASP:** A01:2021 – Broken Access Control (CSRF)
- **Recommended Fix:** Configure AngularJS XSRF protection and ensure the backend sets the `XSRF-TOKEN` cookie on session establishment. Add explicit CSRF token handling in the interceptor as a defence-in-depth measure alongside the `SameSite=Strict` cookie attribute recommended in Finding #3.

---

### 11. [MEDIUM] Hardcoded `'current_user'` in Compliance Case Notes — CWE-287 / CWE-778

- **File:** `src/app/merchantOnboarding/controllers/compliance-case.controller.js`
- **Vulnerable Code:**
```javascript
vm.addNote=function(){
  ...
  vm.complianceCase.notes.push({text:vm.newNote,
    timestamp:new Date(),userId:'current_user'});
```
- **Issue:** When a compliance case note is added locally (optimistic UI update), the `userId` is hardcoded as `'current_user'`. While the note is also POSTed to the backend via `ComplianceCaseService.addNote()`, the local UI state will always show `'current_user'` as the note author until the page is refreshed. More critically, if the backend also accepts and stores this client-supplied `userId` without overriding it with the server-side authenticated identity, the audit trail for compliance notes is permanently corrupted.
- **Security Impact:** Same class of defect as Findings #1 and #7. Compliance case notes are part of the AML/sanctions investigation audit trail required by **FR-ONB-03 Compliance AC** (SAR filing, AMLD evidence). Non-attributable notes undermine regulatory compliance.
- **OWASP:** A09:2021 – Security Logging and Monitoring Failures
- **Recommended Fix:** Resolve the authenticated user's identity from the JWT for the optimistic UI update. Ensure the backend **always** overrides the client-supplied `userId` with the server-side authenticated identity from the JWT `sub` claim — the client should never be trusted to supply its own identity.

---

### 12. [MEDIUM] CSV Export Does Not Sanitise Cell Values — CSV Injection — CWE-1236

- **File:** `src/app/reporting/services/reporting.service.js`
- **Vulnerable Code:**
```javascript
service.convertToCSV=function(data){
  if(!data||data.length===0)return'';
  var keys=Object.keys(data[0]);
  var csv=keys.join(',')+'
';
  data.forEach(function(row){
    var values=keys.map(function(key){return row[key];});
    csv+=values.join(',')+'
';
  });
  return csv;
};
```
- **Issue:** The CSV conversion function does not sanitise cell values. Values are joined directly with commas and newlines without quoting, escaping, or stripping formula-injection characters (`=`, `+`, `-`, `@`, `\t`, `\r`). Report data includes merchant IDs, transaction IDs, amounts, and potentially merchant-supplied business names from onboarding — all of which could contain formula-injection payloads. Additionally, values containing commas or newlines will corrupt the CSV structure.
- **Security Impact:** Violates **FR-REP-04** ("row counts match on-screen data exactly" — corrupted by unescaped commas/newlines). A malicious merchant could register with a business name like `=HYPERLINK("http://attacker.com","Click")` which, when exported to CSV and opened in Excel/LibreOffice by a Finance or Operations Analyst, executes the formula. This is a **CSV Injection / Formula Injection** attack targeting internal users.
- **OWASP:** A03:2021 – Injection
- **Recommended Fix:** Sanitise all cell values before CSV output:
```javascript
function sanitizeCSVCell(value) {
  if (value === null || value === undefined) return '';
  var str = String(value);
  // Strip formula injection prefixes
  if (['=','+','-','@','\t','\r'].indexOf(str[0]) !== -1) {
    str = "'" + str;
  }
  // Quote fields containing commas, quotes, or newlines
  if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1
      || str.indexOf('\n') !== -1) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
```

---

### 13. [MEDIUM] Refund Amount Validated Client-Side Only — Business Logic Bypass — CWE-602

- **File:** `src/app/paymentAcceptance/services/payment.service.js`
- **Vulnerable Code:**
```javascript
if(amount>payment.capturedAmount-payment.refundedAmount){
  deferred.reject({data:{message:'Refund amount exceeds captured amount'}});
  return deferred.promise;
}
```
- **Issue:** The refund over-refund check (`amount > capturedAmount - refundedAmount`) is performed entirely in the client-side JavaScript service against the in-memory `idempotencyCache`. Since the cache is client-side (see Finding #9), it can be manipulated by a user with browser devtools access. A user could modify `payment.capturedAmount` or `payment.refundedAmount` in the JavaScript heap to bypass this check and submit a refund exceeding the captured amount.
- **Security Impact:** Violates **FR-PAY-07** ("Given a refund exceeding captured amount, Then it is rejected"), **NFR-FIN-01** (exactly-once, no double-debit), and **AP-4.2**. While the backend should enforce this, relying solely on client-side validation for a financial integrity control is a critical design flaw per the PRD's own requirements.
- **OWASP:** A04:2021 – Insecure Design; A01:2021 – Broken Access Control
- **Recommended Fix:** This validation **must** be enforced server-side on the `POST /rails/refund` and `POST /ledger/entries` endpoints. The client-side check is acceptable as a UX aid only and must never be the sole control.

---

### 14. [LOW] `setTimeout` Used Instead of `$timeout` in SCA Directive — CWE-362

- **File:** `src/app/paymentAcceptance/directives/sca-challenge.directive.js`
- **Vulnerable Code:**
```javascript
$scope.submitSCA=function(){
  ...
  $scope.loading=true;
  setTimeout(function(){
    $scope.$apply(function(){
      $scope.loading=false;
      if($scope.onComplete){$scope.onComplete({result:'SUCCESS'});}
    });
  },1000);
};
```
- **Issue:** Native `setTimeout` is used instead of AngularJS's `$timeout`. While `$scope.$apply()` is called to re-enter the digest cycle, using `setTimeout` bypasses AngularJS's testability infrastructure and error handling. More critically, the SCA challenge completion always resolves with `result:'SUCCESS'` after a 1-second delay regardless of any actual authentication factor validation. There is no actual SCA factor verification in this directive — it is a stub that always succeeds.
- **Security Impact:** Violates **FR-PAY-04** ("two independent SCA factors are required"), **NFR-CMP-01** (PSD2 SCA enforcement), and **AP-9.9**. The SCA challenge is entirely cosmetic — submitting any two non-empty strings will always result in `SUCCESS`. This is a **PSD2 compliance violation** and an authentication bypass for all customer-initiated EEA/UK payments.
- **OWASP:** A07:2021 – Identification and Authentication Failures
- **Recommended Fix:** Replace `setTimeout` with `$timeout`. More critically, implement actual SCA factor validation — the `onComplete` callback should only be invoked after a real server-side SCA verification response (e.g., `POST /auth/sca/verify` returning a cryptographic proof). The stub must not reach production.

---

### 15. [LOW] `document.createElement` and `URL.createObjectURL` Direct DOM Manipulation — CWE-79

- **File:** `src/app/reporting/services/reporting.service.js`
- **Vulnerable Code:**
```javascript
service.downloadBlob=function(blob,filename){
  var link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download=filename;
  link.click();
};
```
- **Issue:** Direct DOM manipulation via `document.createElement` bypasses AngularJS's security context. The `filename` parameter (`'report.csv'`) is currently hardcoded, but if it were ever made dynamic (e.g., `reportType + '.csv'`), it could be manipulated. `URL.createObjectURL` creates an object URL that persists until explicitly revoked — the code does not call `URL.revokeObjectURL(link.href)` after the download, causing a memory leak.
- **Security Impact:** Low risk in current form due to hardcoded filename. Memory leak from unreleased object URLs. If `filename` becomes dynamic, it could be used for path traversal or content-type confusion attacks.
- **OWASP:** A04:2021 – Insecure Design
- **Recommended Fix:** Add `URL.revokeObjectURL(link.href)` after `link.click()`. If filename becomes dynamic, sanitise it (alphanumeric + hyphens/underscores only). Consider using AngularJS's `$document` service instead of raw `document`.

---

### 16. [LOW] No Input Length or Format Validation on Financial Form Fields — CWE-20

- **File:** `src/app/merchantOnboarding/views/application-form.view.html`
- **Vulnerable Code:**
```html
<input type="text" class="form-control"
  ng-model="appCtrl.application.settlementBankDetails.accountNumber">
<input type="text" class="form-control"
  ng-model="appCtrl.application.settlementBankDetails.sortCode">
<input type="text" class="form-control"
  ng-model="appCtrl.application.businessRegistrationNumber" required>
```
- **Issue:** Settlement bank account number, sort