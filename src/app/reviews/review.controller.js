(function() {
  'use strict';
  angular.module('app.shopping')
    .controller('ReviewController', ['$scope', 'ProductCatalogService', 'NotificationService', function($scope, ProductCatalogService, NotificationService) {
      var vm = this;
      vm.productId = null;
      vm.reviews = [];
      vm.newReview = {
        rating: 5,
        comment: ''
      };
      vm.loading = false;
      vm.error = null;
      vm.init = function(productId) {
        vm.productId = productId;
        vm.loadReviews();
      };
      vm.loadReviews = function() {
        if (!vm.productId) return;
        vm.loading = true;
        vm.error = null;
        ProductCatalogService.getReviews(vm.productId)
          .then(function(data) {
            vm.reviews = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load reviews';
            vm.loading = false;
          });
      };
      vm.submitReview = function() {
        if (!vm.newReview.comment || vm.newReview.comment.trim() === '') {
          NotificationService.showNotification('Please enter a comment', 'warning');
          return;
        }
        ProductCatalogService.addReview(vm.productId, vm.newReview)
          .then(function() {
            NotificationService.showNotification('Review submitted successfully', 'success');
            vm.newReview = { rating: 5, comment: '' };
            vm.loadReviews();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to submit review', 'error');
          });
      };
    }]);
})();