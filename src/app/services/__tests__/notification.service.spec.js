/*
Test Documentation:
- Test Name: NotificationService getPreferences success
- Purpose: Validates retrieval of notification preferences
- Scenario: When fetching user notification preferences
- Expected Result: Preferences are returned successfully
*/
/*
Test Documentation:
- Test Name: NotificationService getPreferences error handling
- Purpose: Validates error handling during preferences fetch
- Scenario: When API request fails
- Expected Result: Error is propagated
*/
/*
Test Documentation:
- Test Name: NotificationService updatePreferences success
- Purpose: Validates updating notification preferences
- Scenario: When updating user preferences
- Expected Result: Preferences are updated successfully
*/
/*
Test Documentation:
- Test Name: NotificationService updatePreferences error handling
- Purpose: Validates error handling during preferences update
- Scenario: When update request fails
- Expected Result: Error is propagated
*/
/*
Coverage Report:
- Functions tested: getPreferences, updatePreferences
- Scenarios covered: successful fetch, fetch error, successful update, update error
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('NotificationService', function() {
    var NotificationService, $httpBackend, API_CONFIG;

    beforeEach(module('financeApp'));

    beforeEach(inject(function(_NotificationService_, _$httpBackend_, _API_CONFIG_) {
      NotificationService = _NotificationService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getPreferences', function() {
      it('should fetch notification preferences successfully', function() {
        var preferencesData = {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          budgetAlerts: true
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/notifications/preferences')
          .respond(200, preferencesData);

        NotificationService.getPreferences().then(function(data) {
          expect(data.emailNotifications).toBe(true);
          expect(data.smsNotifications).toBe(false);
          expect(data.pushNotifications).toBe(true);
          expect(data.budgetAlerts).toBe(true);
        });

        $httpBackend.flush();
      });

      it('should handle error when fetching preferences', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/notifications/preferences')
          .respond(500, { error: 'Server error' });

        NotificationService.getPreferences().catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });

      it('should handle 404 error when preferences not found', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/notifications/preferences')
          .respond(404, { error: 'Preferences not found' });

        NotificationService.getPreferences().catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });

      it('should return empty preferences object', function() {
        var emptyPreferences = {};

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/notifications/preferences')
          .respond(200, emptyPreferences);

        NotificationService.getPreferences().then(function(data) {
          expect(data).toEqual({});
        });

        $httpBackend.flush();
      });
    });

    describe('updatePreferences', function() {
      it('should update notification preferences successfully', function() {
        var preferences = {
          emailNotifications: false,
          smsNotifications: true,
          pushNotifications: false,
          budgetAlerts: true
        };
        var responseData = {
          success: true,
          preferences: preferences
        };

        $httpBackend.expectPUT(
          API_CONFIG.baseUrl + '/notifications/preferences',
          preferences
        ).respond(200, responseData);

        NotificationService.updatePreferences(preferences).then(function(data) {
          expect(data.success).toBe(true);
          expect(data.preferences).toEqual(preferences);
        });

        $httpBackend.flush();
      });

      it('should handle error when updating preferences', function() {
        var preferences = { emailNotifications: true };

        $httpBackend.expectPUT(
          API_CONFIG.baseUrl + '/notifications/preferences',
          preferences
        ).respond(500, { error: 'Update failed' });

        NotificationService.updatePreferences(preferences).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });

      it('should handle validation errors', function() {
        var invalidPreferences = { invalidField: 'value' };

        $httpBackend.expectPUT(
          API_CONFIG.baseUrl + '/notifications/preferences',
          invalidPreferences
        ).respond(400, { error: 'Invalid preferences format' });

        NotificationService.updatePreferences(invalidPreferences).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });

      it('should send correct payload when updating preferences', function() {
        var preferences = {
          emailNotifications: true,
          smsNotifications: true
        };

        $httpBackend.expectPUT(
          API_CONFIG.baseUrl + '/notifications/preferences',
          preferences
        ).respond(200, { success: true });

        NotificationService.updatePreferences(preferences);

        $httpBackend.flush();
      });

      it('should handle partial preference updates', function() {
        var partialPreferences = { emailNotifications: false };
        var responseData = { success: true, updated: ['emailNotifications'] };

        $httpBackend.expectPUT(
          API_CONFIG.baseUrl + '/notifications/preferences',
          partialPreferences
        ).respond(200, responseData);

        NotificationService.updatePreferences(partialPreferences).then(function(data) {
          expect(data.success).toBe(true);
          expect(data.updated).toContain('emailNotifications');
        });

        $httpBackend.flush();
      });
    });
  });
})();