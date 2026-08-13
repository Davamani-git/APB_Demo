describe('AuthService', function() {
  beforeEach(module('app.shopping'));
  var AuthService, $httpBackend, $window, API_BASE_URL;
  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_BASE_URL_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  describe('register', function() {
    /*
    Test Documentation:
    - Test Name: should successfully register user
    - Purpose: Validates user registration with valid data
    - Scenario: POST request to /auth/register with valid userData
    - Expected Result: Returns registration response data
    */
    it('should successfully register user', function() {
      var userData = { email: 'test@example.com', password: 'password123' };
      var response = { id: 1, email: 'test@example.com' };
      $httpBackend.expectPOST(API_BASE_URL + '/auth/register', userData).respond(response);
      AuthService.register(userData).then(function(result) {
        expect(result).toEqual(response);
      });
      $httpBackend.flush();
    });
    /*
    Test Documentation:
    - Test Name: should handle registration error
    - Purpose: Validates error handling during registration
    - Scenario: Server returns error response
    - Expected Result: Promise is rejected with error
    */
    it('should handle registration error', function() {
      var userData = { email: 'test@example.com', password: 'password123' };
      $httpBackend.expectPOST(API_BASE_URL + '/auth/register', userData).respond(400, 'Email already exists');
      AuthService.register(userData).catch(function(error) {
        expect(error.status).toBe(400);
      });
      $httpBackend.flush();
    });
  });
  describe('login', function() {
    /*
    Test Documentation:
    - Test Name: should successfully login and store token
    - Purpose: Validates login and token storage
    - Scenario: POST request to /auth/login with valid credentials
    - Expected Result: Token and user stored in localStorage
    */
    it('should successfully login and store token', function() {
      spyOn($window.localStorage, 'setItem');
      var credentials = { email: 'test@example.com', password: 'password123' };
      var response = { authToken: 'token-123', user: { id: 1, email: 'test@example.com' } };
      $httpBackend.expectPOST(API_BASE_URL + '/auth/login', credentials).respond(response);
      AuthService.login(credentials).then(function(result) {
        expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', 'token-123');
        expect($window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(response.user));
        expect(result).toEqual(response);
      });
      $httpBackend.flush();
    });
    /*
    Test Documentation:
    - Test Name: should handle login without token in response
    - Purpose: Validates login when token is not returned
    - Scenario: Server returns response without authToken
    - Expected Result: localStorage not updated
    */
    it('should handle login without token in response', function() {
      spyOn($window.localStorage, 'setItem');
      var credentials = { email: 'test@example.com', password: 'password123' };
      var response = { user: { id: 1, email: 'test@example.com' } };
      $httpBackend.expectPOST(API_BASE_URL + '/auth/login', credentials).respond(response);
      AuthService.login(credentials).then(function(result) {
        expect($window.localStorage.setItem).not.toHaveBeenCalled();
      });
      $httpBackend.flush();
    });
    /*
    Test Documentation:
    - Test Name: should handle login error
    - Purpose: Validates error handling during login
    - Scenario: Server returns authentication error
    - Expected Result: Promise is rejected
    */
    it('should handle login error', function() {
      var credentials = { email: 'test@example.com', password: 'wrong' };
      $httpBackend.expectPOST(API_BASE_URL + '/auth/login', credentials).respond(401, 'Invalid credentials');
      AuthService.login(credentials).catch(function(error) {
        expect(error.status).toBe(401);
      });
      $httpBackend.flush();
    });
  });
  describe('logout', function() {
    /*
    Test Documentation:
    - Test Name: should remove token and user from localStorage
    - Purpose: Validates logout clears authentication data
    - Scenario: User calls logout
    - Expected Result: authToken and user removed from localStorage
    */
    it('should remove token and user from localStorage', function() {
      spyOn($window.localStorage, 'removeItem');
      AuthService.logout();
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
  describe('getToken', function() {
    /*
    Test Documentation:
    - Test Name: should return token from localStorage
    - Purpose: Validates token retrieval
    - Scenario: Token exists in localStorage
    - Expected Result: Token string is returned
    */
    it('should return token from localStorage', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue('token-123');
      var token = AuthService.getToken();
      expect(token).toBe('token-123');
    });
    /*
    Test Documentation:
    - Test Name: should return null when no token
    - Purpose: Validates token retrieval when absent
    - Scenario: No token in localStorage
    - Expected Result: null is returned
    */
    it('should return null when no token', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var token = AuthService.getToken();
      expect(token).toBeNull();
    });
  });
  describe('getUser', function() {
    /*
    Test Documentation:
    - Test Name: should return parsed user object
    - Purpose: Validates user object retrieval
    - Scenario: User object stored in localStorage
    - Expected Result: Parsed user object is returned
    */
    it('should return parsed user object', function() {
      var user = { id: 1, email: 'test@example.com' };
      spyOn($window.localStorage, 'getItem').and.returnValue(JSON.stringify(user));
      var result = AuthService.getUser();
      expect(result).toEqual(user);
    });
    /*
    Test Documentation:
    - Test Name: should return null when no user
    - Purpose: Validates user retrieval when absent
    - Scenario: No user in localStorage
    - Expected Result: null is returned
    */
    it('should return null when no user', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var result = AuthService.getUser();
      expect(result).toBeNull();
    });
  });
  describe('isAuthenticated', function() {
    /*
    Test Documentation:
    - Test Name: should return true when token exists
    - Purpose: Validates authentication status check
    - Scenario: Token is present in localStorage
    - Expected Result: true is returned
    */
    it('should return true when token exists', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue('token-123');
      var result = AuthService.isAuthenticated();
      expect(result).toBe(true);
    });
    /*
    Test Documentation:
    - Test Name: should return false when token is absent
    - Purpose: Validates authentication status when not authenticated
    - Scenario: No token in localStorage
    - Expected Result: false is returned
    */
    it('should return false when token is absent', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var result = AuthService.isAuthenticated();
      expect(result).toBe(false);
    });
  });
  /*
  Coverage Report:
  - Functions tested: register, login, logout, getToken, getUser, isAuthenticated
  - Scenarios covered: successful registration, registration error, successful login, login without token, login error, logout, token retrieval, user retrieval, authentication status
  - Uncovered scenarios: malformed JSON in localStorage, network timeouts
  */
});
