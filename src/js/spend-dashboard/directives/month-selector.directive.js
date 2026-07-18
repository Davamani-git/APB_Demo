(function() {
  'use strict';

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        availableMonths: '=',
        onMonthChange: '&'
      },
      template: [
        '<div class="month-selector">',
          '<label for="monthSelect">Select Month:</label>',
          '<select id="monthSelect" class="form-control" ng-model="selectedMonth" ng-change="handleChange()">',
            '<option value="" disabled>Choose a month...</option>',
            '<option ng-repeat="month in availableMonths" ng-value="month">',
              '{{ formatMonth(month) }}',
            '</option>',
          '</select>',
        '</div>'
      ].join(''),
      link: function(scope, element, attrs) {
        scope.formatMonth = function(month) {
          return MonthSelectionService.formatMonthDisplay(month);
        };
        
        scope.handleChange = function() {
          if (scope.selectedMonth && scope.onMonthChange) {
            scope.onMonthChange({ selectedMonth: scope.selectedMonth });
          }
        };
        
        // Watch for changes in available months and set default if needed
        scope.$watch('availableMonths', function(newMonths) {
          if (newMonths && newMonths.length > 0 && !scope.selectedMonth) {
            scope.selectedMonth = MonthSelectionService.getDefaultMonth(newMonths);
          }
        });
      }
    };
  }

  monthSelector.$inject = ['MonthSelectionService'];

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();