(function() {
  'use strict';
  angular.module('shoppingPlatform').service('ProductManagementService', ['$http', 'API_CONFIG', 'CDN_CONFIG', 'AuthService', function($http, API_CONFIG, CDN_CONFIG, AuthService) {
    this.getSellerProducts = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/seller/products', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.createProduct = function(productData) {
      var userData = AuthService.getUserData();
      productData.sellerId = userData ? userData.id : null;
      return $http.post(API_CONFIG.baseUrl + '/api/products', productData, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.updateProduct = function(productId, productData) {
      return $http.put(API_CONFIG.baseUrl + '/api/products/' + productId, productData, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.deleteProduct = function(productId) {
      return $http.delete(API_CONFIG.baseUrl + '/api/products/' + productId, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.uploadImages = function(files) {
      var formData = new FormData();
      for (var i = 0; i < files.length; i++) {
        if (files[i].size > CDN_CONFIG.maxFileSize) {
          return Promise.reject('File size exceeds 5MB limit');
        }
        formData.append('images', files[i]);
      }
      return $http.post(CDN_CONFIG.baseUrl + '/upload', formData, {
        headers: { 'Content-Type': undefined },
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data.urls || [];
      });
    };
  }]);
})();