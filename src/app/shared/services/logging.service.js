'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['$http', 'ENV_CONFIG'];

  function LoggingService($http, ENV_CONFIG) {
    var service = {
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function info(message, meta) {
      // Local console logging only for now
      /* eslint-disable no-console */
      console.info('[INFO]', message, meta || {});
      /* eslint-enable no-console */
    }

    function warn(message, meta) {
      /* eslint-disable no-console */
      console.warn('[WARN]', message, meta || {});
      /* eslint-enable no-console */
    }

    function error(message, meta) {
      /* eslint-disable no-console */
      console.error('[ERROR]', message, meta || {});
      /* eslint-enable no-console */
      // Optionally send to remote endpoint
      // return $http.post(ENV_CONFIG.API_BASE_URL + '/client-logs', { level: 'ERROR', message: message, meta: meta });
    }
  }
})();
