(function() {
  'use strict';
  angular.module('shoppingPlatform').service('ProductCatalogService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    var cache = {};
    var cacheExpiry = 300000;
    this.getProducts = function() {
      var cacheKey = 'products_all';
      if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheExpiry)) {
        return $q.resolve(cache[cacheKey].data);
      }
      return $http.get(API_CONFIG.baseUrl + '/api/products', { timeout: API_CONFIG.timeout }).then(function(response) {
        cache[cacheKey] = {
          data: response.data,
          timestamp: Date.now()
        };
        return response.data;
      });
    };
    this.getProductDetails = function(productId) {
      var cacheKey = 'product_' + productId;
      if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheExpiry)) {
        return $q.resolve(cache[cacheKey].data);
      }
      return $http.get(API_CONFIG.baseUrl + '/api/products/' + productId, { timeout: API_CONFIG.timeout }).then(function(response) {
        cache[cacheKey] = {
          data: response.data,
          timestamp: Date.now()
        };
        return response.data;
      });
    };
    this.clearCache = function() {
      cache = {};
    };
  }]);
})();