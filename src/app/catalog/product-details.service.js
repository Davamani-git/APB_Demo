(function() {
  'use strict';
  angular.module('shoppingPlatform').service('ProductDetailsService', ['$http', 'API_CONFIG', 'CDN_CONFIG', function($http, API_CONFIG, CDN_CONFIG) {
    this.getProductDetails = function(productId) {
      return $http.get(API_CONFIG.baseUrl + '/api/products/' + productId, { timeout: API_CONFIG.timeout }).then(function(response) {
        var product = response.data;
        if (product.images && product.images.length > 0) {
          product.images = product.images.map(function(img) {
            return CDN_CONFIG.baseUrl + '/images/' + img;
          });
        }
        return product;
      });
    };
  }]);
})();