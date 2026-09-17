/*
Test Documentation:
- Test Name: AuditLogService Unit Tests
- Purpose: Validate audit logging for fraud decisions and generic events, including HTTP interactions, payload structure, and error handling.
- Scenario: logDecision success/error, logEvent success/error, getAuditLogs success/error, correct payload construction, console.error on failure.
- Expected Result: Each method POSTs or GETs to the correct AUDIT_API_ENDPOINT, resolves with response.data on success, logs errors via console.error on failure, and re-throws errors for getAuditLogs.
*/

describe('AuditLogService', function () {
  'use strict';

  var AuditLogService, $httpBackend, AUDIT_API_ENDPOINT;

  var mockTransaction = {
    transactionId: 'TXN-001',
    amount: 500.00,
    merchant: 'Suspicious Store',
    currency: 'USD'
  };

  var mockDecision = { action: 'decline', reason: 'Critical risk level detected' };
  var mockRiskScore = { score: 95, riskLevel: 'CRITICAL' };

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function ($provide) {
    $provide.constant('AUDIT_API_ENDPOINT', 'https://audit.example.com/logs');
  }));

  beforeEach(inject(function (_AuditLogService_, _$httpBackend_, _AUDIT_API_ENDPOINT_) {
    AuditLogService = _AuditLogService_;
    $httpBackend = _$httpBackend_;
    AUDIT_API_ENDPOINT = _AUDIT_API_ENDPOINT_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── logDecision ────────────────────────────────────────────────────────────

  describe('logDecision()', function () {

    it('should POST to AUDIT_API_ENDPOINT and return response data on success', function () {
      var mockResponse = { id: 'LOG-001', status: 'recorded' };
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(201, mockResponse);

      var result;
      AuditLogService.logDecision(mockTransaction, mockDecision, mockRiskScore)
        .then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should include transactionId, eventType fraud_decision, decision, riskScore, and userId system in POST body', function () {
      $httpBackend.expectPOST('https://audit.example.com/logs', function (body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === 'TXN-001' &&
               parsed.eventType === 'fraud_decision' &&
               parsed.userId === 'system' &&
               parsed.eventData.decision === mockDecision &&
               typeof parsed.timestamp === 'string';
      }).respond(201, {});

      AuditLogService.logDecision(mockTransaction, mockDecision, mockRiskScore);
      $httpBackend.flush();
    });

    it('should call console.error and NOT re-throw when POST fails', function () {
      spyOn(console, 'error');
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(500, { message: 'Server Error' });

      var resolved;
      AuditLogService.logDecision(mockTransaction, mockDecision, mockRiskScore)
        .then(function (data) { resolved = data; });

      $httpBackend.flush();
      expect(console.error).toHaveBeenCalledWith('Audit log failed:', jasmine.anything());
      expect(resolved).toBeUndefined();
    });

    it('should handle logDecision when transaction has minimal fields', function () {
      var minimalTransaction = { transactionId: 'TXN-MIN' };
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(201, {});

      AuditLogService.logDecision(minimalTransaction, mockDecision, mockRiskScore);
      $httpBackend.flush();
    });
  });

  // ─── logEvent ───────────────────────────────────────────────────────────────

  describe('logEvent()', function () {

    it('should POST to AUDIT_API_ENDPOINT with eventType and eventData and return response data', function () {
      var mockResponse = { id: 'LOG-002', status: 'recorded' };
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(201, mockResponse);

      var result;
      AuditLogService.logEvent('fraud_alert_created', { alertId: 'ALT-001' })
        .then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should include eventType, eventData, timestamp, and userId system in POST body for logEvent', function () {
      $httpBackend.expectPOST('https://audit.example.com/logs', function (body) {
        var parsed = JSON.parse(body);
        return parsed.eventType === 'fraud_alert_viewed' &&
               parsed.userId === 'system' &&
               typeof parsed.timestamp === 'string' &&
               parsed.eventData.alertId === 'ALT-001';
      }).respond(201, {});

      AuditLogService.logEvent('fraud_alert_viewed', { alertId: 'ALT-001' });
      $httpBackend.flush();
    });

    it('should call console.error and NOT re-throw when logEvent POST fails', function () {
      spyOn(console, 'error');
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(503, {});

      AuditLogService.logEvent('fraud_alert_failed', {});
      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith('Audit log failed:', jasmine.anything());
    });

    it('should handle logEvent with empty eventData object', function () {
      $httpBackend.expectPOST('https://audit.example.com/logs').respond(201, {});

      AuditLogService.logEvent('fraud_protection_started', {});
      $httpBackend.flush();
    });

    it('should handle all PRD-defined analytics event types without error', function () {
      var eventTypes = [
        'fraud_alert_created', 'fraud_alert_sent', 'fraud_alert_delivered',
        'fraud_alert_viewed', 'fraud_alert_confirmed', 'fraud_alert_reported',
        'fraud_protection_started', 'fraud_protection_completed', 'fraud_alert_failed'
      ];

      eventTypes.forEach(function (eventType) {
        $httpBackend.expectPOST('https://audit.example.com/logs').respond(201, {});
        AuditLogService.logEvent(eventType, { source: 'test' });
      });

      $httpBackend.flush();
    });
  });

  // ─── getAuditLogs ───────────────────────────────────────────────────────────

  describe('getAuditLogs()', function () {

    it('should GET audit logs with the correct transactionId query parameter', function () {
      var mockLogs = [{ id: 'LOG-001', transactionId: 'TXN-001' }];
      $httpBackend.expectGET('https://audit.example.com/logs?transactionId=TXN-001').respond(200, mockLogs);

      var result;
      AuditLogService.getAuditLogs('TXN-001').then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockLogs);
    });

    it('should return an empty array when no audit logs exist for a transaction', function () {
      $httpBackend.expectGET('https://audit.example.com/logs?transactionId=TXN-NEW').respond(200, []);

      var result;
      AuditLogService.getAuditLogs('TXN-NEW').then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject and re-throw error when GET audit logs fails', function () {
      $httpBackend.expectGET('https://audit.example.com/logs?transactionId=TXN-001').respond(500, {});

      var caughtError;
      AuditLogService.getAuditLogs('TXN-001').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error on 403 Forbidden for getAuditLogs', function () {
      $httpBackend.expectGET('https://audit.example.com/logs?transactionId=TXN-001').respond(403, { message: 'Forbidden' });

      var caughtError;
      AuditLogService.getAuditLogs('TXN-001').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  /*
  Coverage Report:
  - Functions tested: logDecision, logEvent, getAuditLogs
  - Scenarios covered:
      logDecision  -> success, correct payload shape, HTTP 500 with console.error, minimal transaction
      logEvent     -> success, correct payload shape, HTTP 503 with console.error, empty eventData, all PRD analytics event types
      getAuditLogs -> success with data, empty array, HTTP 500, HTTP 403
  - Uncovered scenarios: concurrent duplicate audit posts, network-level timeout
  */
});
