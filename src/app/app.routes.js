(function () {
  'use strict';

  angular
    .module('rbApp')
    .config(appRoutes);

  appRoutes.$inject = ['$routeProvider'];

  function appRoutes($routeProvider) {
    $routeProvider
      .when('/insights', {
        templateUrl: 'src/app/features/insights/views/insights-dashboard.html',
        controller: 'InsightsDashboardController',
        controllerAs: 'vm'
      })
      .when('/insights/:id', {
        templateUrl: 'src/app/features/insights/views/insights-detail.html',
        controller: 'InsightsDetailController',
        controllerAs: 'vm'
      })
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
