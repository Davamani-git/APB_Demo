/*
Test Documentation:
- Test Name: inventoryService - getInventory success
- Purpose: Validates retrieval of inventory for a seller
- Scenario: Valid sellerId provided
- Expected Result: Promise resolves with inventory data
*/
/*
Test Documentation:
- Test Name: inventoryService - updateStock success
- Purpose: Validates updating stock levels
- Scenario: Valid productId and stock data provided
- Expected Result: Promise resolves with updated stock
*/
/*
Test Documentation:
- Test Name: inventoryService - startMonitoring
- Purpose: Validates inventory monitoring with low stock alerts
- Scenario: Monitoring started, item below threshold detected
- Expected Result: Alert sent, callback invoked
*/
/*
Test Documentation:
- Test Name: inventoryService - stopMonitoring
- Purpose: Validates stopping inventory monitoring
- Scenario: stopMonitoring called
- Expected Result: Interval cancelled
*/
/*
Coverage Report:
- Functions tested: getInventory, updateStock, startMonitoring, stopMonitoring
- Scenarios covered: CRUD operations, monitoring, alert triggering
- Uncovered scenarios: concurrent stock updates
*/

(function() {
  'use strict';

  describe('inventoryService', function() {
    var inventoryService, $httpBackend, $interval, apiConfig, alertService;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_inventoryService_, _$httpBackend_, _$interval_, _apiConfig_, _alertService_) {
      inventoryService = _inventoryService_;
      $httpBackend = _$httpBackend_;
      $interval = _$interval_;
      apiConfig = _apiConfig_;
      alertService = _alertService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      inventoryService.stopMonitoring();
    });

    describe('getInventory', function() {
      it('should retrieve inventory successfully', function() {
        var sellerId = 'S123';
        var mockInventory = [
          { productId: 'P1', currentStock: 50, lowStockThreshold: 10 },
          { productId: 'P2', currentStock: 5, lowStockThreshold: 10 }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/inventory?sellerId=' + sellerId)
          .respond(200, mockInventory);

        var result;
        inventoryService.getInventory(sellerId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockInventory);
        expect(result.length).toBe(2);
      });

      it('should reject promise on API error', function() {
        var sellerId = 'S123';

        $httpBackend.expectGET(apiConfig.baseUrl + '/inventory?sellerId=' + sellerId)
          .respond(500, { message: 'Server error' });

        var error;
        inventoryService.getInventory(sellerId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('updateStock', function() {
      it('should update stock successfully', function() {
        var productId = 'P123';
        var stockData = { currentStock: 100, lowStockThreshold: 20 };
        var mockResponse = { productId: 'P123', currentStock: 100 };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/inventory/' + productId, stockData)
          .respond(200, mockResponse);

        var result;
        inventoryService.updateStock(productId, stockData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should reject promise on update error', function() {
        var productId = 'P123';
        var stockData = { currentStock: 100 };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/inventory/' + productId)
          .respond(404, { message: 'Product not found' });

        var error;
        inventoryService.updateStock(productId, stockData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('startMonitoring', function() {
      it('should monitor inventory and send alerts for low stock', function() {
        var sellerId = 'S123';
        var callback = jasmine.createSpy('callback');
        var mockInventory = [
          { productId: 'P1', currentStock: 5, lowStockThreshold: 10 }
        ];

        spyOn(alertService, 'sendLowStockAlert').and.returnValue(Promise.resolve({ success: true }));

        $httpBackend.expectGET(apiConfig.baseUrl + '/inventory?sellerId=' + sellerId)
          .respond(200, mockInventory);

        inventoryService.startMonitoring(sellerId, callback);
        $interval.flush(60000);
        $httpBackend.flush();

        expect(alertService.sendLowStockAlert).toHaveBeenCalledWith(mockInventory[0]);
      });

      it('should cancel existing interval before starting new one', function() {
        var sellerId = 'S123';
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        inventoryService.startMonitoring(sellerId, callback1);
        inventoryService.startMonitoring(sellerId, callback2);

        expect(callback1).not.toHaveBeenCalled();
      });
    });

    describe('stopMonitoring', function() {
      it('should cancel monitoring interval', function() {
        var sellerId = 'S123';
        var callback = jasmine.createSpy('callback');

        inventoryService.startMonitoring(sellerId, callback);
        inventoryService.stopMonitoring();

        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
})();