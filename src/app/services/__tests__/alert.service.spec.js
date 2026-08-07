/*
Test Documentation:
- Test Name: alertService - sendLowStockAlert success
- Purpose: Validates that sendLowStockAlert successfully sends alert data to the API
- Scenario: Valid inventory item is passed to sendLowStockAlert
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: alertService - sendLowStockAlert failure
- Purpose: Validates error handling when API call fails
- Scenario: HTTP request fails with error
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: sendLowStockAlert
- Scenarios covered: success response, error handling
- Uncovered scenarios: timeout scenarios
*/

(function() {
  'use strict';

  describe('alertService', function() {
    var alertService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_alertService_, _$httpBackend_, _apiConfig_) {
      alertService = _alertService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('sendLowStockAlert', function() {
      it('should successfully send low stock alert', function() {
        var inventoryItem = {
          productId: 'P123',
          currentStock: 5,
          lowStockThreshold: 10
        };
        var mockResponse = { success: true, alertId: 'A456' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/alerts/low-stock', inventoryItem)
          .respond(200, mockResponse);

        var result;
        alertService.sendLowStockAlert(inventoryItem).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should reject promise when API call fails', function() {
        var inventoryItem = { productId: 'P123' };
        var mockError = { message: 'Server error' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/alerts/low-stock')
          .respond(500, mockError);

        var error;
        alertService.sendLowStockAlert(inventoryItem).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });
  });
})();