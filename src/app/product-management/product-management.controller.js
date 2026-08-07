(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('ProductManagementController', ['productService', '$scope', 'Upload', function(productService, $scope, Upload) {
      var vm = this;
      vm.products = [];
      vm.newProduct = {
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        images: []
      };
      vm.imageUrls = [];
      vm.isEditing = false;
      vm.loadProducts = function() {
        productService.getProducts({sellerId: 'current'}).then(function(products) {
          vm.products = products;
        }, function(error) {
          toastr.error('Failed to load products');
        });
      };
      vm.submitProduct = function() {
        if (!vm.validateProduct()) {
          return;
        }
        vm.newProduct.images = vm.imageUrls;
        productService.createProduct(vm.newProduct).then(function(response) {
          toastr.success('Product listed successfully. Product ID: ' + response.productId);
          vm.resetForm();
          vm.loadProducts();
        }, function(error) {
          toastr.error('Failed to create product');
        });
      };
      vm.validateProduct = function() {
        if (!vm.newProduct.name || !vm.newProduct.description || !vm.newProduct.price) {
          toastr.error('Please fill in all required fields');
          return false;
        }
        if (vm.imageUrls.length === 0) {
          toastr.error('Please upload at least one product image');
          return false;
        }
        return true;
      };
      vm.resetForm = function() {
        vm.newProduct = {
          name: '',
          description: '',
          price: 0,
          category: '',
          stock: 0,
          images: []
        };
        vm.imageUrls = [];
      };
      vm.onImagesUploaded = function(urls) {
        vm.imageUrls = urls;
        $scope.$apply();
      };
      vm.loadProducts();
    }]);
})();