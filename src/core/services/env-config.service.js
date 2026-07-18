(function () {
    'use strict';

    EnvConfigService.$inject = [];

    function EnvConfigService() {
        var env = {
            apiBaseUrl: 'https://dev.api.davms1.example.com',
            apiTimeoutMs: 8000,
            maxLookbackMonths: 12,
            useMockData: true,
            featureFlags: {
                showAverageTransaction: true,
                showMaxTransaction: true,
                showMinTransaction: true
            },
            telemetry: {
                enabled: true,
                endpoint: 'https://dev.telemetry.davms1.example.com',
                sampleRate: 0.5
            }
        };

        var service = {
            getActiveEnv: getActiveEnv,
            isMockMode: isMockMode
        };

        return service;

        function getActiveEnv() {
            return env;
        }

        function isMockMode() {
            return !!env.useMockData;
        }
    }

    angular
        .module('app')
        .service('EnvConfigService', EnvConfigService);
})();
