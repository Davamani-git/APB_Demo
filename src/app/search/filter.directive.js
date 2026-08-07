(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .directive('filterDirective', ['searchService', function(searchService) {
      return {
        restrict: 'E',
        templateUrl: 'src/app/search/filter.template.html',
        scope: {
          onFilterChange: '&'
        },
        link: function(scope, element, attrs) {
          scope.filters = {
            priceRange: {min: 0, max: 1000},
            rating: 0
          };
          scope.applyFilters = function() {
            scope.onFilterChange({filters: scope.filters});
          };
        }
      };
    }]);
})();