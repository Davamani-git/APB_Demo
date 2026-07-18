(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .directive('summaryCard', summaryCard);

  function summaryCard() {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        icon: '@',
        value: '<',
        valueFormat: '@',
        subtext: '@'
      },
      bindToController: true,
      controller: SummaryCardController,
      controllerAs: 'vmCard',
      templateUrl: 'app/shared/templates/components/summary-card.html'
    };
  }

  SummaryCardController.$inject = ['$filter'];

  function SummaryCardController($filter) {
    var vm = this;

    vm.getFormattedValue = function() {
      if (vm.valueFormat === 'currency') {
        return $filter('currencyPrecise')(vm.value);
      }
      if (vm.valueFormat === 'number') {
        return $filter('number')(vm.value);
      }
      return vm.value;
    };
  }
})();
