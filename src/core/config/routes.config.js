(function () {
    'use strict';

    routesConfig.$inject = ['$routeProvider'];

    angular
        .module('app')
        .config(routesConfig);

    function routesConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/features/monthly-summary/monthly-summary.template.html',
                controller: 'MonthlySummaryController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
