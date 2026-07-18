(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .directive('monthSelector', monthSelector)
    .controller('MonthSelectorController', MonthSelectorController);

  function monthSelector() {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        availableMonths: '<',
        onMonthChange: '&'
      },
      bindToController: true,
      controller: 'MonthSelectorController',
      controllerAs: 'vm',
      templateUrl: 'app/features/monthly-summary/templates/month-selector.template.html'
    };
  }

  function MonthSelectorController() {
    var vm = this;

    vm.handleChange = function() {
      if (vm.onMonthChange) {
        vm.onMonthChange({ month: vm.selectedMonth });
      }
    };
  }
})();
