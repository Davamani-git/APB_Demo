(function() {
  'use strict';
  angular.module('financeApp')
    .factory('CategoryService', ['$http', '$cacheFactory', 'API_CONFIG', function($http, $cacheFactory, API_CONFIG) {
      var cache = $cacheFactory('categoryCache');
      var service = {
        getCategories: getCategories,
        correctCategory: correctCategory
      };
      return service;
      function getCategories() {
        var cached = cache.get('categories');
        if (cached) {
          return Promise.resolve(cached);
        }
        return $http.get(API_CONFIG.baseUrl + '/categories')
          .then(function(response) {
            cache.put('categories', response.data);
            return response.data;
          });
      }
      function correctCategory(transactionId, categoryId) {
        return $http.patch(API_CONFIG.baseUrl + '/transactions/' + transactionId + '/category', {
          categoryId: categoryId
        }).then(function(response) {
          return response.data;
        });
      }
    }]);
})();