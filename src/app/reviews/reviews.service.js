(function() {
  'use strict';
  angular.module('shoppingPlatform').service('ReviewsService', ['$http', 'API_CONFIG', 'AuthService', function($http, API_CONFIG, AuthService) {
    this.getReviews = function(productId) {
      return $http.get(API_CONFIG.baseUrl + '/api/products/' + productId + '/reviews', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.submitReview = function(productId, reviewData) {
      var data = {
        productId: productId,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      return $http.post(API_CONFIG.baseUrl + '/api/reviews', data, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();