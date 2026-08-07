(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('alertService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.sendLowStockAlert = function(inventoryItem) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/alerts/low-stock', inventoryItem, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();