(function() {
  'use strict';
  angular.module('shoppingPlatform').service('CartService', ['$http', '$window', 'API_CONFIG', function($http, $window, API_CONFIG) {
    var localStorageKey = 'shopping_cart';
    this.getCart = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/cart', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data.items || [];
      }).catch(function(error) {
        var localCart = $window.localStorage.getItem(localStorageKey);
        if (localCart) {
          return JSON.parse(localCart);
        }
        return [];
      });
    };
    this.addItem = function(product, quantity) {
      var item = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : ''
      };
      return $http.post(API_CONFIG.baseUrl + '/api/cart/items', item, { timeout: API_CONFIG.timeout }).then(function(response) {
        this.syncLocalStorage();
        return response.data;
      }.bind(this)).catch(function(error) {
        this.addItemToLocalStorage(item);
        return item;
      }.bind(this));
    };
    this.updateItem = function(productId, quantity) {
      return $http.put(API_CONFIG.baseUrl + '/api/cart/items/' + productId, { quantity: quantity }, { timeout: API_CONFIG.timeout }).then(function(response) {
        this.syncLocalStorage();
        return response.data;
      }.bind(this));
    };
    this.removeItem = function(productId) {
      return $http.delete(API_CONFIG.baseUrl + '/api/cart/items/' + productId, { timeout: API_CONFIG.timeout }).then(function(response) {
        this.syncLocalStorage();
        return response.data;
      }.bind(this));
    };
    this.clearCart = function() {
      return $http.delete(API_CONFIG.baseUrl + '/api/cart', { timeout: API_CONFIG.timeout }).then(function(response) {
        $window.localStorage.removeItem(localStorageKey);
        return response.data;
      });
    };
    this.addItemToLocalStorage = function(item) {
      var cart = JSON.parse($window.localStorage.getItem(localStorageKey) || '[]');
      var existingItem = cart.find(function(i) { return i.productId === item.productId; });
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.push(item);
      }
      $window.localStorage.setItem(localStorageKey, JSON.stringify(cart));
    };
    this.syncLocalStorage = function() {
      this.getCart().then(function(items) {
        $window.localStorage.setItem(localStorageKey, JSON.stringify(items));
      });
    };
  }]);
})();