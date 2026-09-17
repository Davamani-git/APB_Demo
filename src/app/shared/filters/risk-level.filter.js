(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .filter('riskLevel', function() {
      return function(riskScore) {
        if (riskScore == null) return 'Unknown';
        if (riskScore >= 90) return 'Confirmed Fraud';
        if (riskScore >= 70) return 'High';
        if (riskScore >= 30) return 'Medium';
        return 'Low';
      };
    });
})();