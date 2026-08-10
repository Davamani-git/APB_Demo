(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('InventoryService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
      var apiBase = '/api/inventory';
      var ws = null;
      return {
        getInventory: function(productId) {
          return $http.get(apiBase + '/' + productId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getAllInventory: function(sellerId) {
          return $http.get(apiBase + '?sellerId=' + sellerId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateInventory: function(inventoryId, inventoryData) {
          return $http.put(apiBase + '/' + inventoryId, inventoryData)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        setThreshold: function(inventoryId, threshold) {
          return $http.patch(apiBase + '/' + inventoryId + '/threshold', { lowStockThreshold: threshold })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        connectWebSocket: function(sellerId) {
          if (ws) return;
          ws = new WebSocket('ws://localhost:8080/inventory/' + sellerId);
          ws.onmessage = function(event) {
            var data = JSON.parse(event.data);
            $rootScope.$broadcast('inventory:update', data);
          };
          ws.onerror = function(error) {
            console.error('WebSocket error:', error);
          };
        },
        disconnectWebSocket: function() {
          if (ws) {
            ws.close();
            ws = null;
          }
        }
      };
    }]);
})();