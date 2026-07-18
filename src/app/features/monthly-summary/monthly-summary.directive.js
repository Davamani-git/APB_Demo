(function () {
  'use strict';

  MonthlySummaryDirective.$inject = [];

  function MonthlySummaryDirective() {
    return {
      restrict: 'E',
      scope: {
        summary: '<',
        breakdown: '<',
        availableMonths: '<',
        selectedMonth: '=',
        isLoading: '<',
        error: '<',
        onMonthChange: '&'
      },
      bindToController: true,
      controller: MonthlySummaryDirectiveController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/monthly-summary/monthly-summary.template.html'
    };
  }

  MonthlySummaryDirectiveController.$inject = [];

  function MonthlySummaryDirectiveController() {
    var vm = this;

    vm.handleMonthChange = function () {
      if (typeof vm.onMonthChange === 'function') {
        vm.onMonthChange();
      }
    };
  }

  angular.module('davmsApp')
    .directive('monthlySummaryDashboard', MonthlySummaryDirective);
})();
