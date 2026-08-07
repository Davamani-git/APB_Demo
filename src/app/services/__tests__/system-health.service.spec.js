/*
Test Documentation:
- Test Name: systemHealthService - getMetrics success
- Purpose: Validates retrieval of system health metrics
- Scenario: API returns health metrics
- Expected Result: Promise resolves with metrics data
*/
/*
Test Documentation:
- Test Name: systemHealthService - getMetrics error
- Purpose: Validates error handling for metrics retrieval
- Scenario: API returns error
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: systemHealthService - getPlatformAnalytics success
- Purpose: Validates retrieval of platform analytics
- Scenario: API returns analytics data
- Expected Result: Promise resolves with analytics
*/
/*
Coverage Report:
- Functions tested: getMetrics, getPlatformAnalytics
- Scenarios covered: metrics retrieval, analytics, error handling
- Uncovered scenarios: real-time monitoring, alerts
*/

(function() {
  'use strict';

  describe('systemHealthService', function() {
    var systemHealthService, $httpBackend, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_systemHealthService_, _$httpBackend_, _apiConfig_) {
      systemHealthService = _systemHealthService_;
      $httpBackend = _$httpBackend_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getMetrics', function() {
      it('should retrieve system health metrics successfully', function() {
        var mockMetrics = {
          cpuUsage: 45.2,
          memoryUsage: 62.8,
          diskUsage: 38.5,
          uptime: 864000,
          status: 'healthy'
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/admin/health')
          .respond(200, mockMetrics);

        var result;
        systemHealthService.getMetrics().then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockMetrics);
        expect(result.status).toBe('healthy');
      });

      it('should reject promise on metrics retrieval error', function() {
        $httpBackend.expectGET(apiConfig.baseUrl + '/admin/health')
          .respond(503, { message: 'Service unavailable' });

        var error;
        systemHealthService.getMetrics().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(503);
      });
    });

    describe('getPlatformAnalytics', function() {
      it('should retrieve platform analytics successfully', function() {
        var mockAnalytics = {
          totalUsers: 10000,
          activeUsers: 2500,
          totalOrders: 5000,
          revenue: 250000,
          period: 'monthly'
        };

        $httpBackend.expectGET(apiConfig.baseUrl + '/admin/analytics')
          .respond(200, mockAnalytics);

        var result;
        systemHealthService.getPlatformAnalytics().then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockAnalytics);
        expect(result.totalUsers).toBe(10000);
      });

      it('should reject promise on analytics retrieval error', function() {
        $httpBackend.expectGET(apiConfig.baseUrl + '/admin/analytics')
          .respond(500, { message: 'Internal server error' });

        var error;
        systemHealthService.getPlatformAnalytics().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });
  });
})();