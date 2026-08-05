(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .directive('ccdMonthlySpendChart', ccdMonthlySpendChart);

  function ccdMonthlySpendChart() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      templateUrl: 'src/app/dashboard/views/partials/monthly-spend-chart.html'
    };
  }
})();
