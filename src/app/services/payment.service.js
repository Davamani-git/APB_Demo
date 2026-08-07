(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('paymentService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.processPayment = function(paymentData) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/payment/process', paymentData, {timeout: apiConfig.timeout})
          .then(function(response) {
            if (response.data && response.data.status === 'success') {
              deferred.resolve(response.data);
            } else {
              deferred.reject(response.data.message || 'Payment failed');
            }
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.validatePaymentMethod = function(paymentMethod) {
        if (!paymentMethod.cardNumber || !paymentMethod.expiryDate || !paymentMethod.cvv) {
          return false;
        }
        var expiryParts = paymentMethod.expiryDate.split('/');
        if (expiryParts.length !== 2) return false;
        var month = parseInt(expiryParts[0]);
        var year = parseInt('20' + expiryParts[1]);
        var now = new Date();
        var expiry = new Date(year, month - 1);
        return expiry > now;
      };
    }]);
})();