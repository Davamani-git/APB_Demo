(function() {
  'use strict';
  angular.module('deliveryTracking')
    .directive('liveMap', ['MapService', function(MapService) {
      return {
        restrict: 'E',
        scope: {
          location: '=',
          timestamp: '='
        },
        template: '<div class="map-container">' +
          '<div id="map-container" style="width: 100%; height: 100%;"></div>' +
          '<div class="location-info" ng-if="location">' +
          '<strong>Current Location:</strong> {{location.latitude | number:6}}, {{location.longitude | number:6}}<br>' +
          '<span ng-if="timestamp">Last updated: {{timestamp | date:"medium"}}</span>' +
          '<span ng-if="location.accuracy"> (±{{location.accuracy}}m)</span>' +
          '</div>' +
          '<div class="location-info" ng-if="!location">' +
          'Location data unavailable' +
          '</div>' +
          '</div>',
        link: function(scope, element) {
          scope.$watch('location', function(newLocation) {
            if (newLocation && newLocation.latitude && newLocation.longitude) {
              MapService.renderLocation(newLocation.latitude, newLocation.longitude);
            }
          }, true);
        }
      };
    }]);
})();