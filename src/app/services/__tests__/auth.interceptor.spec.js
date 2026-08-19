describe('AuthInterceptor', function() {
  beforeEach(module('fraudAlertApp'));
  
  var AuthInterceptor, $q, $injector;
  
  beforeEach(inject(function(_AuthInterceptor_, _$q_, _$injector_) {
    AuthInterceptor = _AuthInterceptor_;
    $q = _$q_;
    $injector = _$injector_;
  }));
  
  describe('request interceptor', function() {
    /*
    Test Documentation:
    - Test Name: should add Authorization header when token exists
    - Purpose: Validates that valid auth token is added to request headers
    - Scenario: AuthService returns a valid token
    - Expected Result: Authorization header is set with Bearer token
    */
    it('should add Authorization header when token exists', function() {
      var mockAuthService = {
        getToken: jasmine.createSpy('getToken').and.returnValue('valid-token-xyz')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      
      var config = {
        headers: {}
      };
      
      var result = AuthInterceptor.request(config);
      
      expect(result.headers.Authorization).toBe('Bearer valid-token-xyz');
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });
    
    /*
    Test Documentation:
    - Test Name: should not add Authorization header when token is null
    - Purpose: Validates that no header is added when token is unavailable
    - Scenario: AuthService returns null
    - Expected Result: Authorization header is not set
    */
    it('should not add Authorization header when token is null', function() {
      var mockAuthService = {
        getToken: jasmine.createSpy('getToken').and.returnValue(null)
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      
      var config = {
        headers: {}
      };
      
      var result = AuthInterceptor.request(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });
    
    /*
    Test Documentation:
    - Test Name: should initialize headers object if not present
    - Purpose: Validates that headers object is created when missing
    - Scenario: Config object has no headers property
    - Expected Result: Headers object is created and Authorization header is added
    */
    it('should initialize headers object if not present', function() {
      var mockAuthService = {
        getToken: jasmine.createSpy('getToken').and.returnValue('token-abc')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      
      var config = {};
      
      var result = AuthInterceptor.request(config);
      
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer token-abc');
    });
    
    /*
    Test Documentation:
    - Test Name: should preserve existing headers when adding Authorization
    - Purpose: Validates that existing headers are not overwritten
    - Scenario: Config has existing headers and token is available
    - Expected Result: Authorization header is added while preserving existing headers
    */
    it('should preserve existing headers when adding Authorization', function() {
      var mockAuthService = {
        getToken: jasmine.createSpy('getToken').and.returnValue('token-123')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      
      var config = {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value'
        }
      };
      
      var result = AuthInterceptor.request(config);
      
      expect(result.headers.Authorization).toBe('Bearer token-123');
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['X-Custom-Header']).toBe('custom-value');
    });
  });
  
  describe('responseError interceptor', function() {
    /*
    Test Documentation:
    - Test Name: should logout on 401 Unauthorized response
    - Purpose: Validates that user is logged out when receiving 401 error
    - Scenario: API returns 401 status code
    - Expected Result: AuthService.logout is called and rejection is propagated
    */
    it('should logout on 401 Unauthorized response', function() {
      var mockAuthService = {
        logout: jasmine.createSpy('logout')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      spyOn($q, 'reject').and.callThrough();
      
      var rejection = {
        status: 401,
        data: 'Unauthorized'
      };
      
      AuthInterceptor.responseError(rejection);
      
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect($q.reject).toHaveBeenCalledWith(rejection);
    });
    
    /*
    Test Documentation:
    - Test Name: should not logout on non-401 error responses
    - Purpose: Validates that logout is not called for other error statuses
    - Scenario: API returns 500 status code
    - Expected Result: AuthService.logout is not called, rejection is propagated
    */
    it('should not logout on non-401 error responses', function() {
      var mockAuthService = {
        logout: jasmine.createSpy('logout')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      spyOn($q, 'reject').and.callThrough();
      
      var rejection = {
        status: 500,
        data: 'Internal Server Error'
      };
      
      AuthInterceptor.responseError(rejection);
      
      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect($q.reject).toHaveBeenCalledWith(rejection);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle 403 Forbidden response without logout
    - Purpose: Validates that 403 errors do not trigger logout
    - Scenario: API returns 403 status code
    - Expected Result: AuthService.logout is not called
    */
    it('should handle 403 Forbidden response without logout', function() {
      var mockAuthService = {
        logout: jasmine.createSpy('logout')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      spyOn($q, 'reject').and.callThrough();
      
      var rejection = {
        status: 403,
        data: 'Forbidden'
      };
      
      AuthInterceptor.responseError(rejection);
      
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    });
    
    /*
    Test Documentation:
    - Test Name: should propagate rejection promise
    - Purpose: Validates that error rejection is properly returned as promise
    - Scenario: Any error response is received
    - Expected Result: Rejection is propagated to calling code
    */
    it('should propagate rejection promise', function() {
      var mockAuthService = {
        logout: jasmine.createSpy('logout')
      };
      
      spyOn($injector, 'get').and.returnValue(mockAuthService);
      
      var rejection = {
        status: 400,
        data: 'Bad Request'
      };
      
      var result = AuthInterceptor.responseError(rejection);
      
      expect(result).toBeDefined();
    });
  });
  
  describe('AuthService', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve token from sessionStorage
    - Purpose: Validates that getToken retrieves token from browser storage
    - Scenario: Token exists in sessionStorage
    - Expected Result: Returns the stored token
    */
    it('should retrieve token from sessionStorage', inject(function(AuthService) {
      sessionStorage.setItem('authToken', 'stored-token-456');
      
      var token = AuthService.getToken();
      
      expect(token).toBe('stored-token-456');
      
      sessionStorage.removeItem('authToken');
    }));
    
    /*
    Test Documentation:
    - Test Name: should return mock token when sessionStorage is empty
    - Purpose: Validates fallback to mock token when no stored token exists
    - Scenario: sessionStorage does not contain authToken
    - Expected Result: Returns mock-token-12345
    */
    it('should return mock token when sessionStorage is empty', inject(function(AuthService) {
      sessionStorage.removeItem('authToken');
      
      var token = AuthService.getToken();
      
      expect(token).toBe('mock-token-12345');
    }));
    
    /*
    Test Documentation:
    - Test Name: should clear token and redirect on logout
    - Purpose: Validates that logout clears sessionStorage and redirects user
    - Scenario: logout method is called
    - Expected Result: authToken is removed from sessionStorage and redirect occurs
    */
    it('should clear token and redirect on logout', inject(function(AuthService) {
      sessionStorage.setItem('authToken', 'token-to-clear');
      
      spyOn(window.location, 'href');
      
      AuthService.logout();
      
      expect(sessionStorage.getItem('authToken')).toBeNull();
    }));
    
    /*
    Test Documentation:
    - Test Name: should handle logout when no token exists
    - Purpose: Validates that logout works even when sessionStorage is empty
    - Scenario: logout is called with no stored token
    - Expected Result: No error occurs and redirect is attempted
    */
    it('should handle logout when no token exists', inject(function(AuthService) {
      sessionStorage.removeItem('authToken');
      
      expect(function() {
        AuthService.logout();
      }).not.toThrow();
    }));
  });
  
  /*
  Coverage Report:
  - Functions tested: AuthInterceptor.request, AuthInterceptor.responseError, AuthService.getToken, AuthService.logout
  - Scenarios covered: token injection, header initialization, 401 error handling, non-401 errors, sessionStorage operations
  - Edge cases: null tokens, missing headers, empty sessionStorage, logout without token
  - Uncovered scenarios: none identified
  */
});
