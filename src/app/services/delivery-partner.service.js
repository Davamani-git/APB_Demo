(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('DeliveryPartnerService', ['$http', '$q', function($http, $q) {
      var cache = {};
      this.getPartnerAssignment = function(orderId) {
        if (cache[orderId]) {
          return $q.resolve(cache[orderId]);
        }
        return $http.get('/api/orders/' + orderId + '/delivery-partner')
          .then(function(response) {
            var partner = response.data;
            if (partner.phone) {
              partner.phone = partner.phone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3');
            }
            cache[orderId] = partner;
            return partner;
          })
          .catch(function(error) {
            if (cache[orderId]) {
              return cache[orderId];
            }
            return $q.reject(error);
          });
      };
    }]);
})();