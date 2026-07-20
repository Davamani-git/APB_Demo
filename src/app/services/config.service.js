(function () {
    "use strict";

    angular.module("app")
        .service("ConfigService", ConfigService);

    ConfigService.$inject = ["$q", "$injector", "ENV_CONFIG"];

    function ConfigService($q, $injector, ENV_CONFIG) {
        var loaded = false;

        this.loadEnvConfig = function (envName) {
            if (loaded) {
                return $q.resolve(ENV_CONFIG);
            }

            var deferred = $q.defer();
            var $http = $injector.get("$http");
            var fileName = "env.default.json";
            if (envName === "dev") {
                fileName = "env.dev.json";
            } else if (envName === "prod") {
                fileName = "env.prod.json";
            }

            $http.get("src/app/config/" + fileName)
                .then(function (response) {
                    if (response && response.data) {
                        angular.extend(ENV_CONFIG, response.data);
                    }
                    loaded = true;
                    deferred.resolve(ENV_CONFIG);
                })
                .catch(function () {
                    loaded = true;
                    deferred.resolve(ENV_CONFIG);
                });

            return deferred.promise;
        };

        this.isLoaded = function () {
            return loaded;
        };
    }
})();
