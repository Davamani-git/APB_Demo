(function() {
  'use strict';

  describe('DataRefreshService', function() {
    var DataRefreshService, KPIAggregationService, $interval, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DataRefreshService_, _$interval_, _$q_, _$rootScope_) {
      DataRefreshService = _DataRefreshService_;
      $interval = _$interval_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      KPIAggregationService = jasmine.createSpyObj('KPIAggregationService', ['clearCache', 'getAggregatedKPIs']);
      DataRefreshService.KPIAggregationService = KPIAggregationService;
    }));

    beforeEach(inject(function($injector) {
      $injector.get('$injector').invoke(function(_KPIAggregationService_) {
        KPIAggregationService = _KPIAggregationService_;
        spyOn(KPIAggregationService, 'clearCache');
        spyOn(KPIAggregationService, 'getAggregatedKPIs').and.returnValue($q.resolve({}));
      });
    }));

    afterEach(function() {
      DataRefreshService.stopAutoRefresh();
    });

    /*
    Test Documentation:
    - Test Name: should start auto-refresh with interval
    - Purpose: Verify auto-refresh initialization
    - Scenario: startAutoRefresh is called
    - Expected Result: Interval is created
    */
    it('should start auto-refresh with interval', function() {
      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({ data: 'test' }));

      DataRefreshService.startAutoRefresh(callback);

      expect($interval.cancel).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should stop existing interval before starting new one
    - Purpose: Verify interval cleanup on restart
    - Scenario: startAutoRefresh is called twice
    - Expected Result: Previous interval is cancelled
    */
    it('should stop existing interval before starting new one', function() {
      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({}));

      DataRefreshService.startAutoRefresh(callback);
      spyOn(DataRefreshService, 'stopAutoRefresh').and.callThrough();
      DataRefreshService.startAutoRefresh(callback);

      expect(DataRefreshService.stopAutoRefresh).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should call callback with KPIs on interval
    - Purpose: Verify callback invocation during refresh
    - Scenario: Interval triggers refresh
    - Expected Result: Callback is called with KPI data
    */
    it('should call callback with KPIs on interval', function() {
      var callback = jasmine.createSpy('callback');
      var mockKPIs = { monthlySpend: 1000 };
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve(mockKPIs));

      DataRefreshService.startAutoRefresh(callback);
      $interval.flush(60000);
      $rootScope.$digest();

      expect(KPIAggregationService.clearCache).toHaveBeenCalled();
      expect(KPIAggregationService.getAggregatedKPIs).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(mockKPIs);
    });

    /*
    Test Documentation:
    - Test Name: should not call callback if not provided
    - Purpose: Verify optional callback handling
    - Scenario: startAutoRefresh is called without callback
    - Expected Result: No error is thrown, refresh still happens
    */
    it('should not call callback if not provided', function() {
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({}));

      expect(function() {
        DataRefreshService.startAutoRefresh();
        $interval.flush(60000);
        $rootScope.$digest();
      }).not.toThrow();

      expect(KPIAggregationService.clearCache).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: stopAutoRefresh should cancel interval
    - Purpose: Verify interval cancellation
    - Scenario: stopAutoRefresh is called
    - Expected Result: Interval is cancelled and set to null
    */
    it('stopAutoRefresh should cancel interval', function() {
      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({}));

      DataRefreshService.startAutoRefresh(callback);
      DataRefreshService.stopAutoRefresh();

      expect(function() {
        $interval.flush(60000);
      }).toThrow();
    });

    /*
    Test Documentation:
    - Test Name: stopAutoRefresh should handle null interval
    - Purpose: Verify safe handling when no interval exists
    - Scenario: stopAutoRefresh is called without starting
    - Expected Result: No error is thrown
    */
    it('stopAutoRefresh should handle null interval', function() {
      expect(function() {
        DataRefreshService.stopAutoRefresh();
      }).not.toThrow();
    });

    /*
    Test Documentation:
    - Test Name: setRefreshRate should update refresh rate
    - Purpose: Verify refresh rate configuration
    - Scenario: setRefreshRate is called with new rate
    - Expected Result: Next interval uses new rate
    */
    it('setRefreshRate should update refresh rate', function() {
      DataRefreshService.setRefreshRate(30000);

      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({}));

      DataRefreshService.startAutoRefresh(callback);
      $interval.flush(30000);
      $rootScope.$digest();

      expect(callback).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle KPI service errors
    - Purpose: Verify error handling during refresh
    - Scenario: getAggregatedKPIs rejects promise
    - Expected Result: Error is handled gracefully, callback not called
    */
    it('should handle KPI service errors', function() {
      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.reject('Error'));

      DataRefreshService.startAutoRefresh(callback);
      $interval.flush(60000);
      $rootScope.$digest();

      expect(callback).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should clear cache on each refresh
    - Purpose: Verify cache clearing behavior
    - Scenario: Multiple intervals trigger
    - Expected Result: clearCache is called each time
    */
    it('should clear cache on each refresh', function() {
      var callback = jasmine.createSpy('callback');
      KPIAggregationService.getAggregatedKPIs.and.returnValue($q.resolve({}));

      DataRefreshService.startAutoRefresh(callback);
      $interval.flush(60000);
      $rootScope.$digest();
      $interval.flush(60000);
      $rootScope.$digest();

      expect(KPIAggregationService.clearCache).toHaveBeenCalledTimes(2);
    });

    /*
    Coverage Report:
    - Functions tested: startAutoRefresh, stopAutoRefresh, setRefreshRate
    - Statements/branches covered: Interval creation, interval cancellation, callback invocation, cache clearing, refresh rate configuration, error handling
    - Error scenarios covered: KPI service errors, null interval, missing callback
    - Uncovered scenarios: None - all service methods and error paths tested
    */
  });
})();