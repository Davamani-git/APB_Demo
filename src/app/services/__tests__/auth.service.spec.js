/*
Test Documentation:
- Test Name: AuthService - validateSession with valid token
- Purpose: Verify validateSession sends Authorization header and returns data
- Scenario: Token exists in sessionStorage, GET /api/auth/validate returns 200
- Expected Result: Returns response.data

- Test Name: AuthService - validateSession with no token
- Purpose: Verify validateSession rejects when no token is present
- Scenario: No token in sessionStorage or localStorage
- Expected Result: Promise rejects with 'No token found'

- Test Name: AuthService - getToken from sessionStorage
- Purpose: Verify getToken retrieves authToken from sessionStorage first
- Scenario: authToken set in sessionStorage
- Expected Result: Returns sessionStorage token

- Test Name: AuthService - getToken from localStorage fallback
- Purpose: Verify getToken falls back to localStorage
- Scenario: No token in sessionStorage, token in localStorage
- Expected Result: Returns localStorage token

- Test Name: AuthService - getToken returns null when no token
- Purpose: Verify getToken returns null when neither storage has token
- Scenario: Both storages empty
- Expected Result: Returns null/falsy

- Test Name: AuthService - setToken
- Purpose: Verify setToken stores token in sessionStorage
- Scenario: setToken called with a token string
- Expected Result: sessionStorage contains the token

- Test Name: AuthService - clearToken
- Purpose: Verify clearToken removes token from both storages
- Scenario: Tokens exist in both storages
- Expected Result: Both storages no longer contain authToken

Coverage Report:
- Functions tested: validateSession, getToken, setToken, clearToken
- Scenarios covered: token present, token absent, sessionStorage, localStorage, clear
- Uncovered scenarios: concurrent session validation
*/
describe('AuthService', function() {
  var AuthService, $httpBackend, $window, $q, $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.clear();
    $window.localStorage.clear();
  });

  describe('validateSession', function() {
    it('should GET /api/auth/validate with Bearer token and return response data', function() {
      $window.sessionStorage.setItem('authToken', 'test-token-123');
      var mockData = { valid: true, userId: 'user1' };
      $httpBackend.expectGET('/api/auth/validate', function(headers) {
        return headers['Authorization'] === 'Bearer test-token-123';
      }).respond(200, mockData);

      var result;
      AuthService.validateSession().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockData);
    });

    it('should reject with No token found when no token exists', function() {
      $window.sessionStorage.removeItem('authToken');
      $window.localStorage.removeItem('authToken');

      var rejected;
      AuthService.validateSession().catch(function(err) {
        rejected = err;
      });
      $rootScope.$digest();
      expect(rejected).toBe('No token found');
    });

    it('should use localStorage token if sessionStorage token is absent', function() {
      $window.sessionStorage.removeItem('authToken');
      $window.localStorage.setItem('authToken', 'local-token-456');
      $httpBackend.expectGET('/api/auth/validate', function(headers) {
        return headers['Authorization'] === 'Bearer local-token-456';
      }).respond(200, { valid: true });

      AuthService.validateSession();
      $httpBackend.flush();
    });
  });

  describe('getToken', function() {
    it('should return token from sessionStorage when available', function() {
      $window.sessionStorage.setItem('authToken', 'sess-token');
      expect(AuthService.getToken()).toBe('sess-token');
    });

    it('should fall back to localStorage when sessionStorage has no token', function() {
      $window.sessionStorage.removeItem('authToken');
      $window.localStorage.setItem('authToken', 'local-token');
      expect(AuthService.getToken()).toBe('local-token');
    });

    it('should return null/falsy when neither storage has a token', function() {
      $window.sessionStorage.removeItem('authToken');
      $window.localStorage.removeItem('authToken');
      expect(AuthService.getToken()).toBeFalsy();
    });
  });

  describe('setToken', function() {
    it('should store the token in sessionStorage', function() {
      AuthService.setToken('new-token-789');
      expect($window.sessionStorage.getItem('authToken')).toBe('new-token-789');
    });
  });

  describe('clearToken', function() {
    it('should remove authToken from both sessionStorage and localStorage', function() {
      $window.sessionStorage.setItem('authToken', 'sess-token');
      $window.localStorage.setItem('authToken', 'local-token');
      AuthService.clearToken();
      expect($window.sessionStorage.getItem('authToken')).toBeNull();
      expect($window.localStorage.getItem('authToken')).toBeNull();
    });
  });
});
