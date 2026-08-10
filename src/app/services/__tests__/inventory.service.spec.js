/*
Test Documentation:
- Test Name: InventoryService - getInventory - success scenario
- Purpose: Validates that getInventory returns inventory data for a product
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with inventory data
*/
/*
Test Documentation:
- Test Name: InventoryService - getInventory - error scenario
- Purpose: Validates error handling when getInventory fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: InventoryService - getAllInventory - success scenario
- Purpose: Validates that getAllInventory returns all inventory for a seller
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with inventory list
*/
/*
Test Documentation:
- Test Name: InventoryService - updateInventory - success scenario
- Purpose: Validates that updateInventory updates inventory data
- Scenario: HTTP PUT request succeeds
- Expected Result: Promise resolves with updated inventory
*/
/*
Test Documentation:
- Test Name: InventoryService - setThreshold - success scenario
- Purpose: Validates that setThreshold updates low stock threshold
- Scenario: HTTP PATCH request succeeds
- Expected Result: Promise resolves with updated threshold
*/
/*
Test Documentation:
- Test Name: InventoryService - connectWebSocket - success scenario
- Purpose: Validates WebSocket connection establishment
- Scenario: WebSocket connects and broadcasts inventory updates
- Expected Result: WebSocket connection established and events broadcasted
*/
/*
Test Documentation:
- Test Name: InventoryService - disconnectWebSocket - success scenario
- Purpose: Validates WebSocket disconnection
- Scenario: WebSocket is closed properly
- Expected Result: WebSocket connection closed
*/
/*
Coverage Report:
- Functions tested: getInventory, getAllInventory, updateInventory, setThreshold, connectWebSocket, disconnectWebSocket
- Scenarios covered: success responses, error handling, WebSocket operations
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('InventoryService', function() {
    var InventoryService, $httpBackend, $rootScope, $q;
    var apiBase = '/api/inventory';

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_InventoryService_, _$httpBackend_, _$rootScope_, _$q_) {
      InventoryService = _InventoryService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      InventoryService.disconnectWebSocket();
    });

    describe('getInventory', function() {
      it('should return inventory data for a product', function() {
        var productId = 'prod123';
        var mockResponse = { productId: productId, quantity: 100, threshold: 10 };

        $httpBackend.expectGET(apiBase + '/' + productId)
          .respond(200, mockResponse);

        InventoryService.getInventory(productId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.quantity).toBe(100);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getInventory fails', function() {
        var productId = 'prod123';
        var errorResponse = { message: 'Product not found' };

        $httpBackend.expectGET(apiBase + '/' + productId)
          .respond(404, errorResponse);

        InventoryService.getInventory(productId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });

    describe('getAllInventory', function() {
      it('should return all inventory for a seller', function() {
        var sellerId = 'seller123';
        var mockResponse = [
          { productId: 'p1', quantity: 100 },
          { productId: 'p2', quantity: 50 }
        ];

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(200, mockResponse);

        InventoryService.getAllInventory(sellerId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(2);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getAllInventory fails', function() {
        var sellerId = 'seller123';

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(500, { message: 'Server error' });

        InventoryService.getAllInventory(sellerId).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('updateInventory', function() {
      it('should update inventory data', function() {
        var inventoryId = 'inv123';
        var inventoryData = { quantity: 150 };
        var mockResponse = { inventoryId: inventoryId, quantity: 150 };

        $httpBackend.expectPUT(apiBase + '/' + inventoryId, inventoryData)
          .respond(200, mockResponse);

        InventoryService.updateInventory(inventoryId, inventoryData).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.quantity).toBe(150);
        });

        $httpBackend.flush();
      });

      it('should reject promise when updateInventory fails', function() {
        var inventoryId = 'inv123';
        var inventoryData = { quantity: 150 };

        $httpBackend.expectPUT(apiBase + '/' + inventoryId, inventoryData)
          .respond(400, { message: 'Invalid data' });

        InventoryService.updateInventory(inventoryId, inventoryData).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });
    });

    describe('setThreshold', function() {
      it('should update low stock threshold', function() {
        var inventoryId = 'inv123';
        var threshold = 20;
        var mockResponse = { inventoryId: inventoryId, lowStockThreshold: threshold };

        $httpBackend.expectPATCH(apiBase + '/' + inventoryId + '/threshold', { lowStockThreshold: threshold })
          .respond(200, mockResponse);

        InventoryService.setThreshold(inventoryId, threshold).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.lowStockThreshold).toBe(threshold);
        });

        $httpBackend.flush();
      });

      it('should reject promise when setThreshold fails', function() {
        var inventoryId = 'inv123';
        var threshold = 20;

        $httpBackend.expectPATCH(apiBase + '/' + inventoryId + '/threshold', { lowStockThreshold: threshold })
          .respond(403, { message: 'Forbidden' });

        InventoryService.setThreshold(inventoryId, threshold).catch(function(error) {
          expect(error.status).toBe(403);
        });

        $httpBackend.flush();
      });
    });

    describe('connectWebSocket', function() {
      it('should establish WebSocket connection and broadcast updates', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);
        spyOn($rootScope, '$broadcast');

        InventoryService.connectWebSocket(sellerId);

        expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:8080/inventory/' + sellerId);

        var mockData = { productId: 'p1', quantity: 80 };
        mockWebSocket.onmessage({ data: JSON.stringify(mockData) });

        expect($rootScope.$broadcast).toHaveBeenCalledWith('inventory:update', mockData);
      });

      it('should not create duplicate WebSocket connection', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);

        InventoryService.connectWebSocket(sellerId);
        InventoryService.connectWebSocket(sellerId);

        expect(window.WebSocket.calls.count()).toBe(1);
      });
    });

    describe('disconnectWebSocket', function() {
      it('should close WebSocket connection', function() {
        var sellerId = 'seller123';
        var mockWebSocket = {
          onmessage: null,
          onerror: null,
          close: jasmine.createSpy('close')
        };

        spyOn(window, 'WebSocket').and.returnValue(mockWebSocket);

        InventoryService.connectWebSocket(sellerId);
        InventoryService.disconnectWebSocket();

        expect(mockWebSocket.close).toHaveBeenCalled();
      });

      it('should handle disconnection when no WebSocket exists', function() {
        expect(function() {
          InventoryService.disconnectWebSocket();
        }).not.toThrow();
      });
    });
  });
})();