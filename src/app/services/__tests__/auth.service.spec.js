/*
Test Documentation:
- Test Name: authService - login success
- Purpose: Validates successful user login
- Scenario: Login with valid credentials
- Expected Result: Should store token and user, broadcast login event

Test Documentation:
- Test Name: authService - login failure
- Purpose: Validates login error handling
- Scenario: Login with invalid credentials
- Expected Result: Should reject promise with error

Test Documentation:
- Test Name: authService - logout
- Purpose: Validates user logout
- Scenario: Logout current user
- Expected Result: Should clear token and user, broadcast logout event

Test Documentation:
- Test Name: authService - getToken
- Purpose: Validates token retrieval
- Scenario: Get stored authentication token
- Expected Result: Should return stored token

Test Documentation:
- Test Name: authService - getCurrentUser
- Purpose: Validates current user retrieval
- Scenario: Get current logged-in user
- Expected Result: Should return user object

Test Documentation:
- Test Name: authService - isAuthenticated
- Purpose: Validates authentication status check
- Scenario: Check if user is authenticated
- Expected Result: Should return true if token exists

Test Documentation:
- Test Name: authService - ssoLogin
- Purpose: Validates SSO login redirect
- Scenario: Initiate SSO login
- Expected Result: Should redirect to SSO endpoint

Test Documentation:
- Test Name: authService - handleSSOCallback
- Purpose: Validates SSO callback handling
- Scenario: Handle SSO callback with token and user
- Expected Result: Should store credentials and broadcast login

Test Documentation:
- Test Name: authService - recoverAccess
- Purpose: Validates password recovery
- Scenario: Request password recovery
- Expected Result: Should send recovery request

Coverage Report:
- Functions tested: login, logout, getToken, getCurrentUser, isAuthenticated, ssoLogin, handleSSOCallback, recoverAccess
- Scenarios covered: successful login, failed login, logout, token management, SSO flow, password recovery
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('authService', function() {
    var authService, $httpBackend, $window, $rootScope;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_authService_, _$httpBackend_, _$window_, _$rootScope_) {
      authService = _authService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $rootScope = _$rootScope_;
      $window.sessionStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.sessionStorage.clear();
    });

    describe('login', function() {
      it('should login successfully and store credentials', function() {
        var credentials = {username: 'testuser', password: 'password123'};
        var mockResponse = {
          token: 'jwt-token-123',
          user: {id: 'user123', username: 'testuser', role: 'GP'}
        };
        spyOn($rootScope, '$broadcast');
        $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, mockResponse);
        var result;
        authService.login(credentials).then(function(user) {
          result = user;
        });
        $httpBackend.flush();
        expect(result.id).toBe('user123');
        expect($window.sessionStorage.getItem('jwt_token')).toBe('jwt-token-123');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('auth:login', mockResponse.user);
      });

      it('should reject on invalid response', function() {
        var credentials = {username: 'testuser', password: 'wrong'};
        $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, {});
        var error;
        authService.login(credentials).catch(function(err) {
          error = err;
        });
        $httpBackend.flush();
        expect(error).toBe('Invalid response');
      });

      it('should handle login error', function() {
        var credentials = {username: 'testuser', password: 'wrong'};
        $httpBackend.expectPOST('/api/auth/login', credentials).respond(401, 'Unauthorized');
        var errorCaught = false;
        authService.login(credentials).catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('logout', function() {
      it('should clear credentials and broadcast logout', function() {
        $window.sessionStorage.setItem('jwt_token', 'token123');
        $window.sessionStorage.setItem('current_user', JSON.stringify({id: 'user123'}));
        spyOn($rootScope, '$broadcast');
        authService.logout();
        expect($window.sessionStorage.getItem('jwt_token')).toBeNull();
        expect($window.sessionStorage.getItem('current_user')).toBeNull();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('auth:logout');
      });
    });

    describe('getToken', function() {
      it('should return stored token', function() {
        $window.sessionStorage.setItem('jwt_token', 'token123');
        expect(authService.getToken()).toBe('token123');
      });

      it('should return null if no token', function() {
        expect(authService.getToken()).toBeNull();
      });
    });

    describe('getCurrentUser', function() {
      it('should return current user object', function() {
        var user = {id: 'user123', username: 'testuser'};
        $window.sessionStorage.setItem('current_user', JSON.stringify(user));
        var result = authService.getCurrentUser();
        expect(result.id).toBe('user123');
      });

      it('should return null if no user', function() {
        expect(authService.getCurrentUser()).toBeNull();
      });
    });

    describe('isAuthenticated', function() {
      it('should return true if token exists', function() {
        $window.sessionStorage.setItem('jwt_token', 'token123');
        expect(authService.isAuthenticated()).toBe(true);
      });

      it('should return false if no token', function() {
        expect(authService.isAuthenticated()).toBe(false);
      });
    });

    describe('ssoLogin', function() {
      it('should redirect to SSO endpoint', function() {
        authService.ssoLogin();
        expect($window.location.href).toBe('/api/auth/sso/redirect');
      });
    });

    describe('handleSSOCallback', function() {
      it('should store SSO credentials and broadcast login', function() {
        var token = 'sso-token-123';
        var user = {id: 'user123', username: 'ssouser'};
        spyOn($rootScope, '$broadcast');
        authService.handleSSOCallback(token, user);
        expect($window.sessionStorage.getItem('jwt_token')).toBe(token);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('auth:login', user);
      });
    });

    describe('recoverAccess', function() {
      it('should send password recovery request', function() {
        var email = 'user@example.com';
        $httpBackend.expectPOST('/api/auth/recover', {email: email}).respond(200, {success: true});
        authService.recoverAccess(email);
        $httpBackend.flush();
      });
    });
  });
})();