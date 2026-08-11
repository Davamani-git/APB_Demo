/*
Test Documentation:
- Test Name: AuthService - getToken with existing token
- Purpose: Validates retrieval of stored authentication token
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored token
*/
/*
Test Documentation:
- Test Name: AuthService - getToken with no token
- Purpose: Validates default token when none is stored
- Scenario: No token in localStorage
- Expected Result: Returns default demo token
*/
/*
Test Documentation:
- Test Name: AuthService - setToken
- Purpose: Validates token storage in localStorage
- Scenario: Service stores a new token
- Expected Result: Token is saved to localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - removeToken
- Purpose: Validates token removal from localStorage
- Scenario: Service removes stored token
- Expected Result: Token is removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated with token
- Purpose: Validates authentication status when token exists
- Scenario: Token is present
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated without token
- Purpose: Validates authentication status when no token
- Scenario: No token is present
- Expected Result: Returns false
*/
/*
Coverage Report:
- Functions tested: getToken, setToken, removeToken, isAuthenticated
- Scenarios covered: token present/absent, storage operations
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $window;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_AuthService_, _$window_) {
      AuthService = _AuthService_;
      $window = _$window_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('getToken', function() {
      it('should return stored token when it exists', function() {
        $window.localStorage.setItem('auth_token', 'stored-token-123');
        
        var token = AuthService.getToken();
        
        expect(token).toBe('stored-token-123');
      });

      it('should return default demo token when no token is stored', function() {
        var token = AuthService.getToken();
        
        expect(token).toBe('demo-jwt-token');
      });
    });

    describe('setToken', function() {
      it('should store token in localStorage', function() {
        AuthService.setToken('new-token-456');
        
        var storedToken = $window.localStorage.getItem('auth_token');
        expect(storedToken).toBe('new-token-456');
      });

      it('should overwrite existing token', function() {
        $window.localStorage.setItem('auth_token', 'old-token');
        
        AuthService.setToken('new-token-789');
        
        var storedToken = $window.localStorage.getItem('auth_token');
        expect(storedToken).toBe('new-token-789');
      });
    });

    describe('removeToken', function() {
      it('should remove token from localStorage', function() {
        $window.localStorage.setItem('auth_token', 'token-to-remove');
        
        AuthService.removeToken();
        
        var storedToken = $window.localStorage.getItem('auth_token');
        expect(storedToken).toBeNull();
      });

      it('should not throw error when no token exists', function() {
        expect(function() {
          AuthService.removeToken();
        }).not.toThrow();
      });
    });

    describe('isAuthenticated', function() {
      it('should return true when token exists', function() {
        spyOn(AuthService, 'getToken').and.returnValue('valid-token');
        
        var result = AuthService.isAuthenticated();
        
        expect(result).toBe(true);
      });

      it('should return false when token is null', function() {
        spyOn(AuthService, 'getToken').and.returnValue(null);
        
        var result = AuthService.isAuthenticated();
        
        expect(result).toBe(false);
      });

      it('should return false when token is empty string', function() {
        spyOn(AuthService, 'getToken').and.returnValue('');
        
        var result = AuthService.isAuthenticated();
        
        expect(result).toBe(false);
      });
    });
  });
})();