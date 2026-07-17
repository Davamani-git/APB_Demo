'use strict';

(function () {
  function piPercentFilter($filter) {
    'ngInject';
    return function (value, fractionSize) {
      if (value === null || value === undefined) {
        return '';
      }
      var percent = value * 100;
      return $filter('number')(percent, fractionSize || 1) + '%';
    };
  }

  angular
    .module('davBanking.personalInsights')
    .filter('piPercent', piPercentFilter);
})();
