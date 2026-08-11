(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('ProductDetailController', ['ProductService', 'CartService', 'ToastFactory', '$routeParams', '$scope', ProductDetailController]);
  function ProductDetailController(ProductService, CartService, ToastFactory, $routeParams, $scope) {
    var vm = this;
    vm.product = null;
    vm.quantity = 1;
    vm.loading = true;
    vm.loadProduct = function() {
      ProductService.getProductById($routeParams.productId).then(function(product) {
        vm.product = product;
        vm.loading = false;
      }).catch(function(error) {
        ToastFactory.error('Product not found');
        vm.loading = false;
      });
    };
    vm.addToCart = function() {
      CartService.addToCart(vm.product, vm.quantity).then(function() {
        ToastFactory.success(vm.product.name + ' added to cart');
      }).catch(function(error) {
        ToastFactory.error('Failed to add to cart');
      });
    };
    vm.loadProduct();
  }
})();