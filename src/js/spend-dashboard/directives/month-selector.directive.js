(function() {
  'use strict';

  function monthSelector(MonthSelectionService) {
    return {
      restrict: 'E',
      scope: {
        selectedMonth: '=',
        onMonthChange: '&',
        availableMonths: '='
      },
      templateUrl: 'src/js/spend-dashboard/views/month-selector.template.html',
      link: function(scope) {
        scope.onChange = function() {
          var selected = scope.selectedMonth;
          if (selected && !MonthSelectionService.isMonthSelectable(selected, scope.availableMonths)) {
            return;
          }
          scope.onMonthChange({ selectedMonth: selected });
        };
      }
    };
  }

  monthSelector.$inject = ['MonthSelectionService'];

  angular.module('davms.spendDashboard')
    .directive('monthSelector', monthSelector);
})();
