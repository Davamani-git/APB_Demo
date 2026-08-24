# Security Scan Report

**Repository:** APB_Demo
**Branch:** ccFraudAlert2408
**Scan Date:** 2025-07-14

---

## Security Gate Decision

**Status:** ⚠️ PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 5 |
| Low | 4 |
| Info | 3 |

---

## Findings

---

### 1. [HIGH] Sensitive Financial Data Transmitted Without Authentication Headers — CWE-306 / OWASP A07:2021

- **File:** `src/app/services/fraud-risk-engine.service.js`
- **Lines:** 14–27
- **Vulnerable Code:**
```javascript
var payload = {
  transactionId: transactionEvent.transactionId,
  cardNumber: transactionEvent.cardNumber,       // ← Full card number in POST body
  amount: transactionEvent.amount,
  ...
  deviceFingerprint: transactionEvent.deviceFingerprint,
};
return $http.post(FRAUD_ENGINE_ENDPOINT, payload)
```
- **Issue:** The full `cardNumber` field is included in the outbound POST payload to the fraud-risk engine. No Authorization header, Bearer token, or XSRF token is attached to any `$http` call across the entire codebase. There is no evidence of an HTTP interceptor configuring authentication credentials.
- **Security Impact:** If the endpoint is intercepted (MitM, misconfigured proxy, or SSRF), raw card numbers are exposed in transit. Absence of auth headers means any caller can invoke the fraud-risk API without credentials, enabling unauthorized risk evaluations or data harvesting. Violates PRD §22: *"Use secure authentication before sensitive fraud-response actions"* and *"Encrypt sensitive data in transit and at rest."*
- **Recommended Fix:**
  1. Mask or tokenize `cardNumber` before sending to the risk engine (e.g., send only last-4 or a card token).
  2. Configure a global `$http` interceptor to attach `Authorization: Bearer <token>` and `X-XSRF-TOKEN` headers to every outbound request.
  3. Enforce HTTPS-only endpoints and validate TLS certificates server-side.

---

### 2. [HIGH] Card Number Rendered in Plaintext in Directive Template — CWE-312 / OWASP A02:2021

- **File:** `src/app/directives/fraud-alert-panel.directive.js`
- **Lines:** 11–12
- **Vulnerable Code:**
```html
'<div><strong>Card:</strong> {{alert.transaction.cardNumber}}</div>'
```
- **Issue:** `cardNumber` is bound and rendered directly from the alert object. If the upstream service ever returns a full or partially unmasked PAN (Primary Account Number), it will be displayed verbatim in the DOM. The directive applies no masking filter. PRD §22 explicitly states: *"Never display full card numbers in customer notifications or tracking screens."*
- **Security Impact:** Full or partial PANs exposed in the browser DOM are accessible to any injected script (XSS), browser extensions, or screen-capture tools. This is a PCI-DSS violation risk.
- **Recommended Fix:**
  1. Apply a masking AngularJS filter (e.g., `{{alert.transaction.cardNumber | maskCard}}`) that enforces display of only the last 4 digits regardless of what the API returns.
  2. Validate and mask card data server-side before it reaches the client.
  3. Add a custom filter:
```javascript
angular.module('fraudDetection').filter('maskCard', function() {
  return function(cardNumber) {
    if (!cardNumber) return '';
    return '**** **** **** ' + String(cardNumber).slice(-4);
  };
});
```

---

### 3. [MEDIUM] Sensitive Data Logged to Audit Service Including Error Objects — CWE-532 / OWASP A09:2021

