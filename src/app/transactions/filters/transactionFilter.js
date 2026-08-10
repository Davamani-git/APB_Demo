(function() {
  'use strict';
  angular.module('transactionModule').filter('transactionAmount', [function() {
    return function(amount, currency) {
      if (!amount) return '';
      const formatted = parseFloat(amount).toFixed(2);
      return (currency || 'USD') + ' ' + formatted;
    };
  }]).filter('transactionDate', ['$filter', function($filter) {
    return function(timestamp) {
      if (!timestamp) return '';
      return $filter('date')(timestamp, 'MMM dd, yyyy hh:mm a');
    };
  }]);
})();