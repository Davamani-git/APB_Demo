/*
Test Documentation:
- Test Name: AuthService login success
- Purpose: Validates successful login stores token and user data
- Scenario: Valid credentials provided, API returns token and user
- Expected Result: Token and user are stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthService login failure
- Purpose: Validates login failure when invalid response
- Scenario: API returns response without token
- Expected Result: Error is thrown
*/
/*
Test Documentation:
- Test Name: AuthService logout
- Purpose: Validates logout removes token and user from storage
- Scenario: User is logged in and calls logout
- Expected Result: Token and user are removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthService getToken
- Purpose: Validates retrieval of stored token
- Scenario: Token exists in localStorage
- Expected Result: Token is returned
*/
/*
Test Documentation:
- Test Name: AuthService getUser
- Purpose: Validates retrieval and parsing of user data
- Scenario: User data exists in localStorage
- Expected Result: User object is returned
*/
/*
Test Documentation:
- Test Name: AuthService isAuthenticated
- Purpose: Validates authentication status check
- Scenario: Token exists/does not exist
- Expected Result: Returns true/false based on token presence
*/
/*
Test Documentation:
- Test Name: AuthService autoLogin
- Purpose: Validates automatic login for demo purposes
- Scenario: No existing authentication
- Expected Result: Demo token and user are created
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, getUser, isAuthenticated, autoLogin
- Scenarios covered: successful login, failed login, logout, token retrieval, user retrieval, authentication check, auto-login
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var AuthService, $httpBackend, $window;
  var API_BASE = 'https://api.shopping.com';
  
  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.clear();
  });
  
  describe('login', function() {
    it('should store token and user on successful login', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var response = {
        token: 'test-token-xyz',
        user: { userId: 'u1', email: 'test@example.com', name: 'Test User' }
      };
      
      $httpBackend.expectPOST(API_BASE + '/api/auth/login', credentials).respond(200, response);
      
      AuthService.login(credentials).then(function(data) {
        expect(data.token).toBe('test-token-xyz');
        expect(data.user.userId).toBe('u1');
        expect($window.localStorage.getItem('authToken')).toBe('test-token-xyz');
        expect($window.localStorage.getItem('user')).toBe(JSON.stringify(response.user));
      });
      
      $httpBackend.flush();
    });
    
    it('should throw error when response is invalid', function() {
      var credentials = { username: 'testuser', password: 'password123' };
      var response = { message: 'Login failed' };
      
      $httpBackend.expectPOST(API_BASE + '/api/auth/login', credentials).respond(200, response);
      
      AuthService.login(credentials).catch(function(error) {
        expect(error.message).toBe('Invalid response');
      });
      
      $httpBackend.flush();
    });
    
    it('should handle HTTP errors', function() {
      var credentials = { username: 'testuser', password: 'wrongpass' };
      
      $httpBackend.expectPOST(API_BASE + '/api/auth/login', credentials).respond(401, { error: 'Unauthorized' });
      
      AuthService.login(credentials).catch(function(error) {
        expect(error.status).toBe(401);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('logout', function() {
    it('should remove token and user from localStorage', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      $window.localStorage.setItem('user', JSON.stringify({ userId: 'u1' }));
      
      AuthService.logout();
      
      expect($window.localStorage.getItem('authToken')).toBeNull();
      expect($window.localStorage.getItem('user')).toBeNull();
    });
  });
  
  describe('getToken', function() {
    it('should return token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'my-token');
      expect(AuthService.getToken()).toBe('my-token');
    });
    
    it('should return null when no token exists', function() {
      expect(AuthService.getToken()).toBeNull();
    });
  });
  
  describe('getUser', function() {
    it('should return parsed user object from localStorage', function() {
      var user = { userId: 'u1', email: 'test@example.com' };
      $window.localStorage.setItem('user', JSON.stringify(user));
      
      var result = AuthService.getUser();
      expect(result.userId).toBe('u1');
      expect(result.email).toBe('test@example.com');
    });
    
    it('should return null when no user exists', function() {
      expect(AuthService.getUser()).toBeNull();
    });
  });
  
  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.localStorage.setItem('authToken', 'test-token');
      expect(AuthService.isAuthenticated()).toBe(true);
    });
    
    it('should return false when no token exists', function() {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
  
  describe('autoLogin', function() {
    it('should create demo credentials when not authenticated', function() {
      expect(AuthService.isAuthenticated()).toBe(false);
      
      AuthService.autoLogin();
      
      expect(AuthService.isAuthenticated()).toBe(true);
      var token = AuthService.getToken();
      expect(token).toContain('demo-token-');
      
      var user = AuthService.getUser();
      expect(user.userId).toBe('demo-user');
      expect(user.email).toBe('demo@example.com');
      expect(user.name).toBe('Demo User');
    });
    
    it('should not create new credentials when already authenticated', function() {
      $window.localStorage.setItem('authToken', 'existing-token');
      $window.localStorage.setItem('user', JSON.stringify({ userId: 'existing-user' }));
      
      AuthService.autoLogin();
      
      expect(AuthService.getToken()).toBe('existing-token');
      expect(AuthService.getUser().userId).toBe('existing-user');
    });
  });
});