- **File:** `src/app/services/alert-notification.service.js`
- **Lines:** 39–42
- **Vulnerable Code:**
```javascript
AuditLogService.logEvent('alert_creation_failed', {
  transactionId: transaction.transactionId,
  error: error        // ← raw error object logged
});
```
- **File:** `src/app/services/transaction-ingestion.service.js`
- **Lines:** 42–45
- **Vulnerable Code:**
```javascript
AuditLogService.logEvent('transaction_processing_error', {
  transactionId: transactionEvent.transactionId,
  error: error        // ← raw error object logged
});
```
- **File:** `src/app/services/analytics-tracker.factory.js`
- **Lines:** 23–25
- **Vulnerable Code:**
```javascript
AuditLogService.logEvent('notification_failed', {
  alertId: alert.alertId,
  channel: channel,
  error: error        // ← raw error object logged
});
```
- **Issue:** Raw `error` objects from `$http` failures are passed directly to the audit/analytics logging pipeline. AngularJS `$http` error objects contain the full HTTP response, including request configuration, headers, and potentially sensitive response bodies (e.g., card data, tokens, internal stack traces). These are then POSTed to `/api/audit/log` and `/api/analytics/track`.
- **Security Impact:** Sensitive data (auth tokens, card numbers, internal API paths) may be persisted in audit logs, violating PRD §22: *"Log security events without unnecessarily storing sensitive payment data."*
- **Recommended Fix:**
```javascript
// Sanitize error before logging
var safeError = { status: error.status, statusText: error.statusText };
AuditLogService.logEvent('alert_creation_failed', {
  transactionId: transaction.transactionId,
  error: safeError
});
```

---

### 4. [MEDIUM] No CSRF/XSRF Protection on State-Mutating $http Calls — CWE-352 / OWASP A01:2021

- **Files:** `alert-notification.service.js`, `transaction-ingestion.service.js`, `fraud-risk-engine.service.js`, `audit-log.service.js`, `analytics-tracker.factory.js`
- **Vulnerable Code (representative):**
```javascript
return $http.post(API_BASE + '/alerts/create', alert)
return $http.post(API_BASE + '/alerts/' + alertId + '/resolve', {resolution: resolution})
return $http.post(API_BASE + '/alerts/' + alertId + '/acknowledge')
```
- **Issue:** All POST calls across the application lack explicit XSRF token attachment. While AngularJS supports automatic XSRF cookie-to-header synchronization (`XSRF-TOKEN` → `X-XSRF-TOKEN`), this requires the server to set the `XSRF-TOKEN` cookie and the client to be configured correctly. There is no `$httpProvider.defaults` configuration, no interceptor, and no evidence of XSRF configuration in `fraud-detection.module.js`.
- **Security Impact:** State-mutating endpoints (alert creation, resolution, acknowledgement) are potentially vulnerable to CSRF attacks, allowing an attacker to trigger fraud alert resolutions on behalf of an authenticated user.
- **Recommended Fix:**
```javascript
// In module config block
angular.module('fraudDetection').config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'XSRF-TOKEN';
  $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
}]);
```

---

### 5. [MEDIUM] Unauthenticated Alert Resolution — CWE-862 / OWASP A01:2021

- **File:** `src/app/controllers/fraud-alert.controller.js`
- **Lines:** 14–24
- **Vulnerable Code:**
```javascript
vm.confirmTransaction = function(alert) {
  AlertNotificationService.resolveAlert(alert.alertId, 'confirmed_legitimate')...
};
vm.reportTransaction = function(alert) {
  AlertNotificationService.resolveAlert(alert.alertId, 'reported_fraud')...
};
```
- **File:** `src/app/directives/fraud-alert-panel.directive.js`
- **Lines:** 37–50
- **Issue:** The `confirmTransaction` and `reportTransaction` actions — which trigger card/account protection workflows — execute without any client-side authentication check, step-up verification gate, or role validation. PRD §22 states: *"Use secure authentication before sensitive fraud-response actions"* and PRD §10: *"Customer responses must be authenticated and authorized."*
- **Security Impact:** If a session is hijacked or a shared device is accessed, an attacker can confirm fraudulent transactions as legitimate or trigger unnecessary card-block workflows without re-authentication. This is a privilege escalation and IDOR risk — any `alertId` can be resolved by any authenticated session.
- **Recommended Fix:**
  1. Require step-up authentication (PIN, biometric, OTP) before executing `reportTransaction`.
  2. Validate on the server that the authenticated user owns the `alertId` being resolved.
  3. Add client-side guard:
