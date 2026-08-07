/*
Test Documentation:
- Test Name: cartService - getCart
- Purpose: Validates retrieval of cart from localStorage
- Scenario: Cart data exists in localStorage
- Expected Result: Returns parsed cart array
*/
/*
Test Documentation:
- Test Name: cartService - addItem new product
- Purpose: Validates adding a new product to cart
- Scenario: Product does not exist in cart
- Expected Result: Product added to cart, syncCart called
*/
/*
Test Documentation:
- Test Name: cartService - addItem existing product
- Purpose: Validates updating quantity for existing product
- Scenario: Product already exists in cart
- Expected Result: Quantity incremented, syncCart called
*/
/*
Test Documentation:
- Test Name: cartService - removeItem
- Purpose: Validates removing item from cart
- Scenario: Valid cartItemId provided
- Expected Result: Item removed, syncCart called
*/
/*
Test Documentation:
- Test Name: cartService - updateQuantity
- Purpose: Validates updating item quantity
- Scenario: Valid cartItemId and quantity provided
- Expected Result: Quantity updated, syncCart called
*/
/*
Test Documentation:
- Test Name: cartService - clearCart
- Purpose: Validates clearing all items from cart
- Scenario: clearCart is called
- Expected Result: Cart removed from localStorage
*/
/*
Test Documentation:
- Test Name: cartService - getCartTotal
- Purpose: Validates calculation of cart total
- Scenario: Cart contains multiple items
- Expected Result: Returns correct sum of item prices × quantities
*/
/*
Coverage Report:
- Functions tested: getCart, saveCart, addItem, removeItem, updateQuantity, clearCart, syncCart, getCartTotal
- Scenarios covered: CRUD operations, calculations, API sync
- Uncovered scenarios: concurrent modifications, network failures
*/

(function() {
  'use strict';

  describe('cartService', function() {
    var cartService, $httpBackend, $window, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_cartService_, _$httpBackend_, _$window_, _apiConfig_) {
      cartService = _cartService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('getCart', function() {
      it('should return empty array when cart does not exist', function() {
        var cart = cartService.getCart();

        expect(cart).toEqual([]);
      });

      it('should return parsed cart from localStorage', function() {
        var mockCart = [{ cartItemId: '1', productId: 'P1', quantity: 2 }];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(mockCart));

        var cart = cartService.getCart();

        expect(cart).toEqual(mockCart);
      });
    });

    describe('addItem', function() {
      it('should add new product to cart', function() {
        var product = {
          productId: 'P123',
          name: 'Test Product',
          price: 29.99,
          imageUrl: 'test.jpg'
        };
        var quantity = 2;

        $httpBackend.expectPOST(apiConfig.baseUrl + '/cart/sync')
          .respond(200, { success: true });

        cartService.addItem(product, quantity);
        $httpBackend.flush();

        var cart = cartService.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].productId).toBe('P123');
        expect(cart[0].quantity).toBe(2);
        expect(cart[0].price).toBe(29.99);
      });

      it('should increment quantity for existing product', function() {
        var product = {
          productId: 'P123',
          name: 'Test Product',
          price: 29.99,
          imageUrl: 'test.jpg'
        };
        var existingCart = [{
          cartItemId: '1',
          productId: 'P123',
          name: 'Test Product',
          price: 29.99,
          quantity: 1,
          imageUrl: 'test.jpg'
        }];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        $httpBackend.expectPOST(apiConfig.baseUrl + '/cart/sync')
          .respond(200, { success: true });

        cartService.addItem(product, 2);
        $httpBackend.flush();

        var cart = cartService.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(3);
      });
    });

    describe('removeItem', function() {
      it('should remove item from cart', function() {
        var existingCart = [
          { cartItemId: '1', productId: 'P1', quantity: 1 },
          { cartItemId: '2', productId: 'P2', quantity: 2 }
        ];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        $httpBackend.expectPOST(apiConfig.baseUrl + '/cart/sync')
          .respond(200, { success: true });

        cartService.removeItem('1');
        $httpBackend.flush();

        var cart = cartService.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].cartItemId).toBe('2');
      });
    });

    describe('updateQuantity', function() {
      it('should update item quantity', function() {
        var existingCart = [
          { cartItemId: '1', productId: 'P1', quantity: 1 }
        ];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        $httpBackend.expectPOST(apiConfig.baseUrl + '/cart/sync')
          .respond(200, { success: true });

        cartService.updateQuantity('1', 5);
        $httpBackend.flush();

        var cart = cartService.getCart();
        expect(cart[0].quantity).toBe(5);
      });

      it('should not update when item not found', function() {
        var existingCart = [
          { cartItemId: '1', productId: 'P1', quantity: 1 }
        ];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        $httpBackend.expectPOST(apiConfig.baseUrl + '/cart/sync')
          .respond(200, { success: true });

        cartService.updateQuantity('999', 5);
        $httpBackend.flush();

        var cart = cartService.getCart();
        expect(cart[0].quantity).toBe(1);
      });
    });

    describe('clearCart', function() {
      it('should clear cart from localStorage', function() {
        var existingCart = [{ cartItemId: '1', productId: 'P1' }];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        var result;
        cartService.clearCart().then(function() {
          result = true;
        });

        expect($window.localStorage.getItem('shoppingCart')).toBeNull();
      });
    });

    describe('getCartTotal', function() {
      it('should calculate correct cart total', function() {
        var existingCart = [
          { cartItemId: '1', productId: 'P1', price: 10.00, quantity: 2 },
          { cartItemId: '2', productId: 'P2', price: 15.50, quantity: 3 }
        ];
        $window.localStorage.setItem('shoppingCart', JSON.stringify(existingCart));

        var total = cartService.getCartTotal();

        expect(total).toBe(66.50);
      });

      it('should return 0 for empty cart', function() {
        var total = cartService.getCartTotal();

        expect(total).toBe(0);
      });
    });
  });
})();