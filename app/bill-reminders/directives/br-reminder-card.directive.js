'use strict';

(function () {
  function brReminderCard() {
    return {
      restrict: 'E',
      scope: {
        reminder: '=',
        onAcknowledge: '&',
        onDismiss: '&'
      },
      templateUrl: 'app/bill-reminders/views/br-reminder-card.html'
    };
  }

  angular
    .module('davBanking.billReminders')
    .directive('brReminderCard', brReminderCard);
})();
