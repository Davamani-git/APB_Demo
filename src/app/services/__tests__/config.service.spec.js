/*
Test Documentation:
- Test Name: configService - getConfig success
- Purpose: Verify that getConfig calls $http.get with the correct endpoint and returns resolved data.
- Scenario: Normal - call getConfig().
- Expected Result: $http.get called with API_ENDPOINTS.config; resolved data returned.

- Test Name: configService - getConfig HTTP error
- Purpose: Verify that a rejected $http.get in getConfig propagates the rejection.
- Scenario: Error - $http.get rejects.
- Expected Result: Promise is rejected.

- Test Name: configService - updateConfig success
- Purpose: Verify that updateConfig calls $http.put with the correct endpoint and config data.
- Scenario: Normal - call updateConfig with valid configData.
- Expected Result: $http.put called with API_ENDPOINTS.config and configData; resolved data returned.

- Test Name: configService - updateConfig HTTP error
- Purpose: Verify that a rejected $http.put in updateConfig propagates the rejection.
- Scenario: Error - $http.put rejects.
- Expected Result: Promise is rejected.

- Test Name: configService - getRiskThresholds success
- Purpose: Verify that getRiskThresholds calls $http.get with the correct endpoint.
- Scenario: Normal - call getRiskThresholds().
- Expected Result: $http.get called with API_ENDPOINTS.config + '/risk-thresholds'; resolved data returned.

- Test Name: configService - getRiskThresholds HTTP error
- Purpose: Verify that a rejected $http.get in getRiskThresholds propagates the rejection.
- Scenario: Error - $http.get rejects.
- Expected Result: Promise is rejected.

- Test Name: configService - updateRiskThresholds success
- Purpose: Verify that updateRiskThresholds calls $http.put with the correct endpoint and thresholds data.
- Scenario: Normal - call updateRiskThresholds with valid thresholds.
- Expected Result: $http.put called with API_ENDPOINTS.config + '/risk-thresholds' and thresholds; resolved data returned.

- Test Name: configService - updateRiskThresholds HTTP error
- Purpose: Verify that a rejected $http.put in updateRiskThresholds propagates the rejection.
- Scenario: Error - $http.put rejects.
- Expected Result: Promise is rejected.

Coverage Report:
- Functions tested: getConfig, updateConfig, getRiskThresholds, updateRiskThresholds
- Scenarios covered: success/normal, HTTP errors
- Uncovered scenarios: network timeout, concurrent config updates
*/

describe('configService', function() {
  'use strict';

  var configService;
  var $httpBackend;
  var $rootScope;
  var API_ENDPOINTS;

  var FAKE_ENDPOINTS = {
    config: '/api/config'
  };

  beforeEach(module('fraudAlertModule', function($provide) {
    $provide.constant('API_ENDPOINTS', FAKE_ENDPOINTS);
  }));

  beforeEach(inject(function(_configService_, _$httpBackend_, _$rootScope_, _API_ENDPOINTS_) {
    configService = _configService_;
    $httpBackend  = _$httpBackend_;
    $rootScope    = _$rootScope_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── getConfig ───────────────────────────────────────────────────────────────

  describe('getConfig', function() {

    it('should call $http.get with config endpoint and return resolved data', function() {
      var mockConfig = { alertRetentionDays: 90, maxAlertsPerPage: 50 };
      $httpBackend.expectGET(FAKE_ENDPOINTS.config).respond(200, mockConfig);

      var result;
      configService.getConfig().then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockConfig);
    });

    it('should propagate rejection when $http.get fails', function() {
      $httpBackend.expectGET(FAKE_ENDPOINTS.config).respond(500, { message: 'Server Error' });

      var rejected = false;
      configService.getConfig().catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── updateConfig ────────────────────────────────────────────────────────────

  describe('updateConfig', function() {

    it('should call $http.put with config endpoint and configData, returning resolved data', function() {
      var configData = { alertRetentionDays: 120 };
      var mockResponse = { success: true };
      $httpBackend.expectPUT(FAKE_ENDPOINTS.config, configData).respond(200, mockResponse);

      var result;
      configService.updateConfig(configData).then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should propagate rejection when $http.put fails', function() {
      var configData = { alertRetentionDays: 120 };
      $httpBackend.expectPUT(FAKE_ENDPOINTS.config, configData).respond(500, {});

      var rejected = false;
      configService.updateConfig(configData).catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── getRiskThresholds ───────────────────────────────────────────────────────

  describe('getRiskThresholds', function() {

    it('should call $http.get with config/risk-thresholds endpoint and return resolved data', function() {
      var mockThresholds = { low: 30, medium: 60, high: 80 };
      $httpBackend.expectGET(FAKE_ENDPOINTS.config + '/risk-thresholds').respond(200, mockThresholds);

      var result;
      configService.getRiskThresholds().then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockThresholds);
    });

    it('should propagate rejection when $http.get fails', function() {
      $httpBackend.expectGET(FAKE_ENDPOINTS.config + '/risk-thresholds').respond(500, {});

      var rejected = false;
      configService.getRiskThresholds().catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

  // ─── updateRiskThresholds ────────────────────────────────────────────────────

  describe('updateRiskThresholds', function() {

    it('should call $http.put with config/risk-thresholds endpoint and thresholds data', function() {
      var thresholds = { low: 25, medium: 55, high: 85 };
      var mockResponse = { success: true };
      $httpBackend.expectPUT(FAKE_ENDPOINTS.config + '/risk-thresholds', thresholds).respond(200, mockResponse);

      var result;
      configService.updateRiskThresholds(thresholds).then(function(data) { result = data; });
      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
    });

    it('should propagate rejection when $http.put fails', function() {
      var thresholds = { low: 25, medium: 55, high: 85 };
      $httpBackend.expectPUT(FAKE_ENDPOINTS.config + '/risk-thresholds', thresholds).respond(500, {});

      var rejected = false;
      configService.updateRiskThresholds(thresholds).catch(function() { rejected = true; });
      $httpBackend.flush();

      expect(rejected).toBe(true);
    });

  });

});