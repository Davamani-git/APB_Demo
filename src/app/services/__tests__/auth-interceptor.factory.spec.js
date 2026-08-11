/*
Test Documentation:
- Test Name: authInterceptor - request with token
- Purpose: Validates that Authorization header is added when token exists
- Scenario: Request interceptor is called and AuthService returns a token
- Expected Result: Config headers include Authorization with Bearer token
*/
/*
Test Documentation:
- Test Name: authInterceptor - request without token
- Purpose: Validates request proceeds without Authorization header when no token
- Scenario: Request interceptor is called and AuthService returns null token
- Expected Result: Config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: authInterceptor - requestError
- Purpose: Validates request error handling
- Scenario: Request error occurs
- Expected Result: Rejection is returned
*/
/*
Test Documentation:
- Test Name: authInterceptor - response success
- Purpose: Validates successful response passthrough
- Scenario: Response interceptor receives successful response
- Expected Result: Response is returned unchanged
*/
/*
Test Documentation:
- Test Name: authInterceptor - responseError 401
- Purpose: Validates redirect to login on 401 unauthorized
- Scenario: Response error with 401 status
- Expected Result: Token removed and redirected to /login
*/
/*
Test Documentation:
- Test Name: authInterceptor - responseError 403
- Purpose: Validates redirect to login on 403 forbidden
- Scenario: Response error with 403 status
- Expected Result: Token removed and redirected to /login
*/
/*
Coverage Report:
- Functions tested: request, requestError, response, responseError
- Scenarios covered: with/without token, 401/403 errors, success responses
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('authInterceptor', function() {
    var authInterceptor, $q, $injector, AuthService, $location;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_authInterceptor_, _$q_, _$injector_) {
      authInterceptor = _authInterceptor_;
      $q = _$q_;
      $injector = _$injector_;
      AuthService = $injector.get('AuthService');
      $location = $injector.get('$location');
    }));

    describe('request', function() {
      it('should add Authorization header when token exists', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
        
        var config = { url: '/api/test' };
        var result = authInterceptor.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when token is null', function() {
        spyOn(AuthService, 'getToken').and.returnValue(null);
        
        var config = { url: '/api/test', headers: {} };
        var result = authInterceptor.request(config);
        
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should initialize headers object if not present', function() {
        spyOn(AuthService, 'getToken').and.returnValue('token-456');
        
        var config = { url: '/api/test' };
        var result = authInterceptor.request(config);
        
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer token-456');
      });
    });

    describe('requestError', function() {
      it('should reject the request error', function() {
        var rejection = { status: 400, message: 'Bad Request' };
        var result = authInterceptor.requestError(rejection);
        
        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(rejection);
        });
      });
    });

    describe('response', function() {
      it('should return response unchanged', function() {
        var response = { status: 200, data: { success: true } };
        var result = authInterceptor.response(response);
        
        expect(result).toEqual(response);
      });
    });

    describe('responseError', function() {
      it('should remove token and redirect to login on 401 error', function() {
        spyOn(AuthService, 'removeToken');
        spyOn($location, 'path');
        
        var rejection = { status: 401, message: 'Unauthorized' };
        var result = authInterceptor.responseError(rejection);
        
        expect(AuthService.removeToken).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/login');
      });

      it('should remove token and redirect to login on 403 error', function() {
        spyOn(AuthService, 'removeToken');
        spyOn($location, 'path');
        
        var rejection = { status: 403, message: 'Forbidden' };
        var result = authInterceptor.responseError(rejection);
        
        expect(AuthService.removeToken).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/login');
      });

      it('should not redirect on other error codes', function() {
        spyOn(AuthService, 'removeToken');
        spyOn($location, 'path');
        
        var rejection = { status: 500, message: 'Server Error' };
        var result = authInterceptor.responseError(rejection);
        
        expect(AuthService.removeToken).not.toHaveBeenCalled();
        expect($location.path).not.toHaveBeenCalled();
      });
    });
  });
})();