(function () {
  'use strict';

  angular.module('app.dashboard')
    .directive('monthPicker', ['dateUtils', 'validationUtils', function (dateUtils, validationUtils) {
      return {
        restrict: 'E',
        templateUrl: 'src/app/features/dashboard/views/partials/month-picker.html',
        scope: {
          ngModel: '=',
          onChange: '&'
        },
        link: function (scope) {
          scope.availableMonths = buildAvailableMonths();
          scope.monthInvalid = false;

          scope.onMonthSelected = function () {
            if (validationUtils.isValidMonth(scope.ngModel)) {
              scope.monthInvalid = false;
              scope.onChange({ newMonth: scope.ngModel });
            } else {
              scope.monthInvalid = true;
            }
          };

          function buildAvailableMonths() {
            var months = [];
            var now = new Date();
            var current = new Date(now.getFullYear(), now.getMonth(), 1);
            var maxHistory = 36;
            for (var i = 0; i <= maxHistory; i++) {
              var year = current.getFullYear();
              var monthIndex = current.getMonth() - i;
              var date = new Date(year, monthIndex, 1);
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              var label = y + '-' + (m < 10 ? '0' + m : m);
              months.push(label);
            }
            return months;
          }
        }
      };
    }]);
}());
