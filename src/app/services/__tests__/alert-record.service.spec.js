/*
Test Documentation:
- Test Name: AlertRecordService Unit Tests
- Purpose: Validate all CRUD operations for fraud alert records including HTTP interactions, success and error paths.
- Scenario: createAlert with valid data, getAlerts success/failure, getAlertById success/failure, updateAlert success/failure, HTTP error propagation.
- Expected Result: Each method correctly constructs the URL, sends the right HTTP verb, resolves with response.data on success, and re-throws errors on failure.
*/

describe('AlertRecordService', function () {
  'use strict';

  var AlertRecordService, $httpBackend, $q, API_CONFIG;

  var mockTransaction = {
    transactionId: 'TXN-001',
    amount: 250.00,
    merchant: 'Test Merchant',
    currency: 'USD'
  };

  var mockRiskScore = {
    score: 85,
    riskLevel: 'HIGH'
  };

  var mockDecision = {
    action: 'alert',
    reason: 'High risk level detected'
  };

  var mockAlertResponse = {
    alertId: 'ALT-001',
    transactionId: 'TXN-001',
    status: 'Created'
  };

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function ($provide) {
    $provide.constant('API_CONFIG', {
      baseUrl: 'https://api.example.com',
      alertsEndpoint: '/alerts',
      transactionsEndpoint: '/transactions'
    });
  }));

  beforeEach(inject(function (_AlertRecordService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    AlertRecordService = _AlertRecordService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── createAlert ───────────────────────────────────────────────────────────

  describe('createAlert()', function () {

    it('should POST to the correct alerts endpoint with properly shaped alertData', function () {
      $httpBackend.expectPOST('https://api.example.com/alerts').respond(201, mockAlertResponse);

      var result;
      AlertRecordService.createAlert(mockTransaction, mockRiskScore, mockDecision)
        .then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockAlertResponse);
    });

    it('should include transactionId, riskScore, decision, reason, and createdAt in the POST body', function () {
      $httpBackend.expectPOST('https://api.example.com/alerts', function (body) {
        var parsed = JSON.parse(body);
        return parsed.transactionId === 'TXN-001' &&
               parsed.riskScore === 85 &&
               parsed.decision === 'alert' &&
               parsed.reason === 'High risk level detected' &&
               typeof parsed.createdAt === 'string';
      }).respond(201, mockAlertResponse);

      AlertRecordService.createAlert(mockTransaction, mockRiskScore, mockDecision);
      $httpBackend.flush();
    });

    it('should reject and re-throw error when POST fails', function () {
      $httpBackend.expectPOST('https://api.example.com/alerts').respond(500, { message: 'Server Error' });

      var caughtError;
      AlertRecordService.createAlert(mockTransaction, mockRiskScore, mockDecision)
        .catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should handle 401 Unauthorized error on createAlert', function () {
      $httpBackend.expectPOST('https://api.example.com/alerts').respond(401, { message: 'Unauthorized' });

      var caughtError;
      AlertRecordService.createAlert(mockTransaction, mockRiskScore, mockDecision)
        .catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should handle 400 Bad Request error on createAlert', function () {
      $httpBackend.expectPOST('https://api.example.com/alerts').respond(400, { message: 'Bad Request' });

      var caughtError;
      AlertRecordService.createAlert(mockTransaction, mockRiskScore, mockDecision)
        .catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  // ─── getAlerts ──────────────────────────────────────────────────────────────

  describe('getAlerts()', function () {

    it('should GET all alerts from the correct endpoint and return response data', function () {
      var mockList = [mockAlertResponse, { alertId: 'ALT-002', transactionId: 'TXN-002' }];
      $httpBackend.expectGET('https://api.example.com/alerts').respond(200, mockList);

      var result;
      AlertRecordService.getAlerts().then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockList);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no alerts exist', function () {
      $httpBackend.expectGET('https://api.example.com/alerts').respond(200, []);

      var result;
      AlertRecordService.getAlerts().then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject and re-throw error when GET alerts fails', function () {
      $httpBackend.expectGET('https://api.example.com/alerts').respond(503, { message: 'Service Unavailable' });

      var caughtError;
      AlertRecordService.getAlerts().catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  // ─── getAlertById ───────────────────────────────────────────────────────────

  describe('getAlertById()', function () {

    it('should GET a single alert by ID from the correct endpoint', function () {
      $httpBackend.expectGET('https://api.example.com/alerts/ALT-001').respond(200, mockAlertResponse);

      var result;
      AlertRecordService.getAlertById('ALT-001').then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockAlertResponse);
    });

    it('should construct the correct URL with the provided alertId', function () {
      $httpBackend.expectGET('https://api.example.com/alerts/ALT-999').respond(200, { alertId: 'ALT-999' });

      AlertRecordService.getAlertById('ALT-999');
      $httpBackend.flush();
    });

    it('should reject and re-throw error when alert is not found (404)', function () {
      $httpBackend.expectGET('https://api.example.com/alerts/UNKNOWN').respond(404, { message: 'Not Found' });

      var caughtError;
      AlertRecordService.getAlertById('UNKNOWN').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error on 500 server error', function () {
      $httpBackend.expectGET('https://api.example.com/alerts/ALT-001').respond(500, {});

      var caughtError;
      AlertRecordService.getAlertById('ALT-001').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  // ─── updateAlert ────────────────────────────────────────────────────────────

  describe('updateAlert()', function () {

    var updatePayload = { status: 'Confirmed', resolvedAt: '2026-08-01T10:00:00.000Z' };

    it('should PUT to the correct alert endpoint with update data and return response', function () {
      var updatedAlert = Object.assign({}, mockAlertResponse, updatePayload);
      $httpBackend.expectPUT('https://api.example.com/alerts/ALT-001', updatePayload).respond(200, updatedAlert);

      var result;
      AlertRecordService.updateAlert('ALT-001', updatePayload).then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result.status).toBe('Confirmed');
    });

    it('should construct the correct URL with the provided alertId for PUT', function () {
      $httpBackend.expectPUT('https://api.example.com/alerts/ALT-777').respond(200, {});

      AlertRecordService.updateAlert('ALT-777', {});
      $httpBackend.flush();
    });

    it('should reject and re-throw error when update fails with 404', function () {
      $httpBackend.expectPUT('https://api.example.com/alerts/ALT-001').respond(404, { message: 'Not Found' });

      var caughtError;
      AlertRecordService.updateAlert('ALT-001', updatePayload).catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error when update fails with 500', function () {
      $httpBackend.expectPUT('https://api.example.com/alerts/ALT-001').respond(500, {});

      var caughtError;
      AlertRecordService.updateAlert('ALT-001', updatePayload).catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  /*
  Coverage Report:
  - Functions tested: createAlert, getAlerts, getAlertById, updateAlert
  - Scenarios covered:
      createAlert  -> success (201), HTTP 400, HTTP 401, HTTP 500, correct body shape
      getAlerts    -> success with data, empty array, HTTP 503
      getAlertById -> success, correct URL construction, HTTP 404, HTTP 500
      updateAlert  -> success, correct URL construction, HTTP 404, HTTP 500
  - Uncovered scenarios: network timeout (no $httpBackend support), concurrent duplicate POSTs (idempotency)
  */
});
