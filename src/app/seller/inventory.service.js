(function() {
  'use strict';
  angular.module('shoppingPlatform').service('InventoryService', ['$http', '$interval', 'API_CONFIG', function($http, $interval, API_CONFIG) {
    this.getInventory = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/inventory', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data || [];
      });
    };
    this.updateStock = function(productId, stock) {
      return $http.put(API_CONFIG.baseUrl + '/api/inventory/' + productId, { currentStock: stock }, { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.getLowStockProducts = function() {
      return this.getInventory().then(function(inventory) {
        return inventory.filter(function(item) {
          return item.currentStock <= item.lowStockThreshold;
        });
      });
    };
  }]);
})();