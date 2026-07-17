(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .controller('RemindersDashboardController', RemindersDashboardController);

  RemindersDashboardController.$inject = ['$location', 'RemindersService', 'RbacService', 'LoggingService'];

  function RemindersDashboardController($location, RemindersService, RbacService, LoggingService) {
    const vm = this;

    vm.upcomingReminders = [];
    vm.pastReminders = [];
    vm.filters = { fromDate: null, toDate: null, status: null, page: 1, pageSize: 20 };
    vm.isLoading = false;
    vm.error = null;

    vm.loadReminders = loadReminders;
    vm.applyFilters = applyFilters;
    vm.clearFilters = clearFilters;
    vm.selectReminder = selectReminder;

    activate();

    function activate() {
      if (!RbacService.isActionAllowed('REMINDERS_VIEW')) {
        vm.error = { message: 'You are not allowed to view reminders.' };
        return;
      }
      loadReminders();
    }

    function loadReminders() {
      vm.isLoading = true;
      vm.error = null;
      const query = buildQuery();
      RemindersService.getUpcomingReminders(query)
        .then(function (list) {
          vm.upcomingReminders = list;
          return RemindersService.getPastReminders(query);
        })
        .then(function (pastList) {
          vm.pastReminders = pastList;
        })
        .catch(function (err) {
          vm.error = err;
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function applyFilters() {
      loadReminders();
    }

    function clearFilters() {
      vm.filters = { fromDate: null, toDate: null, status: null, page: 1, pageSize: 20 };
      loadReminders();
    }

    function selectReminder(reminder) {
      if (!reminder || !reminder.id) {
        return;
      }
      LoggingService.info('Reminder selected', { reminderId: reminder.id });
      $location.path('/reminders/' + encodeURIComponent(reminder.id));
    }

    function buildQuery() {
      const query = {
        fromDate: vm.filters.fromDate ? new Date(vm.filters.fromDate) : null,
        toDate: vm.filters.toDate ? new Date(vm.filters.toDate) : null,
        status: vm.filters.status,
        page: vm.filters.page,
        pageSize: vm.filters.pageSize
      };
      return query;
    }
  }
})();
