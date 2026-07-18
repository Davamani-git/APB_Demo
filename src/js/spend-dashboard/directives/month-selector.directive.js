(function() {
  'use strict';

  monthSelector.$inject = ['MonthSelectionService'];

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        availableMonths: '=',
        selectedMonth: '=',
        onMonthChange: '&'
      },
      template: [
        '<div class="month-selector-container">',
        '  <label class="month-selector-label">Select Month:</label>',
        '  <select class="form-control month-selector-control" ng-model="selectedMonth" ng-change="handleChange()" ng-options="formatMonth(month) for month in availableMonths track by (month.year + \'-\' + month.month)">',
        '  </select>',
        '</div>'
      ].join(''),
      link: function(scope, element, attrs) {
        scope.formatMonth = function(month) {
          return MonthSelectionService.formatMonthDisplay(month);
        };

        scope.handleChange = function() {
          if (scope.onMonthChange) {
            scope.onMonthChange({ selectedMonth: scope.selectedMonth });
          }
        };
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();