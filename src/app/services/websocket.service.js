(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('WebSocketService', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
      var ws = null;
      var reconnectAttempts = 0;
      var maxReconnectAttempts = 5;
      var reconnectDelay = 1000;
      this.connect = function(orderId) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          return;
        }
        var wsUrl = 'ws://' + $window.location.host + '/ws/orders/' + orderId;
        ws = new WebSocket(wsUrl);
        ws.onopen = function() {
          reconnectAttempts = 0;
          $rootScope.$broadcast('websocket:connected');
        };
        ws.onmessage = function(event) {
          var data = JSON.parse(event.data);
          $rootScope.$applyAsync(function() {
            $rootScope.$broadcast('websocket:message', data);
          });
        };
        ws.onerror = function(error) {
          $rootScope.$broadcast('websocket:error', error);
        };
        ws.onclose = function() {
          $rootScope.$broadcast('websocket:disconnected');
          if (reconnectAttempts < maxReconnectAttempts) {
            var delay = reconnectDelay * Math.pow(2, reconnectAttempts);
            reconnectAttempts++;
            $timeout(function() {
              this.connect(orderId);
            }.bind(this), delay);
          }
        }.bind(this);
      };
      this.disconnect = function() {
        if (ws) {
          ws.close();
          ws = null;
        }
      };
      this.send = function(message) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      };
    }]);
})();