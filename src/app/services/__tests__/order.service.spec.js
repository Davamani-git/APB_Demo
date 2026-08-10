/*
Test Documentation:
- Test Name: OrderService - getOrders - success scenario
- Purpose: Validates that getOrders returns all orders for a seller
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with orders array
*/
/*
Test Documentation:
- Test Name: OrderService - getOrders - error scenario
- Purpose: Validates error handling when getOrders fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: OrderService - getOrder - success scenario
- Purpose: Validates that getOrder returns a specific order
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with order data
*/
/*
Test Documentation:
- Test Name: OrderService - getOrder - error scenario
- Purpose: Validates error handling when getOrder fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: OrderService - updateOrderStatus - success scenario
- Purpose: Validates that updateOrderStatus updates order status
- Scenario: HTTP PATCH request succeeds
- Expected Result: Promise resolves with updated order
*/
/*
Test Documentation:
- Test Name: OrderService - updateOrderStatus - error scenario
- Purpose: Validates error handling when updateOrderStatus fails
- Scenario: HTTP PATCH request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: OrderService - updateShippingInfo - success scenario
- Purpose: Validates that updateShippingInfo updates shipping tracking
- Scenario: HTTP PATCH request succeeds
- Expected Result: Promise resolves with updated shipping info
*/
/*
Test Documentation:
- Test Name: OrderService - updateShippingInfo - error scenario
- Purpose: Validates error handling when updateShippingInfo fails
- Scenario: HTTP PATCH request fails
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getOrders, getOrder, updateOrderStatus, updateShippingInfo
- Scenarios covered: success responses, error handling for all methods
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('OrderService', function() {
    var OrderService, $httpBackend, $q;
    var apiBase = '/api/orders';

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_OrderService_, _$httpBackend_, _$q_) {
      OrderService = _OrderService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getOrders', function() {
      it('should return all orders for a seller', function() {
        var sellerId = 'seller123';
        var mockResponse = [
          { orderId: 'o1', status: 'pending', total: 100 },
          { orderId: 'o2', status: 'shipped', total: 200 }
        ];

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(200, mockResponse);

        OrderService.getOrders(sellerId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(2);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getOrders fails', function() {
        var sellerId = 'seller123';

        $httpBackend.expectGET(apiBase + '?sellerId=' + sellerId)
          .respond(500, { message: 'Server error' });

        OrderService.getOrders(sellerId).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('getOrder', function() {
      it('should return a specific order', function() {
        var orderId = 'order123';
        var mockResponse = { orderId: orderId, status: 'processing', total: 150 };

        $httpBackend.expectGET(apiBase + '/' + orderId)
          .respond(200, mockResponse);

        OrderService.getOrder(orderId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.orderId).toBe(orderId);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getOrder fails', function() {
        var orderId = 'order123';

        $httpBackend.expectGET(apiBase + '/' + orderId)
          .respond(404, { message: 'Order not found' });

        OrderService.getOrder(orderId).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });

    describe('updateOrderStatus', function() {
      it('should update order status', function() {
        var orderId = 'order123';
        var status = 'shipped';
        var mockResponse = { orderId: orderId, orderStatus: status };

        $httpBackend.expectPATCH(apiBase + '/' + orderId + '/status', { orderStatus: status })
          .respond(200, mockResponse);

        OrderService.updateOrderStatus(orderId, status).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.orderStatus).toBe(status);
        });

        $httpBackend.flush();
      });

      it('should reject promise when updateOrderStatus fails', function() {
        var orderId = 'order123';
        var status = 'shipped';

        $httpBackend.expectPATCH(apiBase + '/' + orderId + '/status', { orderStatus: status })
          .respond(400, { message: 'Invalid status' });

        OrderService.updateOrderStatus(orderId, status).catch(function(error) {
          expect(error.status).toBe(400);
        });

        $httpBackend.flush();
      });
    });

    describe('updateShippingInfo', function() {
      it('should update shipping tracking information', function() {
        var orderId = 'order123';
        var trackingId = 'TRACK123456';
        var mockResponse = { orderId: orderId, shippingTrackingId: trackingId };

        $httpBackend.expectPATCH(apiBase + '/' + orderId + '/shipping', { shippingTrackingId: trackingId })
          .respond(200, mockResponse);

        OrderService.updateShippingInfo(orderId, trackingId).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.shippingTrackingId).toBe(trackingId);
        });

        $httpBackend.flush();
      });

      it('should reject promise when updateShippingInfo fails', function() {
        var orderId = 'order123';
        var trackingId = 'TRACK123456';

        $httpBackend.expectPATCH(apiBase + '/' + orderId + '/shipping', { shippingTrackingId: trackingId })
          .respond(403, { message: 'Forbidden' });

        OrderService.updateShippingInfo(orderId, trackingId).catch(function(error) {
          expect(error.status).toBe(403);
        });

        $httpBackend.flush();
      });
    });
  });
})();