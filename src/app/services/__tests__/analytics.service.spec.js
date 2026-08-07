/*
Test Documentation:
- Test Name: analyticsService - getSalesMetrics success
- Purpose: Validates retrieval of sales metrics for a seller
- Scenario: Valid sellerId and period are provided
- Expected Result: Promise resolves with sales data
*/
/*
Test Documentation:
- Test Name: analyticsService - getPerformanceData success
- Purpose: Validates retrieval of performance data
- Scenario: Valid sellerId is provided
- Expected Result: Promise resolves with performance metrics
*/
/*
Test Documentation:
- Test Name: analyticsService - error handling
- Purpose: Validates error handling for failed API calls
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getSalesMetrics, getPerformanceData
- Scenarios covered: success responses, error handling
- Uncovered scenarios: timeout handling, invalid parameters
*/

(function() {
  'use strict';

  describe('analyticsService', function() {
    var analyticsService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_analyticsService_, _$httpBackend_, _apiConfig_) {
      analyticsService = _analyticsService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSalesMetrics', function() {
      it('should retrieve sales metrics successfully', function() {
        var sellerId = 'S123';
        var period = 'monthly';
        var mockResponse = {
          totalSales: 50000,
          orderCount: 150,
          period: 'monthly'
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/analytics/sales?period=' + period + '&sellerId=' + sellerId)
          .respond(200, mockResponse);

        var result;
        analyticsService.getSalesMetrics(sellerId, period).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.totalSales).toBe(50000);
      });

      it('should reject promise on API error', function() {
        var sellerId = 'S123';
        var period = 'monthly';

        $httpBackend.expectGET(apiConfig.baseUrl + '/analytics/sales?period=' + period + '&sellerId=' + sellerId)
          .respond(404, { message: 'Not found' });

        var error;
        analyticsService.getSalesMetrics(sellerId, period).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });

    describe('getPerformanceData', function() {
      it('should retrieve performance data successfully', function() {
        var sellerId = 'S123';
        var mockResponse = {
          rating: 4.5,
          responseTime: 2.3,
          fulfillmentRate: 98
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/analytics/performance?sellerId=' + sellerId)
          .respond(200, mockResponse);

        var result;
        analyticsService.getPerformanceData(sellerId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
        expect(result.rating).toBe(4.5);
      });

      it('should handle error when retrieving performance data', function() {
        var sellerId = 'S123';

        $httpBackend.expectGET(apiConfig.baseUrl + '/analytics/performance?sellerId=' + sellerId)
          .respond(500, { message: 'Internal error' });

        var error;
        analyticsService.getPerformanceData(sellerId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });
  });
})();