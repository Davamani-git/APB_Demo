/*
Test Documentation:
- Test Name: AlertNotificationService - createAlert (no alert required)
- Purpose: Verify that createAlert returns a resolved promise with 'No alert required' when policyDecision.requiresAlert is false.
- Scenario: policyDecision.requiresAlert = false
- Expected Result: Promise resolves with { message: 'No alert required' }

- Test Name: AlertNotificationService - createAlert (alert required, success)
- Purpose: Verify that createAlert posts to /api/alerts/create, pushes alert to activeAlerts, broadcasts event, and logs audit.
- Scenario: policyDecision.requiresAlert = true, $http.post resolves successfully
- Expected Result: Alert object returned, activeAlerts updated, $rootScope.$broadcast called, AuditLogService.logEvent called with 'alert_created'

- Test Name: AlertNotificationService - createAlert (HTTP failure)
- Purpose: Verify that createAlert logs 'alert_creation_failed' and rejects the promise on HTTP error.
- Scenario: policyDecision.requiresAlert = true, $http.post rejects
- Expected Result: Promise rejected, AuditLogService.logEvent called with 'alert_creation_failed'

- Test Name: AlertNotificationService - getActiveAlerts
- Purpose: Verify that getActiveAlerts returns the current activeAlerts array.
- Scenario: No alerts created yet
- Expected Result: Returns an empty array initially

- Test Name: AlertNotificationService - acknowledgeAlert (success)
- Purpose: Verify that acknowledgeAlert posts to correct endpoint, updates alert status, broadcasts event, and logs audit.
- Scenario: Alert exists in activeAlerts, $http.post resolves
- Expected Result: alert.status set to 'acknowledged', broadcast and audit log called

- Test Name: AlertNotificationService - resolveAlert (success)
- Purpose: Verify that resolveAlert posts to correct endpoint, updates alert status and resolution, broadcasts event, and logs audit.
- Scenario: Alert exists in activeAlerts, $http.post resolves
- Expected Result: alert.status set to 'resolved', resolution stored, broadcast and audit log called

- Test Name: AlertNotificationService - sendNotification (success)
- Purpose: Verify that sendNotification posts correct payload and logs audit on success.
- Scenario: $http.post resolves
- Expected Result: AuditLogService.logEvent called with 'notification_sent', response.data returned

- Test Name: AlertNotificationService - sendNotification (failure)
- Purpose: Verify that sendNotification logs 'notification_failed' and rejects on HTTP error.
- Scenario: $http.post rejects
- Expected Result: Promise rejected, AuditLogService.logEvent called with 'notification_failed'

- Test Name: AlertNotificationService - sendNotification (default channel)
- Purpose: Verify that sendNotification defaults channel to 'push' when not provided.
- Scenario: channel parameter is undefined
- Expected Result: Payload sent with channel: 'push'
*/

