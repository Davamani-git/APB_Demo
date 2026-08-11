/*
Test Documentation:
- Test Name: OrderService createOrder
- Purpose: Validates order creation
- Scenario: Valid order data provided
- Expected Result: Order is created and stored
*/
/*
Test Documentation:
- Test Name: OrderService getOrderHistory
- Purpose: Validates retrieval of user's order history
- Scenario: User has orders
- Expected Result: User's orders are returned
*/
/*
Test Documentation:
- Test Name: OrderService getOrderById success
- Purpose: Validates retrieval of specific order
- Scenario: Order exists
- Expected Result: Order is returned
*/
/*
Test Documentation:
- Test Name: OrderService getOrderById not found
- Purpose: Validates error when order doesn't exist
- Scenario: Order ID doesn't exist
- Expected Result: Promise is rejected with error message
*/
/*
Test Documentation:
- Test Name: OrderService cancelOrder success
- Purpose: Validates order cancellation
- Scenario: Order exists
- Expected Result: Order status is updated to Cancelled
*/
/*
Test Documentation:
- Test Name: OrderService cancelOrder not found
- Purpose: Validates error when cancelling non-existent order
- Scenario: Order ID doesn't exist
- Expected Result: Promise is rejected with error message
*/
/*
Coverage Report:
- Functions tested: createOrder, getOrderHistory, getOrderById, cancelOrder
- Scenarios covered: create order, get history, get by ID success, get by ID failure, cancel success, cancel failure
- Uncovered scenarios: none
*/

describe('OrderService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var OrderService, $timeout;
  
  beforeEach(inject(function(_OrderService_, _$timeout_) {
    OrderService = _OrderService_;
    $timeout = _$timeout_;
  }));
  
  describe('createOrder', function() {
    it('should create and store order', function(done) {
      var orderData = {
        orderId: 'ORD-123',
        userId: 'u1',
        items: [{ productId: 'p1', quantity: 2 }],
        totalAmount: 1998,
        status: 'Confirmed'
      };
      
      OrderService.createOrder(orderData).then(function(order) {
        expect(order.orderId).toBe('ORD-123');
        expect(order.userId).toBe('u1');
        expect(order.totalAmount).toBe(1998);
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getOrderHistory', function() {
    it('should return orders for specific user', function(done) {
      var order1 = { orderId: 'ORD-1', userId: 'u1', totalAmount: 1000 };
      var order2 = { orderId: 'ORD-2', userId: 'u2', totalAmount: 2000 };
      var order3 = { orderId: 'ORD-3', userId: 'u1', totalAmount: 1500 };
      
      OrderService.createOrder(order1).then(function() {
        return OrderService.createOrder(order2);
      }).then(function() {
        return OrderService.createOrder(order3);
      }).then(function() {
        return OrderService.getOrderHistory('u1');
      }).then(function(orders) {
        expect(orders.length).toBe(2);
        expect(orders[0].orderId).toBe('ORD-1');
        expect(orders[1].orderId).toBe('ORD-3');
        done();
      });
      
      $timeout.flush();
      $timeout.flush();
      $timeout.flush();
      $timeout.flush();
    });
    
    it('should return empty array for user with no orders', function(done) {
      OrderService.getOrderHistory('u-nonexistent').then(function(orders) {
        expect(orders.length).toBe(0);
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('getOrderById', function() {
    it('should return order when found', function(done) {
      var orderData = { orderId: 'ORD-456', userId: 'u1', totalAmount: 999 };
      
      OrderService.createOrder(orderData).then(function() {
        return OrderService.getOrderById('ORD-456');
      }).then(function(order) {
        expect(order.orderId).toBe('ORD-456');
        expect(order.totalAmount).toBe(999);
        done();
      });
      
      $timeout.flush();
      $timeout.flush();
    });
    
    it('should reject when order not found', function(done) {
      OrderService.getOrderById('ORD-nonexistent').catch(function(error) {
        expect(error).toBe('Order not found');
        done();
      });
      
      $timeout.flush();
    });
  });
  
  describe('cancelOrder', function() {
    it('should cancel order and update status', function(done) {
      var orderData = { orderId: 'ORD-789', userId: 'u1', status: 'Confirmed' };
      
      OrderService.createOrder(orderData).then(function() {
        return OrderService.cancelOrder('ORD-789');
      }).then(function(order) {
        expect(order.status).toBe('Cancelled');
        done();
      });
      
      $timeout.flush();
      $timeout.flush();
    });
    
    it('should reject when order not found', function(done) {
      OrderService.cancelOrder('ORD-nonexistent').catch(function(error) {
        expect(error).toBe('Order not found');
        done();
      });
      
      $timeout.flush();
    });
  });
});