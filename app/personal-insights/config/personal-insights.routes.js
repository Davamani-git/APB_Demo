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
    .module('davBanking.personalInsights')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/personal-insights', {
          templateUrl: 'app/personal-insights/views/personal-insights-dashboard.html',
          controller: 'PersonalInsightsDashboardController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/personal-insights/:insightId', {
          templateUrl: 'app/personal-insights/views/personal-insights-detail.html',
          controller: 'PersonalInsightDetailController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/personal-insights/preferences', {
          templateUrl: 'app/personal-insights/views/personal-insights-preferences.html',
          controller: 'InsightPreferencesController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        });
    }]);
})();
