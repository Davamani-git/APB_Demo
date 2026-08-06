(function() {
  'use strict';
  angular.module('shoppingPlatform').factory('NotificationFactory', ['$rootScope', function($rootScope) {
    var notifications = [];
    return {
      addNotification: function(notification) {
        notifications.push(notification);
        $rootScope.$broadcast('notification:new', notification);
      },
      getNotifications: function() {
        return notifications;
      },
      clearNotifications: function() {
        notifications = [];
      },
      removeNotification: function(index) {
        notifications.splice(index, 1);
      }
    };
  }]);
})();