(function() {
  'use strict';

  monthSelector.$inject = ['MonthSelectionService'];

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        availableMonths: '=',
        onMonthChange: '&'
      },
      template: [
        '<div class="davms-month-selector form-inline">',
        '  <label for="davmsMonthSelect">Month:&nbsp;</label>',
        '  <select id="davmsMonthSelect" class="form-control"',
        '          ng-model="internalSelected"',
        '          ng-options="m as (m.year + \'-\' + (m.month < 10 ? (\'0\' + m.month) : m.month)) for m in availableMonths">',
        '    <option value="">Select Month</option>',
        '  </select>',
        '</div>'
      ].join(''),
      link: function(scope) {
        scope.internalSelected = scope.selectedMonth;

        scope.$watch('internalSelected', function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }
          if (!newVal) {
            return;
          }
          var selectable = MonthSelectionService.isMonthSelectable(newVal, scope.availableMonths);
          if (!selectable) {
            // Prevent selection outside supported range
            scope.internalSelected = scope.selectedMonth;
            return;
          }
          scope.selectedMonth = newVal;
          scope.onMonthChange({ selectedMonth: newVal });
        });
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();
