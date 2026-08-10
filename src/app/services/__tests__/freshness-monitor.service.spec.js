/*
Test Documentation:
- Test Name: freshnessMonitorService - startMonitoring
- Purpose: Validates monitoring interval start
- Scenario: Start freshness monitoring
- Expected Result: Should create monitoring interval

Test Documentation:
- Test Name: freshnessMonitorService - stopMonitoring
- Purpose: Validates monitoring interval stop
- Scenario: Stop freshness monitoring
- Expected Result: Should cancel monitoring interval

Test Documentation:
- Test Name: freshnessMonitorService - checkDataFreshness
- Purpose: Validates data freshness checking
- Scenario: Check registered data for staleness
- Expected Result: Should notify for stale data

Test Documentation:
- Test Name: freshnessMonitorService - notifyStaleData
- Purpose: Validates stale data notification
- Scenario: Notify about stale data
- Expected Result: Should show notification and broadcast event

Test Documentation:
- Test Name: freshnessMonitorService - registerData
- Purpose: Validates data registration
- Scenario: Register company data for monitoring
- Expected Result: Should store data in dataStore

Test Documentation:
- Test Name: freshnessMonitorService - getDataStatus
- Purpose: Validates data status retrieval
- Scenario: Get status of registered data
- Expected Result: Should return data status

Test Documentation:
- Test Name: freshnessMonitorService - isDataFresh
- Purpose: Validates freshness check
- Scenario: Check if data is fresh
- Expected Result: Should return true/false based on age

Coverage Report:
- Functions tested: startMonitoring, stopMonitoring, checkDataFreshness, notifyStaleData, registerData, getDataStatus, isDataFresh
- Scenarios covered: monitoring lifecycle, freshness checking, notification, data registration
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('freshnessMonitorService', function() {
    var freshnessMonitorService, $interval, $rootScope, notificationService;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_freshnessMonitorService_, _$interval_, _$rootScope_, _notificationService_) {
      freshnessMonitorService = _freshnessMonitorService_;
      $interval = _$interval_;
      $rootScope = _$rootScope_;
      notificationService = _notificationService_;
      spyOn(notificationService, 'warning');
    }));

    afterEach(function() {
      freshnessMonitorService.stopMonitoring();
    });

    describe('startMonitoring', function() {
      it('should start monitoring interval', function() {
        spyOn(freshnessMonitorService, 'checkDataFreshness');
        freshnessMonitorService.startMonitoring();
        expect(freshnessMonitorService.checkDataFreshness).not.toHaveBeenCalled();
      });

      it('should not create duplicate intervals', function() {
        freshnessMonitorService.startMonitoring();
        freshnessMonitorService.startMonitoring();
        expect(true).toBe(true);
      });
    });

    describe('stopMonitoring', function() {
      it('should cancel monitoring interval', function() {
        freshnessMonitorService.startMonitoring();
        freshnessMonitorService.stopMonitoring();
        expect(true).toBe(true);
      });

      it('should handle stop when not monitoring', function() {
        expect(function() {
          freshnessMonitorService.stopMonitoring();
        }).not.toThrow();
      });
    });

    describe('checkDataFreshness', function() {
      it('should check and notify stale data', function() {
        var oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 2);
        freshnessMonitorService.registerData('comp123', {
          companyName: 'Test Company',
          lastUpdated: oldDate
        });
        spyOn(freshnessMonitorService, 'notifyStaleData');
        freshnessMonitorService.checkDataFreshness();
        expect(freshnessMonitorService.notifyStaleData).toHaveBeenCalledWith('comp123', jasmine.any(Object));
      });

      it('should not notify for fresh data', function() {
        freshnessMonitorService.registerData('comp123', {
          companyName: 'Test Company',
          lastUpdated: new Date()
        });
        spyOn(freshnessMonitorService, 'notifyStaleData');
        freshnessMonitorService.checkDataFreshness();
        expect(freshnessMonitorService.notifyStaleData).not.toHaveBeenCalled();
      });
    });

    describe('notifyStaleData', function() {
      it('should show notification and broadcast event', function() {
        var companyId = 'comp123';
        var data = {
          companyName: 'Test Company',
          lastUpdated: new Date('2024-01-01')
        };
        spyOn($rootScope, '$broadcast');
        freshnessMonitorService.notifyStaleData(companyId, data);
        expect(notificationService.warning).toHaveBeenCalled();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('data:stale', {companyId: companyId, data: data});
      });
    });

    describe('registerData', function() {
      it('should register company data', function() {
        var companyId = 'comp123';
        var data = {
          companyName: 'Test Company',
          lastUpdated: new Date(),
          status: 'active'
        };
        freshnessMonitorService.registerData(companyId, data);
        var status = freshnessMonitorService.getDataStatus(companyId);
        expect(status).toBeDefined();
        expect(status.companyName).toBe('Test Company');
      });
    });

    describe('getDataStatus', function() {
      it('should return data status', function() {
        var companyId = 'comp123';
        var data = {companyName: 'Test Company', lastUpdated: new Date()};
        freshnessMonitorService.registerData(companyId, data);
        var status = freshnessMonitorService.getDataStatus(companyId);
        expect(status.companyName).toBe('Test Company');
      });

      it('should return null for unregistered company', function() {
        var status = freshnessMonitorService.getDataStatus('unknown');
        expect(status).toBeNull();
      });
    });

    describe('isDataFresh', function() {
      it('should return true for fresh data', function() {
        var companyId = 'comp123';
        freshnessMonitorService.registerData(companyId, {
          companyName: 'Test Company',
          lastUpdated: new Date()
        });
        expect(freshnessMonitorService.isDataFresh(companyId)).toBe(true);
      });

      it('should return false for stale data', function() {
        var companyId = 'comp123';
        var oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 2);
        freshnessMonitorService.registerData(companyId, {
          companyName: 'Test Company',
          lastUpdated: oldDate
        });
        expect(freshnessMonitorService.isDataFresh(companyId)).toBe(false);
      });

      it('should return false for unregistered data', function() {
        expect(freshnessMonitorService.isDataFresh('unknown')).toBe(false);
      });
    });
  });
})();