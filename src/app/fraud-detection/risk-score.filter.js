(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .filter('riskScore', function() {
      return function(score) {
        if (score === null || score === undefined) {
          return 'N/A';
        }
        return parseFloat(score).toFixed(2);
      };
    })
    .filter('riskBandColor', function() {
      return function(riskBand) {
        const colors = {
          low: '#5cb85c',
          medium: '#f0ad4e',
          high: '#d9534f',
          critical: '#a94442'
        };
        return colors[riskBand] || '#777';
      };
    });
})();