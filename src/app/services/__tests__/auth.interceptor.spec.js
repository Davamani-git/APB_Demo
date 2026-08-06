/*
Test Documentation:
- Test Name: AuthInterceptor request method adds token to headers
- Purpose: Validates that the interceptor adds Authorization header when token exists
- Scenario: Token exists in localStorage
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: AuthInterceptor request method without token
- Purpose: Validates that the interceptor does not add Authorization header when token is missing
- Scenario: No token in localStorage
- Expected Result: Request config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles 401
- Purpose: Validates that 401 errors clear auth data and redirect to login
- Scenario: Response with 401 status
- Expected Result: Token and user data removed, redirected to /login
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles 403
- Purpose: Validates that 403 errors show access denied alert
- Scenario: Response with 403 status
- Expected Result: Alert is displayed with access denied message
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token present, token absent, 401 error, 403 error, other errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor, $q, $location, $window, $rootScope;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_AuthInterceptor_, _$q_, _$location_, _$window_, _$rootScope_) {
      AuthInterceptor = _AuthInterceptor_;
      $q = _$q_;
      $location = _$location_;
      $window = _$window_;
      $rootScope = _$rootScope_;

      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      spyOn($window.localStorage, 'removeItem');
      spyOn($location, 'path');
      spyOn(window, 'alert');
    }));

    describe('request', function() {
      it('should add Authorization header when token exists', function() {
        $window.localStorage.getItem.and.returnValue('test-token-123');
        var config = { headers: {} };
        
        var result = AuthInterceptor.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should create headers object if not present and add token', function() {
        $window.localStorage.getItem.and.returnValue('test-token-456');
        var config = {};
        
        var result = AuthInterceptor.request(config);
        
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-456');
      });

      it('should not add Authorization header when token does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);
        var config = { headers: {} };
        
        var result = AuthInterceptor.request(config);
        
        expect(result.headers.Authorization).toBeUndefined();
      });
    });

    describe('responseError', function() {
      it('should handle 401 error by clearing auth data and redirecting to login', function() {
        var rejection = { status: 401 };
        
        AuthInterceptor.responseError(rejection);
        
        expect($window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
        expect($window.localStorage.removeItem).toHaveBeenCalledWith('user_data');
        expect($location.path).toHaveBeenCalledWith('/login');
      });

      it('should handle 403 error by showing access denied alert', function() {
        var rejection = { status: 403 };
        
        AuthInterceptor.responseError(rejection);
        
        expect(window.alert).toHaveBeenCalledWith('Access Denied: You do not have permission to perform this action.');
      });

      it('should reject the promise for any error', function() {
        var rejection = { status: 500 };
        
        var result = AuthInterceptor.responseError(rejection);
        
        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(rejection);
        });
        $rootScope.$apply();
      });

      it('should not redirect for non-401 errors', function() {
        var rejection = { status: 500 };
        
        AuthInterceptor.responseError(rejection);
        
        expect($location.path).not.toHaveBeenCalled();
        expect($window.localStorage.removeItem).not.toHaveBeenCalled();
      });
    });
  });
})();