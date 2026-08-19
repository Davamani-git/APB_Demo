describe('alertService', function() {
  beforeEach(module('fraudDetectionApp'));
  
  var alertService, $httpBackend, $q, $rootScope;
  
  beforeEach(inject(function(_alertService_, _$httpBackend_, _$q_, _$rootScope_) {
    alertService = _alertService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('triggerAlert', function() {
    /*
    Test Documentation:
    - Test Name: triggerAlert - success scenario
    - Purpose: Validates that triggerAlert successfully sends alert payload and returns alert response
    - Scenario: Valid transaction and riskDecision objects are provided
    - Expected Result: Returns promise resolving with alertId and status 'triggered'
    */
    it('should successfully trigger alert with valid transaction and risk decision', function() {
      var transaction = {
        transactionId: 'TXN001',
        customerId: 'CUST001',
        amount: 1000,
        currency: 'USD',
        merchantName: 'Test Merchant'
      };
      var riskDecision = {
        riskLevel: 'high',
        riskScore: 90,
        decisionReason: 'High risk detected'
      };
      
      $httpBackend.expectPOST('/api/alerts').respond({ alertId: 'ALERT001' });
      
      alertService.triggerAlert(transaction, riskDecision).then(function(result) {
        expect(result.alertId).toBe('ALERT001');
        expect(result.status).toBe('triggered');
        expect(result.timestamp).toBeDefined();
      });
      
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: triggerAlert - missing customerId
    - Purpose: Validates that triggerAlert handles missing customerId gracefully
    - Scenario: Transaction object lacks customerId property
    - Expected Result: Alert payload uses 'unknown' as default customerId
    */
    it('should use unknown as default customerId when not provided', function() {
      var transaction = {
        transactionId: 'TXN002',
        amount: 500,
        currency: 'USD',
        merchantName: 'Test Merchant'
      };
      var riskDecision = {
        riskLevel: 'medium',
        riskScore: 65,
        decisionReason: 'Medium risk'
      };
      
      $httpBackend.expectPOST('/api/alerts', jasmine.objectContaining({
        customerId: 'unknown'
      })).respond({ alertId: 'ALERT002' });
      
      alertService.triggerAlert(transaction, riskDecision);
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: triggerAlert - HTTP error
    - Purpose: Validates that triggerAlert properly rejects promise on HTTP error
    - Scenario: HTTP POST request fails with error
    - Expected Result: Promise rejects with error object containing message and transactionId
    */
    it('should reject promise when HTTP POST fails', function() {
      var transaction = {
        transactionId: 'TXN003',
        customerId: 'CUST003',
        amount: 2000,
        currency: 'USD',
        merchantName: 'Test Merchant'
      };
      var riskDecision = {
        riskLevel: 'high',
        riskScore: 95,
        decisionReason: 'Critical risk'
      };
      
      $httpBackend.expectPOST('/api/alerts').respond(500, 'Server error');
      
      alertService.triggerAlert(transaction, riskDecision).catch(function(error) {
        expect(error.message).toBe('Alert trigger failed');
        expect(error.transactionId).toBe('TXN003');
        expect(error.error).toBeDefined();
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('getAlertStatus', function() {
    /*
    Test Documentation:
    - Test Name: getAlertStatus - success scenario
    - Purpose: Validates that getAlertStatus retrieves alert status successfully
    - Scenario: Valid alertId is provided
    - Expected Result: Returns promise resolving with alert data
    */
    it('should retrieve alert status successfully', function() {
      var alertId = 'ALERT001';
      var expectedData = { alertId: 'ALERT001', status: 'pending', riskLevel: 'high' };
      
      $httpBackend.expectGET('/api/alerts/ALERT001').respond(expectedData);
      
      alertService.getAlertStatus(alertId).then(function(data) {
        expect(data).toEqual(expectedData);
      });
      
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: getAlertStatus - not found
    - Purpose: Validates that getAlertStatus handles 404 errors
    - Scenario: AlertId does not exist
    - Expected Result: Promise rejects with error
    */
    it('should reject promise when alert not found', function() {
      var alertId = 'NONEXISTENT';
      
      $httpBackend.expectGET('/api/alerts/NONEXISTENT').respond(404, 'Not found');
      
      alertService.getAlertStatus(alertId).catch(function(error) {
        expect(error.status).toBe(404);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('updateAlertStatus', function() {
    /*
    Test Documentation:
    - Test Name: updateAlertStatus - success scenario
    - Purpose: Validates that updateAlertStatus successfully updates alert status
    - Scenario: Valid alertId and status are provided
    - Expected Result: Returns promise resolving with updated alert data
    */
    it('should update alert status successfully', function() {
      var alertId = 'ALERT001';
      var newStatus = 'resolved';
      var expectedData = { alertId: 'ALERT001', status: 'resolved' };
      
      $httpBackend.expectPUT('/api/alerts/ALERT001', { status: 'resolved' }).respond(expectedData);
      
      alertService.updateAlertStatus(alertId, newStatus).then(function(data) {
        expect(data.status).toBe('resolved');
      });
      
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: updateAlertStatus - HTTP error
    - Purpose: Validates that updateAlertStatus handles HTTP errors
    - Scenario: HTTP PUT request fails
    - Expected Result: Promise rejects with error
    */
    it('should reject promise when update fails', function() {
      var alertId = 'ALERT001';
      var newStatus = 'resolved';
      
      $httpBackend.expectPUT('/api/alerts/ALERT001', { status: 'resolved' }).respond(500, 'Server error');
      
      alertService.updateAlertStatus(alertId, newStatus).catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Test Documentation:
- Functions tested: triggerAlert, getAlertStatus, updateAlertStatus
- Scenarios covered: success paths, missing data handling, HTTP errors, edge cases
- Uncovered scenarios: network timeouts, concurrent requests
Coverage Report:
- triggerAlert: 3 test cases (success, missing customerId, HTTP error)
- getAlertStatus: 2 test cases (success, not found)
- updateAlertStatus: 2 test cases (success, HTTP error)
- Total: 7 test cases covering normal and error scenarios
*/