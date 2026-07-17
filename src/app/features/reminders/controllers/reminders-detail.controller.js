(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .controller('RemindersDetailController', RemindersDetailController);

  RemindersDetailController.$inject = ['$routeParams', '$window', 'RemindersService', 'LoggingService', 'ErrorHandlerService'];

  function RemindersDetailController($routeParams, $window, RemindersService, LoggingService, ErrorHandlerService) {
    const vm = this;

    vm.reminder = null;
    vm.isLoading = false;
    vm.error = null;

    vm.loadReminder = loadReminder;
    vm.dismiss = dismiss;
    vm.markHandled = markHandled;

    activate();

    function activate() {
      loadReminder();
    }

    function loadReminder() {
      const id = $routeParams.id;
      if (!id) {
        vm.error = { message: 'Reminder not found.' };
        return;
      }
      vm.isLoading = true;
      RemindersService.getReminderById(id)
        .then(function (reminder) {
          vm.reminder = reminder;
        })
        .catch(function (err) {
          vm.error = err;
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function dismiss() {
      if (!vm.reminder || !vm.reminder.id) {
        return;
      }
      RemindersService.dismissReminder(vm.reminder.id)
        .then(function () {
          vm.reminder.status = 'DISMISSED';
          LoggingService.info('Reminder dismissed from detail', { reminderId: vm.reminder.id });
        })
        .catch(function (err) {
          vm.error = ErrorHandlerService.handleClientError(err);
        });
    }

    function markHandled() {
      if (!vm.reminder || !vm.reminder.id) {
        return;
      }
      RemindersService.markReminderHandled(vm.reminder.id)
        .then(function () {
          vm.reminder.status = 'HANDLED';
          LoggingService.info('Reminder marked handled from detail', { reminderId: vm.reminder.id });
        })
        .catch(function (err) {
          vm.error = ErrorHandlerService.handleClientError(err);
        });
    }

    vm.navigateBack = function () {
      $window.history.back();
    };
  }
})();
