/*
Test Documentation:

- Test Name: HttpInterceptorService - request (with token)
- Purpose: Verify that when a valid authToken exists in sessionStorage the Authorization header is set on the outgoing config.
- Scenario: sessionStorage.getItem returns a valid token string.
- Expected Result: config.headers.Authorization equals 'Bearer <token>'.

- Test Name: HttpInterceptorService - request (without token)
- Purpose: Verify that when no authToken is present in sessionStorage no Authorization header is added.
- Scenario: sessionStorage.getItem returns null.
- Expected Result: config.headers.Authorization is undefined.

- Test Name: HttpInterceptorService - request (config has no headers object)
- Purpose: Verify that the interceptor creates a headers object when config.headers is undefined.
- Scenario: config.headers is undefined; token exists in sessionStorage.
- Expected Result: config.headers is created and Authorization is set.

- Test Name: HttpInterceptorService - request (config already has headers)
- Purpose: Verify that existing headers are preserved and Authorization is added.
- Scenario: config.headers already contains Content-Type; token exists.
- Expected Result: config.headers.Authorization is set; Content-Type is preserved.

- Test Name: HttpInterceptorService - requestError
- Purpose: Verify that requestError rejects the promise with the original rejection.
- Scenario: A rejection object is passed.
- Expected Result: The returned promise is rejected with the same rejection object.

- Test Name: HttpInterceptorService - response (pass-through)
- Purpose: Verify that the response interceptor returns the response unchanged.
- Scenario: A mock response object is passed.
- Expected Result: The exact same response object is returned.

- Test Name: HttpInterceptorService - responseError (401 redirect)
- Purpose: Verify that a 401 response triggers a redirect to /login via $window.location.href.
- Scenario: rejection.status === 401; $window is injected via $injector.
- Expected Result: $window.location.href is set to '/login'.

- Test Name: HttpInterceptorService - responseError (500 first retry)
- Purpose: Verify that a 500 error with retryCount 0 increments retryCount and retries the request.
- Scenario: rejection.status === 500; rejection.config.retryCount is 0.
- Expected Result: $http is called with the updated config; retryCount becomes 1.

- Test Name: HttpInterceptorService - responseError (500 second retry)
- Purpose: Verify that a 500 error with retryCount 1 retries again (retryCount becomes 2).
- Scenario: rejection.status === 500; rejection.config.retryCount is 1.
- Expected Result: $http is called; retryCount becomes 2.

- Test Name: HttpInterceptorService - responseError (500 retry limit reached)
- Purpose: Verify that a 500 error with retryCount >= 2 does NOT retry and rejects the promise.
- Scenario: rejection.status === 500; rejection.config.retryCount is 2.
- Expected Result: Promise is rejected; $http is NOT called.

- Test Name: HttpInterceptorService - responseError (non-401, non-5xx)
- Purpose: Verify that other error codes (e.g. 400, 403) are simply rejected without any side effects.
- Scenario: rejection.status === 400.
- Expected Result: Promise is rejected with the original rejection; no redirect, no retry.

- Test Name: HttpInterceptorService - responseError (503 first retry)
- Purpose: Verify that a 503 error is treated the same as 500 (>= 500) and retried.
- Scenario: rejection.status === 503; rejection.config.retryCount is 0.
- Expected Result: $http is called with the updated config.

Coverage Report:
- Functions tested: request, requestError, response, responseError
- Scenarios covered: token present/absent, missing headers object, existing headers preserved, requestError rejection, response pass-through, 401 redirect, 500/503 first retry, 500 second retry, retry limit (retryCount >= 2), 400 rejection, retryCount undefined defaults to 0
- Uncovered scenarios: sessionStorage throwing an exception (environment-level), concurrent interceptor calls (integration concern)
*/

