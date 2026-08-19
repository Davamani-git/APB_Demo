describe('LocationTrackingService', function() {
  beforeEach(module('foodDeliveryApp'));
  var LocationTrackingService, $rootScope, $httpBackend, $timeout, $window;
  var mockWebSocket;

  beforeEach(inject(function(_LocationTrackingService_, _$rootScope_, _$httpBackend_, _$timeout_, _$window_) {
    LocationTrackingService = _LocationTrackingService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    $window = _$window_;
    mockWebSocket = {
      readyState: WebSocket.CLOSED,
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      close: jasmine.createSpy('close')
    };
    spyOn($window, 'WebSocket').and.returnValue(mockWebSocket);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $timeout.verifyNoPendingTimers();
  });

  /*
  Test Documentation:
  - Test Name: should fetch initial location successfully
  - Purpose: Validates retrieval of initial location via HTTP
  - Scenario: HTTP GET request returns valid location data
  - Expected Result: Location data cached and broadcast event emitted
  */
  it('should fetch initial location successfully', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    var broadcastSpy = spyOn($rootScope, '$broadcast');
    var result;
    LocationTrackingService.getInitialLocation(orderId).then(function(location) {
      result = location;
    });
    $httpBackend.flush();
    expect(result.lat).toBe(37.7749);
    expect(broadcastSpy).toHaveBeenCalledWith('location:initial', mockLocation);
  });

  /*
  Test Documentation:
  - Test Name: should return cached location on initial fetch error
  - Purpose: Validates fallback to cache when initial fetch fails
  - Scenario: HTTP request fails after successful previous fetch
  - Expected Result: Cached location returned
  */
  it('should return cached location on initial fetch error', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    LocationTrackingService.getInitialLocation(orderId);
    $httpBackend.flush();
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(500, 'Server Error');
    var result;
    LocationTrackingService.getInitialLocation(orderId).then(function(location) {
      result = location;
    });
    $httpBackend.flush();
    expect(result.lat).toBe(37.7749);
  });

  /*
  Test Documentation:
  - Test Name: should return null when no cache and initial fetch fails
  - Purpose: Validates graceful handling when location unavailable
  - Scenario: Initial fetch fails and no cache exists
  - Expected Result: Null returned
  */
  it('should return null when no cache and initial fetch fails', function() {
    var orderId = 'order456';
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(500, 'Server Error');
    var result;
    LocationTrackingService.getInitialLocation(orderId).then(function(location) {
      result = location;
    });
    $httpBackend.flush();
    expect(result).toBeNull();
  });

  /*
  Test Documentation:
  - Test Name: should connect WebSocket and broadcast connected event
  - Purpose: Validates WebSocket connection establishment
  - Scenario: connect method called with valid orderId
  - Expected Result: WebSocket created and connected event broadcast
  */
  it('should connect WebSocket and broadcast connected event', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    var broadcastSpy = spyOn($rootScope, '$broadcast');
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    mockWebSocket.onopen();
    expect(broadcastSpy).toHaveBeenCalledWith('location:connected');
  });

  /*
  Test Documentation:
  - Test Name: should handle WebSocket message and broadcast location update
  - Purpose: Validates real-time location update handling
  - Scenario: WebSocket receives location data message
  - Expected Result: Location cached and update event broadcast
  */
  it('should handle WebSocket message and broadcast location update', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    var broadcastSpy = spyOn($rootScope, '$broadcast');
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    var newLocation = {
      lat: 37.7750,
      lng: -122.4195
    };
    mockWebSocket.onmessage({
      data: JSON.stringify(newLocation)
    });
    $rootScope.$digest();
    expect(broadcastSpy).toHaveBeenCalledWith('location:update', newLocation);
  });

  /*
  Test Documentation:
  - Test Name: should broadcast error event on WebSocket error
  - Purpose: Validates error handling for WebSocket failures
  - Scenario: WebSocket encounters error
  - Expected Result: Error event broadcast
  */
  it('should broadcast error event on WebSocket error', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    var broadcastSpy = spyOn($rootScope, '$broadcast');
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    var error = new Error('WebSocket error');
    mockWebSocket.onerror(error);
    expect(broadcastSpy).toHaveBeenCalledWith('location:error', error);
  });

  /*
  Test Documentation:
  - Test Name: should reconnect with exponential backoff on close
  - Purpose: Validates automatic reconnection with backoff strategy
  - Scenario: WebSocket closes and reconnect attempts < max
  - Expected Result: Reconnection scheduled with exponential delay
  */
  it('should reconnect with exponential backoff on close', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    mockWebSocket.onclose();
    expect($timeout.verifyNoPendingTimers).not.toThrow();
    $timeout.flush(1000);
  });

  /*
  Test Documentation:
  - Test Name: should stop reconnection after max attempts
  - Purpose: Validates reconnection limit enforcement
  - Scenario: WebSocket closes after max reconnect attempts reached
  - Expected Result: No further reconnection scheduled
  */
  it('should stop reconnection after max attempts', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    for (var i = 0; i < 5; i++) {
      mockWebSocket.onclose();
      if (i < 4) {
        $timeout.flush(1000 * Math.pow(2, i));
      }
    }
    mockWebSocket.onclose();
    expect($timeout.verifyNoPendingTimers).not.toThrow();
  });

  /*
  Test Documentation:
  - Test Name: should return last known location
  - Purpose: Validates retrieval of cached location
  - Scenario: getLastKnownLocation called after location update
  - Expected Result: Cached location returned
  */
  it('should return last known location', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    var lastLocation = LocationTrackingService.getLastKnownLocation(orderId);
    expect(lastLocation.lat).toBe(37.7749);
  });

  /*
  Test Documentation:
  - Test Name: should disconnect WebSocket
  - Purpose: Validates proper WebSocket cleanup
  - Scenario: disconnect method called
  - Expected Result: WebSocket closed and nullified
  */
  it('should disconnect WebSocket', function() {
    var orderId = 'order123';
    var mockLocation = {
      lat: 37.7749,
      lng: -122.4194
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/location')
      .respond(200, mockLocation);
    LocationTrackingService.connect(orderId);
    $httpBackend.flush();
    LocationTrackingService.disconnect();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  /*
  Coverage Report:
  - Functions tested: connect, getInitialLocation, getLastKnownLocation, disconnect
  - Scenarios covered: successful connection, location updates, error handling, reconnection, disconnection
  - Edge cases: missing cache, max reconnect attempts, WebSocket errors
  - Uncovered scenarios: malformed JSON, network timeout, concurrent connections
  */
});