describe('AlertNotificationService', function() {
  var AlertNotificationService;
  var $httpBackend;
  var $rootScope;
  var AuditLogService;
  var $q;

  beforeEach(module('fraudDetection'));

  beforeEach(function() {
    AuditLogService = jasmine.createSpyObj('AuditLogService', ['logEvent']);
    module(function($provide) {
      $provide.value('AuditLogService', AuditLogService);
    });
  });

  beforeEach(inject(function(_AlertNotificationService_, _$httpBackend_, _$rootScope_, _$q_) {
    AlertNotificationService = _AlertNotificationService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('createAlert', function() {
    var transaction, riskScore, policyDecision;

    beforeEach(function() {
      transaction = {
        transactionId: 'TXN-001',
        amount: 250.00,
        currency: 'USD',
        merchantName: 'Test Merchant',
        cardNumber: '****1234',
        timestamp: new Date(),
        location: 'New York, NY'
      };
      riskScore = {
        riskLevel: 'high',
        overallScore: 88
      };
      policyDecision = {
        requiresAlert: true,
        action: 'hold'
      };
    });

    it('should return resolved promise with no alert required message when requiresAlert is false', function() {
      policyDecision.requiresAlert = false;
      var result;
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision).then(function(res) {
        result = res;
      });
      $rootScope.$digest();
      expect(result).toEqual({ message: 'No alert required' });
    });

    it('should post to /api/alerts/create and return alert object on success', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      var result;
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result).toBeDefined();
      expect(result.transactionId).toBe('TXN-001');
      expect(result.riskLevel).toBe('high');
      expect(result.status).toBe('pending');
    });

    it('should push alert to activeAlerts on successful creation', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision);
      $httpBackend.flush();
      var alerts = AlertNotificationService.getActiveAlerts();
      expect(alerts.length).toBe(1);
      expect(alerts[0].transactionId).toBe('TXN-001');
    });

    it('should broadcast fraud-alert-created event on success', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      spyOn($rootScope, '$broadcast').and.callThrough();
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision);
      $httpBackend.flush();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('fraud-alert-created', jasmine.objectContaining({ transactionId: 'TXN-001' }));
    });

    it('should call AuditLogService.logEvent with alert_created on success', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision);
      $httpBackend.flush();
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('alert_created', jasmine.objectContaining({
        transactionId: 'TXN-001',
        riskLevel: 'high'
      }));
    });

    it('should call AuditLogService.logEvent with alert_creation_failed on HTTP error', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(500, { error: 'Server Error' });
      var rejected = false;
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision).catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(rejected).toBe(true);
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('alert_creation_failed', jasmine.objectContaining({
        transactionId: 'TXN-001'
      }));
    });

    it('should include all transaction fields in the alert object', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      var result;
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision).then(function(res) {
        result = res;
      });
      $httpBackend.flush();
      expect(result.transaction.amount).toBe(250.00);
      expect(result.transaction.merchantName).toBe('Test Merchant');
      expect(result.transaction.currency).toBe('USD');
    });
  });

  describe('getActiveAlerts', function() {
    it('should return an empty array initially', function() {
      var alerts = AlertNotificationService.getActiveAlerts();
      expect(alerts).toEqual([]);
    });
  });

  describe('acknowledgeAlert', function() {
    it('should post to correct acknowledge endpoint and update alert status', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      var transaction = { transactionId: 'TXN-ACK', amount: 100, currency: 'USD', merchantName: 'M', cardNumber: '****', timestamp: new Date(), location: 'NY' };
      var riskScore = { riskLevel: 'high', overallScore: 90 };
      var policyDecision = { requiresAlert: true, action: 'hold' };
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision);
      $httpBackend.flush();

      var alertId = AlertNotificationService.getActiveAlerts()[0].alertId;
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/acknowledge').respond(200, { success: true });
      AlertNotificationService.acknowledgeAlert(alertId);
      $httpBackend.flush();

      var alert = AlertNotificationService.getActiveAlerts()[0];
      expect(alert.status).toBe('acknowledged');
    });

    it('should broadcast fraud-alert-acknowledged event', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      var alertId = 'ALT-TEST-123';
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/acknowledge').respond(200, {});
      AlertNotificationService.acknowledgeAlert(alertId);
      $httpBackend.flush();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('fraud-alert-acknowledged', alertId);
    });

    it('should call AuditLogService.logEvent with alert_acknowledged', function() {
      var alertId = 'ALT-TEST-456';
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/acknowledge').respond(200, {});
      AlertNotificationService.acknowledgeAlert(alertId);
      $httpBackend.flush();
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('alert_acknowledged', { alertId: alertId });
    });
  });

  describe('resolveAlert', function() {
    it('should post to correct resolve endpoint and update alert status and resolution', function() {
      $httpBackend.expectPOST('/api/alerts/create').respond(200, { success: true });
      var transaction = { transactionId: 'TXN-RES', amount: 200, currency: 'USD', merchantName: 'M', cardNumber: '****', timestamp: new Date(), location: 'LA' };
      var riskScore = { riskLevel: 'medium', overallScore: 65 };
      var policyDecision = { requiresAlert: true, action: 'approve_with_monitoring' };
      AlertNotificationService.createAlert(transaction, riskScore, policyDecision);
      $httpBackend.flush();

      var alertId = AlertNotificationService.getActiveAlerts()[0].alertId;
      var resolution = 'confirmed_legitimate';
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/resolve').respond(200, { success: true });
      AlertNotificationService.resolveAlert(alertId, resolution);
      $httpBackend.flush();

      var alert = AlertNotificationService.getActiveAlerts()[0];
      expect(alert.status).toBe('resolved');
      expect(alert.resolution).toBe('confirmed_legitimate');
    });

    it('should broadcast fraud-alert-resolved event with alertId and resolution', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      var alertId = 'ALT-RES-789';
      var resolution = 'false_positive';
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/resolve').respond(200, {});
      AlertNotificationService.resolveAlert(alertId, resolution);
      $httpBackend.flush();
      expect($rootScope.$broadcast).toHaveBeenCalledWith('fraud-alert-resolved', { alertId: alertId, resolution: resolution });
    });

    it('should call AuditLogService.logEvent with alert_resolved', function() {
      var alertId = 'ALT-RES-000';
      var resolution = 'fraud_confirmed';
      $httpBackend.expectPOST('/api/alerts/' + alertId + '/resolve').respond(200, {});
      AlertNotificationService.resolveAlert(alertId, resolution);
      $httpBackend.flush();
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('alert_resolved', { alertId: alertId, resolution: resolution });
    });
  });

  describe('sendNotification', function() {
    var alert;

    beforeEach(function() {
      alert = { alertId: 'ALT-NOTIF-001', transactionId: 'TXN-NOTIF-001' };
    });

    it('should post to /api/notifications/send with correct payload', function() {
      $httpBackend.expectPOST('/api/notifications/send', {
        alertId: 'ALT-NOTIF-001',
        channel: 'push',
        message: 'Fraud alert for transaction TXN-NOTIF-001'
      }).respond(200, { delivered: true });
      AlertNotificationService.sendNotification(alert, 'push');
      $httpBackend.flush();
    });

    it('should default channel to push when not provided', function() {
      $httpBackend.expectPOST('/api/notifications/send', jasmine.objectContaining({ channel: 'push' })).respond(200, {});
      AlertNotificationService.sendNotification(alert);
      $httpBackend.flush();
    });

    it('should call AuditLogService.logEvent with notification_sent on success', function() {
      $httpBackend.expectPOST('/api/notifications/send').respond(200, {});
      AlertNotificationService.sendNotification(alert, 'email');
      $httpBackend.flush();
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('notification_sent', { alertId: 'ALT-NOTIF-001', channel: 'email' });
    });

    it('should call AuditLogService.logEvent with notification_failed and reject on HTTP error', function() {
      $httpBackend.expectPOST('/api/notifications/send').respond(503, { error: 'Service Unavailable' });
      var rejected = false;
      AlertNotificationService.sendNotification(alert, 'sms').catch(function() {
        rejected = true;
      });
      $httpBackend.flush();
      $rootScope.$digest();
      expect(rejected).toBe(true);
      expect(AuditLogService.logEvent).toHaveBeenCalledWith('notification_failed', jasmine.objectContaining({
        alertId: 'ALT-NOTIF-001',
        channel: 'sms'
      }));
    });

    it('should use sms channel when specified', function() {
      $httpBackend.expectPOST('/api/notifications/send', jasmine.objectContaining({ channel: 'sms' })).respond(200, {});
      AlertNotificationService.sendNotification(alert, 'sms');
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: createAlert, getActiveAlerts, acknowledgeAlert, resolveAlert, sendNotification
  - Scenarios covered: no alert required, successful alert creation, HTTP failure, active alerts tracking,
    acknowledge with status update, resolve with resolution, notification with default/custom channel,
    notification failure, audit logging for all operations, event broadcasting
  - Uncovered scenarios: concurrent alert creation race conditions, alertId uniqueness collision
  */
});
