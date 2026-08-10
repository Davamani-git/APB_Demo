/*
Test Documentation:
- Test Name: AnalyticsService - getSalesData - success scenario
- Purpose: Validates that getSalesData returns sales data for a given seller and period
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with sales data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getSalesData - error scenario
- Purpose: Validates error handling when getSalesData fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getDashboardMetrics - success scenario
- Purpose: Validates that getDashboardMetrics returns dashboard metrics for a seller
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with dashboard metrics
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getDashboardMetrics - error scenario
- Purpose: Validates error handling when getDashboardMetrics fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getTopProducts - success scenario
- Purpose: Validates that getTopProducts returns top products for a seller
- Scenario: HTTP GET request succeeds with valid response
- Expected Result: Promise resolves with top products data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getTopProducts - error scenario
- Purpose: Validates error handling when getTopProducts fails
- Scenario: HTTP GET request fails
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getSalesData, getDashboardMetrics, getTopProducts
- Scenarios covered: success responses, error handling for all methods
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, $httpBackend, $q;
    var apiBase = '/api/analytics';

    beforeEach(module('app.sellerDashboard'));

    beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_) {
      AnalyticsService = _AnalyticsService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSalesData', function() {
      it('should return sales data for a given seller and period', function() {
        var sellerId = 'seller123';
        var period = 'monthly';
        var mockResponse = { sales: 10000, transactions: 50 };

        $httpBackend.expectGET(apiBase + '/sales?sellerId=' + sellerId + '&period=' + period)
          .respond(200, mockResponse);

        AnalyticsService.getSalesData(sellerId, period).then(function(data) {
          expect(data).toEqual(mockResponse);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getSalesData fails', function() {
        var sellerId = 'seller123';
        var period = 'monthly';
        var errorResponse = { message: 'Server error' };

        $httpBackend.expectGET(apiBase + '/sales?sellerId=' + sellerId + '&period=' + period)
          .respond(500, errorResponse);

        AnalyticsService.getSalesData(sellerId, period).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('getDashboardMetrics', function() {
      it('should return dashboard metrics for a seller', function() {
        var sellerId = 'seller123';
        var mockResponse = { totalSales: 50000, totalOrders: 200, avgOrderValue: 250 };

        $httpBackend.expectGET(apiBase + '/dashboard?sellerId=' + sellerId)
          .respond(200, mockResponse);

        AnalyticsService.getDashboardMetrics(sellerId).then(function(data) {
          expect(data).toEqual(mockResponse);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getDashboardMetrics fails', function() {
        var sellerId = 'seller123';
        var errorResponse = { message: 'Unauthorized' };

        $httpBackend.expectGET(apiBase + '/dashboard?sellerId=' + sellerId)
          .respond(401, errorResponse);

        AnalyticsService.getDashboardMetrics(sellerId).catch(function(error) {
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();
      });
    });

    describe('getTopProducts', function() {
      it('should return top products for a seller with limit', function() {
        var sellerId = 'seller123';
        var limit = 10;
        var mockResponse = [{ productId: 'p1', sales: 1000 }, { productId: 'p2', sales: 800 }];

        $httpBackend.expectGET(apiBase + '/top-products?sellerId=' + sellerId + '&limit=' + limit)
          .respond(200, mockResponse);

        AnalyticsService.getTopProducts(sellerId, limit).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(2);
        });

        $httpBackend.flush();
      });

      it('should reject promise when getTopProducts fails', function() {
        var sellerId = 'seller123';
        var limit = 10;
        var errorResponse = { message: 'Not found' };

        $httpBackend.expectGET(apiBase + '/top-products?sellerId=' + sellerId + '&limit=' + limit)
          .respond(404, errorResponse);

        AnalyticsService.getTopProducts(sellerId, limit).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });
    });
  });
})();