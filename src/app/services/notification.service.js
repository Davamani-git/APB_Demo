(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('NotificationService', ['$rootScope', '$interval', NotificationService]);
  function NotificationService($rootScope, $interval) {
    var self = this;
    var notifications = [];
    self.startPolling = function() {
      $interval(function() {
        $rootScope.$broadcast('notification:received', {
          message: 'Order status updated',
          timestamp: new Date()
        });
      }, 30000);
    };
    self.notify = function(message) {
      notifications.push({ message: message, timestamp: new Date() });
      $rootScope.$broadcast('notification:received', { message: message });
    };
  }
})();