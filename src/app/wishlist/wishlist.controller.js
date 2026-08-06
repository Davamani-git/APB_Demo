(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('WishlistController', ['$scope', 'WishlistService', 'CartService', function($scope, WishlistService, CartService) {
    var vm = this;
    vm.wishlistItems = [];
    vm.loading = false;
    vm.init = function() {
      vm.loadWishlist();
    };
    vm.loadWishlist = function() {
      vm.loading = true;
      WishlistService.getWishlist().then(function(items) {
        vm.wishlistItems = items;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load wishlist.');
        console.error('Error loading wishlist:', error);
      });
    };
    vm.removeItem = function(productId) {
      if (confirm('Remove this item from wishlist?')) {
        WishlistService.removeItem(productId).then(function() {
          vm.loadWishlist();
        }).catch(function(error) {
          alert('Failed to remove item.');
          console.error('Error removing item:', error);
        });
      }
    };
    vm.moveToCart = function(item) {
      var product = {
        id: item.productId,
        name: item.productName,
        price: item.price,
        images: [item.imageUrl]
      };
      CartService.addItem(product, 1).then(function() {
        alert('Item moved to cart!');
        vm.removeItem(item.productId);
      }).catch(function(error) {
        alert('Failed to move item to cart.');
        console.error('Error moving to cart:', error);
      });
    };
    vm.init();
  }]);
})();