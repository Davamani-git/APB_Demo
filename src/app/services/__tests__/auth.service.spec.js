/*
Test Documentation:

- Test Name: authService - getToken - returns stored token
  Purpose: Verify that getToken retrieves the token from localStorage when one is present.
  Scenario: localStorage.getItem returns a stored token string.
  Expected Result: getToken returns the stored token value.

- Test Name: authService - getToken - returns fallback demo token when localStorage is empty
  Purpose: Verify that getToken falls back to 'demo-token-12345' when localStorage returns null.
  Scenario: localStorage.getItem returns null (no token stored).
  Expected Result: getToken returns 'demo-token-12345'.

- Test Name: authService - setToken - stores token in localStorage
  Purpose: Verify that setToken calls localStorage.setItem with the correct key and value.
  Scenario: setToken is called with a valid token string.
  Expected Result: localStorage.setItem is called with ('authToken', <token>).

- Test Name: authService - setToken - stores an empty string token
  Purpose: Verify that setToken does not guard against empty strings and stores them as-is.
  Scenario: setToken is called with an empty string.
  Expected Result: localStorage.setItem is called with ('authToken', '').

- Test Name: authService - clearToken - removes token from localStorage
  Purpose: Verify that clearToken calls localStorage.removeItem with the correct key.
  Scenario: clearToken is called.
  Expected Result: localStorage.removeItem is called with 'authToken'.

- Test Name: authService - isAuthenticated - returns true when token exists
  Purpose: Verify that isAuthenticated returns true when getToken returns a non-empty string.
  Scenario: localStorage.getItem returns a valid token.
  Expected Result: isAuthenticated returns true.

- Test Name: authService - isAuthenticated - returns true when fallback demo token is used
  Purpose: Verify that isAuthenticated returns true even when localStorage is empty, because getToken falls back to the demo token.
  Scenario: localStorage.getItem returns null.
  Expected Result: isAuthenticated returns true (fallback token is truthy).

- Test Name: authService - isAuthenticated - returns false when token is explicitly empty string
  Purpose: Verify that isAuthenticated returns false when the stored token is an empty string (falsy).
  Scenario: localStorage.getItem returns '' and fallback is not applied (empty string is falsy but OR returns fallback).
  Note: Because of the OR operator ('demo-token-12345'), isAuthenticated will always be true unless getToken is overridden.
  Expected Result: isAuthenticated returns true (due to fallback).

- Test Name: authService - token lifecycle - set then get
  Purpose: Verify the full token lifecycle: set a token, then retrieve it.
  Scenario: setToken is called, then getToken is called.
  Expected Result: getToken returns the same token that was set.

- Test Name: authService - token lifecycle - set then clear then get returns fallback
  Purpose: Verify that after clearing, getToken returns the fallback demo token.
  Scenario: setToken is called, clearToken is called, then getToken is called.
  Expected Result: getToken returns 'demo-token-12345'.

Coverage Report:
- Functions tested: getToken, setToken, clearToken, isAuthenticated
- Scenarios covered: token present, token absent (null), fallback token, empty string token, full lifecycle (set/get/clear), authentication state
- Uncovered scenarios: concurrent access to localStorage (outside unit test scope), browser environments without localStorage support
*/

