(function() {
  'use strict';
  angular.module('app.shopping')
    .controller('ProductController', ['$scope', 'ProductCatalogService', 'CartService', 'NotificationService', function($scope, ProductCatalogService, CartService, NotificationService) {
      var vm = this;
      vm.products = [];
      vm.searchQuery = '';
      vm.filters = {
        category: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'name'
      };
      vm.categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
      vm.sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Rating' }
      ];
      vm.loading = false;
      vm.error = null;
      vm.init = function() {
        vm.loadProducts();
      };
      vm.loadProducts = function() {
        vm.loading = true;
        vm.error = null;
        ProductCatalogService.fetchProducts(vm.searchQuery, vm.filters)
          .then(function(data) {
            vm.products = data;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load products. Please try again.';
            vm.loading = false;
            NotificationService.showNotification('Error loading products', 'error');
          });
      };
      vm.search = function() {
        vm.loadProducts();
      };
      vm.applyFilters = function() {
        vm.loadProducts();
      };
      vm.clearFilters = function() {
        vm.filters = {
          category: '',
          minPrice: null,
          maxPrice: null,
          sortBy: 'name'
        };
        vm.searchQuery = '';
        vm.loadProducts();
      };
      vm.addToCart = function(product) {
        CartService.addItem(product.productId, 1)
          .then(function() {
            NotificationService.showNotification('Product added to cart', 'success');
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to add product to cart', 'error');
          });
      };
      vm.addToWishlist = function(product) {
        ProductCatalogService.addToWishlist(product.productId)
          .then(function() {
            NotificationService.showNotification('Product added to wishlist', 'success');
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to add to wishlist', 'error');
          });
      };
      vm.init();
    }]);
})();