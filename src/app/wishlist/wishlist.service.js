(function() {
  'use strict';
  angular.module('shoppingPlatform').service('WishlistService', ['$http', 'API_CONFIG', 'AuthService', function($http, API_CONFIG, AuthService) {
    this.getWishlist = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/wishlist', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data.items || [];
      });
    };
    this.addItem = function(productId) {
      return $http.post(API_CONFIG.baseUrl + '/api/wishlist/items', { productId: productId }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.removeItem = function(productId) {
      return $http.delete(API_CONFIG.baseUrl + '/api/wishlist/items/' + productId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();