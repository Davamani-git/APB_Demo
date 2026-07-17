'use strict';

(function () {
  function brQuietHoursSelector() {
    return {
      restrict: 'E',
      scope: {
        quietHours: '='
      },
      templateUrl: 'app/bill-reminders/views/br-quiet-hours-selector.html'
    };
  }

  angular
    .module('davBanking.billReminders')
    .directive('brQuietHoursSelector', brQuietHoursSelector);
})();
