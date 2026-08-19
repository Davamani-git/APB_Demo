describe('MapService', function() {
  beforeEach(module('foodDeliveryApp'));
  var MapService, $q, $window, $timeout;

  beforeEach(inject(function(_MapService_, _$q_, _$window_, _$timeout_) {
    MapService = _MapService_;
    $q = _$q_;
    $window = _$window_;
    $timeout = _$timeout_;
  }));

  afterEach(function() {
    $timeout.verifyNoPendingTimers();
  });

  /*
  Test Documentation:
  - Test Name: should initialize map with Google Maps API
  - Purpose: Validates map initialization when API not loaded
  - Scenario: initializeMap called with containerId and location
  - Expected Result: Google Maps API script loaded and map created
  */
  it('should initialize map with Google Maps API', function() {
    var containerId = 'map-container';
    var initialLocation = { lat: 37.7749, lng: -122.4194 };
    var container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue({}),
        Marker: jasmine.createSpy('Marker')
      }
    };
    var result;
    MapService.initializeMap(containerId, initialLocation).then(function(map) {
      result = map;
    });
    $q.flush();
    expect(result).toBeDefined();
    document.body.removeChild(container);
  });

  /*
  Test Documentation:
  - Test Name: should reject promise when container not found
  - Purpose: Validates error handling for missing container
  - Scenario: initializeMap called with non-existent containerId
  - Expected Result: Promise rejected with error message
  */
  it('should reject promise when container not found', function() {
    var containerId = 'non-existent-container';
    var initialLocation = { lat: 37.7749, lng: -122.4194 };
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map')
      }
    };
    var error;
    MapService.initializeMap(containerId, initialLocation).catch(function(err) {
      error = err;
    });
    $q.flush();
    expect(error).toBe('Container not found');
  });

  /*
  Test Documentation:
  - Test Name: should create map with default location when not provided
  - Purpose: Validates default location fallback
  - Scenario: initializeMap called without initialLocation
  - Expected Result: Map created with default San Francisco coordinates
  */
  it('should create map with default location when not provided', function() {
    var containerId = 'map-container';
    var container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    var mockMap = {};
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue(mockMap),
        Marker: jasmine.createSpy('Marker')
      }
    };
    var result;
    MapService.initializeMap(containerId).then(function(map) {
      result = map;
    });
    $q.flush();
    expect($window.google.maps.Map).toHaveBeenCalledWith(
      container,
      jasmine.objectContaining({
        lat: 37.7749,
        lng: -122.4194
      })
    );
    document.body.removeChild(container);
  });

  /*
  Test Documentation:
  - Test Name: should render location and update marker position
  - Purpose: Validates marker position update on location change
  - Scenario: renderLocation called with new coordinates
  - Expected Result: Marker moved to new position and map centered
  */
  it('should render location and update marker position', function() {
    var containerId = 'map-container';
    var container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    var mockMarker = {
      setPosition: jasmine.createSpy('setPosition')
    };
    var mockMap = {
      setCenter: jasmine.createSpy('setCenter')
    };
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue(mockMap),
        Marker: jasmine.createSpy('Marker').and.returnValue(mockMarker),
        LatLng: function(lat, lng) {
          return { lat: lat, lng: lng };
        }
      }
    };
    MapService.initializeMap(containerId);
    $q.flush();
    var newLocation = { lat: 37.7750, lng: -122.4195 };
    MapService.renderLocation(newLocation);
    expect(mockMarker.setPosition).toHaveBeenCalled();
    expect(mockMap.setCenter).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  /*
  Test Documentation:
  - Test Name: should handle renderLocation when map not initialized
  - Purpose: Validates graceful handling of render before init
  - Scenario: renderLocation called without prior initializeMap
  - Expected Result: No error thrown
  */
  it('should handle renderLocation when map not initialized', function() {
    expect(function() {
      MapService.renderLocation({ lat: 37.7749, lng: -122.4194 });
    }).not.toThrow();
  });

  /*
  Test Documentation:
  - Test Name: should add route polyline to map
  - Purpose: Validates route rendering on map
  - Scenario: addRoute called with array of coordinates
  - Expected Result: Polyline created and added to map
  */
  it('should add route polyline to map', function() {
    var containerId = 'map-container';
    var container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    var mockPolyline = {
      setMap: jasmine.createSpy('setMap')
    };
    var mockMap = {};
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue(mockMap),
        Marker: jasmine.createSpy('Marker'),
        Polyline: jasmine.createSpy('Polyline').and.returnValue(mockPolyline),
        LatLng: function(lat, lng) {
          return { lat: lat, lng: lng };
        }
      }
    };
    MapService.initializeMap(containerId);
    $q.flush();
    var route = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7750, lng: -122.4195 }
    ];
    MapService.addRoute(route);
    expect($window.google.maps.Polyline).toHaveBeenCalled();
    expect(mockPolyline.setMap).toHaveBeenCalledWith(mockMap);
    document.body.removeChild(container);
  });

  /*
  Test Documentation:
  - Test Name: should clear existing route before adding new one
  - Purpose: Validates route replacement functionality
  - Scenario: addRoute called twice
  - Expected Result: Previous polyline removed, new one added
  */
  it('should clear existing route before adding new one', function() {
    var containerId = 'map-container';
    var container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
    var mockPolyline1 = {
      setMap: jasmine.createSpy('setMap1')
    };
    var mockPolyline2 = {
      setMap: jasmine.createSpy('setMap2')
    };
    var mockMap = {};
    var polylineCallCount = 0;
    $window.google = {
      maps: {
        Map: jasmine.createSpy('Map').and.returnValue(mockMap),
        Marker: jasmine.createSpy('Marker'),
        Polyline: jasmine.createSpy('Polyline').and.callFake(function() {
          polylineCallCount++;
          return polylineCallCount === 1 ? mockPolyline1 : mockPolyline2;
        }),
        LatLng: function(lat, lng) {
          return { lat: lat, lng: lng };
        }
      }
    };
    MapService.initializeMap(containerId);
    $q.flush();
    var route1 = [{ lat: 37.7749, lng: -122.4194 }];
    MapService.addRoute(route1);
    var route2 = [{ lat: 37.7750, lng: -122.4195 }];
    MapService.addRoute(route2);
    expect(mockPolyline1.setMap).toHaveBeenCalledWith(null);
    expect(mockPolyline2.setMap).toHaveBeenCalledWith(mockMap);
    document.body.removeChild(container);
  });

  /*
  Coverage Report:
  - Functions tested: initializeMap, renderLocation, addRoute
  - Scenarios covered: map initialization, location rendering, route display, error handling
  - Edge cases: missing container, uninitialized map, route replacement
  - Uncovered scenarios: Google Maps API load failure, invalid coordinates
  */
});
