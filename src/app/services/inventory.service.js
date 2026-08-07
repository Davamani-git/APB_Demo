(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('inventoryService', ['$http', '$q', '$interval', 'apiConfig', 'alertService', function($http, $q, $interval, apiConfig, alertService) {
      var self = this;
      var pollInterval = null;
      self.getInventory = function(sellerId) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/inventory', {params: {sellerId: sellerId}, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.updateStock = function(productId, stockData) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/inventory/' + productId, stockData, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.startMonitoring = function(sellerId, callback) {
        if (pollInterval) {
          $interval.cancel(pollInterval);
        }
        pollInterval = $interval(function() {
          self.getInventory(sellerId).then(function(inventory) {
            inventory.forEach(function(item) {
              if (item.currentStock <= item.lowStockThreshold) {
                alertService.sendLowStockAlert(item).then(function() {
                  if (callback) callback(item);
                });
              }
            });
          });
        }, 60000);
      };
      self.stopMonitoring = function() {
        if (pollInterval) {
          $interval.cancel(pollInterval);
          pollInterval = null;
        }
      };
    }]);
})();