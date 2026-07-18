(function () {
  'use strict';

  monthSelector.$inject = ['MonthSelectionService'];

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        onMonthChange: '&',
        availableMonths: '='
      },
      template: [
        '<div class="month-selector-container">',
        '  <label for="monthSelector" class="control-label">Select Month</label>',
        '  <select id="monthSelector" class="form-control"',
        '          ng-model="internalSelected"',
        '          ng-options="m as (m.year + \'-\' + (m.month < 10 ? (\'0\' + m.month) : m.month)) for m in availableMonths">',
        '    <option value="">-- Select --</option>',
        '  </select>',
        '  <p class="help-block" ng-if="!isSelectable">Selected month is outside the supported range.</p>',
        '</div>'
      ].join(''),
      link: function (scope) {
        scope.$watch('selectedMonth', function (newVal) {
          scope.internalSelected = newVal;
          scope.isSelectable = MonthSelectionService.isMonthSelectable(newVal);
        }, true);

        scope.$watch('internalSelected', function (newVal) {
          if (!newVal) {
            return;
          }
          var selectable = MonthSelectionService.isMonthSelectable(newVal);
          scope.isSelectable = selectable;
          if (selectable) {
            scope.selectedMonth = newVal;
            scope.onMonthChange({ selectedMonth: newVal });
          }
        }, true);
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();
