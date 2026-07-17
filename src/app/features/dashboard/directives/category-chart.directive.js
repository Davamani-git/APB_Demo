(function () {
  'use strict';

  angular.module('app.dashboard')
    .directive('categoryChart', [function () {
      return {
        restrict: 'E',
        templateUrl: 'src/app/features/dashboard/views/partials/category-breakdown.html',
        scope: {
          categories: '='
        }
      };
    }]);
}());
