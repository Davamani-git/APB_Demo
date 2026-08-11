/*
Test Documentation:
- Test Name: AuthService login success
- Purpose: Validates successful login and token storage
- Scenario: When login credentials are valid
- Expected Result: Token is stored and user data is returned
*/
/*
Test Documentation:
- Test Name: AuthService login failure
- Purpose: Validates login failure handling
- Scenario: When login credentials are invalid
- Expected Result: Error is returned
*/
/*
Test Documentation:
- Test Name: AuthService logout
- Purpose: Validates logout removes token and redirects
- Scenario: When user logs out
- Expected Result: Token is removed from localStorage and user is redirected
*/
/*
Test Documentation:
- Test Name: AuthService getToken
- Purpose: Validates token retrieval from localStorage
- Scenario: When token exists in localStorage
- Expected Result: Token is returned
*/
/*
Test Documentation:
- Test Name: AuthService setToken
- Purpose: Validates token storage in localStorage
- Scenario: When setting a new token
- Expected Result: Token is stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthService isAuthenticated
- Purpose: Validates authentication status check
- Scenario: When checking if user is authenticated
- Expected Result: Returns true if token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService refreshToken success
- Purpose: Validates token refresh functionality
- Scenario: When refreshing a valid token
- Expected Result: New token is stored and returned
*/
/*
Test Documentation:
- Test Name: AuthService refreshToken without token
- Purpose: Validates refresh fails without existing token
- Scenario: When no token exists
- Expected Result: Promise is rejected
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, setToken, isAuthenticated, refreshToken
- Scenarios covered: successful login, failed login, logout, token operations, authentication check, token refresh with/without token
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, API_CONFIG;

    beforeEach(module('financeApp'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_CONFIG_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      API_CONFIG = _API_CONFIG_;

      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      spyOn($window.localStorage, 'setItem');
      spyOn($window.localStorage, 'removeItem');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('login', function() {
      it('should login successfully and store token', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var responseData = { token: 'test-token-123', user: { id: 1, username: 'testuser' } };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(200, responseData);

        AuthService.login(credentials).then(function(data) {
          expect(data.token).toBe('test-token-123');
          expect(data.user.username).toBe('testuser');
          expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token-123');
        });

        $httpBackend.flush();
      });

      it('should handle login failure', function() {
        var credentials = { username: 'testuser', password: 'wrongpass' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(401, { error: 'Invalid credentials' });

        AuthService.login(credentials).catch(function(error) {
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();
      });

      it('should not store token if not provided in response', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var responseData = { user: { id: 1, username: 'testuser' } };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(200, responseData);

        AuthService.login(credentials).then(function(data) {
          expect($window.localStorage.setItem).not.toHaveBeenCalled();
        });

        $httpBackend.flush();
      });
    });

    describe('logout', function() {
      it('should remove token and redirect to login', function() {
        AuthService.logout();

        expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
        expect($window.location.href).toBe('#/login');
      });
    });

    describe('getToken', function() {
      it('should retrieve token from localStorage', function() {
        $window.localStorage.getItem.and.returnValue('stored-token');

        var token = AuthService.getToken();

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(token).toBe('stored-token');
      });

      it('should return null when no token exists', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var token = AuthService.getToken();

        expect(token).toBeNull();
      });
    });

    describe('setToken', function() {
      it('should store token in localStorage', function() {
        AuthService.setToken('new-token-456');

        expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token-456');
      });
    });

    describe('isAuthenticated', function() {
      it('should return true when token exists', function() {
        $window.localStorage.getItem.and.returnValue('valid-token');

        var result = AuthService.isAuthenticated();

        expect(result).toBe(true);
      });

      it('should return false when token does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var result = AuthService.isAuthenticated();

        expect(result).toBe(false);
      });

      it('should return false when token is empty string', function() {
        $window.localStorage.getItem.and.returnValue('');

        var result = AuthService.isAuthenticated();

        expect(result).toBe(false);
      });
    });

    describe('refreshToken', function() {
      it('should refresh token successfully', function() {
        $window.localStorage.getItem.and.returnValue('old-token');
        var responseData = { token: 'new-refreshed-token' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/refresh', { token: 'old-token' })
          .respond(200, responseData);

        AuthService.refreshToken().then(function(data) {
          expect(data.token).toBe('new-refreshed-token');
          expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'new-refreshed-token');
        });

        $httpBackend.flush();
      });

      it('should reject when no token exists', function() {
        $window.localStorage.getItem.and.returnValue(null);

        AuthService.refreshToken().catch(function(error) {
          expect(error).toBe('No token');
        });
      });

      it('should not store token if not provided in refresh response', function() {
        $window.localStorage.getItem.and.returnValue('old-token');
        var responseData = { message: 'Token refreshed' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/refresh', { token: 'old-token' })
          .respond(200, responseData);

        AuthService.refreshToken().then(function(data) {
          expect($window.localStorage.setItem).not.toHaveBeenCalled();
        });

        $httpBackend.flush();
      });

      it('should handle refresh token failure', function() {
        $window.localStorage.getItem.and.returnValue('expired-token');

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/refresh', { token: 'expired-token' })
          .respond(401, { error: 'Token expired' });

        AuthService.refreshToken().catch(function(error) {
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();
      });
    });
  });
})();