```javascript
vm.reportTransaction = function(alert) {
  AuthService.requireStepUp().then(function() {
    AlertNotificationService.resolveAlert(alert.alertId, 'reported_fraud')...
  });
};
```

---

### 6. [MEDIUM] Insecure Fallback to Mock Data Silently Masks Service Failures — CWE-390 / OWASP A09:2021

- **File:** `src/app/controllers/dashboard.controller.js`
- **Lines:** 26–33
- **Vulnerable Code:**
```javascript
}).catch(function(error) {
  vm.transactions = vm.generateMockTransactions();
  vm.updateMetrics();
  vm.loading = false;
});
```
- **Lines:** 55–75 (evaluateTransaction catch block)
```javascript
}).catch(function(error) {
  var mockScore = Math.floor(Math.random() * 100);
  var riskLevel = mockScore >= 85 ? 'confirmed_fraud' : ...
  transaction.riskScore = { overallScore: mockScore, riskLevel: riskLevel, ... };
```
- **Issue:** On service failure, the dashboard silently substitutes randomly generated mock transactions and randomly generated risk scores (including `confirmed_fraud` level) without any user notification or error logging. PRD §12 (Edge Cases) explicitly states: *"Risk engine unavailable: Apply defined fail-safe/fail-open policy… do not invent a decision."*
- **Security Impact:** Random mock risk scores could trigger false fraud alerts or suppress real ones. A network failure could cause the UI to display fabricated `confirmed_fraud` decisions, triggering unnecessary card-block workflows. This also masks availability issues from operations monitoring.
- **Recommended Fix:**
  1. Remove mock data generation from production code paths; move to test fixtures only.
  2. Display a user-facing error state when the service is unavailable.
  3. Implement the PRD-defined fail-safe policy (e.g., fail-open for low-risk, hold for high-risk) rather than random scoring.

---

### 7. [MEDIUM] `PolicyDecisionService` Thresholds Mutable from Any Caller — CWE-284 / OWASP A01:2021

- **File:** `src/app/services/policy-decision.service.js`
- **Lines:** 7–9
- **Vulnerable Code:**
```javascript
this.setThresholds = function(newThresholds) {
  angular.extend(thresholds, newThresholds);
};
```
- **Issue:** The `setThresholds` method is publicly exposed on the service with no authorization check, no validation of threshold values, and no audit logging. Any controller or directive can call `PolicyDecisionService.setThresholds({confirmedFraud: 101})` to effectively disable fraud blocking entirely. `angular.extend` also allows prototype pollution if `newThresholds` contains `__proto__` keys.
- **Security Impact:** An attacker with XSS or a compromised dependency could disable fraud detection thresholds at runtime. Prototype pollution via `angular.extend` with a crafted object could affect all objects in the application.
- **Recommended Fix:**
```javascript
this.setThresholds = function(newThresholds) {
  // Validate and sanitize
  var allowed = ['low','medium','high','confirmedFraud'];
  var sanitized = {};
  allowed.forEach(function(key) {
    if (newThresholds.hasOwnProperty(key) &&
        typeof newThresholds[key] === 'number' &&
        newThresholds[key] >= 0 && newThresholds[key] <= 100) {
      sanitized[key] = newThresholds[key];
    }
  });
  angular.extend(thresholds, sanitized);
  AuditLogService.logEvent('thresholds_updated', sanitized);
};
```

---

### 8. [LOW] `alertId` Constructed Client-Side — CWE-330 / OWASP A04:2021

