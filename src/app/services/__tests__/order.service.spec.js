/*
Test Documentation:
- Test Name: orderService - createOrder success
- Purpose: Validates order creation
- Scenario: Valid order data provided
- Expected Result: Promise resolves with created order
*/
/*
Test Documentation:
- Test Name: orderService - getOrders success
- Purpose: Validates retrieval of orders with filters
- Scenario: Valid query parameters provided
- Expected Result: Promise resolves with orders list
*/
/*
Test Documentation:
- Test Name: orderService - getOrderById success
- Purpose: Validates retrieval of single order
- Scenario: Valid orderId provided
- Expected Result: Promise resolves with order details
*/
/*
Test Documentation:
- Test Name: orderService - updateOrderStatus success
- Purpose: Validates updating order status
- Scenario: Valid orderId and status provided
- Expected Result: Promise resolves with updated order
*/
/*
Coverage Report:
- Functions tested: createOrder, getOrders, getOrderById, updateOrderStatus
- Scenarios covered: CRUD operations, filtering, error handling
- Uncovered scenarios: order cancellation, refunds
*/

(function() {
  'use strict';

  describe('orderService', function() {
    var orderService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_orderService_, _$httpBackend_, _apiConfig_) {
      orderService = _orderService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('createOrder', function() {
      it('should create order successfully', function() {
        var orderData = {
          customerId: 'C123',
          items: [{ productId: 'P1', quantity: 2 }],
          totalAmount: 59.98
        };
        var mockResponse = {
          orderId: 'O456',
          status: 'pending',
          totalAmount: 59.98
        };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/orders', orderData)
          .respond(201, mockResponse);

        var result;
        orderService.createOrder(orderData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.orderId).toBe('O456');
      });

      it('should reject promise on creation error', function() {
        var orderData = { customerId: 'C123' };

        $httpBackend.expectPOST(apiConfig.baseUrl + '/orders')
          .respond(400, { message: 'Invalid order data' });

        var error;
        orderService.createOrder(orderData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(400);
      });
    });

    describe('getOrders', function() {
      it('should retrieve orders with filters', function() {
        var params = { customerId: 'C123', status: 'completed' };
        var mockOrders = [
          { orderId: 'O1', status: 'completed', totalAmount: 100 },
          { orderId: 'O2', status: 'completed', totalAmount: 200 }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/orders?customerId=C123&status=completed')
          .respond(200, mockOrders);

        var result;
        orderService.getOrders(params).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockOrders);
        expect(result.length).toBe(2);
      });

      it('should reject promise on retrieval error', function() {
        var params = { customerId: 'C123' };

        $httpBackend.expectGET(apiConfig.baseUrl + '/orders?customerId=C123')
          .respond(500, { message: 'Server error' });

        var error;
        orderService.getOrders(params).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('getOrderById', function() {
      it('should retrieve order by ID', function() {
        var orderId = 'O123';
        var mockOrder = {
          orderId: 'O123',
          customerId: 'C456',
          status: 'shipped',
          items: [{ productId: 'P1', quantity: 1 }]
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/orders/' + orderId)
          .respond(200, mockOrder);

        var result;
        orderService.getOrderById(orderId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockOrder);
        expect(result.orderId).toBe('O123');
      });

      it('should reject promise when order not found', function() {
        var orderId = 'O999';

        $httpBackend.expectGET(apiConfig.baseUrl + '/orders/' + orderId)
          .respond(404, { message: 'Order not found' });

        var error;
        orderService.getOrderById(orderId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('updateOrderStatus', function() {
      it('should update order status successfully', function() {
        var orderId = 'O123';
        var status = 'delivered';
        var mockResponse = { orderId: 'O123', status: 'delivered' };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/orders/' + orderId, { status: status })
          .respond(200, mockResponse);

        var result;
        orderService.updateOrderStatus(orderId, status).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.status).toBe('delivered');
      });

      it('should reject promise on update error', function() {
        var orderId = 'O123';
        var status = 'delivered';

        $httpBackend.expectPUT(apiConfig.baseUrl + '/orders/' + orderId)
          .respond(400, { message: 'Invalid status' });

        var error;
        orderService.updateOrderStatus(orderId, status).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(400);
      });
    });
  });
})();