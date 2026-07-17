'use strict';

(function () {
  angular
    .module('davBanking.insightDelivery')
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push(['$q', function ($q) {
        return {
          request: function (config) {
            config.headers = config.headers || {};
            config.headers['X-Client-Channel'] = 'WEB';
            return config;
          },
          responseError: function (rejection) {
            return $q.reject(rejection);
          }
        };
      }]);
    }]);
})();
