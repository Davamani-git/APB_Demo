(function () {
    'use strict';

    angular.module('apbDemo', [
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap'
    ])
        .config(AppConfig)
        .run(AppRun);

    AppConfig.$inject = ['$httpProvider'];

    function AppConfig($httpProvider) {
        $httpProvider.interceptors.push('HttpInterceptorService');
    }

    AppRun.$inject = ['EnvConfigService', 'LoggingService', '$rootScope'];

    function AppRun(EnvConfigService, LoggingService, $rootScope) {
        EnvConfigService.loadConfig().then(function () {
            LoggingService.info('Environment configuration loaded.', {});
        }).catch(function (error) {
            LoggingService.error('Failed to load environment configuration.', { error: error });
        });

        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            LoggingService.error('Route change error.', {
                current: current,
                previous: previous,
                rejection: rejection
            });
        });
    }
})();
