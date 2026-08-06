(function() {
  'use strict';
  angular.module('shoppingPlatform').controller('ProductManagementController', ['$scope', 'ProductManagementService', 'AuthService', function($scope, ProductManagementService, AuthService) {
    var vm = this;
    vm.products = [];
    vm.loading = false;
    vm.editMode = false;
    vm.selectedProduct = null;
    vm.newProduct = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      images: []
    };
    vm.categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
    vm.init = function() {
      vm.loadProducts();
    };
    vm.loadProducts = function() {
      vm.loading = true;
      ProductManagementService.getSellerProducts().then(function(products) {
        vm.products = products;
        vm.loading = false;
      }).catch(function(error) {
        vm.loading = false;
        alert('Failed to load products.');
        console.error('Error loading products:', error);
      });
    };
    vm.createProduct = function() {
      if (!vm.validateProduct(vm.newProduct)) {
        return;
      }
      ProductManagementService.createProduct(vm.newProduct).then(function(product) {
        alert('Product created successfully! It will appear in the catalog within 1 minute.');
        vm.loadProducts();
        vm.resetForm();
      }).catch(function(error) {
        alert('Failed to create product.');
        console.error('Error creating product:', error);
      });
    };
    vm.editProduct = function(product) {
      vm.editMode = true;
      vm.selectedProduct = angular.copy(product);
    };
    vm.updateProduct = function() {
      if (!vm.validateProduct(vm.selectedProduct)) {
        return;
      }
      ProductManagementService.updateProduct(vm.selectedProduct.id, vm.selectedProduct).then(function() {
        alert('Product updated successfully!');
        vm.loadProducts();
        vm.cancelEdit();
      }).catch(function(error) {
        alert('Failed to update product.');
        console.error('Error updating product:', error);
      });
    };
    vm.deleteProduct = function(productId) {
      if (!confirm('Are you sure you want to delete this product?')) {
        return;
      }
      ProductManagementService.deleteProduct(productId).then(function() {
        alert('Product deleted successfully!');
        vm.loadProducts();
      }).catch(function(error) {
        alert('Failed to delete product.');
        console.error('Error deleting product:', error);
      });
    };
    vm.uploadImages = function(files) {
      if (!files || files.length === 0) {
        return;
      }
      ProductManagementService.uploadImages(files).then(function(imageUrls) {
        if (vm.editMode) {
          vm.selectedProduct.images = vm.selectedProduct.images.concat(imageUrls);
        } else {
          vm.newProduct.images = vm.newProduct.images.concat(imageUrls);
        }
      }).catch(function(error) {
        alert('Failed to upload images.');
        console.error('Error uploading images:', error);
      });
    };
    vm.validateProduct = function(product) {
      if (!product.name || !product.description || !product.price || !product.category) {
        alert('Please fill in all required fields.');
        return false;
      }
      if (product.price <= 0) {
        alert('Price must be greater than 0.');
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
    };
    vm.cancelEdit = function() {
      vm.editMode = false;
      vm.selectedProduct = null;
    };
    vm.init();
  }]);
})();