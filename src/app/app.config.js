(function () {
    'use strict';

    angular
        .module('app')
        .config(AppConfig);

    AppConfig.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$logProvider', 'ENV_CONFIG'];

    function AppConfig($routeProvider, $locationProvider, $httpProvider, $logProvider, ENV_CONFIG) {
        // HTML5 mode can be enabled but requires server-side configuration
        $locationProvider.hashPrefix('');

        // Set up the default route
        $routeProvider.otherwise({ redirectTo: '/dashboard' });

        // Configure logging
        $logProvider.debugEnabled(ENV_CONFIG.debugMode || false);

        // Register interceptors
        // Note: ErrorHandlerInterceptor might need lazy injection of dependencies if they use $http
        // For now, assuming ErrorHandlerService does not directly inject $http.
        // $httpProvider.interceptors.push('ErrorHandlerInterceptor');
    }

})();