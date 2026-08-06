(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('ProductDetailsController', ['$scope', '$routeParams', 'ProductDetailsService', 'CartService', 'WishlistService', 'ReviewsService', function($scope, $routeParams, ProductDetailsService, CartService, WishlistService, ReviewsService) {
    var vm = this;
    vm.product = null;
    vm.reviews = [];
    vm.loading = false;
    vm.quantity = 1;
    vm.selectedImage = null;
    vm.init = function() {
      vm.loading = true;
      var productId = $routeParams.id;
      ProductDetailsService.getProductDetails(productId).then(function(product) {
        vm.product = product;
        vm.selectedImage = product.images && product.images.length > 0 ? product.images[0] : null;
        vm.loading = false;
        return ReviewsService.getReviews(productId);
      }).then(function(reviews) {
        vm.reviews = reviews;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load product details.');
        console.error('Error loading product:', error);
      });
    };
    vm.addToCart = function() {
      CartService.addItem(vm.product, vm.quantity).then(function() {
        alert('Product added to cart!');
      }).catch(function(error) {
        alert('Failed to add product to cart.');
        console.error('Error adding to cart:', error);
      });
    };
    vm.addToWishlist = function() {
      WishlistService.addItem(vm.product.id).then(function() {
        alert('Product added to wishlist!');
      }).catch(function(error) {
        alert('Failed to add to wishlist.');
        console.error('Error adding to wishlist:', error);
      });
    };
    vm.selectImage = function(image) {
      vm.selectedImage = image;
    };
    vm.init();
  }]);
})();