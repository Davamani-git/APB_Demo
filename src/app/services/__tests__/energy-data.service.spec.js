/*
Test Documentation:
- Test Name: EnergyDataService - fetchRealTimeData success
- Purpose: Validates real-time energy data retrieval from API
- Scenario: HTTP request succeeds
- Expected Result: Returns real-time data from API
*/
/*
Test Documentation:
- Test Name: EnergyDataService - fetchRealTimeData error
- Purpose: Validates error handling for real-time data fetch
- Scenario: HTTP request fails
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: EnergyDataService - fetchHistoricalData success
- Purpose: Validates historical data retrieval with period parameter
- Scenario: HTTP request succeeds with period query
- Expected Result: Returns historical data for specified period
*/
/*
Test Documentation:
- Test Name: EnergyDataService - fetchHistoricalData error
- Purpose: Validates error handling for historical data fetch
- Scenario: HTTP request fails
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: EnergyDataService - getMockRealTimeData
- Purpose: Validates mock real-time data generation
- Scenario: Service generates mock data
- Expected Result: Returns properly structured mock real-time data
*/
/*
Test Documentation:
- Test Name: EnergyDataService - getMockHistoricalData daily
- Purpose: Validates mock historical data for daily period
- Scenario: Service generates mock data for 24 hours
- Expected Result: Returns 24 data points with aggregated values
*/
/*
Test Documentation:
- Test Name: EnergyDataService - getMockHistoricalData weekly
- Purpose: Validates mock historical data for weekly period
- Scenario: Service generates mock data for 7 days
- Expected Result: Returns 7 data points with aggregated values
*/
/*
Test Documentation:
- Test Name: EnergyDataService - getMockHistoricalData monthly
- Purpose: Validates mock historical data for monthly period
- Scenario: Service generates mock data for 30 days
- Expected Result: Returns 30 data points with aggregated values
*/
/*
Coverage Report:
- Functions tested: fetchRealTimeData, fetchHistoricalData, getMockRealTimeData, getMockHistoricalData
- Scenarios covered: API success/failure, mock data generation for all periods
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('EnergyDataService', function() {
    var EnergyDataService, $httpBackend, API_CONFIG;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_EnergyDataService_, _$httpBackend_, _API_CONFIG_) {
      EnergyDataService = _EnergyDataService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchRealTimeData', function() {
      it('should fetch real-time data successfully', function() {
        var mockData = {
          timestamp: new Date(),
          totalConsumption: 15.5,
          instantaneousPower: 4.2
        };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.realtime)
          .respond(200, mockData);
        
        EnergyDataService.fetchRealTimeData().then(function(data) {
          expect(data.totalConsumption).toBe(15.5);
          expect(data.instantaneousPower).toBe(4.2);
        });
        
        $httpBackend.flush();
      });

      it('should reject on fetch failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.realtime)
          .respond(500, 'Server Error');
        
        EnergyDataService.fetchRealTimeData().catch(function(error) {
          expect(error.status).toBe(500);
        });
        
        $httpBackend.flush();
      });
    });

    describe('fetchHistoricalData', function() {
      it('should fetch historical data for daily period', function() {
        var mockData = {
          period: 'daily',
          dataPoints: [{ date: '2024-01-01', consumption: 10 }],
          totalConsumption: 10
        };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.historical + '?period=daily')
          .respond(200, mockData);
        
        EnergyDataService.fetchHistoricalData('daily').then(function(data) {
          expect(data.period).toBe('daily');
          expect(data.dataPoints.length).toBe(1);
        });
        
        $httpBackend.flush();
      });

      it('should fetch historical data for weekly period', function() {
        var mockData = {
          period: 'weekly',
          dataPoints: [],
          totalConsumption: 70
        };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.historical + '?period=weekly')
          .respond(200, mockData);
        
        EnergyDataService.fetchHistoricalData('weekly').then(function(data) {
          expect(data.period).toBe('weekly');
        });
        
        $httpBackend.flush();
      });

      it('should reject on fetch failure', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.historical + '?period=monthly')
          .respond(404, 'Not Found');
        
        EnergyDataService.fetchHistoricalData('monthly').catch(function(error) {
          expect(error.status).toBe(404);
        });
        
        $httpBackend.flush();
      });
    });

    describe('getMockRealTimeData', function() {
      it('should return properly structured mock real-time data', function() {
        var data = EnergyDataService.getMockRealTimeData();
        
        expect(data.timestamp).toBeDefined();
        expect(data.totalConsumption).toBe(12.5);
        expect(data.instantaneousPower).toBe(3.2);
        expect(data.cost).toBe(2.5);
        expect(data.devices).toBeDefined();
        expect(data.devices.length).toBe(4);
        expect(data.devices[0].deviceId).toBe('dev-001');
      });

      it('should include device details in mock data', function() {
        var data = EnergyDataService.getMockRealTimeData();
        var device = data.devices[0];
        
        expect(device.deviceId).toBeDefined();
        expect(device.deviceName).toBeDefined();
        expect(device.deviceType).toBeDefined();
        expect(device.consumption).toBeDefined();
        expect(device.power).toBeDefined();
        expect(device.status).toBeDefined();
        expect(device.lastUpdated).toBeDefined();
      });
    });

    describe('getMockHistoricalData', function() {
      it('should generate 24 data points for daily period', function() {
        var data = EnergyDataService.getMockHistoricalData('daily');
        
        expect(data.period).toBe('daily');
        expect(data.dataPoints.length).toBe(24);
        expect(data.totalConsumption).toBeGreaterThan(0);
        expect(data.totalCost).toBeGreaterThan(0);
        expect(data.averageDaily).toBeGreaterThan(0);
      });

      it('should generate 7 data points for weekly period', function() {
        var data = EnergyDataService.getMockHistoricalData('weekly');
        
        expect(data.period).toBe('weekly');
        expect(data.dataPoints.length).toBe(7);
        expect(data.totalConsumption).toBeGreaterThan(0);
      });

      it('should generate 30 data points for monthly period', function() {
        var data = EnergyDataService.getMockHistoricalData('monthly');
        
        expect(data.period).toBe('monthly');
        expect(data.dataPoints.length).toBe(30);
        expect(data.totalConsumption).toBeGreaterThan(0);
      });

      it('should calculate correct averageDaily', function() {
        var data = EnergyDataService.getMockHistoricalData('daily');
        var expectedAverage = data.totalConsumption / 24;
        
        expect(data.averageDaily).toBeCloseTo(expectedAverage, 2);
      });

      it('should include date, consumption, and cost in each data point', function() {
        var data = EnergyDataService.getMockHistoricalData('daily');
        var point = data.dataPoints[0];
        
        expect(point.date).toBeDefined();
        expect(point.consumption).toBeDefined();
        expect(point.cost).toBeDefined();
        expect(point.consumption).toBeGreaterThan(0);
      });
    });
  });
})();