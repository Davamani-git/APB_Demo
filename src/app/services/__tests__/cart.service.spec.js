/*
Test Documentation:
- Test Name: CartService getCart
- Purpose: Validates retrieval of cart items
- Scenario: Cart has items
- Expected Result: Array of cart items is returned
*/
/*
Test Documentation:
- Test Name: CartService addToCart new item
- Purpose: Validates adding new product to cart
- Scenario: Product not in cart
- Expected Result: Product is added with correct quantity
*/
/*
Test Documentation:
- Test Name: CartService addToCart existing item
- Purpose: Validates updating quantity for existing product
- Scenario: Product already in cart
- Expected Result: Quantity is incremented
*/
/*
Test Documentation:
- Test Name: CartService removeFromCart
- Purpose: Validates removal of item from cart
- Scenario: Item exists in cart
- Expected Result: Item is removed and event is broadcast
*/
/*
Test Documentation:
- Test Name: CartService updateQuantity
- Purpose: Validates updating item quantity
- Scenario: Item exists in cart
- Expected Result: Quantity is updated
*/
/*
Test Documentation:
- Test Name: CartService clearCart
- Purpose: Validates clearing all cart items
- Scenario: Cart has items
- Expected Result: Cart is emptied
*/
/*
Test Documentation:
- Test Name: CartService getCartCount
- Purpose: Validates total item count calculation
- Scenario: Cart has multiple items with quantities
- Expected Result: Total count is correct
*/
/*
Test Documentation:
- Test Name: CartService getCartTotal
- Purpose: Validates total price calculation
- Scenario: Cart has items with prices and quantities
- Expected Result: Total price is correct
*/
/*
Coverage Report:
- Functions tested: getCart, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartTotal
- Scenarios covered: get cart, add new item, add existing item, remove item, update quantity, clear cart, count items, calculate total
- Uncovered scenarios: none
*/

describe('CartService', function() {
  'use strict';
  
  beforeEach(module('onlineShoppingApp'));
  
  var CartService, $rootScope, $timeout;
  
  beforeEach(inject(function(_CartService_, _$rootScope_, _$timeout_) {
    CartService = _CartService_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  
  afterEach(function() {
    CartService.clearCart();
  });
  
  describe('getCart', function() {
    it('should return empty array initially', function() {
      var cart = CartService.getCart();
      expect(cart).toEqual([]);
    });
    
    it('should return cart items after adding', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      CartService.addToCart(product, 1).then(function() {
        var cart = CartService.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].productId).toBe('p1');
        done();
      });
      $timeout.flush();
    });
  });
  
  describe('addToCart', function() {
    it('should add new product to cart', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var broadcastSpy = jasmine.createSpy('broadcast');
      $rootScope.$on('cart:updated', broadcastSpy);
      
      CartService.addToCart(product, 2).then(function(cart) {
        expect(cart.length).toBe(1);
        expect(cart[0].productId).toBe('p1');
        expect(cart[0].productName).toBe('Laptop');
        expect(cart[0].quantity).toBe(2);
        expect(cart[0].price).toBe(999);
        expect(cart[0].cartItemId).toContain('ci-');
        expect(broadcastSpy).toHaveBeenCalled();
        done();
      });
      $timeout.flush();
    });
    
    it('should increment quantity for existing product', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      
      CartService.addToCart(product, 1).then(function() {
        return CartService.addToCart(product, 2);
      }).then(function(cart) {
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(3);
        done();
      });
      $timeout.flush();
      $timeout.flush();
    });
  });
  
  describe('removeFromCart', function() {
    it('should remove item from cart', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var broadcastSpy = jasmine.createSpy('broadcast');
      
      CartService.addToCart(product, 1).then(function(cart) {
        var cartItemId = cart[0].cartItemId;
        $rootScope.$on('cart:updated', broadcastSpy);
        CartService.removeFromCart(cartItemId);
        
        var updatedCart = CartService.getCart();
        expect(updatedCart.length).toBe(0);
        expect(broadcastSpy).toHaveBeenCalled();
        done();
      });
      $timeout.flush();
    });
  });
  
  describe('updateQuantity', function() {
    it('should update item quantity', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var broadcastSpy = jasmine.createSpy('broadcast');
      
      CartService.addToCart(product, 1).then(function(cart) {
        var cartItemId = cart[0].cartItemId;
        $rootScope.$on('cart:updated', broadcastSpy);
        CartService.updateQuantity(cartItemId, 5);
        
        var updatedCart = CartService.getCart();
        expect(updatedCart[0].quantity).toBe(5);
        expect(broadcastSpy).toHaveBeenCalled();
        done();
      });
      $timeout.flush();
    });
    
    it('should not update if item not found', function(done) {
      var product = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      
      CartService.addToCart(product, 1).then(function() {
        CartService.updateQuantity('non-existent-id', 10);
        var cart = CartService.getCart();
        expect(cart[0].quantity).toBe(1);
        done();
      });
      $timeout.flush();
    });
  });
  
  describe('clearCart', function() {
    it('should clear all items from cart', function(done) {
      var product1 = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var product2 = { productId: 'p2', name: 'Phone', price: 699, imageUrl: 'img.jpg' };
      var broadcastSpy = jasmine.createSpy('broadcast');
      
      CartService.addToCart(product1, 1).then(function() {
        return CartService.addToCart(product2, 1);
      }).then(function() {
        $rootScope.$on('cart:updated', broadcastSpy);
        CartService.clearCart();
        
        var cart = CartService.getCart();
        expect(cart.length).toBe(0);
        expect(broadcastSpy).toHaveBeenCalled();
        done();
      });
      $timeout.flush();
      $timeout.flush();
    });
  });
  
  describe('getCartCount', function() {
    it('should return 0 for empty cart', function() {
      expect(CartService.getCartCount()).toBe(0);
    });
    
    it('should return total quantity of all items', function(done) {
      var product1 = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var product2 = { productId: 'p2', name: 'Phone', price: 699, imageUrl: 'img.jpg' };
      
      CartService.addToCart(product1, 2).then(function() {
        return CartService.addToCart(product2, 3);
      }).then(function() {
        expect(CartService.getCartCount()).toBe(5);
        done();
      });
      $timeout.flush();
      $timeout.flush();
    });
  });
  
  describe('getCartTotal', function() {
    it('should return 0 for empty cart', function() {
      expect(CartService.getCartTotal()).toBe(0);
    });
    
    it('should return total price of all items', function(done) {
      var product1 = { productId: 'p1', name: 'Laptop', price: 999, imageUrl: 'img.jpg' };
      var product2 = { productId: 'p2', name: 'Phone', price: 699, imageUrl: 'img.jpg' };
      
      CartService.addToCart(product1, 2).then(function() {
        return CartService.addToCart(product2, 1);
      }).then(function() {
        expect(CartService.getCartTotal()).toBe(2697);
        done();
      });
      $timeout.flush();
      $timeout.flush();
    });
  });
});