(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .directive('reminderCard', reminderCardDirective);

  function reminderCardDirective() {
    return {
      restrict: 'E',
      scope: {
        reminder: '=',
        onDismiss: '&',
        onHandled: '&',
        onSelect: '&'
      },
      template: '\n        <div class="reminder-card">\n          <div class="reminder-header" ng-click="onSelect({reminder: reminder})">\n            <h4>{{reminder.merchantName}}</h4>\n            <span class="label label-info">Due {{reminder.dueDate | date: \'mediumDate\'}}</span>\n          </div>\n          <div class="reminder-body">\n            <p>Amount: {{reminder.amount | currencySafe:reminder.currency}}</p>\n            <p>Status: {{reminder.status}}</p>\n            <p>Lead time: {{reminder.leadTimeDays}} days</p>\n          </div>\n          <div class="reminder-actions">\n            <button class="btn btn-default btn-sm" ng-click="onDismiss({reminder: reminder})">Dismiss</button>\n            <button class="btn btn-primary btn-sm" ng-click="onHandled({reminder: reminder})">Mark as handled</button>\n          </div>\n        </div>\n      '
    };
  }
})();
