(function () {
    'use strict';

    angular
        .module('app')
        .service('EnvConfigService', EnvConfigService);

    EnvConfigService.$inject = ['$injector', '$q', 'ENV_CONFIG'];

    function EnvConfigService($injector, $q, ENV_CONFIG) {
        var config = null;
        var configPromise = null;

        this.loadConfig = function() {
            if (configPromise) {
                return configPromise;
            }

            var deferred = $q.defer();
            configPromise = deferred.promise;

            // Lazy-load $http to prevent circular dependency with interceptors
            var $http = $injector.get('$http');

            $http.get('src/app/config/env.default.json')
                .then(function(response) {
                    config = angular.extend({}, ENV_CONFIG, response.data);
                    deferred.resolve(config);
                })
                .catch(function() {
                    // Fallback to constant if JSON fails to load
                    config = ENV_CONFIG;
                    deferred.resolve(config); // Resolve with fallback
                });

            return configPromise;
        };

        this.get = function(key) {
            if (!config) {
                // This should not happen if routes properly resolve loadConfig
                console.error('Configuration not loaded yet. Accessing key:', key);
                return ENV_CONFIG[key];
            }
            return config[key];
        };

        this.getConfig = function() {
            return config;
        };
    }
})();