(function() {
  'use strict';
  angular.module('energyDashboard')
    .directive('deviceCard', ['$interval', function($interval) {
      return {
        restrict: 'E',
        scope: {
          deviceData: '='
        },
        template: '<div class="panel" ng-class="{\"panel-success\": deviceData.status === \"active\", \"panel-warning\": deviceData.status === \"idle\", \"panel-danger\": deviceData.status === \"offline\"}">' +
                  '  <div class="panel-heading">' +
                  '    <h4>{{deviceData.deviceName}}</h4>' +
                  '    <small>{{deviceData.deviceType}}</small>' +
                  '  </div>' +
                  '  <div class="panel-body">' +
                  '    <p><strong>Consumption:</strong> {{deviceData.consumption | number:2}} kWh</p>' +
                  '    <p><strong>Power:</strong> {{deviceData.power | number:2}} kW</p>' +
                  '    <p><strong>Status:</strong> <span class="label" ng-class="{\"label-success\": deviceData.status === \"active\", \"label-warning\": deviceData.status === \"idle\", \"label-danger\": deviceData.status === \"offline\"}">{{deviceData.status}}</span></p>' +
                  '    <p><small>Last updated: {{deviceData.lastUpdated | date:\"short\"}}</small></p>' +
                  '  </div>' +
                  '</div>',
        link: function(scope, element, attrs) {
          const updateInterval = $interval(function() {
            if (scope.deviceData) {
              scope.deviceData.lastUpdated = new Date();
            }
          }, 60000);
          scope.$on('$destroy', function() {
            $interval.cancel(updateInterval);
          });
        }
      };
    }]);
})();