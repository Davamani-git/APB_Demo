describe('MonthlySummaryMockDatasets', function() {
    it('should define mock datasets for multiple months', function() {
        // Arrange / Act
        var datasets = window.MonthlySummaryMockDatasets;

        // Assert
        expect(datasets).toBeDefined();
        expect(datasets['2026-07']).toBeDefined();
        expect(datasets['2026-06']).toBeDefined();
        expect(datasets['2026-05']).toBeDefined();
    });
});

/*
Test Documentation:
- Test Name: Mock datasets presence
- Purpose: Verify that MonthlySummaryMockDatasets is defined and contains expected months.
- Scenario: Access window.MonthlySummaryMockDatasets.
- Expected Result: Datasets exist for 2026-07, 2026-06, and 2026-05.
*/

/*
Coverage Report:
- Functions tested:
  - None (static data only)
- Statements covered:
  - IIFE assigning window.MonthlySummaryMockDatasets
- Branches covered:
  - None
- Error scenarios covered:
  - None
- Uncovered scenarios:
  - Data integrity and value correctness for each dataset
*/