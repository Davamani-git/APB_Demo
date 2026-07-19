(function () {
  'use strict';

  SpendSummaryDirective.$inject = [];

  angular.module('app')
    .directive('spendSummaryDashboard', SpendSummaryDirective);

  function SpendSummaryDirective() {
    return {
      restrict: 'E',
      scope: {
        summary: '<',
        isLoading: '<',
        hasError: '<',
        errorMessage: '@',
        availableMonths: '<',
        selectedMonth: '<',
        onMonthChange: '&',
        onRetry: '&'
      },
      bindToController: true,
      controller: SpendSummaryDashboardController,
      controllerAs: 'vm',
      templateUrl: 'src/app/features/spend-summary/spend-summary.template.html',
      transclude: false,
      replace: false
    };
  }

  SpendSummaryDashboardController.$inject = [];

  function SpendSummaryDashboardController() {
    var vm = this;
    // Composition root - no additional logic.
  }
})();
