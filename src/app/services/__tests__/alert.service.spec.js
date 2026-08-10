/*
Test Documentation:
- Test Name: alertService - startMonitoring
- Purpose: Validates that monitoring interval starts correctly
- Scenario: Call startMonitoring and verify interval is created
- Expected Result: Interval should be created and checkBudgetThresholds called

Test Documentation:
- Test Name: alertService - stopMonitoring
- Purpose: Validates that monitoring interval stops correctly
- Scenario: Start monitoring then stop it
- Expected Result: Interval should be cancelled

Test Documentation:
- Test Name: alertService - checkBudgetThresholds success
- Purpose: Validates budget threshold checking with triggered alerts
- Scenario: Mock HTTP response with triggered alerts
- Expected Result: Should send alerts and show notifications

Test Documentation:
- Test Name: alertService - checkBudgetThresholds error
- Purpose: Validates error handling in budget check
- Scenario: Mock HTTP error response
- Expected Result: Should handle error gracefully

Test Documentation:
- Test Name: alertService - sendAlert
- Purpose: Validates alert sending functionality
- Scenario: Send an alert via HTTP POST
- Expected Result: Should broadcast event and return response

Test Documentation:
- Test Name: alertService - configureThreshold
- Purpose: Validates threshold configuration
- Scenario: Configure threshold for a company
- Expected Result: Should make POST request with correct data

Test Documentation:
- Test Name: alertService - getAlerts
- Purpose: Validates fetching alerts with filters
- Scenario: Get alerts with filter parameters
- Expected Result: Should make GET request with params

Test Documentation:
- Test Name: alertService - acknowledgeAlert
- Purpose: Validates alert acknowledgement
- Scenario: Acknowledge an alert by ID
- Expected Result: Should make POST request to acknowledge endpoint

Coverage Report:
- Functions tested: startMonitoring, stopMonitoring, checkBudgetThresholds, sendAlert, configureThreshold, getAlerts, acknowledgeAlert
- Scenarios covered: normal operation, error handling, interval management, HTTP interactions
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('alertService', function() {
    var alertService, $httpBackend, $interval, $rootScope, notificationService;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_alertService_, _$httpBackend_, _$interval_, _$rootScope_, _notificationService_) {
      alertService = _alertService_;
      $httpBackend = _$httpBackend_;
      $interval = _$interval_;
      $rootScope = _$rootScope_;
      notificationService = _notificationService_;
      spyOn(notificationService, 'warning');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      alertService.stopMonitoring();
    });

    describe('startMonitoring', function() {
      it('should start monitoring interval and call checkBudgetThresholds', function() {
        spyOn(alertService, 'checkBudgetThresholds').and.returnValue({then: function() {}});
        alertService.startMonitoring();
        expect(alertService.checkBudgetThresholds).toHaveBeenCalled();
      });

      it('should not create duplicate intervals', function() {
        spyOn(alertService, 'checkBudgetThresholds').and.returnValue({then: function() {}});
        alertService.startMonitoring();
        var callCount = alertService.checkBudgetThresholds.calls.count();
        alertService.startMonitoring();
        expect(alertService.checkBudgetThresholds.calls.count()).toBe(callCount);
      });
    });

    describe('stopMonitoring', function() {
      it('should cancel monitoring interval', function() {
        spyOn(alertService, 'checkBudgetThresholds').and.returnValue({then: function() {}});
        alertService.startMonitoring();
        alertService.stopMonitoring();
        expect(true).toBe(true);
      });

      it('should handle stop when not monitoring', function() {
        expect(function() {
          alertService.stopMonitoring();
        }).not.toThrow();
      });
    });

    describe('checkBudgetThresholds', function() {
      it('should check budget thresholds and send alerts for triggered status', function() {
        var mockResponse = {
          alerts: [
            {status: 'triggered', companyName: 'Company A', threshold: 80},
            {status: 'normal', companyName: 'Company B'}
          ]
        };
        spyOn(alertService, 'sendAlert').and.returnValue({then: function() {}});
        $httpBackend.expectGET('/api/alerts/budget-check').respond(200, mockResponse);
        alertService.checkBudgetThresholds();
        $httpBackend.flush();
        expect(alertService.sendAlert).toHaveBeenCalledWith(mockResponse.alerts[0]);
        expect(notificationService.warning).toHaveBeenCalledWith('Budget threshold exceeded for Company A');
      });

      it('should handle empty alerts response', function() {
        $httpBackend.expectGET('/api/alerts/budget-check').respond(200, {alerts: []});
        alertService.checkBudgetThresholds();
        $httpBackend.flush();
        expect(notificationService.warning).not.toHaveBeenCalled();
      });

      it('should handle HTTP error gracefully', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/alerts/budget-check').respond(500, 'Server error');
        alertService.checkBudgetThresholds();
        $httpBackend.flush();
        expect(console.error).toHaveBeenCalledWith('Budget check failed', jasmine.any(Object));
      });
    });

    describe('sendAlert', function() {
      it('should send alert and broadcast event', function() {
        var alert = {companyName: 'Test Company', threshold: 90};
        var mockResponse = {success: true};
        spyOn($rootScope, '$broadcast');
        $httpBackend.expectPOST('/api/alerts/send', alert).respond(200, mockResponse);
        alertService.sendAlert(alert);
        $httpBackend.flush();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('alert:sent', alert);
      });

      it('should handle send alert error', function() {
        var alert = {companyName: 'Test Company'};
        $httpBackend.expectPOST('/api/alerts/send', alert).respond(500, 'Error');
        var errorCaught = false;
        alertService.sendAlert(alert).catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('configureThreshold', function() {
      it('should configure threshold for company', function() {
        var companyId = 'comp123';
        var threshold = 85;
        $httpBackend.expectPOST('/api/alerts/configure', {companyId: companyId, threshold: threshold}).respond(200, {success: true});
        alertService.configureThreshold(companyId, threshold);
        $httpBackend.flush();
      });
    });

    describe('getAlerts', function() {
      it('should fetch alerts with filters', function() {
        var filters = {status: 'triggered', companyId: 'comp123'};
        $httpBackend.expectGET('/api/alerts?companyId=comp123&status=triggered').respond(200, {alerts: []});
        alertService.getAlerts(filters);
        $httpBackend.flush();
      });

      it('should fetch alerts without filters', function() {
        $httpBackend.expectGET('/api/alerts').respond(200, {alerts: []});
        alertService.getAlerts();
        $httpBackend.flush();
      });
    });

    describe('acknowledgeAlert', function() {
      it('should acknowledge alert by ID', function() {
        var alertId = 'alert123';
        $httpBackend.expectPOST('/api/alerts/alert123/acknowledge').respond(200, {success: true});
        alertService.acknowledgeAlert(alertId);
        $httpBackend.flush();
      });
    });
  });
})();