describe('HttpInterceptorService', function() {
  'use strict';

  var HttpInterceptorService;
  var $q;
  var $rootScope;
  var $injectorMock;
  var $windowMock;
  var $httpMock;

  beforeEach(module('fraudDetectionApp'));

  beforeEach(function() {
    $windowMock = { location: { href: '' } };
    $httpMock   = jasmine.createSpy('$http').and.returnValue('retried-promise');

    $injectorMock = {
      get: jasmine.createSpy('get').and.callFake(function(token) {
        if (token === '$window') { return $windowMock; }
        if (token === '$http')   { return $httpMock;   }
        return null;
      })
    };

    module(function($provide) {
      $provide.value('$injector', $injectorMock);
    });
  });

  beforeEach(inject(function(_HttpInterceptorService_, _$q_, _$rootScope_) {
    HttpInterceptorService = _HttpInterceptorService_;
    $q                     = _$q_;
    $rootScope             = _$rootScope_;
  }));

  // ---------------------------------------------------------------------------
  // request
  // ---------------------------------------------------------------------------

  describe('request', function() {

    beforeEach(function() {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
    });

    it('should set Authorization header when token exists in sessionStorage', function() {
      sessionStorage.getItem.and.returnValue('test-token-12345');
      var config = { url: '/api/test', headers: {} };

      var result = HttpInterceptorService.request(config);

      expect(result.headers.Authorization).toBe('Bearer test-token-12345');
    });

    it('should NOT set Authorization header when token is absent', function() {
      sessionStorage.getItem.and.returnValue(null);
      var config = { url: '/api/test', headers: {} };

      var result = HttpInterceptorService.request(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should create headers object if config.headers is undefined', function() {
      sessionStorage.getItem.and.returnValue('my-token');
      var config = { url: '/api/test' };

      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer my-token');
    });

    it('should preserve existing headers when adding Authorization', function() {
      sessionStorage.getItem.and.returnValue('my-token');
      var config = { url: '/api/test', headers: { 'Content-Type': 'application/json' } };

      var result = HttpInterceptorService.request(config);

      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBe('Bearer my-token');
    });
  });

  // ---------------------------------------------------------------------------
  // requestError
  // ---------------------------------------------------------------------------

  describe('requestError', function() {

    it('should reject the promise with the original rejection', function(done) {
      var rejection = { error: 'Request failed' };

      HttpInterceptorService.requestError(rejection).catch(function(err) {
        expect(err).toEqual(rejection);
        done();
      });

      $rootScope.$digest();
    });
  });

  // ---------------------------------------------------------------------------
  // response
  // ---------------------------------------------------------------------------

  describe('response', function() {

    it('should return the response unchanged', function() {
      var mockResponse = { status: 200, data: { message: 'OK' } };

      var result = HttpInterceptorService.response(mockResponse);

      expect(result).toBe(mockResponse);
    });
  });

  // ---------------------------------------------------------------------------
  // responseError
  // ---------------------------------------------------------------------------

  describe('responseError', function() {

    it('should redirect to /login when status is 401', function(done) {
      var rejection = { status: 401, config: {} };

      HttpInterceptorService.responseError(rejection).catch(function() {
        expect($windowMock.location.href).toBe('/login');
        done();
      });

      $rootScope.$digest();
    });

    it('should retry the request on 500 error (first retry)', function(done) {
      var rejection = { status: 500, config: { retryCount: 0 } };

      HttpInterceptorService.responseError(rejection);

      setTimeout(function() {
        expect($httpMock).toHaveBeenCalledWith(rejection.config);
        expect(rejection.config.retryCount).toBe(1);
        done();
      }, 10);
    });

    it('should retry the request on 500 error (second retry)', function(done) {
      var rejection = { status: 500, config: { retryCount: 1 } };

      HttpInterceptorService.responseError(rejection);

      setTimeout(function() {
        expect($httpMock).toHaveBeenCalledWith(rejection.config);
        expect(rejection.config.retryCount).toBe(2);
        done();
      }, 10);
    });

    it('should NOT retry when retryCount >= 2 and reject the promise', function(done) {
      var rejection = { status: 500, config: { retryCount: 2 } };

      HttpInterceptorService.responseError(rejection).catch(function(err) {
        expect($httpMock).not.toHaveBeenCalled();
        expect(err).toEqual(rejection);
        done();
      });

      $rootScope.$digest();
    });

    it('should retry on 503 error (>= 500)', function(done) {
      var rejection = { status: 503, config: { retryCount: 0 } };

      HttpInterceptorService.responseError(rejection);

      setTimeout(function() {
        expect($httpMock).toHaveBeenCalledWith(rejection.config);
        expect(rejection.config.retryCount).toBe(1);
        done();
      }, 10);
    });

    it('should reject without side effects for 400 error', function(done) {
      var rejection = { status: 400, config: {} };

      HttpInterceptorService.responseError(rejection).catch(function(err) {
        expect(err).toEqual(rejection);
        expect($httpMock).not.toHaveBeenCalled();
        expect($windowMock.location.href).toBe('');
        done();
      });

      $rootScope.$digest();
    });

    it('should reject without side effects for 403 error', function(done) {
      var rejection = { status: 403, config: {} };

      HttpInterceptorService.responseError(rejection).catch(function(err) {
        expect(err).toEqual(rejection);
        expect($httpMock).not.toHaveBeenCalled();
        done();
      });

      $rootScope.$digest();
    });

    it('should default retryCount to 0 when undefined', function(done) {
      var rejection = { status: 500, config: {} };

      HttpInterceptorService.responseError(rejection);

      setTimeout(function() {
        expect(rejection.config.retryCount).toBe(1);
        done();
      }, 10);
    });
  });
});
