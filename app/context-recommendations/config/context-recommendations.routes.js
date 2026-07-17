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
    .module('davBanking.contextRecommendations')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/recommendations', {
          templateUrl: 'app/context-recommendations/views/context-recommendations-full.html',
          controller: 'ContextRecommendationsListController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        })
        .when('/recommendations/:id', {
          templateUrl: 'app/context-recommendations/views/context-recommendation-detail.html',
          controller: 'ContextRecommendationDetailController',
          controllerAs: 'vm',
          resolve: { auth: requireAuth }
        });
    }]);
})();
