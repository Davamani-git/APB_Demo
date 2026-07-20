(function () {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap'
    ]);

    app.run(function($rootScope, $location, LoggingService) {
        $rootScope.isLoading = false;

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            $rootScope.isLoading = true;
            LoggingService.info('Route change started', { to: next.originalPath });
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.isLoading = false;
            $rootScope.pageTitle = current.title || 'Dashboard';
            LoggingService.info('Route change successful', { path: $location.path() });
        });

        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            $rootScope.isLoading = false;
            LoggingService.error('Route change error', { rejection: rejection });
            $location.path('/dashboard'); // Redirect to a safe page
        });
    });

})();