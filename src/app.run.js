(function () {
    'use strict';

    appRun.$inject = ['EnvConfigService', '$rootScope'];

    angular
        .module('app')
        .run(appRun);

    function appRun(EnvConfigService, $rootScope) {
        var env = EnvConfigService.getActiveEnv();
        $rootScope.appName = 'DAVMS1 Monthly Spending Summary Dashboard';
        $rootScope.featureFlags = env.featureFlags;
    }
})();
