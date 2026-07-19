(function () {
  'use strict';

  EnvConfigService.$inject = ['$http', '$q', 'EnvConfig'];

  angular
    .module('app')
    .service('EnvConfigService', EnvConfigService);

  function EnvConfigService($http, $q, EnvConfig) {
    var self = this;
    var _config = null;
    var _initPromise = null;

    self.initialize = initialize;
    self.getConfig = getConfig;
    self.isMockMode = isMockMode;

    function initialize() {
      if (_initPromise) {
        return _initPromise;
      }

      var deferred = $q.defer();

      // Always load env.config.json; useMockData flag inside controls mock mode
      $http.get('config/env/env.config.json')
        .then(function (response) {
          var data = response.data || {};
          _config = new EnvConfig(data);
          deferred.resolve(_config);
        })
        .catch(function () {
          // Fallback to mock env if production config fails
          $http.get('config/env/env.mock.config.json')
            .then(function (response) {
              var data = response.data || {};
              _config = new EnvConfig(data);
              deferred.resolve(_config);
            })
            .catch(function (error) {
              deferred.reject(error);
            });
        });

      _initPromise = deferred.promise;
      return _initPromise;
    }

    function getConfig() {
      return _config || new EnvConfig({});
    }

    function isMockMode() {
      var cfg = getConfig();
      return !!cfg.useMockData;
    }
  }
})();
