'use strict';

(function () {
  function requireAuth(SecurityContextService, $q, $location) {
    'ngInject';
    if (SecurityContextService.isAuthenticated()) {
      return $q.resolve();
    }
    $location.path('/login');
    return $q.reject('NOT_AUTHENTICATED');
  }

  angular
    .module('davBanking.billReminders')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/bill-reminders', {
          templateUrl: 'app/bill-reminders/views/bill-reminders-dashboard.html',
          controller: 'BillRemindersDashboardController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/bill-reminders/preferences', {
          templateUrl: 'app/bill-reminders/views/bill-reminder-preferences.html',
          controller: 'BillReminderPreferencesController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        });
    }]);
})();
