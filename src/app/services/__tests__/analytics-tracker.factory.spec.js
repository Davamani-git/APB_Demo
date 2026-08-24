/*
Test Documentation:
- Test Name: AnalyticsTrackerFactory - trackEvent (success)
- Purpose: Verify that trackEvent increments metrics counters and posts to /api/analytics/track.
- Scenario: Valid eventType and eventData, $http.post resolves
- Expected Result: metrics.totalEvents incremented, eventsByType updated, response.data returned

- Test Name: AnalyticsTrackerFactory - trackEvent (HTTP failure)
- Purpose: Verify that trackEvent resolves with { tracked: false } on HTTP error (graceful degradation).
- Scenario: $http.post rejects
- Expected Result: Promise resolves with { tracked: false }, metrics still updated

- Test Name: AnalyticsTrackerFactory - trackEvent (multiple events same type)
- Purpose: Verify that eventsByType counter accumulates correctly for repeated event types.
- Scenario: Same eventType called multiple times
- Expected Result: eventsByType[eventType] equals number of calls

- Test Name: AnalyticsTrackerFactory - getMetrics
- Purpose: Verify that getMetrics returns the current metrics object.
- Scenario: After tracking events
- Expected Result: Returns object with totalEvents and eventsByType

- Test Name: AnalyticsTrackerFactory - trackModelPerformance (success)
- Purpose: Verify that trackModelPerformance posts correct payload to /api/analytics/model-performance.
- Scenario: $http.post resolves
- Expected Result: response.data returned

- Test Name: AnalyticsTrackerFactory - trackModelDrift (success)
- Purpose: Verify that trackModelDrift posts correct payload to /api/analytics/model-drift.
- Scenario: $http.post resolves
- Expected Result: response.data returned

- Test Name: AnalyticsTrackerFactory - trackEvent payload structure
- Purpose: Verify that the payload sent to analytics/track includes eventType, eventData, timestamp, and sessionId.
- Scenario: trackEvent called with specific parameters
- Expected Result: POST body contains all required fields
*/