- **File:** `src/app/services/alert-notification.service.js`
- **Lines:** 10–12
- **Vulnerable Code:**
```javascript
alertId: 'ALT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
```
- **Issue:** Alert IDs are generated client-side using `Date.now()` (predictable millisecond timestamp) combined with a weak pseudo-random suffix. These IDs are then used in API paths (`/alerts/<alertId>/resolve`), creating a potential IDOR vector if server-side ownership validation is absent.
- **Security Impact:** Predictable IDs enable enumeration attacks. An attacker could guess or brute-force valid `alertId` values and attempt to resolve other users' alerts.
- **Recommended Fix:** Generate all entity IDs server-side using cryptographically secure UUIDs (UUIDv4). The client should use the ID returned by the server's `POST /alerts/create` response, not a self-generated one.

---

### 9. [LOW] Unbounded In-Memory Alert Store — CWE-400 / OWASP A05:2021

- **File:** `src/app/services/alert-notification.service.js`
- **Lines:** 3, 21
- **Vulnerable Code:**
```javascript
var activeAlerts = [];
...
activeAlerts.push(alert);
```
- **Issue:** The `activeAlerts` array grows indefinitely within the AngularJS service singleton. Resolved alerts are status-updated but never removed from the array. Under high transaction volume (a stated scalability requirement in PRD §13), this could cause memory exhaustion in the browser.
- **Security Impact:** Memory exhaustion leading to browser tab crash (DoS). Stale resolved alerts remaining in memory may also be inadvertently re-displayed.
- **Recommended Fix:** Implement a maximum size cap and eviction policy, or filter out resolved alerts from the in-memory store after a configurable TTL.

---

### 10. [LOW] `$timeout` Polling Without Jitter or Back-off — CWE-400

- **File:** `src/app/directives/fraud-alert-panel.directive.js`
- **Lines:** 62–65
- **Vulnerable Code:**
```javascript
var refreshInterval = $timeout(function refresh() {
  scope.loadAlerts();
  refreshInterval = $timeout(refresh, 5000);
}, 5000);
```
- **Issue:** The directive polls the alert service every 5 seconds unconditionally with no exponential back-off, jitter, or circuit-breaker. If multiple instances of the directive are rendered simultaneously, polling requests multiply linearly.
- **Security Impact:** Under failure conditions (service degradation), this pattern can amplify load and contribute to denial-of-service against the backend API. It also generates unnecessary authenticated requests.
- **Recommended Fix:** Use WebSocket or Server-Sent Events for real-time updates. If polling is required, implement exponential back-off with jitter and a circuit-breaker pattern.

---

### 11. [LOW] `subscribeToTransactionEvents` Returns Callback Unguarded — CWE-20

- **File:** `src/app/services/transaction-ingestion.service.js`
- **Lines:** 44–46
- **Vulnerable Code:**
```javascript
this.subscribeToTransactionEvents = function(callback) {
  return callback;
};
```
- **Issue:** This method accepts and returns an arbitrary callback with no validation, type-checking, or invocation guard. It is a stub that provides no actual subscription mechanism, which may lead developers to incorrectly assume event-driven processing is active.
- **Security Impact:** Low direct risk, but incomplete implementation may cause silent processing failures for transaction events, undermining fraud detection coverage (PRD FR-01).
- **Recommended Fix:** Implement a proper event subscription mechanism or remove the stub and document the gap explicitly.

---

### 12. [INFO] No Content Security Policy (CSP) Configuration Observed — OWASP A05:2021

- **File:** `src/app/fraud-detection.module.js`
- **Issue:** No CSP nonce, `$sceProvider` configuration, or HTTP security header setup is present in the module configuration. AngularJS applications are particularly sensitive to XSS without a strict CSP.
- **Recommended Fix:** Configure a strict CSP header server-side (`default-src 'self'; script-src 'self' 'nonce-<random>'`) and configure `$sceProvider` appropriately.

---

### 13. [INFO] No Route-Level Authorization Guards Observed — OWASP A01:2021

- **Issue:** No `$routeProvider` or `ui-router` configuration with authentication/authorization resolve guards is present in the scanned codebase. PRD §14 requires that *"Authorized fraud operations users must be able to investigate alert outcomes"* — implying role-based access control is required.
- **Recommended Fix:** Implement route resolve guards that verify authentication state and user roles before activating sensitive routes (e.g., operations dashboard).

