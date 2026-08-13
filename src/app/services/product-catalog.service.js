(function() {
  'use strict';
  angular.module('app.shopping')
    .service('ProductCatalogService', ['$http', '$q', 'API_BASE_URL', function($http, $q, API_BASE_URL) {
      var self = this;
      self.fetchProducts = function(query, filters) {
        var params = {};
        if (query) params.query = query;
        if (filters) {
          if (filters.category) params.category = filters.category;
          if (filters.minPrice) params.minPrice = filters.minPrice;
          if (filters.maxPrice) params.maxPrice = filters.maxPrice;
          if (filters.sortBy) params.sortBy = filters.sortBy;
        }
        return $http.get(API_BASE_URL + '/products', { params: params })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getProductById = function(productId) {
        return $http.get(API_BASE_URL + '/products/' + productId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.searchProducts = function(keyword) {
        return $http.get(API_BASE_URL + '/products/search', { params: { keyword: keyword } })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.addReview = function(productId, review) {
        return $http.post(API_BASE_URL + '/products/' + productId + '/reviews', review)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getReviews = function(productId) {
        return $http.get(API_BASE_URL + '/products/' + productId + '/reviews')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.addToWishlist = function(productId) {
        return $http.post(API_BASE_URL + '/wishlist', { productId: productId })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.getWishlist = function() {
        return $http.get(API_BASE_URL + '/wishlist')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
    }]);
})();