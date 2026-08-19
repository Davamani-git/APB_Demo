(function() {
  'use strict';
  angular.module('foodDeliveryApp')
    .service('MapService', ['$q', '$window', function($q, $window) {
      var mapInstance = null;
      var marker = null;
      var routeLine = null;
      var mapLoaded = false;
      this.initializeMap = function(containerId, initialLocation) {
        var deferred = $q.defer();
        if (!$window.google || !$window.google.maps) {
          var script = document.createElement('script');
          script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY';
          script.async = true;
          script.onload = function() {
            mapLoaded = true;
            this.createMap(containerId, initialLocation, deferred);
          }.bind(this);
          script.onerror = function() {
            deferred.reject('Map API failed to load');
          };
          document.head.appendChild(script);
        } else {
          this.createMap(containerId, initialLocation, deferred);
        }
        return deferred.promise;
      };
      this.createMap = function(containerId, initialLocation, deferred) {
        var container = document.getElementById(containerId);
        if (!container) {
          deferred.reject('Container not found');
          return;
        }
        var center = initialLocation || { lat: 37.7749, lng: -122.4194 };
        mapInstance = new google.maps.Map(container, {
          center: center,
          zoom: 14,
          disableDefaultUI: false
        });
        marker = new google.maps.Marker({
          position: center,
          map: mapInstance,
          title: 'Delivery Partner'
        });
        deferred.resolve(mapInstance);
      };
      this.renderLocation = function(lat, lng) {
        if (!mapInstance) return;
        var position = { lat: lat, lng: lng };
        if (marker) {
          marker.setPosition(position);
        } else {
          marker = new google.maps.Marker({
            position: position,
            map: mapInstance,
            title: 'Delivery Partner'
          });
        }
        mapInstance.setCenter(position);
      };
      this.updateMarker = function(lat, lng) {
        this.renderLocation(lat, lng);
      };
      this.drawRoute = function(origin, destination, waypoints) {
        if (!mapInstance || !$window.google) return;
        if (routeLine) {
          routeLine.setMap(null);
        }
        var directionsService = new google.maps.DirectionsService();
        var request = {
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING'
        };
        directionsService.route(request, function(result, status) {
          if (status === 'OK') {
            routeLine = new google.maps.Polyline({
              path: google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline),
              strokeColor: '#2196F3',
              strokeWeight: 4,
              map: mapInstance
            });
          }
        });
      };
    }]);
})();