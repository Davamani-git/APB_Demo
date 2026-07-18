(function() {
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
      template: '\n        <div class="month-selector-container">\n          <label for="monthSelectorControl">Select Month:</label>\n          <select id="monthSelectorControl" class="form-control"\n                  ng-model="internalSelected"\n                  ng-options="month as (month.year + '-' + (month.month < 10 ? ('0' + month.month) : month.month)) for month in availableMonths"\n                  ng-change="changeMonth()">\n          </select>\n        </div>\n      ',
      link: function(scope) {
        scope.internalSelected = scope.selectedMonth;

        scope.$watch('selectedMonth', function(newVal) {
          scope.internalSelected = newVal;
        });

        scope.changeMonth = function() {
          var candidate = scope.internalSelected;
          if (!MonthSelectionService.isMonthSelectable(candidate)) {
            return;
          }
          scope.selectedMonth = candidate;
          scope.onMonthChange({ selectedMonth: candidate });
        };
      }
    };
  }

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();
