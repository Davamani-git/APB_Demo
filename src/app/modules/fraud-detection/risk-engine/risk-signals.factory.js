(function() {
  'use strict';
  angular.module('fraudDetection.riskEngine')
    .factory('RiskSignalsFactory', [function() {
      return {
        evaluateAmountAnomaly: function(transaction, customerHistory) {
          if (!customerHistory || !customerHistory.avgAmount) return false;
          return transaction.amount > (customerHistory.avgAmount * 3);
        },
        evaluateMerchantRisk: function(transaction, merchantData) {
          if (!merchantData) return 'unknown';
          if (merchantData.fraudRate > 0.05) return 'high';
          if (merchantData.fraudRate > 0.02) return 'medium';
          return 'low';
        },
        evaluateGeoInconsistency: function(transaction, customerProfile) {
          if (!transaction.location || !customerProfile.lastLocation) return false;
          var distance = this.calculateDistance(
            transaction.location.lat,
            transaction.location.lng,
            customerProfile.lastLocation.lat,
            customerProfile.lastLocation.lng
          );
          var timeDiff = (new Date(transaction.timestamp) - new Date(customerProfile.lastTransactionTime)) / 1000 / 60;
          return distance > 500 && timeDiff < 60;
        },
        evaluateVelocityAlert: function(recentTransactions) {
          if (!recentTransactions || recentTransactions.length < 3) return false;
          return recentTransactions.length > 5;
        },
        evaluateDeviceRisk: function(deviceId, deviceData) {
          if (!deviceData) return 'unknown';
          if (deviceData.compromised) return 'high';
          if (deviceData.newDevice) return 'medium';
          return 'low';
        },
        calculateDistance: function(lat1, lon1, lat2, lon2) {
          var R = 6371;
          var dLat = (lat2 - lat1) * Math.PI / 180;
          var dLon = (lon2 - lon1) * Math.PI / 180;
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        }
      };
    }]);
})();