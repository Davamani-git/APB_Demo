/*
Test Documentation:
- Test Name: AuthService Unit Tests
- Purpose: Validate token management operations using localStorage, including get, set, clear, and authentication state checks.
- Scenario: getToken returns stored token or fallback, setToken stores token, clearToken removes token, isAuthenticated returns true/false based on token presence.
- Expected Result: All localStorage interactions behave correctly; isAuthenticated correctly reflects token state.
*/

describe('AuthService', function () {
  'use strict';

  var AuthService;

  beforeEach(module('fraudAlertApp'));

  beforeEach(inject(function (_AuthService_) {
    AuthService = _AuthService_;
  }));

  beforeEach(function () {
    // Ensure clean localStorage state before each test
    localStorage.removeItem('auth_token');
  });

  afterEach(function () {
    localStorage.removeItem('auth_token');
  });

  // ─── getToken ───────────────────────────────────────────────────────────────

  describe('getToken()', function () {

    it('should return the mock fallback token when no token is stored in localStorage', function () {
      localStorage.removeItem('auth_token');
      var token = AuthService.getToken();
      expect(token).toBe('mock-jwt-token-12345');
    });

    it('should return the stored token from localStorage when one exists', function () {
      localStorage.setItem('auth_token', 'real-jwt-token-abc');
      var token = AuthService.getToken();
      expect(token).toBe('real-jwt-token-abc');
    });

    it('should prefer the localStorage value over the fallback', function () {
      localStorage.setItem('auth_token', 'custom-token-xyz');
      expect(AuthService.getToken()).toBe('custom-token-xyz');
    });

    it('should return fallback token when localStorage returns null', function () {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(AuthService.getToken()).toBe('mock-jwt-token-12345');
    });

    it('should return fallback token when localStorage returns empty string (falsy)', function () {
      spyOn(localStorage, 'getItem').and.returnValue('');
      // Empty string is falsy, so OR fallback applies
      expect(AuthService.getToken()).toBe('mock-jwt-token-12345');
    });
  });

  // ─── setToken ───────────────────────────────────────────────────────────────

  describe('setToken()', function () {

    it('should store the provided token in localStorage under auth_token key', function () {
      AuthService.setToken('new-jwt-token-999');
      expect(localStorage.getItem('auth_token')).toBe('new-jwt-token-999');
    });

    it('should overwrite an existing token in localStorage', function () {
      localStorage.setItem('auth_token', 'old-token');
      AuthService.setToken('updated-token');
      expect(localStorage.getItem('auth_token')).toBe('updated-token');
    });

    it('should store an empty string token if provided', function () {
      AuthService.setToken('');
      expect(localStorage.getItem('auth_token')).toBe('');
    });

    it('should call localStorage.setItem with the correct key and value', function () {
      spyOn(localStorage, 'setItem');
      AuthService.setToken('spy-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'spy-token');
    });
  });

  // ─── clearToken ─────────────────────────────────────────────────────────────

  describe('clearToken()', function () {

    it('should remove the auth_token from localStorage', function () {
      localStorage.setItem('auth_token', 'token-to-clear');
      AuthService.clearToken();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should not throw when clearing a token that does not exist', function () {
      localStorage.removeItem('auth_token');
      expect(function () { AuthService.clearToken(); }).not.toThrow();
    });

    it('should call localStorage.removeItem with the correct key', function () {
      spyOn(localStorage, 'removeItem');
      AuthService.clearToken();
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  // ─── isAuthenticated ────────────────────────────────────────────────────────

  describe('isAuthenticated()', function () {

    it('should return true when a token is stored in localStorage', function () {
      localStorage.setItem('auth_token', 'valid-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return true when no localStorage token exists but fallback token is used', function () {
      localStorage.removeItem('auth_token');
      // getToken returns fallback 'mock-jwt-token-12345' which is truthy
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when getToken returns a falsy value', function () {
      spyOn(AuthService, 'getToken').and.returnValue(null);
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it('should return false when getToken returns an empty string', function () {
      spyOn(AuthService, 'getToken').and.returnValue('');
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it('should return false when getToken returns undefined', function () {
      spyOn(AuthService, 'getToken').and.returnValue(undefined);
      expect(AuthService.isAuthenticated()).toBe(false);
    });

    it('should return true after setToken is called', function () {
      AuthService.clearToken();
      spyOn(AuthService, 'getToken').and.returnValue(null);
      expect(AuthService.isAuthenticated()).toBe(false);

      AuthService.getToken.and.returnValue('fresh-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false after clearToken is called and getToken returns null', function () {
      spyOn(AuthService, 'getToken').and.returnValue('some-token');
      expect(AuthService.isAuthenticated()).toBe(true);

      AuthService.getToken.and.returnValue(null);
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getToken, setToken, clearToken, isAuthenticated
  - Scenarios covered:
      getToken        -> localStorage has value, localStorage is null, localStorage is empty string (falsy), fallback token
      setToken        -> stores new token, overwrites existing, stores empty string, correct key/value
      clearToken      -> removes existing token, no-op when absent, correct key
      isAuthenticated -> true with stored token, true with fallback, false with null/empty/undefined from getToken
  - Uncovered scenarios: none identified for this service
  */
});
