/*
Test Documentation:
- Test Name: cloudProviderService - validateAndConnect success
- Purpose: Validates cloud provider connection
- Scenario: Connect to cloud provider with valid credentials
- Expected Result: Should connect and fetch usage data

Test Documentation:
- Test Name: cloudProviderService - validateAndConnect failure
- Purpose: Validates connection failure handling
- Scenario: Connection fails
- Expected Result: Should reject promise

Test Documentation:
- Test Name: cloudProviderService - fetchUsageData
- Purpose: Validates fetching usage data
- Scenario: Fetch usage data for connection
- Expected Result: Should return usage data

Test Documentation:
- Test Name: cloudProviderService - getConnections
- Purpose: Validates fetching connections
- Scenario: Get all connections or by company
- Expected Result: Should return connection list

Test Documentation:
- Test Name: cloudProviderService - testConnection
- Purpose: Validates connection testing
- Scenario: Test existing connection
- Expected Result: Should return test result

Test Documentation:
- Test Name: cloudProviderService - deleteConnection
- Purpose: Validates connection deletion
- Scenario: Delete a connection
- Expected Result: Should delete connection

Test Documentation:
- Test Name: cloudProviderService - syncData
- Purpose: Validates data synchronization
- Scenario: Sync data for connection
- Expected Result: Should return sync result

Test Documentation:
- Test Name: cloudProviderService - getProviderTypes
- Purpose: Validates provider types retrieval
- Scenario: Get supported provider types
- Expected Result: Should return provider array

Coverage Report:
- Functions tested: validateAndConnect, fetchUsageData, getConnections, testConnection, deleteConnection, syncData, getProviderTypes
- Scenarios covered: connection management, data fetching, testing, deletion, synchronization
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('cloudProviderService', function() {
    var cloudProviderService, $httpBackend, authService;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_cloudProviderService_, _$httpBackend_, _authService_) {
      cloudProviderService = _cloudProviderService_;
      $httpBackend = _$httpBackend_;
      authService = _authService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('validateAndConnect', function() {
      it('should connect and fetch usage data on success', function() {
        var credentials = {provider: 'AWS', apiKey: 'key123'};
        var mockConnectResponse = {status: 'connected', connectionId: 'conn123'};
        var mockUsageData = {usage: {compute: 1000, storage: 500}};
        $httpBackend.expectPOST('/api/cloud-providers/connect', credentials).respond(200, mockConnectResponse);
        $httpBackend.expectGET('/api/cloud-providers/conn123/usage').respond(200, mockUsageData);
        var result;
        cloudProviderService.validateAndConnect(credentials).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.usage).toBeDefined();
      });

      it('should reject on connection failure', function() {
        var credentials = {provider: 'AWS', apiKey: 'invalid'};
        var mockResponse = {status: 'failed'};
        $httpBackend.expectPOST('/api/cloud-providers/connect', credentials).respond(200, mockResponse);
        var errorCaught = false;
        cloudProviderService.validateAndConnect(credentials).catch(function(err) {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });

      it('should handle HTTP error', function() {
        var credentials = {provider: 'AWS'};
        $httpBackend.expectPOST('/api/cloud-providers/connect', credentials).respond(500, 'Error');
        var errorCaught = false;
        cloudProviderService.validateAndConnect(credentials).catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('fetchUsageData', function() {
      it('should fetch usage data for connection', function() {
        var connectionId = 'conn123';
        var mockUsageData = {usage: {compute: 1000}};
        $httpBackend.expectGET('/api/cloud-providers/conn123/usage').respond(200, mockUsageData);
        var result;
        cloudProviderService.fetchUsageData(connectionId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.usage).toBeDefined();
      });
    });

    describe('getConnections', function() {
      it('should fetch all connections', function() {
        var mockConnections = {connections: [{id: 'conn1', provider: 'AWS'}]};
        $httpBackend.expectGET('/api/cloud-providers/connections').respond(200, mockConnections);
        var result;
        cloudProviderService.getConnections().then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.connections).toBeDefined();
      });

      it('should fetch connections for specific company', function() {
        var companyId = 'comp123';
        $httpBackend.expectGET('/api/cloud-providers/connections?companyId=comp123').respond(200, {connections: []});
        cloudProviderService.getConnections(companyId);
        $httpBackend.flush();
      });
    });

    describe('testConnection', function() {
      it('should test connection', function() {
        var connectionId = 'conn123';
        var mockTestResult = {status: 'success', latency: 150};
        $httpBackend.expectPOST('/api/cloud-providers/conn123/test').respond(200, mockTestResult);
        var result;
        cloudProviderService.testConnection(connectionId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.status).toBe('success');
      });
    });

    describe('deleteConnection', function() {
      it('should delete connection', function() {
        var connectionId = 'conn123';
        $httpBackend.expectDELETE('/api/cloud-providers/conn123').respond(200, {success: true});
        cloudProviderService.deleteConnection(connectionId);
        $httpBackend.flush();
      });
    });

    describe('syncData', function() {
      it('should sync data for connection', function() {
        var connectionId = 'conn123';
        var mockSyncResult = {status: 'synced', recordsUpdated: 100};
        $httpBackend.expectPOST('/api/cloud-providers/conn123/sync').respond(200, mockSyncResult);
        var result;
        cloudProviderService.syncData(connectionId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.status).toBe('synced');
      });
    });

    describe('getProviderTypes', function() {
      it('should return supported provider types', function() {
        var types = cloudProviderService.getProviderTypes();
        expect(Array.isArray(types)).toBe(true);
        expect(types.length).toBe(3);
        expect(types).toContain('AWS');
        expect(types).toContain('AZURE');
        expect(types).toContain('GCP');
      });
    });
  });
})();