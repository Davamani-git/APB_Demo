'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .directive('loadingSpinner', loadingSpinner);

  function loadingSpinner() {
    return {
      restrict: 'E',
      template: '<div class="loading-spinner text-center"><span class="glyphicon glyphicon-refresh glyphicon-spin"></span> Loading...</div>'
    };
  }
})();
