(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('LocationTrackingService', ['$rootScope', '$window', '$http', '$timeout', function($rootScope, $window, $http, $timeout) {
      var ws = null;
      var locationCache = {};
      var reconnectAttempts = 0;
      var maxReconnectAttempts = 5;
      this.connect = function(orderId) {
        this.getInitialLocation(orderId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          return;
        }
        var wsUrl = 'ws://' + $window.location.host + '/ws/location/' + orderId;
        ws = new WebSocket(wsUrl);
        ws.onopen = function() {
          reconnectAttempts = 0;
          $rootScope.$broadcast('location:connected');
        };
        ws.onmessage = function(event) {
          var locationData = JSON.parse(event.data);
          locationCache[orderId] = locationData;
          $rootScope.$applyAsync(function() {
            $rootScope.$broadcast('location:update', locationData);
          });
        };
        ws.onerror = function(error) {
          $rootScope.$broadcast('location:error', error);
        };
        ws.onclose = function() {
          $rootScope.$broadcast('location:disconnected');
          if (reconnectAttempts < maxReconnectAttempts) {
            var delay = 1000 * Math.pow(2, reconnectAttempts);
            reconnectAttempts++;
            $timeout(function() {
              this.connect(orderId);
            }.bind(this), delay);
          }
        }.bind(this);
      };
      this.getInitialLocation = function(orderId) {
        return $http.get('/api/orders/' + orderId + '/location')
          .then(function(response) {
            locationCache[orderId] = response.data;
            $rootScope.$broadcast('location:initial', response.data);
            return response.data;
          })
          .catch(function() {
            return locationCache[orderId] || null;
          });
      };
      this.getLastKnownLocation = function(orderId) {
        return locationCache[orderId];
      };
      this.disconnect = function() {
        if (ws) {
          ws.close();
          ws = null;
        }
      };
    }]);
})();