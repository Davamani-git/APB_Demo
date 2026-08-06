(function() {
  'use strict';

  describe('AnalyticsController', function() {
    var vm, SpendingAnalyticsService, $q, $rootScope;

    beforeEach(module('spendingAnalytics'));

    beforeEach(inject(function($controller, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;

      SpendingAnalyticsService = jasmine.createSpyObj('SpendingAnalyticsService', ['getSpendingData']);

      vm = $controller('AnalyticsController', {
        SpendingAnalyticsService: SpendingAnalyticsService,
        $scope: $rootScope.$new()
      });
    }));

    /*
    Test Documentation:
    - Test Name: should initialize controller with default values
    - Purpose: Verify controller initialization state
    - Scenario: Controller is instantiated
    - Expected Result: Default properties are set correctly
    */
    it('should initialize controller with default values', function() {
      expect(vm.analytics).toEqual({});
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);
      expect(vm.dateRange).toBeDefined();
      expect(vm.dateRange.startDate).toBeDefined();
      expect(vm.dateRange.endDate).toBeDefined();
      expect(vm.categoryChartData).toBe(null);
      expect(vm.monthlyChartData).toBe(null);
    });

    /*
    Test Documentation:
    - Test Name: should set date range to last 12 months
    - Purpose: Verify default date range calculation
    - Scenario: Controller initializes date range
    - Expected Result: Start date is 12 months before end date
    */
    it('should set date range to last 12 months', function() {
      var monthsDiff = (vm.dateRange.endDate.getFullYear() - vm.dateRange.startDate.getFullYear()) * 12;
      monthsDiff += vm.dateRange.endDate.getMonth() - vm.dateRange.startDate.getMonth();
      expect(monthsDiff).toBe(12);
    });

    /*
    Test Documentation:
    - Test Name: should call loadAnalytics on init
    - Purpose: Verify init method triggers data loading
    - Scenario: init() is called
    - Expected Result: loadAnalytics is invoked
    */
    it('should call loadAnalytics on init', function() {
      spyOn(vm, 'loadAnalytics');
      vm.init();
      expect(vm.loadAnalytics).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadAnalytics should fetch data successfully
    - Purpose: Verify successful data loading
    - Scenario: SpendingAnalyticsService returns valid analytics data
    - Expected Result: Analytics data is set, loading is false, charts are prepared
    */
    it('loadAnalytics should fetch data successfully', function() {
      var mockAnalytics = {
        categories: [
          { categoryName: 'Food', totalAmount: 500, transactionCount: 10, percentage: 50 },
          { categoryName: 'Transport', totalAmount: 300, transactionCount: 5, percentage: 30 }
        ],
        monthlyTrends: [
          { month: '2023-01', categoryBreakdown: { Food: 200, Transport: 100 } },
          { month: '2023-02', categoryBreakdown: { Food: 300, Transport: 200 } }
        ]
      };
      SpendingAnalyticsService.getSpendingData.and.returnValue($q.resolve(mockAnalytics));
      spyOn(vm, 'prepareCategoryChart');
      spyOn(vm, 'prepareMonthlyChart');

      vm.loadAnalytics();
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);

      $rootScope.$digest();

      expect(vm.analytics).toEqual(mockAnalytics);
      expect(vm.prepareCategoryChart).toHaveBeenCalled();
      expect(vm.prepareMonthlyChart).toHaveBeenCalled();
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: loadAnalytics should handle errors
    - Purpose: Verify error handling during data loading
    - Scenario: SpendingAnalyticsService rejects the promise
    - Expected Result: Error message is set, loading is false
    */
    it('loadAnalytics should handle errors', function() {
      SpendingAnalyticsService.getSpendingData.and.returnValue($q.reject('API Error'));

      vm.loadAnalytics();
      $rootScope.$digest();

      expect(vm.error).toBe('Failed to load analytics data');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: prepareCategoryChart should create chart data structure
    - Purpose: Verify category chart data preparation
    - Scenario: Analytics data with categories is available
    - Expected Result: Chart data object with labels and datasets is created
    */
    it('prepareCategoryChart should create chart data structure', function() {
      vm.analytics = {
        categories: [
          { categoryName: 'Food', totalAmount: 500 },
          { categoryName: 'Transport', totalAmount: 300 }
        ]
      };

      vm.prepareCategoryChart();

      expect(vm.categoryChartData).toBeDefined();
      expect(vm.categoryChartData.labels).toEqual(['Food', 'Transport']);
      expect(vm.categoryChartData.datasets.length).toBe(1);
      expect(vm.categoryChartData.datasets[0].data).toEqual([500, 300]);
      expect(vm.categoryChartData.datasets[0].label).toBe('Spending by Category');
    });

    /*
    Test Documentation:
    - Test Name: prepareCategoryChart should handle empty categories
    - Purpose: Verify chart preparation with no data
    - Scenario: Analytics has empty categories array
    - Expected Result: Chart data with empty arrays is created
    */
    it('prepareCategoryChart should handle empty categories', function() {
      vm.analytics = { categories: [] };

      vm.prepareCategoryChart();

      expect(vm.categoryChartData.labels).toEqual([]);
      expect(vm.categoryChartData.datasets[0].data).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: prepareMonthlyChart should create monthly trend chart data
    - Purpose: Verify monthly chart data preparation
    - Scenario: Analytics data with monthly trends is available
    - Expected Result: Chart data with labels and multiple datasets per category
    */
    it('prepareMonthlyChart should create monthly trend chart data', function() {
      vm.analytics = {
        monthlyTrends: [
          { month: '2023-01', categoryBreakdown: { Food: 200, Transport: 100 } },
          { month: '2023-02', categoryBreakdown: { Food: 300, Transport: 150 } }
        ]
      };

      vm.prepareMonthlyChart();

      expect(vm.monthlyChartData).toBeDefined();
      expect(vm.monthlyChartData.labels).toEqual(['2023-01', '2023-02']);
      expect(vm.monthlyChartData.datasets.length).toBe(2);
      expect(vm.monthlyChartData.datasets[0].label).toBe('Food');
      expect(vm.monthlyChartData.datasets[0].data).toEqual([200, 300]);
      expect(vm.monthlyChartData.datasets[1].label).toBe('Transport');
      expect(vm.monthlyChartData.datasets[1].data).toEqual([100, 150]);
    });

    /*
    Test Documentation:
    - Test Name: prepareMonthlyChart should handle empty trends
    - Purpose: Verify chart preparation with no monthly data
    - Scenario: Analytics has empty monthlyTrends array
    - Expected Result: Chart data with empty arrays is created
    */
    it('prepareMonthlyChart should handle empty trends', function() {
      vm.analytics = { monthlyTrends: [] };

      vm.prepareMonthlyChart();

      expect(vm.monthlyChartData.labels).toEqual([]);
      expect(vm.monthlyChartData.datasets).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: onCategoryClick should log category
    - Purpose: Verify category click handler
    - Scenario: User clicks on a category
    - Expected Result: Category is logged to console
    */
    it('onCategoryClick should log category', function() {
      spyOn(console, 'log');
      var category = 'Food';

      vm.onCategoryClick(category);

      expect(console.log).toHaveBeenCalledWith('Category clicked:', category);
    });

    /*
    Test Documentation:
    - Test Name: onCategoryClick should handle null category
    - Purpose: Verify category click with null input
    - Scenario: Category is null
    - Expected Result: Console log is called with null
    */
    it('onCategoryClick should handle null category', function() {
      spyOn(console, 'log');

      vm.onCategoryClick(null);

      expect(console.log).toHaveBeenCalledWith('Category clicked:', null);
    });

    /*
    Coverage Report:
    - Functions tested: init, loadAnalytics, prepareCategoryChart, prepareMonthlyChart, onCategoryClick
    - Statements/branches covered: Initialization, successful data loading, error handling, chart preparation with data and empty data, category click handler
    - Error scenarios covered: API failure, promise rejection
    - Uncovered scenarios: None - all public methods and error paths tested
    */
  });
})();