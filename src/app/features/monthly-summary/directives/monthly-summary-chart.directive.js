(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .directive('monthlySummaryChart', monthlySummaryChart)
    .controller('MonthlySummaryChartController', MonthlySummaryChartController);

  function monthlySummaryChart() {
    return {
      restrict: 'E',
      scope: {
        summary: '<'
      },
      bindToController: true,
      controller: 'MonthlySummaryChartController',
      controllerAs: 'vm',
      templateUrl: 'app/features/monthly-summary/templates/monthly-summary-chart.template.html'
    };
  }

  function MonthlySummaryChartController() {
    var vm = this;
  }
})();
