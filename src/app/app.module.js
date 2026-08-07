(function() {
  'use strict';
  angular.module('app.core', []);
  angular.module('app.creditCardDashboard', ['ngRoute', 'app.core'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/dashboard', {
          templateUrl: 'src/app/modules/credit-card-dashboard/views/dashboard.view.html',
          controller: 'CreditCardDashboardController',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/dashboard'
        });
    }])
    .constant('API_ENDPOINTS', {
      creditCards: '/api/creditcards'
    });
})();