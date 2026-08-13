(function() {
  'use strict';
  angular.module('app.shopping')
    .service('NotificationService', ['$http', '$interval', '$timeout', 'API_BASE_URL', function($http, $interval, $timeout, API_BASE_URL) {
      var self = this;
      var notifications = [];
      var pollingInterval = null;
      self.startPolling = function(userId, callback) {
        if (pollingInterval) {
          $interval.cancel(pollingInterval);
        }
        pollingInterval = $interval(function() {
          $http.get(API_BASE_URL + '/notifications/' + userId)
            .then(function(response) {
              if (response.data && response.data.length > 0) {
                notifications = response.data;
                if (callback) callback(notifications);
              }
            })
            .catch(function(error) {
              console.error('Notification polling error:', error);
            });
        }, 5000);
      };
      self.stopPolling = function() {
        if (pollingInterval) {
          $interval.cancel(pollingInterval);
          pollingInterval = null;
        }
      };
      self.getNotifications = function() {
        return notifications;
      };
      self.markAsRead = function(notificationId) {
        return $http.put(API_BASE_URL + '/notifications/' + notificationId + '/read')
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            throw error;
          });
      };
      self.showNotification = function(message, type) {
        var notification = {
          message: message,
          type: type || 'info',
          timestamp: new Date()
        };
        notifications.push(notification);
        $timeout(function() {
          var index = notifications.indexOf(notification);
          if (index > -1) {
            notifications.splice(index, 1);
          }
        }, 5000);
      };
    }]);
})();