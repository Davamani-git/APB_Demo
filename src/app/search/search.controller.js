(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .controller('SearchController', ['searchService', '$scope', function(searchService, $scope) {
      var vm = this;
      vm.searchParams = {
        keyword: '',
        category: ''
      };
      vm.results = [];
      vm.categories = [];
      vm.loading = false;
      vm.sortOptions = ['price-asc', 'price-desc', 'name-asc', 'rating-desc'];
      vm.selectedSort = 'price-asc';
      vm.loadCategories = function() {
        searchService.getCategories().then(function(categories) {
          vm.categories = categories;
        });
      };
      vm.search = function() {
        if (!vm.searchParams.keyword && !vm.searchParams.category) {
          toastr.warning('Please enter a keyword or select a category');
          return;
        }
        vm.loading = true;
        var params = angular.copy(vm.searchParams);
        params.sort = vm.selectedSort;
        searchService.search(params).then(function(results) {
          vm.results = results;
          vm.loading = false;
          if (results.length === 0) {
            toastr.info('No products found');
          }
        }, function(error) {
          vm.loading = false;
          toastr.error('Search failed');
        });
      };
      vm.loadCategories();
    }]);
})();