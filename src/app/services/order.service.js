(function() {
  'use strict';
  angular.module('app.sellerDashboard')
    .factory('OrderService', ['$http', '$q', function($http, $q) {
      var apiBase = '/api/orders';
      return {
        getOrders: function(sellerId) {
          return $http.get(apiBase + '?sellerId=' + sellerId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        getOrder: function(orderId) {
          return $http.get(apiBase + '/' + orderId)
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateOrderStatus: function(orderId, status) {
          return $http.patch(apiBase + '/' + orderId + '/status', { orderStatus: status })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        },
        updateShippingInfo: function(orderId, trackingId) {
          return $http.patch(apiBase + '/' + orderId + '/shipping', { shippingTrackingId: trackingId })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();