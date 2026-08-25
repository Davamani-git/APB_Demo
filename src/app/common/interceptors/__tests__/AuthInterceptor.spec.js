/*
Test Documentation:
- Test Name: AuthInterceptor - request adds Authorization header when token exists
- Purpose: Validate that the HTTP request interceptor attaches a Bearer JWT token to outgoing requests.
- Scenario: localStorage contains a valid jwtToken.
- Expected Result: config.headers.Authorization is set to 'Bearer <token>'.

- Test Name: AuthInterceptor - request does not add Authorization header when token is absent
- Purpose: Ensure no Authorization header is added when no token is stored.
- Scenario: localStorage returns null for jwtToken.
- Expected Result: config.headers.Authorization remains undefined.

- Test Name: AuthInterceptor - responseError handles 401 status
- Purpose: Validate that a 401 rejection is logged and the promise is rejected.
- Scenario: HTTP response returns status 401.
- Expected Result: $q.reject is called with the rejection object.

- Test Name: AuthInterceptor - responseError handles 500 status
- Purpose: Validate that a 500 server error rejection is handled.
- Scenario: HTTP response returns status 500.
- Expected Result: $q.reject is called with the rejection object.

- Test Name: AuthInterceptor - responseError handles status 0 (network error)
- Purpose: Validate that a network error (status 0) is handled.
- Scenario: HTTP response returns status 0.
- Expected Result: $q.reject is called with the rejection object.

Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token present, token absent, 401 error, 500 error, network error (0)
- Uncovered scenarios: non-standard HTTP error codes
*/

describe('AuthInterceptor', function() {
  'use strict';

  var AuthInterceptor, $q, $window, $rootScope;

  beforeEach(module('creditCardDashboardModule'));

  beforeEach(inject(function(_AuthInterceptor_, _$q_, _$window_, _$rootScope_) {
    AuthInterceptor = _AuthInterceptor_;
    $q = _$q_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));

  describe('request()', function() {

    it('should add Authorization header when JWT token exists in localStorage', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue('test-jwt-token');
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect($window.localStorage.getItem).toHaveBeenCalledWith('jwtToken');
      expect(result.headers.Authorization).toBe('Bearer test-jwt-token');
    });

    it('should initialize headers object if not present and add Authorization header', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue('another-token');
      var config = {};
      var result = AuthInterceptor.request(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer another-token');
    });

    it('should NOT add Authorization header when JWT token is absent from localStorage', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should return the config object unchanged when no token is present', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var config = { headers: { 'Content-Type': 'application/json' } };
      var result = AuthInterceptor.request(config);
      expect(result).toBe(config);
    });

  });

  describe('responseError()', function() {

    it('should reject the promise on 401 Unauthorized', function() {
      var rejection = { status: 401 };
      spyOn(console, 'error');
      var promise = AuthInterceptor.responseError(rejection);
      var rejected = false;
      promise.then(null, function() { rejected = true; });
      $rootScope.$digest();
      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Unauthorized access - please login');
    });

    it('should reject the promise on 500 Server Error', function() {
      var rejection = { status: 500 };
      spyOn(console, 'error');
      var promise = AuthInterceptor.responseError(rejection);
      var rejected = false;
      promise.then(null, function() { rejected = true; });
      $rootScope.$digest();
      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Server error - please try again later');
    });

    it('should reject the promise on status 0 (Network Error)', function() {
      var rejection = { status: 0 };
      spyOn(console, 'error');
      var promise = AuthInterceptor.responseError(rejection);
      var rejected = false;
      promise.then(null, function() { rejected = true; });
      $rootScope.$digest();
      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Network error - please check your connection');
    });

    it('should still reject the promise for unhandled error status codes', function() {
      var rejection = { status: 403 };
      spyOn(console, 'error');
      var promise = AuthInterceptor.responseError(rejection);
      var rejected = false;
      promise.then(null, function() { rejected = true; });
      $rootScope.$digest();
      expect(rejected).toBe(true);
    });

  });

});