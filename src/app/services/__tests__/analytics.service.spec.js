/*
Test Documentation:
- Test Name: AnalyticsService - calculateTrends with valid data
- Purpose: Validates trend calculation with valid data points
- Scenario: Service receives valid consumption data with multiple data points
- Expected Result: Returns trends object with correct totals, averages, and peak values
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateTrends with null data
- Purpose: Validates fallback to mock data when input is null
- Scenario: Service receives null data parameter
- Expected Result: Returns mock historical data for the specified period
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateDeviceMetrics with valid devices
- Purpose: Validates device metrics aggregation and sorting
- Scenario: Service receives array of device objects
- Expected Result: Returns sorted metrics array with cost estimates
*/
/*
Test Documentation:
- Test Name: AnalyticsService - aggregateDeviceMetrics with empty array
- Purpose: Validates handling of empty device array
- Scenario: Service receives empty array
- Expected Result: Returns empty array
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateCostEstimate with pricing
- Purpose: Validates cost calculation with pricing object
- Scenario: Service receives consumption value and pricing object
- Expected Result: Returns cost based on pricing rate
*/
/*
Test Documentation:
- Test Name: AnalyticsService - calculateCostEstimate without pricing
- Purpose: Validates cost calculation with default rate
- Scenario: Service receives consumption value without pricing
- Expected Result: Returns cost based on default rate of 0.2
*/
/*
Coverage Report:
- Functions tested: calculateTrends, aggregateDeviceMetrics, calculateCostEstimate
- Scenarios covered: valid data, null/empty data, with/without pricing, sorting
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AnalyticsService', function() {
    var AnalyticsService, EnergyDataService, PricingService;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_AnalyticsService_, _EnergyDataService_, _PricingService_) {
      AnalyticsService = _AnalyticsService_;
      EnergyDataService = _EnergyDataService_;
      PricingService = _PricingService_;
    }));

    describe('calculateTrends', function() {
      it('should calculate trends with valid data', function() {
        var data = {
          dataPoints: [
            { date: '2024-01-01', consumption: 10, cost: 2 },
            { date: '2024-01-02', consumption: 15, cost: 3 },
            { date: '2024-01-03', consumption: 12, cost: 2.4 }
          ]
        };
        var result = AnalyticsService.calculateTrends(data, 'daily');
        
        expect(result.period).toBe('daily');
        expect(result.totalConsumption).toBe(37);
        expect(result.totalCost).toBe(7.4);
        expect(result.averageDaily).toBeCloseTo(12.33, 2);
        expect(result.peakConsumption).toBe(15);
        expect(result.peakTime).toBe('2024-01-02');
      });

      it('should return mock data when data is null', function() {
        spyOn(EnergyDataService, 'getMockHistoricalData').and.returnValue({
          period: 'weekly',
          dataPoints: [],
          totalConsumption: 0
        });
        
        var result = AnalyticsService.calculateTrends(null, 'weekly');
        
        expect(EnergyDataService.getMockHistoricalData).toHaveBeenCalledWith('weekly');
        expect(result.period).toBe('weekly');
      });

      it('should return mock data when data has no dataPoints', function() {
        spyOn(EnergyDataService, 'getMockHistoricalData').and.returnValue({
          period: 'monthly',
          dataPoints: [],
          totalConsumption: 0
        });
        
        var result = AnalyticsService.calculateTrends({}, 'monthly');
        
        expect(EnergyDataService.getMockHistoricalData).toHaveBeenCalledWith('monthly');
      });
    });

    describe('aggregateDeviceMetrics', function() {
      it('should aggregate and sort device metrics', function() {
        var devices = [
          { deviceId: 'dev-001', deviceName: 'AC', deviceType: 'hvac', consumption: 5.2, power: 1.8, status: 'active' },
          { deviceId: 'dev-002', deviceName: 'Fridge', deviceType: 'appliance', consumption: 3.1, power: 0.8, status: 'active' },
          { deviceId: 'dev-003', deviceName: 'Lights', deviceType: 'lighting', consumption: 0.5, power: 0.2, status: 'active' }
        ];
        
        var result = AnalyticsService.aggregateDeviceMetrics(devices);
        
        expect(result.length).toBe(3);
        expect(result[0].deviceId).toBe('dev-001');
        expect(result[0].totalConsumption).toBe(5.2);
        expect(result[0].costEstimate).toBeCloseTo(1.04, 2);
        expect(result[2].deviceId).toBe('dev-003');
      });

      it('should return empty array when devices is null', function() {
        var result = AnalyticsService.aggregateDeviceMetrics(null);
        expect(result).toEqual([]);
      });

      it('should return empty array when devices is empty', function() {
        var result = AnalyticsService.aggregateDeviceMetrics([]);
        expect(result).toEqual([]);
      });
    });

    describe('calculateCostEstimate', function() {
      it('should calculate cost with pricing object', function() {
        var pricing = { ratePerKwh: 0.25 };
        var result = AnalyticsService.calculateCostEstimate(10, pricing);
        expect(result).toBe(2.5);
      });

      it('should calculate cost with default rate when pricing is null', function() {
        var result = AnalyticsService.calculateCostEstimate(10, null);
        expect(result).toBe(2);
      });

      it('should calculate cost with default rate when pricing is undefined', function() {
        var result = AnalyticsService.calculateCostEstimate(15);
        expect(result).toBe(3);
      });
    });
  });
})();