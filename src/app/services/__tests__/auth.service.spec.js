/*
Test Documentation:
- Test Name: AuthService login success
- Purpose: Validates successful login stores token and user data
- Scenario: Valid credentials provided, server returns token and user
- Expected Result: Token and user data stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthService login failure
- Purpose: Validates login failure when no token returned
- Scenario: Server response missing token
- Expected Result: Error thrown with 'Invalid login response'
*/
/*
Test Documentation:
- Test Name: AuthService logout
- Purpose: Validates logout clears auth data
- Scenario: User logs out
- Expected Result: Token and user data removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthService getToken
- Purpose: Validates token retrieval from localStorage
- Scenario: Token exists in localStorage
- Expected Result: Token is returned
*/
/*
Test Documentation:
- Test Name: AuthService isAuthenticated
- Purpose: Validates authentication status check
- Scenario: Token exists or does not exist
- Expected Result: Returns true if token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService getUserRole
- Purpose: Validates user role retrieval
- Scenario: User data exists in localStorage
- Expected Result: User role is returned
*/
/*
Test Documentation:
- Test Name: AuthService getUserData
- Purpose: Validates user data retrieval
- Scenario: User data exists in localStorage
- Expected Result: Complete user object is returned
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, isAuthenticated, getUserRole, getUserData
- Scenarios covered: successful login, failed login, logout, token retrieval, authentication check, role retrieval with valid/invalid/missing data, user data retrieval with valid/invalid/missing data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, API_CONFIG;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_CONFIG_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      API_CONFIG = _API_CONFIG_;

      spyOn($window.localStorage, 'setItem');
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      spyOn($window.localStorage, 'removeItem');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('login', function() {
      it('should store token and user data on successful login', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var responseData = {
          token: 'test-token-123',
          user: { id: 1, username: 'testuser', role: 'consumer' }
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/auth/login', credentials)
          .respond(200, responseData);

        AuthService.login(credentials).then(function(data) {
          expect(data).toEqual(responseData);
        });

        $httpBackend.flush();

        expect($window.localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token-123');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify(responseData.user));
      });

      it('should throw error when response does not contain token', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var responseData = { user: { id: 1 } };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/auth/login', credentials)
          .respond(200, responseData);

        AuthService.login(credentials).catch(function(error) {
          expect(error.message).toBe('Invalid login response');
        });

        $httpBackend.flush();
      });

      it('should handle server error during login', function() {
        var credentials = { username: 'testuser', password: 'wrongpass' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/auth/login', credentials)
          .respond(401, { error: 'Unauthorized' });

        AuthService.login(credentials).catch(function(error) {
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();
      });
    });

    describe('logout', function() {
      it('should remove token and user data from localStorage', function() {
        AuthService.logout();

        expect($window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
        expect($window.localStorage.removeItem).toHaveBeenCalledWith('user_data');
      });
    });

    describe('getToken', function() {
      it('should return token from localStorage', function() {
        $window.localStorage.getItem.and.returnValue('stored-token');

        var token = AuthService.getToken();

        expect($window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
        expect(token).toBe('stored-token');
      });

      it('should return null when no token exists', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var token = AuthService.getToken();

        expect(token).toBeNull();
      });
    });

    describe('isAuthenticated', function() {
      it('should return true when token exists', function() {
        $window.localStorage.getItem.and.returnValue('valid-token');

        var isAuth = AuthService.isAuthenticated();

        expect(isAuth).toBe(true);
      });

      it('should return false when token does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var isAuth = AuthService.isAuthenticated();

        expect(isAuth).toBe(false);
      });
    });

    describe('getUserRole', function() {
      it('should return user role when valid user data exists', function() {
        var userData = { id: 1, username: 'testuser', role: 'admin' };
        $window.localStorage.getItem.and.returnValue(JSON.stringify(userData));

        var role = AuthService.getUserRole();

        expect(role).toBe('admin');
      });

      it('should return null when user data does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var role = AuthService.getUserRole();

        expect(role).toBeNull();
      });

      it('should return null when user data is invalid JSON', function() {
        $window.localStorage.getItem.and.returnValue('invalid-json');

        var role = AuthService.getUserRole();

        expect(role).toBeNull();
      });
    });

    describe('getUserData', function() {
      it('should return user data when valid data exists', function() {
        var userData = { id: 1, username: 'testuser', role: 'seller' };
        $window.localStorage.getItem.and.returnValue(JSON.stringify(userData));

        var data = AuthService.getUserData();

        expect(data).toEqual(userData);
      });

      it('should return null when user data does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var data = AuthService.getUserData();

        expect(data).toBeNull();
      });

      it('should return null when user data is invalid JSON', function() {
        $window.localStorage.getItem.and.returnValue('invalid-json');

        var data = AuthService.getUserData();

        expect(data).toBeNull();
      });
    });
  });
})();