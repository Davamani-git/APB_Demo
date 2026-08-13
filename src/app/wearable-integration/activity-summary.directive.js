(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .directive('activitySummary', [function() {
      return {
        restrict: 'E',
        scope: {
          summary: '='
        },
        templateUrl: 'src/app/wearable-integration/activity-summary.template.html',
        link: function(scope) {
          scope.getHeartRateStatus = function() {
            if (!scope.summary || !scope.summary.avgHeartRate) return 'normal';
            var hr = scope.summary.avgHeartRate;
            if (hr < 60) return 'low';
            if (hr > 100) return 'high';
            return 'normal';
          };
        }
      };
    }]);
})();