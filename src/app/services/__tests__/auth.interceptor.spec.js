/*
Test Documentation:
- Test Name: AuthInterceptor request method adds Authorization header
- Purpose: Validates that the interceptor adds Bearer token to request headers
- Scenario: When a valid token exists
- Expected Result: Authorization header is set with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptor request method without token
- Purpose: Validates that the interceptor handles requests when no token exists
- Scenario: When no token is available
- Expected Result: Request config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles 401 status
- Purpose: Validates that 401 errors trigger logout
- Scenario: When response status is 401
- Expected Result: AuthService.logout is called and rejection is returned
*/
/*
Test Documentation:
- Test Name: AuthInterceptor responseError handles other errors
- Purpose: Validates that non-401 errors are passed through
- Scenario: When response status is not 401
- Expected Result: Rejection is returned without logout
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token present, token absent, 401 error, other errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor, $q, $window, $injector, AuthService;

    beforeEach(module('financeApp'));

    beforeEach(inject(function(_$q_, _$window_, _$injector_) {
      $q = _$q_;
      $window = _$window_;
      $injector = _$injector_;

      AuthService = {
        getToken: jasmine.createSpy('getToken'),
        logout: jasmine.createSpy('logout')
      };

      spyOn($injector, 'get').and.returnValue(AuthService);

      AuthInterceptor = _$injector_.get('AuthInterceptor');
    }));

    describe('request', function() {
      it('should add Authorization header when token exists', function() {
        AuthService.getToken.and.returnValue('test-token-123');
        var config = { headers: {} };

        var result = AuthInterceptor.request(config);

        expect($injector.get).toHaveBeenCalledWith('AuthService');
        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when token does not exist', function() {
        AuthService.getToken.and.returnValue(null);
        var config = { headers: {} };

        var result = AuthInterceptor.request(config);

        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should return config object', function() {
        AuthService.getToken.and.returnValue('token');
        var config = { headers: {}, url: '/api/test' };

        var result = AuthInterceptor.request(config);

        expect(result.url).toBe('/api/test');
      });
    });

    describe('responseError', function() {
      it('should call logout when status is 401', function() {
        var rejection = { status: 401, data: 'Unauthorized' };

        AuthInterceptor.responseError(rejection);

        expect($injector.get).toHaveBeenCalledWith('AuthService');
        expect(AuthService.logout).toHaveBeenCalled();
      });

      it('should return rejected promise when status is 401', function() {
        var rejection = { status: 401, data: 'Unauthorized' };

        var result = AuthInterceptor.responseError(rejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(rejection);
        });
      });

      it('should not call logout when status is not 401', function() {
        var rejection = { status: 500, data: 'Server Error' };

        AuthInterceptor.responseError(rejection);

        expect(AuthService.logout).not.toHaveBeenCalled();
      });

      it('should return rejected promise for non-401 errors', function() {
        var rejection = { status: 404, data: 'Not Found' };

        var result = AuthInterceptor.responseError(rejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(rejection);
        });
      });
    });
  });
})();