(function () {
  'use strict';

  angular
    .module('apb.spendDashboard')
    .directive('freshnessIndicator', freshnessIndicator);

  function freshnessIndicator() {
    return {
      restrict: 'E',
      scope: {
        timestamp: '=',
        isStale: '='
      },
      template: '<div ng-if="timestamp" class="apb-freshness-indicator" ng-class="{\'apb-freshness-stale\': isStale, \'apb-freshness-fresh\': !isStale}">' +
        '<span class="glyphicon" ng-class="{\'glyphicon-alert\': isStale, \'glyphicon-ok-circle\': !isStale}"></span> ' +
        '<span ng-if="!isStale">Up to date as of {{timestamp | date:\'medium\'}}</span>' +
        '<span ng-if="isStale">Data may not reflect latest transactions (last updated {{timestamp | date:\'medium\'}}).</span>' +
        '</div>'
    };
  }
})();
