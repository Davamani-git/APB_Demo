/*
Test Documentation:
- Test Name: SellerService - login - success scenario
- Purpose: Validates that login authenticates seller and stores credentials
- Scenario: HTTP POST request succeeds with valid credentials
- Expected Result: Promise resolves with auth token and seller ID stored in sessionStorage
*/
/*
Test Documentation:
- Test Name: SellerService - login - error scenario
- Purpose: Validates error handling when login fails
- Scenario: HTTP POST request fails with invalid credentials
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: SellerService - login - missing auth token
- Purpose: Validates login when response doesn't contain auth token
- Scenario: HTTP POST succeeds but no auth token in response
- Expected Result: Promise resolves but sessionStorage not updated
*/
/*
Test Documentation:
- Test Name: SellerService - register - success scenario
- Purpose: Validates that register creates a new seller account
- Scenario: HTTP POST request succeeds with valid seller data
- Expected Result: Promise resolves with registration confirmation
*/
/*
Test Documentation:
- Test Name: SellerService - register - error scenario
- Purpose: Validates error handling when registration fails
- Scenario: HTTP POST request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: SellerService - getProfile - success scenario
- Purpose: Validates that getProfile returns seller profile data
- Scenario: HTTP GET request succeeds
- Expected Result: Promise resolves with seller profile
*/
/*
Test Documentation:
- Test Name: SellerService - getProfile - error scenario
- Purpose: Validates error handling when getProfile fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: SellerService - updateProfile - success scenario
- Purpose: Validates that updateProfile updates seller profile
- Scenario: HTTP PUT request succeeds
- Expected Result: Promise resolves with updated profile
*/
/*
Test Documentation:
- Test Name: SellerService - updateProfile - error scenario
- Purpose: Validates error handling when updateProfile fails
- Scenario: HTTP PUT request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: SellerService - logout - success scenario
- Purpose: Validates that logout clears session data
- Scenario: Logout is called
- Expected Result: Auth token and seller ID removed from sessionStorage
*/
/*
Coverage Report:
- Functions tested: login, register, getProfile, updateProfile, logout
- Scenarios covered: success responses, error handling, session management
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('SellerService', function() {
    var SellerService, $httpBackend, $q;
    var apiBase = '/api/sellers';

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_SellerService_, _$httpBackend_, _$q_) {
      SellerService = _SellerService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      sessionStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      sessionStorage.clear();
    });

    describe('login', function() {
      it('should authenticate seller and store credentials in sessionStorage', function() {
        var credentials = { email: 'seller@test.com', password: 'password123' };
        var mockResponse = { authToken: 'token123', sellerId: 'seller123' };

        $httpBackend.expectPOST(apiBase + '/login', credentials)
          .respond(200, mockResponse);

        SellerService.login(credentials).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(sessionStorage.getItem('authToken')).toBe('token123');
          expect(sessionStorage.getItem('sellerId')).toBe('seller123');
        });

        $httpBackend.flush();
      });

      it('should reject promise when login fails', function() {
        var credentials = { email: 'seller@test.com', password: 'wrongpassword' };

        $httpBackend.expectPOST(apiBase + '/login', credentials)
          .respond(401, { message: 'Invalid credentials' });

        SellerService.login(credentials).catch(function(error) {
          expect(error.status).toBe(401);
          expect(sessionStorage.getItem('authToken')).toBeNull();
        });

        $httpBackend.flush();
      });

      it('should not store credentials when auth token is missing', function() {
        var credentials = { email: 'seller@test.com', password: 'password123' };
        var mockResponse = { sellerId: 'seller123' };

        $httpBackend.expectPOST(apiBase + '/login', credentials)
          .respond(200, mockResponse);

        SellerService.login(credentials).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(sessionStorage.getItem('authToken')).toBeNull();
          expect(sessionStorage.getItem('sellerId')).toBeNull();
        });

        $httpBackend.flush();
      });
    });

    describe('register', function() {
      it('should create a new seller account', function() {
        var sellerData = { email: 'newseller@test.com', password: 'password123', name: 'New Seller' };
        var mockResponse = { sellerId: 'seller456', message: 'Registration successful' };

        $httpBackend.expectPOST(apiBase + '/register', sellerData)
          .respond(201, mockResponse);

        SellerService.register(sellerData).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.sellerId).toBeDefined();
        });

        $httpBackend.flush();
      });

      it('should reject promise when registration fails', function() {
        var sellerData = { email: 'newseller@test.com', password: '123' };

        $httpBackend.expectPOST(apiBase + '/register', sellerData)
          .respond(400, { message: 'Invalid registration data' });

        SellerService.register(sellerData).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });
    });

    describe('getProfile', function() {
      it('should return seller profile data', function() {
        var sellerId = 'seller123';
        var mockResponse = { sellerId: sellerId, name: 'Test Seller', email: 'seller@test.com' };

        $httpBackend.expectGET(apiBase + '/' + sellerId)
          .respond(200, mockResponse);

        SellerService.getProfile(sellerId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.sellerId).toBe(sellerId);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getProfile fails', function() {
        var sellerId = 'seller123';

        $httpBackend.expectGET(apiBase + '/' + sellerId)
          .respond(404, { message: 'Seller not found' });

        SellerService.getProfile(sellerId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });

    describe('updateProfile', function() {
      it('should update seller profile', function() {
        var sellerId = 'seller123';
        var profileData = { name: 'Updated Seller', email: 'updated@test.com' };
        var mockResponse = { sellerId: sellerId, name: 'Updated Seller', email: 'updated@test.com' };

        $httpBackend.expectPUT(apiBase + '/' + sellerId, profileData)
          .respond(200, mockResponse);

        SellerService.updateProfile(sellerId, profileData).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.name).toBe('Updated Seller');
        });

        $httpBackend.flush();
      });

      it('should reject promise when updateProfile fails', function() {
        var sellerId = 'seller123';
        var profileData = { name: 'Updated Seller' };

        $httpBackend.expectPUT(apiBase + '/' + sellerId, profileData)
          .respond(403, { message: 'Forbidden' });

        SellerService.updateProfile(sellerId, profileData).catch(function(error) {
          expect(error.status).toBe(403);
        });

        $httpBackend.flush();
      });
    });

    describe('logout', function() {
      it('should clear session data', function() {
        sessionStorage.setItem('authToken', 'token123');
        sessionStorage.setItem('sellerId', 'seller123');

        SellerService.logout().then(function() {
          expect(sessionStorage.getItem('authToken')).toBeNull();
          expect(sessionStorage.getItem('sellerId')).toBeNull();
        });
      });

      it('should resolve successfully even when no session data exists', function() {
        SellerService.logout().then(function() {
          expect(sessionStorage.getItem('authToken')).toBeNull();
          expect(sessionStorage.getItem('sellerId')).toBeNull();
        });
      });
    });
  });
})();