(function() {
  'use strict';

  ssKpiCard.$inject = [];

  function ssKpiCard() {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        value: '<',
        label: '@',
        iconClass: '@',
        trendIndicator: '<'
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: [function() {
        var vm = this;

        vm.getTrendClass = function() {
          if (!vm.trendIndicator || !vm.trendIndicator.direction) {
            return '';
          }
          return vm.trendIndicator.direction === 'up' ? 'kpi-trend-up' : 'kpi-trend-down';
        };

        vm.getTrendIcon = function() {
          if (!vm.trendIndicator || !vm.trendIndicator.direction) {
            return '';
          }
          return vm.trendIndicator.direction === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
        };
      }],
      templateUrl: 'src/app/modules/dashboard/templates/kpi-card.html'
    };
  }

  angular.module('app')
    .directive('ssKpiCard', ssKpiCard);
})();
