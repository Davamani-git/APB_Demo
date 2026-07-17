'use strict';

(function () {
  angular
    .module('davBankingInsightsApp.personalizedInsights.ui')
    .config(insightsRoutes);

  insightsRoutes.$inject = ['$stateProvider'];

  function insightsRoutes($stateProvider) {
    $stateProvider
      .state('insightsDashboard', {
        url: '/insights',
        templateUrl: 'src/app/personalized-insights/ui/views/insights-dashboard.html',
        controller: 'InsightsDashboardController',
        controllerAs: 'vm'
      })
      .state('insightDetail', {
        url: '/insights/:insightId',
        templateUrl: 'src/app/personalized-insights/ui/views/insight-detail.html',
        controller: 'InsightDetailController',
        controllerAs: 'vm'
      })
      .state('insightPreferences', {
        url: '/insights/preferences/manage',
        templateUrl: 'src/app/personalized-insights/ui/views/insight-preferences.html',
        controller: 'InsightPreferencesController',
        controllerAs: 'vm'
      });
  }
})();
