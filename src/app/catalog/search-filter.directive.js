(function() {
  'use strict';
  angular.module('shoppingPlatform').directive('searchFilter', ['SearchFilterService', function(SearchFilterService) {
    return {
      restrict: 'E',
      scope: {
        filters: '=',
        onApply: '&',
        categories: '='
      },
      template: '<div class="panel panel-default">' +
        '<div class="panel-body">' +
        '<div class="row">' +
        '<div class="col-md-4">' +
        '<input type="text" class="form-control" ng-model="filters.keyword" placeholder="Search products..." ng-change="onFilterChange()">' +
        '</div>' +
        '<div class="col-md-3">' +
        '<select class="form-control" ng-model="filters.category" ng-change="onFilterChange()">' +
        '<option value="">All Categories</option>' +
        '<option ng-repeat="cat in categories" value="{{cat}}">{{cat}}</option>' +
        '</select>' +
        '</div>' +
        '<div class="col-md-2">' +
        '<input type="number" class="form-control" ng-model="filters.minPrice" placeholder="Min Price" ng-change="onFilterChange()">' +
        '</div>' +
        '<div class="col-md-2">' +
        '<input type="number" class="form-control" ng-model="filters.maxPrice" placeholder="Max Price" ng-change="onFilterChange()">' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button class="btn btn-primary" ng-click="applyFilters()">Search</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',
      link: function(scope, element, attrs) {
        scope.onFilterChange = function() {
        };
        scope.applyFilters = function() {
          scope.onApply();
        };
      }
    };
  }]);
})();