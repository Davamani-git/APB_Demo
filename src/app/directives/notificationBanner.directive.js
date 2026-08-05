(function () {
  'use strict';

  angular
    .module('execSummary.directives')
    .directive('notificationBanner', [function () {
      return {
        restrict: 'E',
        scope: {
          notifications: '='
        },
        templateUrl: 'src/app/views/notification-banner.html'
      };
    }]);
})();