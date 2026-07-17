(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .filter('categoryLabel', categoryLabelFilter);

  function categoryLabelFilter() {
    const map = {
      SPENDING_TREND: 'Spending trends',
      INCOME_TREND: 'Income trends',
      SAVINGS_BEHAVIOR: 'Savings behavior'
    };

    return function (code) {
      if (!code) {
        return '';
      }
      return map[code] || code;
    };
  }
})();
