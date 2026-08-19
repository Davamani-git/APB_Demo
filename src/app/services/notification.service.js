angular.module('fraudDetectionApp').service('NotificationService', ['$http', '$q', function($http, $q) {
  var API_BASE = '/api/notifications';

  this.send = function(notificationRequest) {
    if (!notificationRequest || !notificationRequest.alertId) {
      return $q.reject({ error: 'Invalid notification request' });
    }
    return $http.post(API_BASE + '/send', notificationRequest).then(function(response) {
      return response.data;
    }).catch(function(error) {
      return this.sendFallback(notificationRequest);
    }.bind(this));
  };

  this.sendFallback = function(notificationRequest) {
    var fallbackChannels = notificationRequest.channels.filter(function(ch) { return ch !== 'push'; });
    if (fallbackChannels.length === 0) {
      return $q.reject({ error: 'All notification channels failed' });
    }
    var fallbackRequest = angular.copy(notificationRequest);
    fallbackRequest.channels = fallbackChannels;
    return $http.post(API_BASE + '/send', fallbackRequest).then(function(response) {
      return response.data;
    });
  };

  this.getStatus = function(notificationId) {
    return $http.get(API_BASE + '/status/' + notificationId).then(function(response) {
      return response.data;
    });
  };
}]);