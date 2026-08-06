(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('ProductCatalogController', ['$scope', 'ProductCatalogService', 'SearchFilterService', function($scope, ProductCatalogService, SearchFilterService) {
    var vm = this;
    vm.products = [];
    vm.loading = false;
    vm.error = null;
    vm.filters = {
      keyword: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name'
    };
    vm.categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
    vm.init = function() {
      vm.loadProducts();
    };
    vm.loadProducts = function() {
      vm.loading = true;
      vm.error = null;
      ProductCatalogService.getProducts().then(function(products) {
        vm.products = products;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to load products. Please try again.';
        vm.loading = false;
        console.error('Error loading products:', error);
      });
    };
    vm.applyFilters = function() {
      vm.loading = true;
      vm.error = null;
      SearchFilterService.applyFilters(vm.filters).then(function(filteredProducts) {
        vm.products = filteredProducts;
        vm.loading = false;
      }).catch(function(error) {
        vm.error = 'Failed to apply filters. Please try again.';
        vm.loading = false;
        console.error('Error applying filters:', error);
      });
    };
    vm.clearFilters = function() {
      vm.filters = {
        keyword: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'name'
      };
      vm.loadProducts();
    };
    vm.init();
  }]);
})();