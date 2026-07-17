'use strict';

(function () {
  function crRiskLabelFilter() {
    return function (risk) {
      if (!risk || !risk.level) {
        return '';
      }
      switch (risk.level) {
        case 'LOW':
          return 'Low risk';
        case 'HIGH':
          return 'High risk';
        default:
          return 'Medium risk';
      }
    };
  }

  angular
    .module('davBanking.contextRecommendations')
    .filter('crRiskLabel', crRiskLabelFilter);
})();
