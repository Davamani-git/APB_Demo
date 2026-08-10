(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .controller('ProductController', ['$scope', 'ProductService', 'NotificationService', function($scope, ProductService, NotificationService) {
      var vm = this;
      vm.products = [];
      vm.currentProduct = {};
      vm.isEditing = false;
      vm.sellerId = sessionStorage.getItem('sellerId');
      vm.init = function() {
        vm.loadProducts();
      };
      vm.loadProducts = function() {
        if (!vm.sellerId) {
          NotificationService.showNotification('Seller ID not found', 'error');
          return;
        }
        ProductService.getProducts(vm.sellerId)
          .then(function(products) {
            vm.products = products;
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to load products: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.createProduct = function() {
        if (!vm.currentProduct.title || !vm.currentProduct.description || !vm.currentProduct.price) {
          NotificationService.showNotification('Please fill all required fields', 'error');
          return;
        }
        vm.currentProduct.sellerId = vm.sellerId;
        vm.currentProduct.images = vm.currentProduct.images || [];
        ProductService.createProduct(vm.currentProduct)
          .then(function(product) {
            NotificationService.showNotification('Product listed successfully', 'success');
            vm.products.push(product);
            vm.resetForm();
            vm.loadProducts();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to create product: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.editProduct = function(product) {
        vm.currentProduct = angular.copy(product);
        vm.isEditing = true;
      };
      vm.updateProduct = function() {
        if (!vm.currentProduct.productId) {
          NotificationService.showNotification('Product ID not found', 'error');
          return;
        }
        ProductService.updateProduct(vm.currentProduct.productId, vm.currentProduct)
          .then(function(product) {
            NotificationService.showNotification('Product updated successfully', 'success');
            vm.loadProducts();
            vm.resetForm();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to update product: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.deleteProduct = function(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
          return;
        }
        ProductService.deleteProduct(productId)
          .then(function() {
            NotificationService.showNotification('Product deleted successfully', 'success');
            vm.loadProducts();
          })
          .catch(function(error) {
            NotificationService.showNotification('Failed to delete product: ' + (error.data?.message || 'Please try again'), 'error');
          });
      };
      vm.resetForm = function() {
        vm.currentProduct = {};
        vm.isEditing = false;
      };
      vm.init();
    }]);
})();