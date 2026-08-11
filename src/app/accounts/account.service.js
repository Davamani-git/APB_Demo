(function() {
  'use strict';
  angular.module('app.accounts')
    .service('AccountService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
      this.getAccounts = function() {
        return $http.get(API_CONFIG.baseUrl + '/accounts')
          .then(function(response) {
            return response.data;
          });
      };
      this.connectAccount = function(institutionId) {
        return $http.post(API_CONFIG.baseUrl + '/accounts/connect', {
          institutionId: institutionId
        }).then(function(response) {
          return response.data;
        });
      };
      this.disconnectAccount = function(accountId) {
        return $http.delete(API_CONFIG.baseUrl + '/accounts/' + accountId)
          .then(function(response) {
            return response.data;
          });
      };
      this.triggerSync = function(accountId) {
        return $http.post(API_CONFIG.baseUrl + '/accounts/' + accountId + '/sync')
          .then(function(response) {
            return response.data;
          });
      };
    }]);
})();