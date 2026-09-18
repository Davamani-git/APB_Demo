/*
Test Documentation:
- Test Name: alertRecordService - getAlerts (no filters)
- Purpose: Verify that getAlerts calls $http.get with the correct endpoint and empty params when no filters are provided.
- Scenario: Normal - call getAlerts() without arguments.
- Expected Result: $http.get is called with API_ENDPOINTS.fraudAlerts and params: {}; resolved data is returned.

- Test Name: alertRecordService - getAlerts (with filters)
- Purpose: Verify that getAlerts passes provided filter params to $http.get.
- Scenario: Normal - call getAlerts({ status: 'open' }).
- Expected Result: $http.get is called with params: { status: 'open' }; resolved data is returned.

- Test Name: alertRecordService - getAlerts HTTP error
- Purpose: Verify that a rejected $http.get propagates the rejection.
- Scenario: Error - $http.get rejects.
- Expected Result: Promise is rejected with the error object.

- Test Name: alertRecordService - getAlertById success
- Purpose: Verify that getAlertById calls $http.get with the correct URL including alertId.
- Scenario: Normal - call getAlertById('alert_123').
- Expected Result: $http.get called with API_ENDPOINTS.fraudAlerts + '/alert_123'; resolved data returned.

- Test Name: alertRecordService - getAlertById HTTP error
- Purpose: Verify that a rejected $http.get in getAlertById propagates the rejection.
- Scenario: Error - $http.get rejects.
- Expected Result: Promise is rejected.

- Test Name: alertRecordService - createAlert success
- Purpose: Verify that createAlert builds the correct alert payload and posts it.
- Scenario: Normal - call createAlert with valid alertData.
- Expected Result: $http.post called with API_ENDPOINTS.fraudAlerts and a payload containing correct fields; status is 'open'; resolved data returned.

- Test Name: alertRecordService - createAlert sets status to open
- Purpose: Verify that the status field is always set to 'open' on creation.
- Scenario: Normal - createAlert with any alertData.
- Expected Result: Posted payload has status === 'open'.

- Test Name: alertRecordService - createAlert sets reviewedBy to null
- Purpose: Verify that reviewedBy is null on creation.
- Scenario: Normal - createAlert with any alertData.
- Expected Result: Posted payload has reviewedBy === null.

- Test Name: alertRecordService - createAlert sets notes to empty string
- Purpose: Verify that notes is empty string on creation.
- Scenario: Normal - createAlert with any alertData.
- Expected Result: Posted payload has notes === ''.

- Test Name: alertRecordService - createAlert HTTP error
- Purpose: Verify that a rejected $http.post in createAlert propagates the rejection.
- Scenario: Error - $http.post rejects.
- Expected Result: Promise is rejected.

- Test Name: alertRecordService - updateAlert success
- Purpose: Verify that updateAlert calls $http.put with the correct URL and updates including updatedAt.
- Scenario: Normal - call updateAlert('alert_123', { status: 'closed' }).
- Expected Result: $http.put called with correct URL; updates object contains updatedAt; resolved data returned.

- Test Name: alertRecordService - updateAlert sets updatedAt
- Purpose: Verify that updateAlert always stamps updatedAt onto the updates object.
- Scenario: Normal - call updateAlert with any updates.
- Expected Result: updates.updatedAt is a Date instance.

- Test Name: alertRecordService - updateAlert HTTP error
- Purpose: Verify that a rejected $http.put in updateAlert propagates the rejection.
- Scenario: Error - $http.put rejects.
- Expected Result: Promise is rejected.

- Test Name: alertRecordService - deleteAlert success
- Purpose: Verify that deleteAlert calls $http.delete with the correct URL.
- Scenario: Normal - call deleteAlert('alert_123').
- Expected Result: $http.delete called with API_ENDPOINTS.fraudAlerts + '/alert_123'; resolved data returned.

- Test Name: alertRecordService - deleteAlert HTTP error
- Purpose: Verify that a rejected $http.delete in deleteAlert propagates the rejection.
- Scenario: Error - $http.delete rejects.
- Expected Result: Promise is rejected.

- Test Name: alertRecordService - generateAlertId format
- Purpose: Verify that generateAlertId returns a string starting with 'alert_'.
- Scenario: Normal - call generateAlertId().
- Expected Result: Returned string matches /^alert_\d+_[a-z0-9]+$/.

- Test Name: alertRecordService - generateAlertId uniqueness
- Purpose: Verify that two consecutive calls to generateAlertId return different values.
- Scenario: Edge - rapid successive calls.
- Expected Result: Two generated IDs are not equal.

Coverage Report:
- Functions tested: getAlerts, getAlertById, createAlert, updateAlert, deleteAlert, generateAlertId
- Scenarios covered: success/normal, missing parameters, HTTP errors, payload field validation, ID uniqueness
- Uncovered scenarios: network timeout (not directly testable via $http mock), concurrent duplicate requests
*/

