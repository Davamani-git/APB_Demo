(function() {
  'use strict';

  describe('DashboardController', function() {
    var vm, KPIAggregationService, DataRefreshService, $q, $rootScope, $scope;

    beforeEach(module('creditCardDashboard'));

    beforeEach(inject(function($controller, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      KPIAggregationService = jasmine.createSpyObj('KPIAggregationService', ['getAggregatedKPIs', 'clearCache']);
      DataRefreshService = jasmine.createSpyObj('DataRefreshService', ['startAutoRefresh', 'stopAutoRefresh']);

      vm = $controller('DashboardController', {
        KPIAggregationService: KPIAggregationService,
        DataRefreshService: DataRefreshService,
        $scope: $scope
      });
    }));

    /*
    Test Documentation:
    - Test Name: should initialize with default values
    - Purpose: Verify controller initialization
    - Scenario: Controller is instantiated
    - Expected Result: Default properties are set
    */
    it('should initialize with default values', function() {
      expect(vm.kpis).toEqual({});
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);
    });

    /*
    Test Documentation:
    - Test Name: should call loadKPIs and startAutoRefresh on init
    - Purpose: Verify init triggers data loading and auto-refresh
    - Scenario: init() is called
    - Expected Result: loadKPIs and startAutoRefresh are invoked
    */
    it('should call loadKPIs and startAutoRefresh on init', function() {
      spyOn(vm, 'loadKPIs');
      vm.init();
      expect(vm.loadKPIs).toHaveBeenCalled();
      expect(DataRefreshService.startAutoRefresh).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: loadKPIs should fetch KPIs successfully
    - Purpose: Verify successful KPI data loading
    - Scenario: KPIAggregationService returns KPI data
    - Expected Result: KPIs are set, loading is false
    */
    it('loadKPIs should fetch KPIs successfully', function() {
      var mockKPIs = {
        monthlySpend: 1000,
        totalCreditLimit: 5000,
        availableCredit: 3000,
        outstandingAmount: 2000,
        cards: []
      };
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve(mockKPIs));

      vm.loadKPIs();
      expect(vm.loading).toBe(true);
      expect(vm.error).toBe(null);

      $rootScope.$digest();

      expect(vm.kpis).toEqual(mockKPIs);
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: loadKPIs should handle errors
    - Purpose: Verify error handling during KPI loading
    - Scenario: KPIAggregationService rejects promise
    - Expected Result: Error message is set, loading is false
    */
    it('loadKPIs should handle errors', function() {
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.reject('API Error'));

      vm.loadKPIs();
      $rootScope.$digest();

      expect(vm.error).toBe('Failed to load dashboard data');
      expect(vm.loading).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: refresh should clear cache and reload KPIs
    - Purpose: Verify manual refresh functionality
    - Scenario: User clicks refresh button
    - Expected Result: Cache is cleared, loadKPIs is called
    */
    it('refresh should clear cache and reload KPIs', function() {
      spyOn(vm, 'loadKPIs');

      vm.refresh();

      expect(KPIAggregationService.clearCache).toHaveBeenCalled();
      expect(vm.loadKPIs).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should stop auto-refresh on scope destroy
    - Purpose: Verify cleanup on controller destruction
    - Scenario: Scope is destroyed
    - Expected Result: stopAutoRefresh is called
    */
    it('should stop auto-refresh on scope destroy', function() {
      $scope.$destroy();
      expect(DataRefreshService.stopAutoRefresh).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: startAutoRefresh callback should update KPIs
    - Purpose: Verify auto-refresh callback updates controller state
    - Scenario: Auto-refresh triggers callback with new KPIs
    - Expected Result: vm.kpis is updated with new data
    */
    it('startAutoRefresh callback should update KPIs', function() {
      var callback;
      DataRefreshService.startAutoRefresh.and.callFake(function(cb) {
        callback = cb;
      });

      vm.init();

      var newKPIs = { monthlySpend: 2000 };
      spyOn($scope, '$apply');
      callback(newKPIs);

      expect(vm.kpis).toEqual(newKPIs);
      expect($scope.$apply).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle null KPIs from service
    - Purpose: Verify handling of null response
    - Scenario: Service returns null
    - Expected Result: vm.kpis is set to null, no errors thrown
    */
    it('should handle null KPIs from service', function() {
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve(null));

      vm.loadKPIs();
      $rootScope.$digest();

      expect(vm.kpis).toBe(null);
      expect(vm.loading).toBe(false);
      expect(vm.error).toBe(null);
    });

    /*
    Coverage Report:
    - Functions tested: init, loadKPIs, refresh, $destroy event handler
    - Statements/branches covered: Initialization, successful KPI loading, error handling, cache clearing, auto-refresh setup, cleanup on destroy, callback execution
    - Error scenarios covered: API failure, null response
    - Uncovered scenarios: None - all public methods and error paths tested
    */
  });
})();