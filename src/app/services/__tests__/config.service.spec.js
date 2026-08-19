describe('ConfigService', function() {
  beforeEach(module('fraudAlertApp'));
  var ConfigService, $httpBackend, $q, API_ENDPOINTS;

  beforeEach(inject(function(_ConfigService_, _$httpBackend_, _$q_, _API_ENDPOINTS_) {
    ConfigService = _ConfigService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    localStorage.clear();
  });

  /*
  Test Documentation:
  - Test Name: getThresholds - Success Scenario
  - Purpose: Validates successful retrieval of thresholds from API
  - Scenario: API returns valid threshold configuration
  - Expected Result: Threshold data returned from API
  */
  it('should fetch thresholds successfully from API', function() {
    var mockThresholds = {
      thresholdId: 'config1',
      low: 20,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };

    $httpBackend.expectGET(API_ENDPOINTS.CONFIG_THRESHOLDS).respond(mockThresholds);

    var result;
    ConfigService.getThresholds().then(function(data) {
      result = data;
    });

    $httpBackend.flush();
    expect(result).toEqual(mockThresholds);
  });

  /*
  Test Documentation:
  - Test Name: getThresholds - API Error with Fallback
  - Purpose: Validates fallback to default thresholds when API fails
  - Scenario: API returns error response
  - Expected Result: Default thresholds returned
  */
  it('should return default thresholds when API fails', function() {
    spyOn(console, 'error');
    $httpBackend.expectGET(API_ENDPOINTS.CONFIG_THRESHOLDS).respond(500, { error: 'Server error' });

    var result;
    ConfigService.getThresholds().then(function(data) {
      result = data;
    });

    $httpBackend.flush();
    expect(result.thresholdId).toBe('default');
    expect(result.low).toBe(20);
    expect(result.medium).toBe(40);
    expect(result.high).toBe(70);
    expect(result.confirmedFraud).toBe(90);
    expect(console.error).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: updateThresholds - Success Scenario
  - Purpose: Validates successful threshold update with valid values
  - Scenario: Valid threshold values provided
  - Expected Result: HTTP PUT request sent, response data returned
  */
  it('should update thresholds successfully with valid values', function() {
    localStorage.setItem('userId', 'admin123');
    var thresholds = {
      thresholdId: 'config1',
      low: 25,
      medium: 45,
      high: 75,
      confirmedFraud: 95
    };
    var mockResponse = { status: 'updated', thresholdId: 'config1' };

    $httpBackend.expectPUT(API_ENDPOINTS.CONFIG_THRESHOLDS, function(data) {
      var payload = JSON.parse(data);
      expect(payload.low).toBe(25);
      expect(payload.medium).toBe(45);
      expect(payload.high).toBe(75);
      expect(payload.confirmedFraud).toBe(95);
      expect(payload.updatedBy).toBe('admin123');
      return true;
    }).respond(mockResponse);

    var result;
    ConfigService.updateThresholds(thresholds).then(function(data) {
      result = data;
    });

    $httpBackend.flush();
    expect(result).toEqual(mockResponse);
  });

  /*
  Test Documentation:
  - Test Name: updateThresholds - Invalid Thresholds
  - Purpose: Validates rejection when threshold values are invalid
  - Scenario: Threshold values violate validation rules
  - Expected Result: Promise rejected with error message
  */
  it('should reject update with invalid threshold values', function() {
    var invalidThresholds = {
      low: 50,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };
    var error;

    ConfigService.updateThresholds(invalidThresholds).catch(function(err) {
      error = err;
    });

    expect(error).toBe('Invalid threshold values');
  });

  /*
  Test Documentation:
  - Test Name: updateThresholds - Missing Thresholds
  - Purpose: Validates rejection when thresholds object is not provided
  - Scenario: thresholds is null or undefined
  - Expected Result: Promise rejected with error message
  */
  it('should reject update when thresholds is missing', function() {
    var error;

    ConfigService.updateThresholds(null).catch(function(err) {
      error = err;
    });

    expect(error).toBe('Invalid threshold values');
  });

  /*
  Test Documentation:
  - Test Name: updateThresholds - Confirmed Fraud Exceeds Max
  - Purpose: Validates rejection when confirmedFraud exceeds 100
  - Scenario: confirmedFraud value is greater than 100
  - Expected Result: Promise rejected with error message
  */
  it('should reject when confirmedFraud exceeds 100', function() {
    var invalidThresholds = {
      low: 20,
      medium: 40,
      high: 70,
      confirmedFraud: 105
    };
    var error;

    ConfigService.updateThresholds(invalidThresholds).catch(function(err) {
      error = err;
    });

    expect(error).toBe('Invalid threshold values');
  });

  /*
  Test Documentation:
  - Test Name: validateThresholds - Valid Thresholds
  - Purpose: Validates correct validation of proper threshold configuration
  - Scenario: All threshold values follow proper ordering and ranges
  - Expected Result: Validation returns true
  */
  it('should validate correct threshold configuration', function() {
    var validThresholds = {
      low: 20,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };

    var result = ConfigService.validateThresholds(validThresholds);
    expect(result).toBe(true);
  });

  /*
  Test Documentation:
  - Test Name: validateThresholds - Low Below Zero
  - Purpose: Validates rejection when low threshold is negative
  - Scenario: low threshold value is less than 0
  - Expected Result: Validation returns false
  */
  it('should reject when low threshold is below zero', function() {
    var invalidThresholds = {
      low: -5,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };

    var result = ConfigService.validateThresholds(invalidThresholds);
    expect(result).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: validateThresholds - Medium Not Greater Than Low
  - Purpose: Validates rejection when medium is not greater than low
  - Scenario: medium threshold is not greater than low
  - Expected Result: Validation returns false
  */
  it('should reject when medium is not greater than low', function() {
    var invalidThresholds = {
      low: 40,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };

    var result = ConfigService.validateThresholds(invalidThresholds);
    expect(result).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: validateThresholds - High Not Greater Than Medium
  - Purpose: Validates rejection when high is not greater than medium
  - Scenario: high threshold is not greater than medium
  - Expected Result: Validation returns false
  */
  it('should reject when high is not greater than medium', function() {
    var invalidThresholds = {
      low: 20,
      medium: 70,
      high: 70,
      confirmedFraud: 90
    };

    var result = ConfigService.validateThresholds(invalidThresholds);
    expect(result).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: validateThresholds - ConfirmedFraud Not Greater Than High
  - Purpose: Validates rejection when confirmedFraud is not greater than high
  - Scenario: confirmedFraud is not greater than high
  - Expected Result: Validation returns false
  */
  it('should reject when confirmedFraud is not greater than high', function() {
    var invalidThresholds = {
      low: 20,
      medium: 40,
      high: 90,
      confirmedFraud: 90
    };

    var result = ConfigService.validateThresholds(invalidThresholds);
    expect(result).toBe(false);
  });

  /*
  Test Documentation:
  - Test Name: getDefaultThresholds - Returns Default Values
  - Purpose: Validates that default thresholds are correctly returned
  - Scenario: getDefaultThresholds is called
  - Expected Result: Promise resolves with default threshold values
  */
  it('should return default thresholds with correct values', function() {
    var result;
    ConfigService.getDefaultThresholds().then(function(data) {
      result = data;
    });

    expect(result.thresholdId).toBe('default');
    expect(result.low).toBe(20);
    expect(result.medium).toBe(40);
    expect(result.high).toBe(70);
    expect(result.confirmedFraud).toBe(90);
    expect(result.updatedBy).toBe('system');
  });

  /*
  Test Documentation:
  - Test Name: updateThresholds - HTTP Error Handling
  - Purpose: Validates error handling when HTTP PUT request fails
  - Scenario: Server returns error response
  - Expected Result: Error logged and promise rejected
  */
  it('should handle HTTP errors in updateThresholds', function() {
    var thresholds = {
      low: 20,
      medium: 40,
      high: 70,
      confirmedFraud: 90
    };
    var error;

    spyOn(console, 'error');
    $httpBackend.expectPUT(API_ENDPOINTS.CONFIG_THRESHOLDS).respond(500, { error: 'Server error' });

    ConfigService.updateThresholds(thresholds).catch(function(err) {
      error = err;
    });

    $httpBackend.flush();
    expect(console.error).toHaveBeenCalled();
    expect(error).toBeDefined();
  });

  /*
  Coverage Report:
  - Functions tested: getThresholds, updateThresholds, validateThresholds, getDefaultThresholds
  - Scenarios covered: success paths, API errors with fallback, invalid thresholds, validation edge cases, HTTP errors, default values
  - Uncovered scenarios: none identified
  */
});
