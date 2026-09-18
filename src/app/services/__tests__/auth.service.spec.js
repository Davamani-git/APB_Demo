/*
Test Documentation:

- Test Name: AuthService - getToken() should return cached token without HTTP call when token already set
- Purpose: Verify that getToken() returns the cached authToken immediately via $q.resolve without making a new HTTP request.
- Scenario: Normal - setToken() has been called prior to getToken().
- Expected Result: Promise resolves with the cached token; no HTTP call is made.

- Test Name: AuthService - getToken() should fetch token from API when no cached token exists
- Purpose: Verify that getToken() calls $http.get with the correct auth URL when authToken is null.
- Scenario: Normal - no token cached; API returns a valid token.
- Expected Result: $http.get is called with API_CONFIG.authUrl + '/token'; promise resolves with the token string.

- Test Name: AuthService - getToken() should cache the token returned by the API
- Purpose: Ensure that after a successful API call the token is cached so subsequent calls do not hit the API again.
- Scenario: Normal - first call fetches from API; second call should use cache.
- Expected Result: $http.get is called exactly once across two getToken() invocations.

- Test Name: AuthService - getToken() should reject when API call fails
- Purpose: Verify that getToken() propagates the rejection when $http.get fails.
- Scenario: Error - API returns a 401 Unauthorized response.
- Expected Result: The returned promise rejects with the error object.

- Test Name: AuthService - setToken() should store the provided token
- Purpose: Verify that setToken() correctly stores a token so that subsequent getToken() calls return it from cache.
- Scenario: Normal - a valid token string is passed to setToken().
- Expected Result: getToken() resolves with the token set by setToken() without making an HTTP call.

- Test Name: AuthService - setToken() should overwrite an existing cached token
- Purpose: Ensure that calling setToken() with a new value replaces the previously cached token.
- Scenario: Normal - setToken() called twice with different tokens.
- Expected Result: getToken() resolves with the most recently set token.

- Test Name: AuthService - clearToken() should remove the cached token
- Purpose: Verify that clearToken() nullifies the cached token so the next getToken() call hits the API.
- Scenario: Normal - token is set then cleared.
- Expected Result: After clearToken(), getToken() makes an HTTP GET request.

- Test Name: AuthService - clearToken() should be safe to call when no token is cached
- Purpose: Ensure clearToken() does not throw when called with no token in cache.
- Scenario: Edge - clearToken() called on a fresh service instance.
- Expected Result: No error is thrown; subsequent getToken() still hits the API.

- Test Name: AuthService - getToken() should handle empty string token from API
- Purpose: Verify behavior when the API returns an empty string as the token.
- Scenario: Edge - API responds with { token: '' }.
- Expected Result: Promise resolves with an empty string; empty string is cached.

- Test Name: AuthService - getToken() should handle missing token field in API response
- Purpose: Verify behavior when the API response body does not contain a token field.
- Scenario: Edge - API responds with {} (no token property).
- Expected Result: Promise resolves with undefined; authToken is set to undefined.

Coverage Report:
- Functions tested: getToken, setToken, clearToken
- Scenarios covered: cached token return, API fetch, token caching after fetch, API rejection propagation, setToken stores token, setToken overwrites, clearToken removes token, clearToken safe on empty, empty string token, missing token field
- Uncovered scenarios: concurrent getToken() race conditions, token expiry logic (not implemented in source)
*/

(function() {
  'use strict';

  describe('AuthService', function() {

    var AuthService;
    var $httpBackend;
    var $rootScope;
    var API_CONFIG;

    beforeEach(module('fraudDetectionApp'));

    beforeEach(module(function($provide) {
      API_CONFIG = { authUrl: '/api/auth', auditUrl: '/api/audit' };
      $provide.constant('API_CONFIG', API_CONFIG);
    }));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$rootScope_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      AuthService.clearToken();
    });

    // ─── getToken() ──────────────────────────────────────────────────────────

    describe('getToken()', function() {

      it('should return cached token without HTTP call when token already set', function() {
        AuthService.setToken('cached-token-abc');

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $rootScope.$digest();

        expect(result).toBe('cached-token-abc');
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should fetch token from API when no cached token exists', function() {
        var result;
        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'api-token-xyz' });

        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('api-token-xyz');
      });

      it('should cache the token returned by the API so second call skips HTTP', function() {
        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'cached-after-fetch' });

        AuthService.getToken();
        $httpBackend.flush();

        // Second call — no additional HTTP expectation registered
        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $rootScope.$digest();

        expect(result).toBe('cached-after-fetch');
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should reject when API call returns 401', function() {
        var caughtError;
        $httpBackend.expectGET('/api/auth/token').respond(401, { message: 'Unauthorized' });

        AuthService.getToken().catch(function(err) { caughtError = err; });
        $httpBackend.flush();

        expect(caughtError).toBeDefined();
        expect(caughtError.status).toBe(401);
      });

      it('should reject when API call returns 500', function() {
        var caughtError;
        $httpBackend.expectGET('/api/auth/token').respond(500, {});

        AuthService.getToken().catch(function(err) { caughtError = err; });
        $httpBackend.flush();

        expect(caughtError).toBeDefined();
        expect(caughtError.status).toBe(500);
      });

      it('should handle empty string token from API', function() {
        var result;
        $httpBackend.expectGET('/api/auth/token').respond(200, { token: '' });

        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('');
      });

      it('should handle missing token field in API response', function() {
        var result = 'not-set';
        $httpBackend.expectGET('/api/auth/token').respond(200, {});

        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBeUndefined();
      });

    });

    // ─── setToken() ──────────────────────────────────────────────────────────

    describe('setToken()', function() {

      it('should store the provided token so getToken() returns it from cache', function() {
        AuthService.setToken('my-secure-token');

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $rootScope.$digest();

        expect(result).toBe('my-secure-token');
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should overwrite an existing cached token', function() {
        AuthService.setToken('first-token');
        AuthService.setToken('second-token');

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $rootScope.$digest();

        expect(result).toBe('second-token');
      });

      it('should accept a null value to clear the token', function() {
        AuthService.setToken('some-token');
        AuthService.setToken(null);

        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'from-api' });

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('from-api');
      });

    });

    // ─── clearToken() ────────────────────────────────────────────────────────

    describe('clearToken()', function() {

      it('should remove the cached token so next getToken() hits the API', function() {
        AuthService.setToken('token-to-clear');
        AuthService.clearToken();

        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'fresh-token' });

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('fresh-token');
      });

      it('should be safe to call when no token is cached', function() {
        expect(function() {
          AuthService.clearToken();
        }).not.toThrow();

        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'safe-token' });

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('safe-token');
      });

      it('should allow re-fetching a new token after clearing', function() {
        AuthService.setToken('old-token');
        AuthService.clearToken();

        $httpBackend.expectGET('/api/auth/token').respond(200, { token: 'new-token' });

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $httpBackend.flush();

        expect(result).toBe('new-token');
      });

      it('should not affect a subsequently set token', function() {
        AuthService.setToken('token-a');
        AuthService.clearToken();
        AuthService.setToken('token-b');

        var result;
        AuthService.getToken().then(function(token) { result = token; });
        $rootScope.$digest();

        expect(result).toBe('token-b');
        $httpBackend.verifyNoOutstandingRequest();
      });

    });

  });

})();
