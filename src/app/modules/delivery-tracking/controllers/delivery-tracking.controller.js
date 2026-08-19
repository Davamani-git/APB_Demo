(function() {
  'use strict';
  angular.module('deliveryTracking')
    .controller('DeliveryTrackingController', ['$scope', '$routeParams', 'DeliveryPartnerService', 'LocationTrackingService', 'MapService', function($scope, $routeParams, DeliveryPartnerService, LocationTrackingService, MapService) {
      var vm = this;
      vm.orderId = $routeParams.orderId;
      vm.partner = null;
      vm.currentLocation = null;
      vm.loading = true;
      vm.error = null;
      vm.locationTimestamp = null;
      vm.init = function() {
        DeliveryPartnerService.getPartnerAssignment(vm.orderId)
          .then(function(partner) {
            vm.partner = partner;
            $scope.partner = partner;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load delivery partner information';
            vm.loading = false;
          });
        LocationTrackingService.connect(vm.orderId);
      };
      $scope.$on('location:initial', function(event, location) {
        vm.currentLocation = location;
        vm.locationTimestamp = location.timestamp;
        $scope.currentLocation = location;
        if (location.latitude && location.longitude) {
          MapService.initializeMap('map-container', {
            lat: location.latitude,
            lng: location.longitude
          }).catch(function() {
            vm.error = 'Map failed to load';
          });
        }
      });
      $scope.$on('location:update', function(event, location) {
        vm.currentLocation = location;
        vm.locationTimestamp = location.timestamp;
        $scope.currentLocation = location;
        if (location.latitude && location.longitude) {
          MapService.updateMarker(location.latitude, location.longitude);
        }
      });
      $scope.$on('location:error', function() {
        vm.error = 'Location tracking error';
      });
      $scope.$on('location:disconnected', function() {
        var lastKnown = LocationTrackingService.getLastKnownLocation(vm.orderId);
        if (lastKnown) {
          vm.error = 'Using last known location from ' + new Date(lastKnown.timestamp).toLocaleTimeString();
        }
      });
      $scope.$on('location:connected', function() {
        vm.error = null;
      });
      $scope.$on('$destroy', function() {
        LocationTrackingService.disconnect();
      });
      vm.init();
    }]);
})();