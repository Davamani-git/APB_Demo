angular.module('fraudAlert.ingestion')
  .service('AlertService', ['$http', '$rootScope', '$q', 'API_CONFIG', function($http, $rootScope, $q, API_CONFIG) {
    this.createAlert = function(transaction, decision) {
      var alertData = {
        transactionId: transaction.transactionId,
        customerId: transaction.customerId || 'unknown',
        alertType: decision.riskBand === 'high' ? 'urgent' : 'standard',
        message: 'Transaction of ' + transaction.amount + ' ' + transaction.currency + ' at ' + transaction.merchantName + ' requires verification',
        status: 'pending',
        createdAt: new Date().toISOString(),
        transactionDetails: {
          amount: transaction.amount,
          currency: transaction.currency,
          merchantName: transaction.merchantName,
          cardNumber: transaction.cardNumber,
          timestamp: transaction.transactionTimestamp
        }
      };
      return $http.post(API_CONFIG.alertsUrl, alertData)
        .then(function(response) {
          var alert = response.data;
          $rootScope.$broadcast('alert:created', alert);
          return alert;
        })
        .catch(function(error) {
          console.error('Alert creation failed:', error);
          return $q.reject(error);
        });
    };
    this.getAlerts = function() {
      return $http.get(API_CONFIG.alertsUrl)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Failed to fetch alerts:', error);
          return [];
        });
    };
    this.acknowledgeAlert = function(alertId) {
      return $http.put(API_CONFIG.alertsUrl + '/' + alertId, { status: 'acknowledged' })
        .then(function(response) {
          $rootScope.$broadcast('alert:acknowledged', response.data);
          return response.data;
        })
        .catch(function(error) {
          console.error('Alert acknowledgement failed:', error);
          return $q.reject(error);
        });
    };
  }]);