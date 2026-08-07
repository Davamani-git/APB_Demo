(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('productService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.getProducts = function(params) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/products', {params: params, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getProductById = function(productId) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/products/' + productId, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.createProduct = function(productData) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/products', productData, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.updateProduct = function(productId, productData) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/products/' + productId, productData, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.deleteProduct = function(productId) {
        var deferred = $q.defer();
        $http.delete(apiConfig.baseUrl + '/products/' + productId, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();