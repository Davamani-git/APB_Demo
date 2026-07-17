(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .directive('reminderChannelToggle', reminderChannelToggleDirective);

  function reminderChannelToggleDirective() {
    return {
      restrict: 'E',
      scope: {
        channels: '='
      },
      template: '\n        <div class="reminder-channel-toggle">\n          <label class="checkbox-inline">\n            <input type="checkbox" ng-model="channels.APP"> In-app\n          </label>\n          <label class="checkbox-inline">\n            <input type="checkbox" ng-model="channels.EMAIL"> Email\n          </label>\n          <label class="checkbox-inline">\n            <input type="checkbox" ng-model="channels.SMS"> SMS\n          </label>\n          <label class="checkbox-inline">\n            <input type="checkbox" ng-model="channels.PUSH"> Push\n          </label>\n          <p class="help-block">Channels may be limited based on your communication preferences and regulatory requirements.</p>\n        </div>\n      '
    };
  }
})();
