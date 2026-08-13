describe('AuthInterceptor', function() {
  beforeEach(module('app.shopping'));
  var AuthInterceptor, $window, $q;
  beforeEach(inject(function(_AuthInterceptor_, _$window_, _$q_) {
    AuthInterceptor = _AuthInterceptor_;
    $window = _$window_;
    $q = _$q_;
  }));
  describe('request', function() {
    /*
    Test Documentation:
    - Test Name: should add Authorization header when token exists
    - Purpose: Validates that the interceptor adds Bearer token to request headers
    - Scenario: Token exists in localStorage
    - Expected Result: Authorization header is set with Bearer token
    */
    it('should add Authorization header when token exists', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue('test-token-123');
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });
    /*
    Test Documentation:
    - Test Name: should not add Authorization header when token is null
    - Purpose: Validates that interceptor handles missing token gracefully
    - Scenario: No token in localStorage
    - Expected Result: Authorization header is not added
    */
    it('should not add Authorization header when token is null', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
    /*
    Test Documentation:
    - Test Name: should return config object
    - Purpose: Validates that request interceptor returns modified config
    - Scenario: Any valid request config
    - Expected Result: Config object is returned
    */
    it('should return config object', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var config = { headers: {}, url: '/api/test' };
      var result = AuthInterceptor.request(config);
      expect(result).toBe(config);
    });
  });
  describe('responseError', function() {
    /*
    Test Documentation:
    - Test Name: should clear localStorage and redirect on 401 error
    - Purpose: Validates that interceptor handles unauthorized responses
    - Scenario: Server returns 401 Unauthorized
    - Expected Result: Token and user removed from localStorage, redirected to login
    */
    it('should clear localStorage and redirect on 401 error', function() {
      spyOn($window.localStorage, 'removeItem');
      var rejection = { status: 401 };
      AuthInterceptor.responseError(rejection);
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('user');
      expect($window.location.href).toBe('#/login');
    });
    /*
    Test Documentation:
    - Test Name: should reject promise on 401 error
    - Purpose: Validates that error is properly rejected
    - Scenario: Server returns 401 Unauthorized
    - Expected Result: Promise is rejected with rejection object
    */
    it('should reject promise on 401 error', function() {
      spyOn($window.localStorage, 'removeItem');
      var rejection = { status: 401, data: 'Unauthorized' };
      var result = AuthInterceptor.responseError(rejection);
      expect(result.$$state.status).toBe(2);
    });
    /*
    Test Documentation:
    - Test Name: should reject promise on non-401 errors
    - Purpose: Validates that other errors are properly rejected
    - Scenario: Server returns 500 error
    - Expected Result: Promise is rejected, localStorage not cleared
    */
    it('should reject promise on non-401 errors', function() {
      spyOn($window.localStorage, 'removeItem');
      var rejection = { status: 500, data: 'Server Error' };
      var result = AuthInterceptor.responseError(rejection);
      expect($window.localStorage.removeItem).not.toHaveBeenCalled();
      expect(result.$$state.status).toBe(2);
    });
  });
  /*
  Coverage Report:
  - Functions tested: request, responseError
  - Scenarios covered: token present, token absent, 401 error, non-401 error, redirect logic
  - Uncovered scenarios: edge cases with malformed headers
  */
});
