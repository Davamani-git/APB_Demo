(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .directive('remindersCalendar', remindersCalendarDirective);

  remindersCalendarDirective.$inject = ['RemindersCalendarService'];

  function remindersCalendarDirective(RemindersCalendarService) {
    return {
      restrict: 'E',
      scope: {
        reminders: '=',
        onSelect: '&'
      },
      template: '\n        <div class="reminders-calendar">\n          <div class="row">\n            <div class="col-xs-12" ng-repeat="day in vm.calendar.days">\n              <div class="calendar-day" ng-class="{\'has-reminders\': day.reminders.length}">\n                <strong>{{day.date | date: \'MMM d\'}}</strong>\n                <ul>\n                  <li ng-repeat="reminder in day.reminders">\n                    <a href="" ng-click="vm.select(reminder)">{{reminder.merchantName}} - {{reminder.amount | currencySafe:reminder.currency}}</a>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      ',
      controllerAs: 'vm',
      controller: ['$scope', function ($scope) {
        const vm = this;
        vm.calendar = { days: [] };

        vm.$onInit = function () {
          build();
        };

        $scope.$watch('reminders', function () {
          build();
        }, true);

        vm.select = function (reminder) {
          $scope.onSelect({ reminder: reminder });
        };

        function build() {
          const today = new Date();
          vm.calendar = RemindersCalendarService.buildCalendarMonth($scope.reminders || [], today);
        }
      }]
    };
  }
})();
