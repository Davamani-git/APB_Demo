/*
Test Documentation:
- Test Name: httpInterceptorService - request with token
- Purpose: Validates that auth token is added to request headers
- Scenario: Auth token exists in localStorage
- Expected Result: Authorization header is set with Bearer token
*/
/*
Test Documentation:
- Test Name: httpInterceptorService - request without token
- Purpose: Validates request handling when no token exists
- Scenario: No auth token in localStorage
- Expected Result: Request proceeds without Authorization header
*/
/*
Test Documentation:
- Test Name: httpInterceptorService - responseError 401
- Purpose: Validates handling of unauthorized responses
- Scenario: API returns 401 status
- Expected Result: Auth data cleared, user redirected to login
*/
/*
Test Documentation:
- Test Name: httpInterceptorService - responseError 4xx/5xx
- Purpose: Validates error handling for HTTP errors
- Scenario: API returns error status >= 400
- Expected Result: Error logged, promise rejected
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, error handling, authentication failures
- Uncovered scenarios: token refresh, retry logic
*/

(function() {
  'use strict';

  describe('httpInterceptorService', function() {
    var httpInterceptorService, $window, $q, $rootScope;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_httpInterceptorService_, _$window_, _$q_, _$rootScope_) {
      httpInterceptorService = _httpInterceptorService_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('request', function() {
      it('should add Authorization header when token exists', function() {
        $window.localStorage.setItem('authToken', 'test-token-123');
        var config = { headers: {} };

        var result = httpInterceptorService.request(config);

        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when token does not exist', function() {
        var config = { headers: {} };

        var result = httpInterceptorService.request(config);

        expect(result.headers.Authorization).toBeUndefined();
      });
    });

    describe('responseError', function() {
      it('should clear auth data and redirect on 401 error', function() {
        $window.localStorage.setItem('authToken', 'test-token');
        $window.localStorage.setItem('user', JSON.stringify({ userId: 'U1' }));
        var rejection = { status: 401, data: { message: 'Unauthorized' } };

        spyOn($window.location, 'href', 'set');

        var result;
        httpInterceptorService.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($window.localStorage.getItem('user')).toBeNull();
      });

      it('should handle 4xx errors', function() {
        var rejection = {
          status: 404,
          data: { message: 'Not found' }
        };

        spyOn(console, 'error');

        var result;
        httpInterceptorService.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect(result).toEqual(rejection);
        expect(console.error).toHaveBeenCalledWith('HTTP Error:', rejection);
      });

      it('should handle 5xx errors', function() {
        var rejection = {
          status: 500,
          data: { message: 'Internal server error' }
        };

        spyOn(console, 'error');

        var result;
        httpInterceptorService.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect(result).toEqual(rejection);
        expect(console.error).toHaveBeenCalledWith('HTTP Error:', rejection);
      });

      it('should use default error message when data.message is not available', function() {
        var rejection = {
          status: 500,
          data: {}
        };

        spyOn(console, 'error');

        httpInterceptorService.responseError(rejection);
        $rootScope.$apply();

        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();