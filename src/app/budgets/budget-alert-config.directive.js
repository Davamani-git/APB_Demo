(function() {
  'use strict';
  angular.module('app.budgets')
    .directive('budgetAlertConfig', [function() {
      return {
        restrict: 'E',
        scope: {
          thresholds: '='
        },
        template: '<div class="budget-alert-config">' +
          '<h4>Alert Thresholds</h4>' +
          '<div class="checkbox">' +
          '<label><input type="checkbox" ng-model="alerts.fifty" ng-change="updateThresholds()"> 50% Alert</label>' +
          '</div>' +
          '<div class="checkbox">' +
          '<label><input type="checkbox" ng-model="alerts.eighty" ng-change="updateThresholds()"> 80% Alert</label>' +
          '</div>' +
          '<div class="checkbox">' +
          '<label><input type="checkbox" ng-model="alerts.hundred" ng-change="updateThresholds()"> 100% Alert</label>' +
          '</div>' +
          '</div>',
        link: function(scope) {
          scope.alerts = {
            fifty: false,
            eighty: false,
            hundred: false
          };
          scope.$watch('thresholds', function(thresholds) {
            if (thresholds && Array.isArray(thresholds)) {
              scope.alerts.fifty = thresholds.indexOf(50) !== -1;
              scope.alerts.eighty = thresholds.indexOf(80) !== -1;
              scope.alerts.hundred = thresholds.indexOf(100) !== -1;
            }
          });
          scope.updateThresholds = function() {
            var newThresholds = [];
            if (scope.alerts.fifty) newThresholds.push(50);
            if (scope.alerts.eighty) newThresholds.push(80);
            if (scope.alerts.hundred) newThresholds.push(100);
            scope.thresholds = newThresholds;
          };
        }
      };
    }]);
})();