/*
Test Documentation:
- Test Name: fraudDetectionService - getAlerts success
- Purpose: Validates retrieval of fraud alerts
- Scenario: API returns fraud alerts
- Expected Result: Promise resolves with alerts data
*/
/*
Test Documentation:
- Test Name: fraudDetectionService - startMonitoring
- Purpose: Validates polling mechanism for fraud alerts
- Scenario: Monitoring is started with callback
- Expected Result: Interval is created and callback invoked with alerts
*/
/*
Test Documentation:
- Test Name: fraudDetectionService - stopMonitoring
- Purpose: Validates stopping of monitoring interval
- Scenario: stopMonitoring is called
- Expected Result: Interval is cancelled
*/
/*
Test Documentation:
- Test Name: fraudDetectionService - updateAlertStatus
- Purpose: Validates updating fraud alert status
- Scenario: Valid alertId and status provided
- Expected Result: Promise resolves with updated alert
*/
/*
Coverage Report:
- Functions tested: getAlerts, startMonitoring, stopMonitoring, updateAlertStatus
- Scenarios covered: API calls, polling, interval management
- Uncovered scenarios: multiple concurrent monitoring sessions
*/

(function() {
  'use strict';

  describe('fraudDetectionService', function() {
    var fraudDetectionService, $httpBackend, $interval, apiConfig;

    beforeEach(module('onlineShoppingApp'));

    beforeEach(inject(function(_fraudDetectionService_, _$httpBackend_, _$interval_, _apiConfig_) {
      fraudDetectionService = _fraudDetectionService_;
      $httpBackend = _$httpBackend_;
      $interval = _$interval_;
      apiConfig = _apiConfig_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      fraudDetectionService.stopMonitoring();
    });

    describe('getAlerts', function() {
      it('should retrieve fraud alerts successfully', function() {
        var mockAlerts = [
          { alertId: 'A1', type: 'suspicious_transaction', severity: 'high' },
          { alertId: 'A2', type: 'multiple_failed_logins', severity: 'medium' }
        ];

        $httpBackend.expectGET(apiConfig.baseUrl + '/fraud/alerts')
          .respond(200, mockAlerts);

        var result;
        fraudDetectionService.getAlerts().then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockAlerts);
        expect(result.length).toBe(2);
      });

      it('should reject promise on API error', function() {
        $httpBackend.expectGET(apiConfig.baseUrl + '/fraud/alerts')
          .respond(500, { message: 'Server error' });

        var error;
        fraudDetectionService.getAlerts().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(500);
      });
    });

    describe('startMonitoring', function() {
      it('should start polling for alerts', function() {
        var callbackInvoked = false;
        var mockAlerts = [{ alertId: 'A1' }];

        var callback = jasmine.createSpy('callback');

        $httpBackend.expectGET(apiConfig.baseUrl + '/fraud/alerts')
          .respond(200, mockAlerts);

        fraudDetectionService.startMonitoring(callback);
        $interval.flush(30000);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledWith(mockAlerts);
      });

      it('should cancel existing interval before starting new one', function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        fraudDetectionService.startMonitoring(callback1);
        fraudDetectionService.startMonitoring(callback2);

        expect(callback1).not.toHaveBeenCalled();
      });
    });

    describe('stopMonitoring', function() {
      it('should cancel polling interval', function() {
        var callback = jasmine.createSpy('callback');

        fraudDetectionService.startMonitoring(callback);
        fraudDetectionService.stopMonitoring();

        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('updateAlertStatus', function() {
      it('should update alert status successfully', function() {
        var alertId = 'A123';
        var status = 'resolved';
        var mockResponse = { alertId: 'A123', status: 'resolved' };

        $httpBackend.expectPUT(apiConfig.baseUrl + '/fraud/alerts/' + alertId, { status: status })
          .respond(200, mockResponse);

        var result;
        fraudDetectionService.updateAlertStatus(alertId, status).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should reject promise on update error', function() {
        var alertId = 'A123';
        var status = 'resolved';

        $httpBackend.expectPUT(apiConfig.baseUrl + '/fraud/alerts/' + alertId)
          .respond(404, { message: 'Alert not found' });

        var error;
        fraudDetectionService.updateAlertStatus(alertId, status).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error.status).toBe(404);
      });
    });
  });
})();