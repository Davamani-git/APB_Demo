(function () {
  'use strict';

  angular
    .module('rbApp.reminders')
    .config(remindersRoutes);

  remindersRoutes.$inject = ['$routeProvider'];

  function remindersRoutes($routeProvider) {
    $routeProvider
      .when('/reminders', {
        templateUrl: 'src/app/features/reminders/views/reminders-dashboard.html',
        controller: 'RemindersDashboardController',
        controllerAs: 'vm'
      })
      .when('/reminders/:id', {
        templateUrl: 'src/app/features/reminders/views/reminders-detail.html',
        controller: 'RemindersDetailController',
        controllerAs: 'vm'
      })
      .when('/reminders/settings', {
        templateUrl: 'src/app/features/reminders/views/reminders-settings.html',
        controller: 'RemindersSettingsController',
        controllerAs: 'vm'
      });
  }
})();
