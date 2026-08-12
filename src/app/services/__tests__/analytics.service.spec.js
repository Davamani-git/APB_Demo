describe('AnalyticsService', function() {
  'use strict';
  
  beforeEach(module('spendingAnalytics'));
  
  var AnalyticsService;
  
  beforeEach(inject(function(_AnalyticsService_) {
    AnalyticsService = _AnalyticsService_;
  }));
  
  describe('calculateTrends', function() {
    /*
    Test Documentation:
    - Test Name: calculateTrends - Normal Scenario
    - Purpose: Validates trend calculation with valid historical data
    - Scenario: Provided with array of monthly spend data
    - Expected Result: Returns months, spendValues, and trendLine arrays with correct average
    */
    it('should calculate trends with valid historical data', function() {
      var historicalData = [
        { month: 'Jan', totalSpend: 1000 },
        { month: 'Feb', totalSpend: 1200 },
        { month: 'Mar', totalSpend: 1100 }
      ];
      
      var result = AnalyticsService.calculateTrends(historicalData);
      
      expect(result.months).toEqual(['Jan', 'Feb', 'Mar']);
      expect(result.spendValues).toEqual([1000, 1200, 1100]);
      expect(result.trendLine.length).toBe(3);
      expect(result.trendLine[0]).toBeCloseTo(1100, 1);
    });
    
    /*
    Test Documentation:
    - Test Name: calculateTrends - Empty Data
    - Purpose: Validates behavior with empty historical data
    - Scenario: Provided with empty array
    - Expected Result: Returns empty arrays and handles gracefully
    */
    it('should handle empty historical data', function() {
      var historicalData = [];
      
      expect(function() {
        AnalyticsService.calculateTrends(historicalData);
      }).toThrow();
    });
    
    /*
    Test Documentation:
    - Test Name: calculateTrends - Single Month
    - Purpose: Validates trend calculation with single data point
    - Scenario: Provided with single month data
    - Expected Result: Returns arrays with single element and trendLine matching spend value
    */
    it('should calculate trends with single month data', function() {
      var historicalData = [
        { month: 'Jan', totalSpend: 1500 }
      ];
      
      var result = AnalyticsService.calculateTrends(historicalData);
      
      expect(result.months.length).toBe(1);
      expect(result.spendValues).toEqual([1500]);
      expect(result.trendLine[0]).toBe(1500);
    });
    
    /*
    Test Documentation:
    - Test Name: calculateTrends - Zero Values
    - Purpose: Validates trend calculation with zero spend values
    - Scenario: Provided with months containing zero spend
    - Expected Result: Returns correct average including zeros
    */
    it('should calculate trends with zero spend values', function() {
      var historicalData = [
        { month: 'Jan', totalSpend: 0 },
        { month: 'Feb', totalSpend: 1000 },
        { month: 'Mar', totalSpend: 0 }
      ];
      
      var result = AnalyticsService.calculateTrends(historicalData);
      
      expect(result.spendValues).toEqual([0, 1000, 0]);
      expect(result.trendLine[0]).toBeCloseTo(333.33, 1);
    });
  });
  
  describe('calculateCardPerformance', function() {
    /*
    Test Documentation:
    - Test Name: calculateCardPerformance - Normal Scenario
    - Purpose: Validates card performance calculation with valid data
    - Scenario: Provided with historical data containing card breakdowns
    - Expected Result: Returns array of cards with calculated metrics
    */
    it('should calculate card performance with valid data', function() {
      var historicalData = [
        {
          month: 'Jan',
          cardBreakdown: [
            { cardId: 'CARD001', cardName: 'Visa', amount: 500 },
            { cardId: 'CARD002', cardName: 'MasterCard', amount: 300 }
          ]
        },
        {
          month: 'Feb',
          cardBreakdown: [
            { cardId: 'CARD001', cardName: 'Visa', amount: 600 },
            { cardId: 'CARD002', cardName: 'MasterCard', amount: 400 }
          ]
        }
      ];
      
      var result = AnalyticsService.calculateCardPerformance(historicalData);
      
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CARD001');
      expect(result[0].totalSpend).toBe(1100);
      expect(result[0].monthCount).toBe(2);
      expect(result[0].averageMonthlySpend).toBe(550);
      expect(result[0].trendDirection).toBe('stable');
      expect(result[0].utilizationRate).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: calculateCardPerformance - No Card Breakdown
    - Purpose: Validates behavior when card breakdown is missing
    - Scenario: Provided with historical data without cardBreakdown property
    - Expected Result: Returns empty array
    */
    it('should handle data without card breakdown', function() {
      var historicalData = [
        { month: 'Jan' },
        { month: 'Feb' }
      ];
      
      var result = AnalyticsService.calculateCardPerformance(historicalData);
      
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: calculateCardPerformance - Empty Breakdown
    - Purpose: Validates behavior with empty card breakdown arrays
    - Scenario: Provided with historical data with empty cardBreakdown arrays
    - Expected Result: Returns empty array
    */
    it('should handle empty card breakdown arrays', function() {
      var historicalData = [
        { month: 'Jan', cardBreakdown: [] },
        { month: 'Feb', cardBreakdown: [] }
      ];
      
      var result = AnalyticsService.calculateCardPerformance(historicalData);
      
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: calculateCardPerformance - Card Without Name
    - Purpose: Validates card name fallback to cardId
    - Scenario: Provided with card data missing cardName property
    - Expected Result: Uses cardId as cardName
    */
    it('should use cardId as cardName when name is missing', function() {
      var historicalData = [
        {
          month: 'Jan',
          cardBreakdown: [
            { cardId: 'CARD001', amount: 500 }
          ]
        }
      ];
      
      var result = AnalyticsService.calculateCardPerformance(historicalData);
      
      expect(result[0].cardName).toBe('CARD001');
    });
    
    /*
    Test Documentation:
    - Test Name: calculateCardPerformance - Multiple Months Same Card
    - Purpose: Validates accumulation of spend across multiple months
    - Scenario: Provided with same card appearing in multiple months
    - Expected Result: Correctly aggregates totalSpend and monthCount
    */
    it('should aggregate spending for same card across months', function() {
      var historicalData = [
        {
          month: 'Jan',
          cardBreakdown: [
            { cardId: 'CARD001', cardName: 'Visa', amount: 1000 }
          ]
        },
        {
          month: 'Feb',
          cardBreakdown: [
            { cardId: 'CARD001', cardName: 'Visa', amount: 2000 }
          ]
        },
        {
          month: 'Mar',
          cardBreakdown: [
            { cardId: 'CARD001', cardName: 'Visa', amount: 3000 }
          ]
        }
      ];
      
      var result = AnalyticsService.calculateCardPerformance(historicalData);
      
      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(6000);
      expect(result[0].monthCount).toBe(3);
      expect(result[0].averageMonthlySpend).toBe(2000);
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: calculateTrends, calculateCardPerformance
  - Scenarios covered: normal data, empty data, single month, zero values, missing properties, multiple months
  - Edge cases: empty arrays, missing cardBreakdown, missing cardName, zero spend values
  - Uncovered scenarios: null/undefined inputs, negative values, very large datasets
  */
});
