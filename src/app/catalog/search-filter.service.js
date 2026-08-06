(function() {
  'use strict';
  angular.module('shoppingPlatform').service('SearchFilterService', ['$http', '$filter', 'API_CONFIG', function($http, $filter, API_CONFIG) {
    this.applyFilters = function(filters) {
      var params = {};
      if (filters.keyword) {
        params.keyword = filters.keyword;
      }
      if (filters.category) {
        params.category = filters.category;
      }
      if (filters.minPrice) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      return $http.get(API_CONFIG.baseUrl + '/api/products/search', {
        params: params,
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data;
      });
    };
    this.searchProducts = function(keyword) {
      return $http.get(API_CONFIG.baseUrl + '/api/products/search', {
        params: { keyword: keyword },
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();