describe('ETAService', function() {
  beforeEach(module('foodDeliveryApp'));
  var ETAService, $httpBackend, $interval, $q;

  beforeEach(inject(function(_ETAService_, _$httpBackend_, _$interval_, _$q_) {
    ETAService = _ETAService_;
    $httpBackend = _$httpBackend_;
    $interval = _$interval_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $interval.verifyNoPendingTimers();
  });

  /*
  Test Documentation:
  - Test Name: should fetch ETA successfully
  - Purpose: Validates successful retrieval of ETA data
  - Scenario: HTTP GET request returns valid ETA response
  - Expected Result: ETA data is returned and cached
  */
  it('should fetch ETA successfully', function() {
    var orderId = 'order123';
    var mockETA = {
      eta: '15 minutes',
      confidence: 'high'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(200, mockETA);
    var result;
    ETAService.getETA(orderId).then(function(eta) {
      result = eta;
    });
    $httpBackend.flush();
    expect(result.eta).toBe('15 minutes');
    expect(result.confidence).toBe('high');
  });

  /*
  Test Documentation:
  - Test Name: should return cached ETA on error
  - Purpose: Validates fallback to cached ETA during failures
  - Scenario: HTTP request fails but cached ETA exists
  - Expected Result: Cached ETA returned
  */
  it('should return cached ETA on error', function() {
    var orderId = 'order123';
    var mockETA = {
      eta: '20 minutes',
      confidence: 'medium'
    };
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(200, mockETA);
    ETAService.getETA(orderId);
    $httpBackend.flush();
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(500, 'Server Error');
    var result;
    ETAService.getETA(orderId).then(function(eta) {
      result = eta;
    });
    $httpBackend.flush();
    expect(result.eta).toBe('20 minutes');
  });

  /*
  Test Documentation:
  - Test Name: should return default ETA on error without cache
  - Purpose: Validates default response when no cache available
  - Scenario: HTTP request fails and no cached data exists
  - Expected Result: Default ETA object with null eta and low confidence
  */
  it('should return default ETA on error without cache', function() {
    var orderId = 'order456';
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(500, 'Server Error');
    var result;
    ETAService.getETA(orderId).then(function(eta) {
      result = eta;
    });
    $httpBackend.flush();
    expect(result.eta).toBeNull();
    expect(result.confidence).toBe('low');
  });

  /*
  Test Documentation:
  - Test Name: should start auto refresh with interval
  - Purpose: Validates periodic ETA refresh functionality
  - Scenario: startAutoRefresh called with orderId and callback
  - Expected Result: Interval set to refresh ETA every 180000ms
  */
  it('should start auto refresh with interval', function() {
    var orderId = 'order123';
    var mockETA = {
      eta: '10 minutes',
      confidence: 'high'
    };
    var callbackSpy = jasmine.createSpy('callback');
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(200, mockETA);
    ETAService.startAutoRefresh(orderId, callbackSpy);
    $httpBackend.flush();
    $interval.flush(180000);
    expect(callbackSpy).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should stop auto refresh and cancel interval
  - Purpose: Validates cleanup of refresh interval
  - Scenario: stopAutoRefresh called after startAutoRefresh
  - Expected Result: Interval cancelled and no further updates
  */
  it('should stop auto refresh and cancel interval', function() {
    var orderId = 'order123';
    var mockETA = {
      eta: '10 minutes',
      confidence: 'high'
    };
    var callbackSpy = jasmine.createSpy('callback');
    $httpBackend.expectGET('/api/orders/' + orderId + '/eta')
      .respond(200, mockETA);
    ETAService.startAutoRefresh(orderId, callbackSpy);
    $httpBackend.flush();
    ETAService.stopAutoRefresh();
    $interval.flush(180000);
    expect(callbackSpy).toHaveBeenCalledTimes(0);
  });

  /*
  Test Documentation:
  - Test Name: should handle stopAutoRefresh when no interval active
  - Purpose: Validates graceful handling of stop without start
  - Scenario: stopAutoRefresh called without active interval
  - Expected Result: No error thrown
  */
  it('should handle stopAutoRefresh when no interval active', function() {
    expect(function() {
      ETAService.stopAutoRefresh();
    }).not.toThrow();
  });

  /*
  Test Documentation:
  - Test Name: should replace previous interval on new startAutoRefresh
  - Purpose: Validates cleanup of old interval before starting new one
  - Scenario: startAutoRefresh called twice
  - Expected Result: Previous interval cancelled, new one started
  */
  it('should replace previous interval on new startAutoRefresh', function() {
    var orderId1 = 'order123';
    var orderId2 = 'order456';
    var mockETA = {
      eta: '10 minutes',
      confidence: 'high'
    };
    var callback1 = jasmine.createSpy('callback1');
    var callback2 = jasmine.createSpy('callback2');
    $httpBackend.expectGET('/api/orders/' + orderId1 + '/eta')
      .respond(200, mockETA);
    ETAService.startAutoRefresh(orderId1, callback1);
    $httpBackend.flush();
    $httpBackend.expectGET('/api/orders/' + orderId2 + '/eta')
      .respond(200, mockETA);
    ETAService.startAutoRefresh(orderId2, callback2);
    $httpBackend.flush();
    $interval.flush(180000);
    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalled();
  });

  /*
  Coverage Report:
  - Functions tested: getETA, startAutoRefresh, stopAutoRefresh
  - Scenarios covered: successful fetch, cached fallback, default response, interval management
  - Edge cases: missing cache, multiple intervals, stop without start
  - Uncovered scenarios: malformed JSON, network timeout, callback exceptions
  */
});
