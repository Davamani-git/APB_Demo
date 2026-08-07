(function() {
    'use strict';
    angular.module('app', ['ngRoute', 'app.creditCardDashboard'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/dashboard', {
                    templateUrl: 'src/app/modules/creditCardDashboard/views/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm'
                })
                .otherwise({
                    redirectTo: '/dashboard'
                });
        }]);
})();