---

### 14. [INFO] AngularJS Framework Version — OWASP A06:2021

- **Issue:** The application uses AngularJS (Angular 1.x). AngularJS reached End-of-Life on **December 31, 2021** and no longer receives security patches. Any newly discovered vulnerabilities in the framework will remain unpatched.
- **Security Impact:** Long-term risk of unpatched framework-level vulnerabilities. PRD §22 requires strong security controls which cannot be guaranteed on an EOL framework.
- **Recommended Fix:** Plan migration to a supported framework (Angular 2+, React, Vue). In the interim, pin to the last known-good AngularJS version (1.8.3) and monitor CVE disclosures.

---

## Summary Table

| # | Severity | File | Issue | OWASP / CWE |
|---|----------|------|-------|-------------|
| 1 | HIGH | `fraud-risk-engine.service.js` | Card number in POST payload; no auth headers | CWE-306 / A07 |
| 2 | HIGH | `fraud-alert-panel.directive.js` | Card number rendered without masking filter | CWE-312 / A02 |
| 3 | MEDIUM | `alert-notification.service.js`, `transaction-ingestion.service.js`, `analytics-tracker.factory.js` | Raw error objects logged (may contain sensitive data) | CWE-532 / A09 |
| 4 | MEDIUM | All service files | No CSRF/XSRF protection on POST calls | CWE-352 / A01 |
| 5 | MEDIUM | `fraud-alert.controller.js`, `fraud-alert-panel.directive.js` | No step-up auth for confirm/report actions | CWE-862 / A01 |
| 6 | MEDIUM | `dashboard.controller.js` | Silent fallback to random mock risk scores | CWE-390 / A09 |
| 7 | MEDIUM | `policy-decision.service.js` | Public threshold mutation; prototype pollution risk | CWE-284 / A01 |
| 8 | LOW | `alert-notification.service.js` | Client-side predictable alert ID generation | CWE-330 / A04 |
| 9 | LOW | `alert-notification.service.js` | Unbounded in-memory alert array | CWE-400 / A05 |
| 10 | LOW | `fraud-alert-panel.directive.js` | Polling without back-off or circuit-breaker | CWE-400 |
| 11 | LOW | `transaction-ingestion.service.js` | Unimplemented subscription stub | CWE-20 |
| 12 | INFO | `fraud-detection.module.js` | No CSP configuration | A05 |
| 13 | INFO | *(module config)* | No route-level authorization guards | A01 |
| 14 | INFO | *(framework)* | AngularJS EOL — no security patches since Dec 2021 | A06 |

---

## Final Decision

**Status: PASS_WITH_WARNINGS**

**Reason:** No hardcoded credentials, API keys, or secrets were detected in the codebase. No direct `eval()`, `$sce.trustAsHtml()`, `innerHTML`, or `$compile` with untrusted input was identified. No critical authentication bypass or exploitable critical-severity vulnerability was found in isolation.

However, **two High-severity findings** require remediation before production deployment:

1. **Card number transmitted in plaintext within the fraud-risk engine POST payload** without authentication headers (Finding #1) — violates PCI-DSS and PRD §22.
2. **Card number rendered in the directive template without a masking filter** (Finding #2) — violates PRD §22 and PCI-DSS display requirements.

Additionally, **five Medium-severity findings** collectively represent a significant security posture gap, particularly the absence of CSRF protection across all state-mutating endpoints and the lack of step-up authentication for fraud response actions — both explicitly required by the PRD.

**The code must NOT proceed to unit testing until Findings #1 and #2 (HIGH) are remediated. Findings #3–#7 (MEDIUM) should be addressed in the same sprint prior to integration testing.**

---

*Report generated by Senior Security & Compliance Engineer — AngularJS Specialist | CISSP | OSCP*
*Codebase: APB_Demo / branch: ccFraudAlert2408 | PRD Reference: Credit Card Fraud Alert System v1.0 (August 2026)*