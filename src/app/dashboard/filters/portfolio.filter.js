(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .filter('portfolioFilter', function() {
      return function(input, type) {
        if (!input) return input;
        if (type === 'currency') {
          return '$' + parseFloat(input).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        } else if (type === 'percentage') {
          return parseFloat(input).toFixed(2) + '%';
        } else if (type === 'date') {
          return new Date(input).toLocaleDateString();
        }
        return input;
      };
    });
})();