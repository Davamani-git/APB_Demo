(function() {
  'use strict';

  monthSelector.$inject = ['MonthSelectionService'];

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        onMonthChange: '&',
        availableMonths: '<'
      },
      template: '<div class="month-selector-container">' +
        '<label for="davms-month-selector">Select month:</label>' +
        '<select id="davms-month-selector" class="form-control" ' +
        'ng-model="internalSelected" ' +
        'ng-options="month as (month.year + - + (month.month < 10 ? ( 0 + month.month) : month.month)) for month in selectableMonths" ' +
        'ng-change="handleChange()">' +
        '<option value="">-- Select --</option>' +
        '</select>' +
        '</div>',
      link: function(scope) {
        scope.selectableMonths = [];

        scope.$watch('availableMonths', function(newVal) {
          if (Array.isArray(newVal)) {
            scope.selectableMonths = newVal.filter(function(month) {
              return MonthSelectionService.isMonthSelectable(month);
            });
          } else {
            scope.selectableMonths = [];
          }
          scope.internalSelected = scope.selectedMonth;
        });

        scope.$watch('selectedMonth', function(newVal) {
          scope.internalSelected = newVal;
        });

        scope.handleChange = function() {
          scope.selectedMonth = scope.internalSelected;
          if (scope.onMonthChange) {
            scope.onMonthChange({ selectedMonth: scope.internalSelected });
          }
        };
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();
