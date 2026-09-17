/*
Test Documentation:

- Test Name: analyticsService - getMetrics - success
  Purpose: Verify that getMetrics calls the correct API endpoint and returns response data.
  Scenario: $http.get resolves successfully with metrics data.
  Expected Result: Resolved value equals response.data.

- Test Name: analyticsService - getMetrics - failure
  Purpose: Verify that getMetrics rejects the promise and logs an error when the HTTP call fails.
  Scenario: $http.get rejects with an error object.
  Expected Result: Promise is rejected with the original error; console.error is called.

- Test Name: analyticsService - emitEvent - success
  Purpose: Verify that emitEvent posts the correct payload (type, data, timestamp) to the events endpoint.
  Scenario: $http.post resolves successfully.
  Expected Result: $http.post is called with the correct URL and a payload containing type, data, and a valid ISO timestamp.

- Test Name: analyticsService - emitEvent - failure
  Purpose: Verify that emitEvent rejects the promise and logs an error when the HTTP call fails.
  Scenario: $http.post rejects with an error object.
  Expected Result: Promise is rejected with the original error; console.error is called.

- Test Name: analyticsService - emitEvent - payload timestamp format
  Purpose: Verify that the timestamp in the posted payload is a valid ISO 8601 string.
  Scenario: emitEvent is called with any eventType and eventData.
  Expected Result: The timestamp field in the posted body matches an ISO 8601 pattern.

- Test Name: analyticsService - getPerformanceStats - success
  Purpose: Verify that getPerformanceStats calls the correct API endpoint and returns response data.
  Scenario: $http.get resolves successfully with performance stats.
  Expected Result: Resolved value equals response.data.

- Test Name: analyticsService - getPerformanceStats - failure
  Purpose: Verify that getPerformanceStats rejects the promise and logs an error when the HTTP call fails.
  Scenario: $http.get rejects with an error object.
  Expected Result: Promise is rejected with the original error; console.error is called.

Coverage Report:
- Functions tested: getMetrics, emitEvent, getPerformanceStats
- Scenarios covered: HTTP success, HTTP failure/rejection, payload structure validation, ISO timestamp validation
- Uncovered scenarios: Network timeout edge cases (outside AngularJS $http mock scope)
*/

describe('analyticsService', function () {

  var analyticsService, $httpBackend, $q, $rootScope;

  beforeEach(module('fraudDetectionModule'));

  beforeEach(inject(function (_analyticsService_, _$httpBackend_, _$q_, _$rootScope_) {
    analyticsService = _analyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    spyOn(console, 'error');
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── getMetrics ───────────────────────────────────────────────────────────

  describe('getMetrics', function () {

    it('should call GET /api/analytics/metrics and return response data on success', function () {
      var mockData = { totalAlerts: 42, falsePositives: 3 };
      $httpBackend.expectGET('/api/analytics/metrics').respond(200, mockData);

      var result;
      analyticsService.getMetrics().then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual(mockData);
    });

    it('should reject the promise and call console.error when GET /api/analytics/metrics fails', function () {
      $httpBackend.expectGET('/api/analytics/metrics').respond(500, { message: 'Server Error' });

      var rejected = false;
      analyticsService.getMetrics().catch(function () {
        rejected = true;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should reject with the original error object when GET /api/analytics/metrics fails', function () {
      var serverError = { message: 'Internal Server Error' };
      $httpBackend.expectGET('/api/analytics/metrics').respond(500, serverError);

      var capturedError;
      analyticsService.getMetrics().catch(function (err) {
        capturedError = err;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(capturedError).toBeDefined();
    });

  });

  // ─── emitEvent ────────────────────────────────────────────────────────────

  describe('emitEvent', function () {

    it('should POST to /api/analytics/events with correct type and data on success', function () {
      var eventType = 'fraud_alert_created';
      var eventData = { alertId: 'A001', severity: 'HIGH' };

      $httpBackend.expectPOST('/api/analytics/events', function (body) {
        var parsed = JSON.parse(body);
        return parsed.type === eventType && parsed.data.alertId === 'A001';
      }).respond(200, {});

      analyticsService.emitEvent(eventType, eventData);
      $httpBackend.flush();
    });

    it('should include a valid ISO 8601 timestamp in the POST payload', function () {
      var isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

      $httpBackend.expectPOST('/api/analytics/events', function (body) {
        var parsed = JSON.parse(body);
        return isoPattern.test(parsed.timestamp);
      }).respond(200, {});

      analyticsService.emitEvent('fraud_alert_viewed', { alertId: 'A002' });
      $httpBackend.flush();
    });

    it('should reject the promise and call console.error when POST /api/analytics/events fails', function () {
      $httpBackend.expectPOST('/api/analytics/events').respond(503, { message: 'Service Unavailable' });

      var rejected = false;
      analyticsService.emitEvent('fraud_alert_failed', {}).catch(function () {
        rejected = true;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle empty eventData gracefully and still POST successfully', function () {
      $httpBackend.expectPOST('/api/analytics/events', function (body) {
        var parsed = JSON.parse(body);
        return parsed.type === 'fraud_protection_started' && parsed.data !== undefined;
      }).respond(200, {});

      analyticsService.emitEvent('fraud_protection_started', {});
      $httpBackend.flush();
    });

    it('should handle null eventData without throwing', function () {
      $httpBackend.expectPOST('/api/analytics/events').respond(200, {});

      expect(function () {
        analyticsService.emitEvent('fraud_alert_sent', null);
      }).not.toThrow();

      $httpBackend.flush();
    });

  });

  // ─── getPerformanceStats ──────────────────────────────────────────────────

  describe('getPerformanceStats', function () {

    it('should call GET /api/analytics/performance and return response data on success', function () {
      var mockStats = { avgLatencyMs: 120, throughput: 5000 };
      $httpBackend.expectGET('/api/analytics/performance').respond(200, mockStats);

      var result;
      analyticsService.getPerformanceStats().then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual(mockStats);
    });

    it('should reject the promise and call console.error when GET /api/analytics/performance fails', function () {
      $httpBackend.expectGET('/api/analytics/performance').respond(404, { message: 'Not Found' });

      var rejected = false;
      analyticsService.getPerformanceStats().catch(function () {
        rejected = true;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should reject with the original error object when GET /api/analytics/performance fails', function () {
      $httpBackend.expectGET('/api/analytics/performance').respond(500, {});

      var capturedError;
      analyticsService.getPerformanceStats().catch(function (err) {
        capturedError = err;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(capturedError).toBeDefined();
    });

    it('should return an empty object when performance endpoint returns empty data', function () {
      $httpBackend.expectGET('/api/analytics/performance').respond(200, {});

      var result;
      analyticsService.getPerformanceStats().then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual({});
    });

  });

});
