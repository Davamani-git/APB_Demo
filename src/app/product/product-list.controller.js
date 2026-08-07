(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('ProductListController', ['productService', '$scope', '$routeParams', function(productService, $scope, $routeParams) {
      var vm = this;
      vm.products = [];
      vm.loading = false;
      vm.loadProducts = function() {
        vm.loading = true;
        productService.getProducts($routeParams).then(function(products) {
          vm.products = products;
          vm.loading = false;
        }, function(error) {
          vm.loading = false;
          toastr.error('Failed to load products');
        });
      };
      vm.loadProducts();
    }]);
})();