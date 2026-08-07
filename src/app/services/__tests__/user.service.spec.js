/*
Test Documentation:
- Test Name: userService - getUsers success
- Purpose: Validates retrieval of users with filters
- Scenario: Valid query parameters provided
- Expected Result: Promise resolves with users list
*/
/*
Test Documentation:
- Test Name: userService - lockAccount success
- Purpose: Validates locking user account
- Scenario: Valid userId provided
- Expected Result: Promise resolves with locked account status
*/
/*
Test Documentation:
- Test Name: userService - unlockAccount success
- Purpose: Validates unlocking user account
- Scenario: Valid userId provided
- Expected Result: Promise resolves with unlocked account status
*/
/*
Coverage Report:
- Functions tested: getUsers, lockAccount, unlockAccount
- Scenarios covered: user management, account status changes, error handling
- Uncovered scenarios: bulk operations, role management
*/

(function() {
  'use strict';

  describe('userService', function() {
    var userService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_userService_, _$httpBackend_, _apiConfig_) {
      userService = _userService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUsers', function() {
      it('should retrieve users with filters', function() {
        var params = { role: 'customer', status: 'active' };
        var mockUsers = [
          { userId: 'U1', username: 'user1', role: 'customer', status: 'active' },
          { userId: 'U2', username: 'user2', role: 'customer', status: 'active' }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/users?role=customer&status=active')
          .respond(200, mockUsers);

        var result;
        userService.getUsers(params).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockUsers);
        expect(result.length).toBe(2);
      });

      it('should reject promise on retrieval error', function() {
        var params = { role: 'customer' };

        $httpBackend.expectGET(apiConfig.baseUrl + '/users?role=customer')
          .respond(500, { message: 'Server error' });

        var error;
        userService.getUsers(params).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('lockAccount', function() {
      it('should lock user account successfully', function() {
        var userId = 'U123';
        var mockResponse = {
          userId: 'U123',
          status: 'locked',
          message: 'Account locked successfully'
        };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/users/' + userId + '/lock', {})
          .respond(200, mockResponse);

        var result;
        userService.lockAccount(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.status).toBe('locked');
      });

      it('should reject promise on lock error', function() {
        var userId = 'U123';

        $httpBackend.expectPUT(apiConfig.baseUrl + '/users/' + userId + '/lock')
          .respond(404, { message: 'User not found' });

        var error;
        userService.lockAccount(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('unlockAccount', function() {
      it('should unlock user account successfully', function() {
        var userId = 'U123';
        var mockResponse = {
          userId: 'U123',
          status: 'active',
          message: 'Account unlocked successfully'
        };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/users/' + userId + '/unlock', {})
          .respond(200, mockResponse);

        var result;
        userService.unlockAccount(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.status).toBe('active');
      });

      it('should reject promise on unlock error', function() {
        var userId = 'U123';

        $httpBackend.expectPUT(apiConfig.baseUrl + '/users/' + userId + '/unlock')
          .respond(404, { message: 'User not found' });

        var error;
        userService.unlockAccount(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });
  });
})();