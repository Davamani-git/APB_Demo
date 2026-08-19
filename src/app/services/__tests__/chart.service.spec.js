describe('ChartService', function() {
  beforeEach(module('fraudDetectionApp'));
  var ChartService;

  beforeEach(inject(function(_ChartService_) {
    ChartService = _ChartService_;
  }));

  describe('prepareLineChartData', function() {
    /*
    Test Documentation:
    - Test Name: should prepare line chart data from array
    - Purpose: Validates transformation of data into line chart format
    - Scenario: Array of objects with xKey and yKey properties
    - Expected Result: Returns array of objects with x and y properties
    */
    it('should prepare line chart data from array', function() {
      var data = [
        { date: '2024-01-01', count: 10 },
        { date: '2024-01-02', count: 20 },
        { date: '2024-01-03', count: 15 }
      ];
      var result = ChartService.prepareLineChartData(data, 'date', 'count');
      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ x: '2024-01-01', y: 10 });
      expect(result[1]).toEqual({ x: '2024-01-02', y: 20 });
      expect(result[2]).toEqual({ x: '2024-01-03', y: 15 });
    });

    /*
    Test Documentation:
    - Test Name: should handle empty data array
    - Purpose: Validates handling of empty input data
    - Scenario: Empty array passed to prepareLineChartData
    - Expected Result: Returns empty array
    */
    it('should handle empty data array', function() {
      var result = ChartService.prepareLineChartData([], 'date', 'count');
      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle single data point
    - Purpose: Validates handling of single data point
    - Scenario: Array with single object
    - Expected Result: Returns array with single transformed object
    */
    it('should handle single data point', function() {
      var data = [{ date: '2024-01-01', count: 10 }];
      var result = ChartService.prepareLineChartData(data, 'date', 'count');
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({ x: '2024-01-01', y: 10 });
    });
  });

  describe('prepareBarChartData', function() {
    /*
    Test Documentation:
    - Test Name: should prepare bar chart data with labels and values
    - Purpose: Validates transformation of data into bar chart format
    - Scenario: Array of objects with labelKey and valueKey properties
    - Expected Result: Returns object with labels and values arrays
    */
    it('should prepare bar chart data with labels and values', function() {
      var data = [
        { category: 'Approved', count: 100 },
        { category: 'Declined', count: 20 },
        { category: 'Pending', count: 15 }
      ];
      var result = ChartService.prepareBarChartData(data, 'category', 'count');
      expect(result.labels).toEqual(['Approved', 'Declined', 'Pending']);
      expect(result.values).toEqual([100, 20, 15]);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty data for bar chart
    - Purpose: Validates handling of empty input data for bar charts
    - Scenario: Empty array passed to prepareBarChartData
    - Expected Result: Returns object with empty labels and values arrays
    */
    it('should handle empty data for bar chart', function() {
      var result = ChartService.prepareBarChartData([], 'category', 'count');
      expect(result.labels).toEqual([]);
      expect(result.values).toEqual([]);
    });
  });

  describe('preparePieChartData', function() {
    /*
    Test Documentation:
    - Test Name: should prepare pie chart data with labels and values
    - Purpose: Validates transformation of data into pie chart format
    - Scenario: Array of objects with labelKey and valueKey properties
    - Expected Result: Returns object with labels and values arrays
    */
    it('should prepare pie chart data with labels and values', function() {
      var data = [
        { status: 'Active', count: 50 },
        { status: 'Inactive', count: 30 },
        { status: 'Pending', count: 20 }
      ];
      var result = ChartService.preparePieChartData(data, 'status', 'count');
      expect(result.labels).toEqual(['Active', 'Inactive', 'Pending']);
      expect(result.values).toEqual([50, 30, 20]);
    });
  });

  describe('calculatePercentages', function() {
    /*
    Test Documentation:
    - Test Name: should calculate percentages from values
    - Purpose: Validates percentage calculation for chart data
    - Scenario: Array of numeric values
    - Expected Result: Returns array of percentage values
    */
    it('should calculate percentages from values', function() {
      var values = [50, 30, 20];
      var result = ChartService.calculatePercentages(values);
      expect(result).toEqual([50, 30, 20]);
    });

    /*
    Test Documentation:
    - Test Name: should handle zero total for percentages
    - Purpose: Validates handling of zero total in percentage calculation
    - Scenario: Array with all zero values
    - Expected Result: Returns array of zeros
    */
    it('should handle zero total for percentages', function() {
      var values = [0, 0, 0];
      var result = ChartService.calculatePercentages(values);
      expect(result).toEqual([0, 0, 0]);
    });
  });

  describe('formatChartLabels', function() {
    /*
    Test Documentation:
    - Test Name: should format date labels
    - Purpose: Validates date label formatting for charts
    - Scenario: Array of date strings
    - Expected Result: Returns array of formatted date labels
    */
    it('should format date labels', function() {
      var dates = ['2024-01-01', '2024-01-02', '2024-01-03'];
      var result = ChartService.formatChartLabels(dates, 'date');
      expect(result.length).toBe(3);
    });

    /*
    Test Documentation:
    - Test Name: should format currency labels
    - Purpose: Validates currency label formatting for charts
    - Scenario: Array of numeric values
    - Expected Result: Returns array of formatted currency labels
    */
    it('should format currency labels', function() {
      var amounts = [100, 200, 300];
      var result = ChartService.formatChartLabels(amounts, 'currency');
      expect(result[0]).toContain('$');
    });
  });
});

/*
Test Documentation:
- Test Name: ChartService comprehensive test suite
- Purpose: Validates all chart data preparation and formatting operations
- Scenario: Multiple scenarios covering line charts, bar charts, pie charts, percentage calculations, and label formatting
- Expected Result: All chart operations function correctly with proper data transformation

Coverage Report:
- Functions tested: prepareLineChartData, prepareBarChartData, preparePieChartData, calculatePercentages, formatChartLabels
- Scenarios covered: line chart data preparation, empty data handling, single data point, bar chart data preparation, pie chart data preparation, percentage calculation, zero total handling, date label formatting, currency label formatting
- Uncovered scenarios: Invalid data types, null values, negative values
*/