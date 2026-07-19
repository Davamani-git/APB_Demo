(function () {
  'use strict';

  angular
    .module('app')
    .constant('FEATURE_FLAGS', {
      enableBreakdownChart: true,
      showActiveDaysCount: true
    });
})();