describe('authService', function () {

  var authService, $window;
  var localStorageStore;

  beforeEach(module('fraudDetectionModule'));

  beforeEach(inject(function (_authService_, _$window_) {
    authService = _authService_;
    $window = _$window_;

    // Reset in-memory store for each test
    localStorageStore = {};

    spyOn($window.localStorage, 'getItem').and.callFake(function (key) {
      return localStorageStore.hasOwnProperty(key) ? localStorageStore[key] : null;
    });

    spyOn($window.localStorage, 'setItem').and.callFake(function (key, value) {
      localStorageStore[key] = value;
    });

    spyOn($window.localStorage, 'removeItem').and.callFake(function (key) {
      delete localStorageStore[key];
    });
  }));

  // ─── getToken ─────────────────────────────────────────────────────────────

  describe('getToken', function () {

    it('should return the token stored in localStorage when one exists', function () {
      localStorageStore['authToken'] = 'secure-jwt-token-abc123';

      var token = authService.getToken();

      expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
      expect(token).toBe('secure-jwt-token-abc123');
    });

    it('should return the fallback demo token when localStorage returns null', function () {
      // localStorageStore is empty, getItem returns null
      var token = authService.getToken();

      expect(token).toBe('demo-token-12345');
    });

    it('should call localStorage.getItem with the key "authToken"', function () {
      authService.getToken();

      expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should return fallback token when localStorage returns undefined (coerced to null)', function () {
      $window.localStorage.getItem.and.returnValue(undefined);

      var token = authService.getToken();

      // undefined is falsy, so OR operator returns fallback
      expect(token).toBe('demo-token-12345');
    });

  });

  // ─── setToken ─────────────────────────────────────────────────────────────

  describe('setToken', function () {

    it('should call localStorage.setItem with key "authToken" and the provided token', function () {
      authService.setToken('new-fraud-detection-token-xyz');

      expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'new-fraud-detection-token-xyz');
    });

    it('should store an empty string token without throwing', function () {
      expect(function () {
        authService.setToken('');
      }).not.toThrow();

      expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', '');
    });

    it('should overwrite an existing token when setToken is called again', function () {
      authService.setToken('first-token');
      authService.setToken('second-token');

      expect($window.localStorage.setItem).toHaveBeenCalledTimes(2);
      expect($window.localStorage.setItem.calls.mostRecent().args).toEqual(['authToken', 'second-token']);
    });

    it('should store a token that contains special characters', function () {
      var specialToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';
      authService.setToken(specialToken);

      expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', specialToken);
    });

  });

  // ─── clearToken ───────────────────────────────────────────────────────────

  describe('clearToken', function () {

    it('should call localStorage.removeItem with key "authToken"', function () {
      authService.clearToken();

      expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });

    it('should not throw when clearToken is called and no token exists', function () {
      expect(function () {
        authService.clearToken();
      }).not.toThrow();
    });

    it('should call removeItem exactly once per clearToken invocation', function () {
      authService.clearToken();

      expect($window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    });

  });

  // ─── isAuthenticated ──────────────────────────────────────────────────────

  describe('isAuthenticated', function () {

    it('should return true when a valid token is stored in localStorage', function () {
      localStorageStore['authToken'] = 'valid-session-token';

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return true when localStorage is empty because the fallback demo token is used', function () {
      // No token in store; getToken returns 'demo-token-12345' which is truthy
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return a boolean value (not just a truthy/falsy value)', function () {
      localStorageStore['authToken'] = 'some-token';

      var result = authService.isAuthenticated();

      expect(typeof result).toBe('boolean');
    });

    it('should return true after setToken is called with a valid token', function () {
      authService.setToken('freshly-issued-token');
      // Simulate that getItem now returns the stored value
      localStorageStore['authToken'] = 'freshly-issued-token';

      expect(authService.isAuthenticated()).toBe(true);
    });

  });

  // ─── Token Lifecycle Integration ──────────────────────────────────────────

  describe('token lifecycle', function () {

    it('should return the correct token after set then get', function () {
      authService.setToken('lifecycle-token-001');
      localStorageStore['authToken'] = 'lifecycle-token-001';

      var token = authService.getToken();

      expect(token).toBe('lifecycle-token-001');
    });

    it('should return the fallback demo token after set then clear then get', function () {
      authService.setToken('temporary-token');
      authService.clearToken();
      // After clear, localStorageStore no longer has 'authToken'

      var token = authService.getToken();

      expect(token).toBe('demo-token-12345');
    });

    it('should remain authenticated after setting a new token', function () {
      authService.setToken('fraud-ops-token-999');
      localStorageStore['authToken'] = 'fraud-ops-token-999';

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should still be authenticated after clearToken due to fallback token', function () {
      authService.setToken('temp');
      authService.clearToken();

      // Because getToken falls back to 'demo-token-12345', isAuthenticated is still true
      expect(authService.isAuthenticated()).toBe(true);
    });

  });

});
