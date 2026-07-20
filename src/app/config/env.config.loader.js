(function () {
    "use strict";

    angular.module("app")
        .service("EnvConfigService", EnvConfigService);

    EnvConfigService.$inject = ["$q", "$injector", "ENV_CONFIG"];

    function EnvConfigService($q, $injector, ENV_CONFIG) {
        var configLoaded = false;

        this.loadConfig = function () {
            if (configLoaded) {
                return $q.resolve(ENV_CONFIG);
            }

            var deferred = $q.defer();
            var $http = $injector.get("$http");

            $http.get("src/app/config/env.default.json")
                .then(function (response) {
                    if (response && response.data) {
                        angular.extend(ENV_CONFIG, response.data);
                    }
                    configLoaded = true;
                    deferred.resolve(ENV_CONFIG);
                })
                .catch(function () {
                    configLoaded = true;
                    deferred.resolve(ENV_CONFIG);
                });

            return deferred.promise;
        };

        this.isLoaded = function () {
            return configLoaded;
        };
    }
})();
