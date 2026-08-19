(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('OrderStatusService', ['$http', '$q', function($http, $q) {
      var cache = {};
      var processedEventIds = {};
      var validTransitions = {
        'confirmed': ['preparing', 'cancelled'],
        'preparing': ['ready', 'cancelled'],
        'ready': ['picked_up', 'cancelled'],
        'picked_up': ['delivered', 'cancelled'],
        'delivered': [],
        'cancelled': []
      };
      this.getOrderStatus = function(orderId) {
        return $http.get('/api/orders/' + orderId + '/status')
          .then(function(response) {
            cache[orderId] = response.data;
            return response.data;
          })
          .catch(function(error) {
            if (cache[orderId]) {
              return cache[orderId];
            }
            return $q.reject(error);
          });
      };
      this.validateTransition = function(currentStatus, newStatus) {
        if (!validTransitions[currentStatus]) return false;
        return validTransitions[currentStatus].indexOf(newStatus) !== -1;
      };
      this.isEventProcessed = function(eventId) {
        return !!processedEventIds[eventId];
      };
      this.markEventProcessed = function(eventId) {
        processedEventIds[eventId] = true;
      };
      this.getCachedStatus = function(orderId) {
        return cache[orderId];
      };
    }]);
})();