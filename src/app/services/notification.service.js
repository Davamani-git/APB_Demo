(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('NotificationService', ['$rootScope', '$timeout', function($rootScope, $timeout) {
      var notifications = [];
      var ws = null;
      return {
        showNotification: function(message, type) {
          type = type || 'info';
          var notification = {
            message: message,
            type: type,
            timestamp: new Date()
          };
          notifications.push(notification);
          $rootScope.$broadcast('notification:new', notification);
          $timeout(function() {
            var index = notifications.indexOf(notification);
            if (index > -1) {
              notifications.splice(index, 1);
            }
          }, 5000);
        },
        getNotifications: function() {
          return notifications;
        },
        clearNotifications: function() {
          notifications.length = 0;
        },
        connectWebSocket: function(sellerId) {
          if (ws) return;
          ws = new WebSocket('ws://localhost:8080/notifications/' + sellerId);
          ws.onmessage = function(event) {
            var data = JSON.parse(event.data);
            this.showNotification(data.message, data.type);
            $rootScope.$apply();
          }.bind(this);
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