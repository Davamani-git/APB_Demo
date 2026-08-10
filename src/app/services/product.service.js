(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('ProductService', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/products';
      return {
        getProducts: function(sellerId) {
          return $http.get(apiBase + '?sellerId=' + sellerId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getProduct: function(productId) {
          return $http.get(apiBase + '/' + productId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        createProduct: function(productData) {
          return $http.post(apiBase, productData)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateProduct: function(productId, productData) {
          return $http.put(apiBase + '/' + productId, productData)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        deleteProduct: function(productId) {
          return $http.delete(apiBase + '/' + productId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();