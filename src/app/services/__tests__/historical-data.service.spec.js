describe('HistoricalDataService', function() {
  'use strict';
  
  beforeEach(module('spendingAnalytics'));
  
  var HistoricalDataService, $httpBackend;
  
  beforeEach(inject(function(_HistoricalDataService_, _$httpBackend_) {
    HistoricalDataService = _HistoricalDataService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getHistoricalData', function() {
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Success Scenario
    - Purpose: Validates successful retrieval of historical data
    - Scenario: HTTP GET request returns historical data for specified months
    - Expected Result: Returns response data containing historical analytics
    */
    it('should retrieve historical data for specified months', function() {
      var mockData = [
        { month: 'Jan', totalSpend: 1000, cardBreakdown: [] },
        { month: 'Feb', totalSpend: 1200, cardBreakdown: [] },
        { month: 'Mar', totalSpend: 1100, cardBreakdown: [] }
      ];
      
      $httpBackend.expectGET('/api/analytics/historical?months=3').respond(200, mockData);
      
      var result;
      HistoricalDataService.getHistoricalData(3).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(3);
      expect(result[0].month).toBe('Jan');
      expect(result[0].totalSpend).toBe(1000);
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Single Month
    - Purpose: Validates retrieval of single month data
    - Scenario: Request historical data for 1 month
    - Expected Result: Returns single month data
    */
    it('should retrieve data for single month', function() {
      var mockData = [
        { month: 'Jan', totalSpend: 1000, cardBreakdown: [] }
      ];
      
      $httpBackend.expectGET('/api/analytics/historical?months=1').respond(200, mockData);
      
      var result;
      HistoricalDataService.getHistoricalData(1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(1);
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Large Month Range
    - Purpose: Validates retrieval of large historical dataset
    - Scenario: Request historical data for 12 months
    - Expected Result: Returns all 12 months of data
    */
    it('should retrieve data for large month range', function() {
      var mockData = [];
      for (var i = 0; i < 12; i++) {
        mockData.push({ month: 'Month' + i, totalSpend: 1000 + (i * 100), cardBreakdown: [] });
      }
      
      $httpBackend.expectGET('/api/analytics/historical?months=12').respond(200, mockData);
      
      var result;
      HistoricalDataService.getHistoricalData(12).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(12);
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Empty Response
    - Purpose: Validates handling of empty historical data
    - Scenario: Server returns empty array
    - Expected Result: Returns empty array
    */
    it('should handle empty historical data response', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=3').respond(200, []);
      
      var result;
      HistoricalDataService.getHistoricalData(3).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - HTTP 404 Error
    - Purpose: Validates error handling for not found response
    - Scenario: Server returns 404 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on 404 error', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=3').respond(404, 'Not Found');
      
      var error;
      HistoricalDataService.getHistoricalData(3).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - HTTP 500 Error
    - Purpose: Validates error handling for server error
    - Scenario: Server returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on 500 server error', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=3').respond(500, 'Server Error');
      
      var error;
      HistoricalDataService.getHistoricalData(3).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Zero Months
    - Purpose: Validates behavior with zero months parameter
    - Scenario: Request historical data for 0 months
    - Expected Result: Returns empty array or appropriate response
    */
    it('should handle zero months parameter', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=0').respond(200, []);
      
      var result;
      HistoricalDataService.getHistoricalData(0).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Negative Months
    - Purpose: Validates behavior with negative months parameter
    - Scenario: Request historical data with negative month value
    - Expected Result: Handles gracefully or returns error
    */
    it('should handle negative months parameter', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=-1').respond(200, []);
      
      var result;
      HistoricalDataService.getHistoricalData(-1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: getHistoricalData - Network Timeout
    - Purpose: Validates error handling for network timeout
    - Scenario: HTTP request times out
    - Expected Result: Promise is rejected
    */
    it('should reject promise on network timeout', function() {
      $httpBackend.expectGET('/api/analytics/historical?months=3').respond(0, '');
      
      var error;
      HistoricalDataService.getHistoricalData(3).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: getHistoricalData
  - Scenarios covered: success with multiple months, single month, large datasets, empty response, HTTP errors (404, 500), zero/negative parameters, network timeout
  - Edge cases: empty arrays, error responses, boundary values (0, negative, large numbers)
  - Uncovered scenarios: null/undefined parameters, malformed response data, partial data objects
  */
});
