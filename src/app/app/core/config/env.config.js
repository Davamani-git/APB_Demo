(function () {
  'use strict';

  angular
    .module('ccd.core')
    .factory('envConfig', [
      function () {
        var env = window.__CCD_ENV__ || {
          apiBaseUrl: 'https://api.dev.example.com',
          loggingLevel: 'INFO',
          featureFlags: {
            showTrends: true,
            enableDegradedIndicator: true
          }
        };

        return {
          get: function (key) {
            return env[key];
          },
          getAll: function () {
            return angular.copy(env);
          }
        };
      }
    ]);
})();
