'use strict';

(function () {
  function crPercentFilter($filter) {
    'ngInject';
    return function (value, fractionSize) {
      if (value === null || value === undefined) {
        return '';
      }
      var percent = value * 100;
      return $filter('number')(percent, fractionSize || 2) + '%';
    };
  }

  angular
    .module('davBanking.contextRecommendations')
    .filter('crPercent', crPercentFilter);
})();
