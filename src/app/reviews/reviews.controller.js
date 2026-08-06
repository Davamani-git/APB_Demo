(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('ReviewsController', ['$scope', 'ReviewsService', function($scope, ReviewsService) {
    var vm = this;
    vm.reviews = [];
    vm.newReview = {
      rating: 5,
      comment: ''
    };
    vm.productId = null;
    vm.init = function(productId) {
      vm.productId = productId;
      vm.loadReviews();
    };
    vm.loadReviews = function() {
      ReviewsService.getReviews(vm.productId).then(function(reviews) {
        vm.reviews = reviews;
      }).catch(function(error) {
        console.error('Error loading reviews:', error);
      });
    };
    vm.submitReview = function() {
      if (!vm.newReview.comment) {
        alert('Please enter a comment.');
        return;
      }
      ReviewsService.submitReview(vm.productId, vm.newReview).then(function() {
        alert('Review submitted successfully!');
        vm.newReview = { rating: 5, comment: '' };
        vm.loadReviews();
      }).catch(function(error) {
        alert('Failed to submit review.');
        console.error('Error submitting review:', error);
      });
    };
  }]);
})();