(function () {
    'use strict';

    angular
        .module('app')
        .config(RouteConfig);

    RouteConfig.$inject = ['$routeProvider'];

    function RouteConfig($routeProvider) {
        var envConfigResolve = ['EnvConfigService', function (EnvConfigService) {
            return EnvConfigService.loadConfig();
        }];

        $routeProvider
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'src/templates/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                resolve: {
                    envConfig: envConfigResolve,
                    dashboardData: ['envConfig', 'DashboardService', function (envConfig, DashboardService) {
                        return DashboardService.getDashboardSummary();
                    }]
                }
            })
            .when('/transactions', {
                title: 'Transactions',
                templateUrl: 'src/templates/transactions/transactions.html',
                controller: 'TransactionsController',
                controllerAs: 'vm',
                resolve: {
                    envConfig: envConfigResolve
                }
            })
            .when('/analytics', {
                title: 'Analytics',
                templateUrl: 'src/templates/analytics/analytics.html',
                controller: 'AnalyticsController',
                controllerAs: 'vm',
                resolve: {
                    envConfig: envConfigResolve
                }
            });
    }

})();