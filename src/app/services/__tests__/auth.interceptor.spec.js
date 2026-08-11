/*
Test Documentation:
- Test Name: AuthInterceptor request method adds token to headers
- Purpose: Validates that the interceptor adds Authorization header when token exists
- Scenario: Token exists in localStorage
- Expected Result: Authorization header is added with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptor request method without token
- Purpose: Validates that the interceptor does not add Authorization header when no token
- Scenario: No token in localStorage
- Expected Result: Config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles 401
- Purpose: Validates that 401 errors trigger logout and redirect
- Scenario: API returns 401 status
- Expected Result: AuthService.logout is called and user is redirected to root
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles other errors
- Purpose: Validates that non-401 errors are rejected without logout
- Scenario: API returns 500 status
- Expected Result: Error is rejected without calling logout
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token present, token absent, 401 error, non-401 error
- Uncovered scenarios: none
*/

describe('AuthInterceptor', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var AuthInterceptor, $q, $injector, $window, $rootScope;
  
  beforeEach(inject(function(_AuthInterceptor_, _$q_, _$injector_, _$window_, _$rootScope_) {
    AuthInterceptor = _AuthInterceptor_;
    $q = _$q_;
    $injector = _$injector_;
    $window = _$window_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $window.localStorage.clear();
  });
  
  describe('request', function() {
    it('should add Authorization header when token exists', function() {
      $window.localStorage.setItem('authToken', 'test-token-123');
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });
    
    it('should create headers object if not present and add Authorization', function() {
      $window.localStorage.setItem('authToken', 'test-token-456');
      var config = {};
      var result = AuthInterceptor.request(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer test-token-456');
    });
    
    it('should not add Authorization header when token does not exist', function() {
      var config = { headers: {} };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
  });
  
  describe('responseError', function() {
    it('should call logout and redirect on 401 error', function() {
      var mockAuthService = { logout: jasmine.createSpy('logout') };
      var mockLocation = { path: jasmine.createSpy('path') };
      spyOn($injector, 'get').and.callFake(function(serviceName) {
        if (serviceName === 'AuthService') return mockAuthService;
        if (serviceName === '$location') return mockLocation;
      });
      
      var rejection = { status: 401, data: 'Unauthorized' };
      AuthInterceptor.responseError(rejection);
      
      expect($injector.get).toHaveBeenCalledWith('AuthService');
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect($injector.get).toHaveBeenCalledWith('$location');
      expect(mockLocation.path).toHaveBeenCalledWith('/');
    });
    
    it('should reject promise on 401 error', function() {
      var mockAuthService = { logout: jasmine.createSpy('logout') };
      var mockLocation = { path: jasmine.createSpy('path') };
      spyOn($injector, 'get').and.callFake(function(serviceName) {
        if (serviceName === 'AuthService') return mockAuthService;
        if (serviceName === '$location') return mockLocation;
      });
      
      var rejection = { status: 401 };
      var result = AuthInterceptor.responseError(rejection);
      
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error.status).toBe(401);
      });
      $rootScope.$apply();
    });
    
    it('should reject promise without logout on non-401 errors', function() {
      spyOn($injector, 'get');
      var rejection = { status: 500, data: 'Server Error' };
      var result = AuthInterceptor.responseError(rejection);
      
      expect($injector.get).not.toHaveBeenCalled();
      result.catch(function(error) {
        expect(error.status).toBe(500);
      });
      $rootScope.$apply();
    });
  });
});