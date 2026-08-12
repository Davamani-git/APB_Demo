# Security Scan Report

**Repository:** APB_Demo

**Branch:** DAVCODESECURITY02

**Scan Date:** 2025-06-12

## Security Gate Decision

**Status:** PASS_WITH_WARNINGS

| Severity | Count |
|----------|-------|
| Critical | 0     |
| High     | 0     |
| Medium   | 3     |
| Low      | 2     |
| Info     | 1     |

## Findings

### 1. [MEDIUM] Sensitive Authentication Token Stored in localStorage — CWE-922

- **File:** `src/app/app.module.js`
- **Line:** 22 (`var token = $window.localStorage.getItem('authToken');`)
- **Vulnerable Code:**
  ```javascript
  var token = $window.localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  ```
- **Issue:** The bearer/authentication token is read from `localStorage`. Data in `localStorage` is persistent, accessible to any JavaScript running in the origin, and is a prime exfiltration target for any XSS vector.
- **Impact:** If an XSS flaw is ever introduced, the attacker can steal the `authToken` and fully impersonate the user (session hijacking). `localStorage` also lacks the `HttpOnly`, `Secure`, and `SameSite` protections offered by cookies.
- **Recommendation:** Store session tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies managed server-side, or in short-lived in-memory storage. Avoid persisting long-lived tokens in `localStorage`.

---

### 2. [MEDIUM] Bearer Token Attached to All Requests Without Endpoint Scoping — CWE-200 / CWE-522

- **File:** `src/app/app.module.js`
- **Line:** 20–27 (request interceptor)
- **Vulnerable Code:**
  ```javascript
  request: function(config) {
    var token = $window.localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
  ```
- **Issue:** The interceptor appends the `Authorization: Bearer` header to **every** outbound `$http` request regardless of destination host. If any request is ever issued to a third-party/absolute URL, the token would leak to that host. There is no same-origin/allow-list check.
- **Impact:** Potential credential/token leakage to unintended (cross-origin) endpoints, enabling token theft and account takeover.
- **Recommendation:** Restrict the token to same-origin/whitelisted API hosts only (e.g., check `config.url` starts with the known API base or is relative before attaching the header). Combine with the cookie-based fix above.

---

### 3. [MEDIUM] Open Redirect on 401 Response Handling — CWE-601

- **File:** `src/app/app.module.js`
- **Line:** 30–33 (responseError handler)
- **Vulnerable Code:**
  ```javascript
  responseError: function(rejection) {
    if (rejection.status === 401) {
      $window.location.href = '/login';
    }
    return $q.reject(rejection);
  }
  ```
- **Issue:** While the current redirect target `'/login'` is a hardcoded relative path (safe as written), the pattern of driving navigation from a response handler without validating any server-supplied redirect field is fragile. No `return-url` sanitization exists should this be extended. Currently low exploitability but flagged for defensive hardening.
- **Impact:** If future changes source the redirect target from response data or query params, an attacker could craft an open-redirect phishing chain. As written the risk is limited.
- **Recommendation:** Keep the redirect target as a fixed constant and never derive navigation targets from untrusted response/query data without an allow-list validation.

---

### 4. [LOW] Unencoded Card Identifier Concatenated into API URL — CWE-20

- **File:** `src/app/services/transaction.factory.js` / `src/app/services/credit-card-data.factory.js`
- **Line:** `transaction.factory.js` ~24 (`apiBase + '?cardId=' + cardId`) and `credit-card-data.factory.js` ~21 (`apiBase + '/' + cardId`)
- **Vulnerable Code:**
  ```javascript
  return $http.get(apiBase + '?cardId=' + cardId)
  ...
  return $http.get(apiBase + '/' + cardId)
  ```
- **Issue:** `cardId` is concatenated directly into the request URL without `encodeURIComponent()`. Values containing reserved characters could alter the query/path structure (parameter pollution). Note: authorization for the referenced object is performed server-side and cannot be verified from client code — potential IDOR/BOLA depends on backend enforcement.
- **Impact:** URL/parameter manipulation and malformed requests. IDOR risk cannot be confirmed or ruled out from the supplied client code alone.
- **Recommendation:** Use `encodeURIComponent(cardId)` or pass parameters via the `$http` `params` option. Ensure the backend enforces object-level authorization for `cardId`.

---

### 5. [LOW] Client-Side Card Masking Only — Full PAN May Be Exposed by API — CWE-311

- **File:** `src/app/modules/dashboard/controllers/dashboard.controller.js`
- **Line:** 29–32 (`vm.maskCardNumber`)
- **Vulnerable Code:**
  ```javascript
  vm.maskCardNumber = function(cardNumber) {
    if (!cardNumber || cardNumber.length < 4) return '****';
    return '**** **** **** ' + cardNumber.slice(-4);
  };
  ```
- **Issue:** Masking is performed only in the browser, implying the full card number (`card.cardNumber`) is transmitted from the API and held in client memory/network responses. This is a PCI-DSS concern (sensitive PAN handling).
- **Impact:** Full PAN present in client-side memory and network payloads increases exposure surface; masking at the presentation layer does not protect data in transit or in browser memory.
- **Recommendation:** Have the backend return already-masked/tokenized PANs so the full card number never reaches the client. Retain client masking only as a display convenience.

---

### 6. [INFO] No Dependency Manifest Provided for Vulnerability Assessment

- **File:** N/A (no `package.json` / `bower.json` in supplied `src` folder)
- **Line:** N/A
- **Issue:** The scan scope (`src`) did not include dependency manifests, so `ngRoute`, `ui.bootstrap`, and AngularJS (1.x) versions could not be verified. AngularJS 1.x is End-of-Life and receives no security patches.
- **Impact:** Unknown/EOL framework versions may contain unpatched vulnerabilities.
- **Recommendation:** Provide `package.json`/`bower.json` and pin/verify dependency versions. Plan migration away from EOL AngularJS 1.x.

---

## Positive Observations

- No hardcoded passwords, API keys, tokens, or secrets detected in the supplied code.
- No use of `ng-bind-html`, `$sce.trustAsHtml`, `innerHTML`, `.html()`, `$compile`, `$eval`, `$parse`, or `eval()` — data is rendered via safe AngularJS `{{ }}` bindings, which are auto-escaped (no direct XSS detected).
- All API calls use relative endpoints (`/api/...`), avoiding hardcoded insecure `http://` URLs.
- No sensitive data written to logs (`console.log`) in the supplied code.

---

## Final Decision

**Reason:** No CRITICAL findings, exposed credentials, authentication bypass, or exploitable HIGH-risk issues were detected. The identified issues are non-blocking MEDIUM/LOW hardening concerns — token storage in `localStorage`, unscoped bearer-token attachment, defensive redirect handling, unencoded URL parameters, and client-only PAN masking. Object-level authorization (IDOR/BOLA) is enforced server-side and cannot be fully validated from client code. The code is **PASS_WITH_WARNINGS** and may proceed to unit testing, provided the MEDIUM findings (token storage and token scoping) are tracked for remediation before production release. A complete dependency manifest is recommended to finalize the third-party vulnerability assessment.