'use strict';

(function () {
  function BillRemindersDashboardController(BillReminderApiService,
                                           BillReminderModelService,
                                           AuditEventService,
                                           $log) {
    'ngInject';
    var vm = this;

    vm.reminders = [];
    vm.loading = false;
    vm.error = null;

    vm.init = function () {
      vm.loading = true;
      vm.error = null;
      BillReminderApiService.getReminders({})
        .then(function (data) {
          BillReminderModelService.setReminders(data.reminders || []);
          vm.reminders = BillReminderModelService.getReminders();
          AuditEventService.logEvent('BILL_REMINDERS_VIEW', { count: vm.reminders.length });
        })
        .catch(function (err) {
          vm.error = 'Unable to load reminders.';
          $log.error('Error loading reminders', err);
        })
        .finally(function () {
          vm.loading = false;
        });
    };

    vm.refresh = function () {
      vm.init();
    };

    vm.acknowledgeReminder = function (reminder) {
      if (!reminder || !reminder.id) { return; }
      BillReminderApiService.acknowledgeReminder(reminder.id)
        .then(function () {
          reminder.status = 'ACKNOWLEDGED';
          BillReminderModelService.updateReminder(reminder);
          AuditEventService.logEvent('BILL_REMINDER_ACKNOWLEDGED', { reminderId: reminder.id });
        });
    };

    vm.dismissReminder = function (reminder) {
      if (!reminder || !reminder.id) { return; }
      BillReminderApiService.dismissReminder(reminder.id)
        .then(function () {
          reminder.status = 'DISMISSED';
          BillReminderModelService.updateReminder(reminder);
          AuditEventService.logEvent('BILL_REMINDER_DISMISSED', { reminderId: reminder.id });
        });
    };

    vm.init();
  }

  angular
    .module('davBanking.billReminders')
    .controller('BillRemindersDashboardController', BillRemindersDashboardController);
})();
