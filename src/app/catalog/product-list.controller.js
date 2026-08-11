(function() {
  'use strict';
  angular.module('onlineShoppingApp').controller('ProductListController', ['ProductService', 'CartService', 'ToastFactory', '$scope', ProductListController]);
  function ProductListController(ProductService, CartService, ToastFactory, $scope) {
    var vm = this;
    vm.products = [];
    vm.filters = { keyword: '', category: '', sortBy: '' };
    vm.categories = ['Electronics', 'Accessories', 'Clothing', 'Home'];
    vm.loading = false;
    vm.searchProducts = function() {
      vm.loading = true;
      ProductService.getProducts(vm.filters).then(function(products) {
        vm.products = products;
        vm.loading = false;
      }).catch(function(error) {
        ToastFactory.error('Failed to load products');
        vm.loading = false;
      });
    };
    vm.addToCart = function(product) {
      CartService.addToCart(product, 1).then(function() {
        ToastFactory.success(product.name + ' added to cart');
      }).catch(function(error) {
        ToastFactory.error('Failed to add to cart');
      });
    };
    vm.searchProducts();
  }
})();