(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('ProductService', ['$http', '$q', ProductService]);
  function ProductService($http, $q) {
    var self = this;
    var API_BASE = 'https://api.shopping.com';
    var mockProducts = [
      { productId: 'p1', name: 'Laptop', description: 'High-performance laptop', price: 999, imageUrl: 'https://via.placeholder.com/300x200?text=Laptop', category: 'Electronics', stock: 50, ratings: 4.5, reviews: [] },
      { productId: 'p2', name: 'Smartphone', description: 'Latest smartphone', price: 699, imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone', category: 'Electronics', stock: 100, ratings: 4.7, reviews: [] },
      { productId: 'p3', name: 'Headphones', description: 'Noise-cancelling headphones', price: 199, imageUrl: 'https://via.placeholder.com/300x200?text=Headphones', category: 'Electronics', stock: 75, ratings: 4.3, reviews: [] },
      { productId: 'p4', name: 'Tablet', description: 'Portable tablet', price: 499, imageUrl: 'https://via.placeholder.com/300x200?text=Tablet', category: 'Electronics', stock: 60, ratings: 4.4, reviews: [] },
      { productId: 'p5', name: 'Camera', description: 'Digital camera', price: 799, imageUrl: 'https://via.placeholder.com/300x200?text=Camera', category: 'Electronics', stock: 30, ratings: 4.6, reviews: [] },
      { productId: 'p6', name: 'Watch', description: 'Smart watch', price: 299, imageUrl: 'https://via.placeholder.com/300x200?text=Watch', category: 'Accessories', stock: 80, ratings: 4.2, reviews: [] }
    ];
    self.getProducts = function(filters) {
      var deferred = $q.defer();
      setTimeout(function() {
        var results = mockProducts;
        if (filters) {
          if (filters.keyword) {
            var keyword = filters.keyword.toLowerCase();
            results = results.filter(function(p) {
              return p.name.toLowerCase().indexOf(keyword) !== -1 || p.description.toLowerCase().indexOf(keyword) !== -1;
            });
          }
          if (filters.category) {
            results = results.filter(function(p) {
              return p.category === filters.category;
            });
          }
          if (filters.sortBy) {
            if (filters.sortBy === 'price-asc') {
              results.sort(function(a, b) { return a.price - b.price; });
            } else if (filters.sortBy === 'price-desc') {
              results.sort(function(a, b) { return b.price - a.price; });
            } else if (filters.sortBy === 'rating') {
              results.sort(function(a, b) { return b.ratings - a.ratings; });
            }
          }
        }
        deferred.resolve(results);
      }, 500);
      return deferred.promise;
    };
    self.getProductById = function(productId) {
      var deferred = $q.defer();
      setTimeout(function() {
        var product = mockProducts.find(function(p) { return p.productId === productId; });
        if (product) {
          deferred.resolve(product);
        } else {
          deferred.reject('Product not found');
        }
      }, 300);
      return deferred.promise;
    };
  }
})();