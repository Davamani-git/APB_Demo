(function() {
  'use strict';

  ConfigMockRuntimeService.$inject = ['$q', '$timeout', 'ConfigModel'];

  function ConfigMockRuntimeService($q, $timeout, ConfigModel) {
    this.getConfig = function() {
      var deferred = $q.defer();

      $timeout(function() {
        if (window.ConfigMockData) {
          deferred.resolve(new ConfigModel(window.ConfigMockData));
        } else {
          deferred.resolve(new ConfigModel({}));
        }
      }, 200);

      return deferred.promise;
    };
  }

  angular.module('app')
    .service('ConfigMockRuntimeService', ConfigMockRuntimeService);
})();
