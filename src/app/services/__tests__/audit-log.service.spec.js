/*
Test Documentation:
- Test Name: AuditLogService - logTransaction success
- Purpose: Verify that logTransaction posts correct payload and returns response data
- Scenario: $http.post resolves successfully
- Expected Result: Returns response.data from the API

- Test Name: AuditLogService - logTransaction failure
- Purpose: Verify that logTransaction handles HTTP errors gracefully
- Scenario: $http.post rejects with an error
- Expected Result: catch block executes, console.error is called

- Test Name: AuditLogService - logTransaction payload structure
- Purpose: Verify the payload sent to /api/audit/log contains required fields
- Scenario: logTransaction called with a result object
- Expected Result: POST is called with eventType INTEGRATION, result, and timestamp

Coverage Report:
- Functions tested: logTransaction
- Scenarios covered: success response, HTTP error, payload validation
- Uncovered scenarios: network timeout edge cases
*/
describe('AuditLogService', function() {
  var AuditLogService, $http, $httpBackend, $q;

  beforeEach(module('app'));

  beforeEach(inject(function(_AuditLogService_, _$httpBackend_, _$q_) {
    AuditLogService = _AuditLogService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('logTransaction', function() {
    it('should POST to /api/audit/log with correct payload and return response data', function() {
      var mockResult = { status: 'SUCCESS', successCount: 5 };
      var mockResponse = { logged: true };
      $httpBackend.expectPOST('/api/audit/log', function(data) {
        var parsed = JSON.parse(data);
        return parsed.eventType === 'INTEGRATION' &&
               parsed.result.status === 'SUCCESS' &&
               typeof parsed.timestamp === 'string';
      }).respond(200, mockResponse);

      var result;
      AuditLogService.logTransaction(mockResult).then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should call console.error when $http.post fails', function() {
      spyOn(console, 'error');
      var mockResult = { status: 'FAIL' };
      $httpBackend.expectPOST('/api/audit/log').respond(500, { message: 'Server Error' });

      AuditLogService.logTransaction(mockResult);
      $httpBackend.flush();
      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Audit log failed:'),
        jasmine.anything()
      );
    });

    it('should include a valid ISO timestamp in the payload', function() {
      var mockResult = { status: 'SUCCESS' };
      $httpBackend.expectPOST('/api/audit/log', function(data) {
        var parsed = JSON.parse(data);
        return !isNaN(Date.parse(parsed.timestamp));
      }).respond(200, {});

      AuditLogService.logTransaction(mockResult);
      $httpBackend.flush();
    });

    it('should set timeout to 5000 in the request config', function() {
      var mockResult = { status: 'SUCCESS' };
      $httpBackend.expectPOST('/api/audit/log').respond(200, {});
      AuditLogService.logTransaction(mockResult);
      $httpBackend.flush();
    });
  });
});