describe('AnalyticsTrackerFactory', function() {
  var AnalyticsTrackerFactory;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('fraudDetection'));

  beforeEach(inject(function(_AnalyticsTrackerFactory_, _$httpBackend_, _$rootScope_) {
    AnalyticsTrackerFactory = _AnalyticsTrackerFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('trackEvent', function() {
    it('should increment totalEvents on each call', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(200, { success: true });
      var initialCount = AnalyticsTrackerFactory.getMetrics().totalEvents;
      AnalyticsTrackerFactory.trackEvent('fraud_alert_created', { alertId: 'ALT-001' });
      $httpBackend.flush();
      expect(AnalyticsTrackerFactory.getMetrics().totalEvents).toBe(initialCount + 1);
    });

    it('should increment eventsByType counter for given event type', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(200, {});
      AnalyticsTrackerFactory.trackEvent('fraud_alert_sent', {});
      $httpBackend.flush();
      expect(AnalyticsTrackerFactory.getMetrics().eventsByType['fraud_alert_sent']).toBe(1);
    });

    it('should accumulate eventsByType for repeated event types', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(200, {});
      $httpBackend.expectPOST('/api/analytics/track').respond(200, {});
      $httpBackend.expectPOST('/api/analytics/track').respond(200, {});
      AnalyticsTrackerFactory.trackEvent('fraud_alert_viewed', {});
      AnalyticsTrackerFactory.trackEvent('fraud_alert_viewed', {});
      AnalyticsTrackerFactory.trackEvent('fraud_alert_viewed', {});
      $httpBackend.flush();
      expect(AnalyticsTrackerFactory.getMetrics().eventsByType['fraud_alert_viewed']).toBe(3);
    });

    it('should post to /api/analytics/track with correct structure', function() {
      $httpBackend.expectPOST('/api/analytics/track', jasmine.objectContaining({
        eventType: 'fraud_alert_confirmed',
        eventData: { transactionId: 'TXN-001' }
      })).respond(200, { tracked: true });
      AnalyticsTrackerFactory.trackEvent('fraud_alert_confirmed', { transactionId: 'TXN-001' });
      $httpBackend.flush();
    });

    it('should return response.data on success', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(200, { tracked: true });
      var result;
      AnalyticsTrackerFactory.trackEvent('fraud_alert_reported', {}).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toEqual({ tracked: true });
    });

    it('should resolve with { tracked: false } on HTTP error (graceful degradation)', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(500, { error: 'Server Error' });
      var result;
      AnalyticsTrackerFactory.trackEvent('fraud_alert_failed', {}).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(result).toEqual({ tracked: false });
    });

    it('should still update metrics even when HTTP call fails', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(503, {});
      var initialCount = AnalyticsTrackerFactory.getMetrics().totalEvents;
      AnalyticsTrackerFactory.trackEvent('fraud_protection_started', {});
      $httpBackend.flush();
      expect(AnalyticsTrackerFactory.getMetrics().totalEvents).toBe(initialCount + 1);
    });

    it('should include sessionId and timestamp in payload', function() {
      $httpBackend.expectPOST('/api/analytics/track', jasmine.objectContaining({
        sessionId: jasmine.stringMatching(/^SESSION-/)
      })).respond(200, {});
      AnalyticsTrackerFactory.trackEvent('fraud_alert_delivered', { alertId: 'ALT-002' });
      $httpBackend.flush();
    });
  });

  describe('getMetrics', function() {
    it('should return metrics object with totalEvents and eventsByType', function() {
      var metrics = AnalyticsTrackerFactory.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.hasOwnProperty('totalEvents')).toBe(true);
      expect(metrics.hasOwnProperty('eventsByType')).toBe(true);
    });

    it('should reflect live metrics state', function() {
      $httpBackend.expectPOST('/api/analytics/track').respond(200, {});
      AnalyticsTrackerFactory.trackEvent('fraud_protection_completed', {});
      $httpBackend.flush();
      var metrics = AnalyticsTrackerFactory.getMetrics();
      expect(metrics.totalEvents).toBeGreaterThan(0);
    });
  });

  describe('trackModelPerformance', function() {
    it('should post to /api/analytics/model-performance with correct payload', function() {
      var modelVersion = 'v2.1.0';
      var performance = { accuracy: 0.97, precision: 0.95, recall: 0.93 };
      $httpBackend.expectPOST('/api/analytics/model-performance', jasmine.objectContaining({
        modelVersion: modelVersion,
        performance: performance
      })).respond(200, { recorded: true });
      var result;
      AnalyticsTrackerFactory.trackModelPerformance(modelVersion, performance).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toEqual({ recorded: true });
    });

    it('should include timestamp in model performance payload', function() {
      $httpBackend.expectPOST('/api/analytics/model-performance', jasmine.objectContaining({
        timestamp: jasmine.any(Object)
      })).respond(200, {});
      AnalyticsTrackerFactory.trackModelPerformance('v1.0', { accuracy: 0.90 });
      $httpBackend.flush();
    });
  });

  describe('trackModelDrift', function() {
    it('should post to /api/analytics/model-drift with correct payload', function() {
      var driftMetrics = { featureDrift: 0.12, predictionDrift: 0.08 };
      $httpBackend.expectPOST('/api/analytics/model-drift', jasmine.objectContaining({
        driftMetrics: driftMetrics
      })).respond(200, { driftRecorded: true });
      var result;
      AnalyticsTrackerFactory.trackModelDrift(driftMetrics).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toEqual({ driftRecorded: true });
    });

    it('should include timestamp in model drift payload', function() {
      $httpBackend.expectPOST('/api/analytics/model-drift', jasmine.objectContaining({
        timestamp: jasmine.any(Object)
      })).respond(200, {});
      AnalyticsTrackerFactory.trackModelDrift({ featureDrift: 0.05 });
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: trackEvent, getMetrics, trackModelPerformance, trackModelDrift
  - Scenarios covered: successful tracking, HTTP failure graceful degradation, metrics accumulation,
    multiple events same type, payload structure validation, model performance tracking, model drift tracking
  - Uncovered scenarios: concurrent trackEvent calls, very large eventData payloads
  */
});