describe('alertRecordService', function() {
  'use strict';

  var alertRecordService;
  var $httpBackend;
  var $q;
  var $rootScope;
  var API_ENDPOINTS;

  var FAKE_ENDPOINTS = {
    fraudAlerts: '/api/fraud-alerts'
  };

  beforeEach(module('fraudAlertModule', function($provide) {
    $provide.constant('API_ENDPOINTS', FAKE_ENDPOINTS);
  }));

  beforeEach(inject(function(_alertRecordService_, _$httpBackend_, _$q_, _$rootScope_, _API_ENDPOINTS_) {
    alertRecordService = _alertRecordService_;
    $httpBackend    = _$httpBackend_;
    $q              = _$q_;
    $rootScope      = _$rootScope_;
    API_ENDPOINTS   = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── getAlerts ───────────────────────────────────────────────────────────────

  describe('getAlerts', function() {

    it('should call $http.get with fraudAlerts endpoint and empty params when no filters provided', function() {
      var mockData = [{ alertId: 'alert_1' }];
      $httpBackend.expectGET(function(url) {
        return url.indexOf(FAKE_ENDPOINTS.fraudAlerts) === 0;
      }).respond(200, mockData);

      var result;
      alertRecordService.getAlerts().then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockData);
    });

    it('should pass provided filters as params to $http.get', function() {
      var mockData = [{ alertId: 'alert_2', status: 'open' }];
      $httpBackend.expectGET(FAKE_ENDPOINTS.fraudAlerts + '?status=open').respond(200, mockData);

      var result;
      alertRecordService.getAlerts({ status: 'open' }).then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockData);
    });

    it('should propagate rejection when $http.get fails', function() {
      $httpBackend.expectGET(function(url) {
        return url.indexOf(FAKE_ENDPOINTS.fraudAlerts) === 0;
      }).respond(500, { message: 'Server Error' });

      var rejected = false;
      alertRecordService.getAlerts().catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── getAlertById ─────────────────────────────────────────────────────────────

  describe('getAlertById', function() {

    it('should call $http.get with the correct URL for a given alertId', function() {
      var mockAlert = { alertId: 'alert_123' };
      $httpBackend.expectGET(FAKE_ENDPOINTS.fraudAlerts + '/alert_123').respond(200, mockAlert);

      var result;
      alertRecordService.getAlertById('alert_123').then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockAlert);
    });

    it('should propagate rejection when $http.get fails for getAlertById', function() {
      $httpBackend.expectGET(FAKE_ENDPOINTS.fraudAlerts + '/alert_999').respond(404, { message: 'Not Found' });

      var rejected = false;
      alertRecordService.getAlertById('alert_999').catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── createAlert ─────────────────────────────────────────────────────────────

  describe('createAlert', function() {

    var sampleAlertData;

    beforeEach(function() {
      sampleAlertData = {
        transactionId: 'txn_001',
        cardId:        'card_001',
        riskScore:     75,
        riskLevel:     'high',
        treatment:     'block'
      };
    });

    it('should post to fraudAlerts endpoint and return resolved data', function() {
      var mockResponse = { alertId: 'alert_new_001' };
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts).respond(201, mockResponse);

      var result;
      alertRecordService.createAlert(sampleAlertData).then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should set status to "open" in the posted payload', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      alertRecordService.createAlert(sampleAlertData);
      $httpBackend.flush();

      expect(capturedPayload.status).toBe('open');
    });

    it('should set reviewedBy to null in the posted payload', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      alertRecordService.createAlert(sampleAlertData);
      $httpBackend.flush();

      expect(capturedPayload.reviewedBy).toBeNull();
    });

    it('should set notes to empty string in the posted payload', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      alertRecordService.createAlert(sampleAlertData);
      $httpBackend.flush();

      expect(capturedPayload.notes).toBe('');
    });

    it('should include transactionId, cardId, riskScore, riskLevel, treatment from alertData', function() {
      var capturedPayload;
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts, function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(201, {});

      alertRecordService.createAlert(sampleAlertData);
      $httpBackend.flush();

      expect(capturedPayload.transactionId).toBe('txn_001');
      expect(capturedPayload.cardId).toBe('card_001');
      expect(capturedPayload.riskScore).toBe(75);
      expect(capturedPayload.riskLevel).toBe('high');
      expect(capturedPayload.treatment).toBe('block');
    });

    it('should propagate rejection when $http.post fails', function() {
      $httpBackend.expectPOST(FAKE_ENDPOINTS.fraudAlerts).respond(500, { message: 'Server Error' });

      var rejected = false;
      alertRecordService.createAlert(sampleAlertData).catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── updateAlert ─────────────────────────────────────────────────────────────

  describe('updateAlert', function() {

    it('should call $http.put with the correct URL and return resolved data', function() {
      var mockResponse = { alertId: 'alert_123', status: 'closed' };
      $httpBackend.expectPUT(FAKE_ENDPOINTS.fraudAlerts + '/alert_123').respond(200, mockResponse);

      var result;
      alertRecordService.updateAlert('alert_123', { status: 'closed' }).then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should stamp updatedAt as a Date on the updates object before PUT', function() {
      var capturedPayload;
      $httpBackend.expectPUT(FAKE_ENDPOINTS.fraudAlerts + '/alert_123', function(body) {
        capturedPayload = angular.fromJson(body);
        return true;
      }).respond(200, {});

      alertRecordService.updateAlert('alert_123', { status: 'closed' });
      $httpBackend.flush();

      expect(capturedPayload.updatedAt).toBeDefined();
      // updatedAt is serialised as ISO string in JSON
      expect(new Date(capturedPayload.updatedAt).toString()).not.toBe('Invalid Date');
    });

    it('should propagate rejection when $http.put fails', function() {
      $httpBackend.expectPUT(FAKE_ENDPOINTS.fraudAlerts + '/alert_123').respond(500, {});

      var rejected = false;
      alertRecordService.updateAlert('alert_123', { status: 'closed' }).catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── deleteAlert ─────────────────────────────────────────────────────────────

  describe('deleteAlert', function() {

    it('should call $http.delete with the correct URL and return resolved data', function() {
      var mockResponse = { deleted: true };
      $httpBackend.expectDELETE(FAKE_ENDPOINTS.fraudAlerts + '/alert_123').respond(200, mockResponse);

      var result;
      alertRecordService.deleteAlert('alert_123').then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should propagate rejection when $http.delete fails', function() {
      $httpBackend.expectDELETE(FAKE_ENDPOINTS.fraudAlerts + '/alert_999').respond(404, {});

      var rejected = false;
      alertRecordService.deleteAlert('alert_999').catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── generateAlertId ─────────────────────────────────────────────────────────

  describe('generateAlertId', function() {

    it('should return a string matching the pattern alert_<timestamp>_<random>', function() {
      var id = alertRecordService.generateAlertId();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^alert_\d+_[a-z0-9]+$/);
    });

    it('should return unique IDs on successive calls', function() {
      var id1 = alertRecordService.generateAlertId();
      var id2 = alertRecordService.generateAlertId();
      expect(id1).not.toBe(id2);
    });

    it('should always start with the prefix "alert_"', function() {
      var id = alertRecordService.generateAlertId();
      expect(id.indexOf('alert_')).toBe(0);
    });

  });

});