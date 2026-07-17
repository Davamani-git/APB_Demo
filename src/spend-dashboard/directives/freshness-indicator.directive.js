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
      template: [
        '<div ng-if="timestamp" class="apb-freshness-indicator">',
        '  <div class="alert" ng-class="{\'alert-warning\': isStale, \'alert-success\': !isStale}">',
        '    <strong>Last updated:</strong> {{timestamp | date:\'medium\'}}',
        '    <span ng-if="isStale">  Data may not reflect the latest transactions.</span>',
        '    <span ng-if="!isStale">  Up to date.</span>',
        '  </div>',
        '</div>'
      ].join('')
    };
  }
})();
