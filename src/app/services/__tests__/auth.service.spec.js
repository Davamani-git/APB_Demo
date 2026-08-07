/*
Test Documentation:
- Test Name: authService - login success
- Purpose: Validates successful user authentication
- Scenario: Valid credentials are provided
- Expected Result: Auth token stored in localStorage, promise resolves
*/
/*
Test Documentation:
- Test Name: authService - login failure
- Purpose: Validates error handling for invalid credentials
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: authService - register user
- Purpose: Validates user registration functionality
- Scenario: Valid user data is provided
- Expected Result: Promise resolves with user data
*/
/*
Test Documentation:
- Test Name: authService - logout
- Purpose: Validates logout clears authentication data
- Scenario: User logs out
- Expected Result: Auth token and user data removed from localStorage
*/
/*
Test Documentation:
- Test Name: authService - getToken
- Purpose: Validates retrieval of stored auth token
- Scenario: Token exists in localStorage
- Expected Result: Returns stored token
*/
/*
Test Documentation:
- Test Name: authService - isAuthenticated
- Purpose: Validates authentication status check
- Scenario: Token exists or does not exist
- Expected Result: Returns true if authenticated, false otherwise
*/
/*
Test Documentation:
- Test Name: authService - getCurrentUser
- Purpose: Validates retrieval of current user data
- Scenario: User data exists in localStorage
- Expected Result: Returns parsed user object
*/
/*
Coverage Report:
- Functions tested: login, register, logout, getToken, isAuthenticated, getCurrentUser
- Scenarios covered: success flows, error handling, authentication checks
- Uncovered scenarios: token expiration, concurrent login attempts
*/

(function() {
  'use strict';

  describe('authService', function() {
    var authService, $httpBackend, $window, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_authService_, _$httpBackend_, _$window_, _apiConfig_) {
      authService = _authService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('login', function() {
      it('should successfully login and store auth token', function() {
        var credentials = { username: 'testuser', password: 'password123' };
        var mockResponse = {
          authToken: 'token123',
          userId: 'U123',
          username: 'testuser'
        };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/auth/login', credentials)
          .respond(200, mockResponse);

        var result;
        authService.login(credentials).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect($window.localStorage.getItem('authToken')).toBe('token123');
        expect($window.localStorage.getItem('user')).toBe(JSON.stringify(mockResponse));
      });

      it('should reject promise when login fails', function() {
        var credentials = { username: 'testuser', password: 'wrong' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/auth/login')
          .respond(401, { message: 'Invalid credentials' });

        var error;
        authService.login(credentials).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(401);
      });

      it('should reject when response does not contain authToken', function() {
        var credentials = { username: 'testuser', password: 'password123' };
        var mockResponse = { userId: 'U123' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/auth/login')
          .respond(200, mockResponse);

        var error;
        authService.login(credentials).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBe('Invalid response');
      });
    });

    describe('register', function() {
      it('should successfully register a new user', function() {
        var userData = {
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        };
        var mockResponse = { userId: 'U456', message: 'Registration successful' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/auth/register', userData)
          .respond(201, mockResponse);

        var result;
        authService.register(userData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should reject promise when registration fails', function() {
        var userData = { username: 'newuser' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/auth/register')
          .respond(400, { message: 'Invalid data' });

        var error;
        authService.register(userData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(400);
      });
    });

    describe('logout', function() {
      it('should clear auth token and user data from localStorage', function() {
        $window.localStorage.setItem('authToken', 'token123');
        $window.localStorage.setItem('user', JSON.stringify({ userId: 'U123' }));

        authService.logout();

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($window.localStorage.getItem('user')).toBeNull();
      });
    });

    describe('getToken', function() {
      it('should return stored auth token', function() {
        $window.localStorage.setItem('authToken', 'token123');

        var token = authService.getToken();

        expect(token).toBe('token123');
      });

      it('should return null when no token is stored', function() {
        var token = authService.getToken();

        expect(token).toBeNull();
      });
    });

    describe('isAuthenticated', function() {
      it('should return true when user is authenticated', function() {
        $window.localStorage.setItem('authToken', 'token123');

        var isAuth = authService.isAuthenticated();

        expect(isAuth).toBe(true);
      });

      it('should return false when user is not authenticated', function() {
        var isAuth = authService.isAuthenticated();

        expect(isAuth).toBe(false);
      });
    });

    describe('getCurrentUser', function() {
      it('should return parsed user object when user data exists', function() {
        var userData = { userId: 'U123', username: 'testuser' };
        $window.localStorage.setItem('user', JSON.stringify(userData));

        var user = authService.getCurrentUser();

        expect(user).toEqual(userData);
      });

      it('should return null when no user data exists', function() {
        var user = authService.getCurrentUser();

        expect(user).toBeNull();
      });
    });
  });
})();