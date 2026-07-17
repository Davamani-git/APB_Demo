(function () {
  'use strict';

  angular.module('app.dashboard')
    .directive('kpiCard', [function () {
      return {
        restrict: 'E',
        templateUrl: 'src/app/features/dashboard/views/partials/kpi-cards.html',
        scope: {
          title: '@',
          value: '=',
          currency: '@?'
        }
      };
    }]);
}());
