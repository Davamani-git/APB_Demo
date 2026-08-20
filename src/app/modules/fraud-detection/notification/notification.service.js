(function() {
  'use strict';
  angular.module('fraudDetection.notification')
    .factory('NotificationService', ['$http', '$q', function($http, $q) {
      return {
        sendAlert: function(alertId, channels) {
          var promises = [];
          angular.forEach(channels, function(channel) {
            var promise = $http.post('/api/notifications/send', {
              alertId: alertId,
              channel: channel,
              timestamp: new Date()
            });
            promises.push(promise);
          });
          return $q.all(promises)
            .then(function(responses) {
              return responses.map(function(r) { return r.data; });
            })
            .catch(function(error) {
              return $http.post('/api/notifications/send', {
                alertId: alertId,
                channel: 'email',
                fallback: true,
                timestamp: new Date()
              }).then(function(response) {
                return [response.data];
              });
            });
        },
        getDeliveryStatus: function(notificationId) {
          return $http.get('/api/notifications/' + notificationId + '/status')
            .then(function(response) {
              return response.data;
            });
        }
      };
    }]);
})();