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
    .module('davBanking.recommendationControl')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/recommendations/history', {
        templateUrl: 'app/recommendation-control/views/recommendation-history.html',
        controller: 'RecommendationHistoryController',
        controllerAs: 'vm',
        resolve: { auth: requireAuth }
      });
    }]);
})();
