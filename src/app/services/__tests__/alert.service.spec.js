describe('AlertService', function() {
  beforeEach(module('fraudDetectionApp'));
  var AlertService, $httpBackend, $q, PolicyDecisionService, NotificationService;

  beforeEach(inject(function(_AlertService_, _$httpBackend_, _$q_, _PolicyDecisionService_, _NotificationService_) {
    AlertService = _AlertService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    PolicyDecisionService = _PolicyDecisionService_;
    NotificationService = _NotificationService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('createAlert', function() {
    /*
    Test Documentation:
    - Test Name: should create alert with valid policy decision
    - Purpose: Validates alert creation with valid policy decision and customer ID
    - Scenario: Valid policyDecision with transactionId and action='alert'
    - Expected Result: Alert is created and notification is sent
    */
    it('should create alert with valid policy decision', function() {
      var policyDecision = {
        transactionId: 'TXN-123',
        action: 'alert',
        riskScore: 75
      };
      var customerId = 'CUST-001';
      var mockResponse = { alertId: 'ALT-123', status: 'pending' };
      var mockNotification = { notificationId: 'NOT-123' };

      spyOn(NotificationService, 'send').and.returnValue($q.when(mockNotification));
      $httpBackend.expectPOST('/api/alerts').respond(mockResponse);

      AlertService.createAlert(policyDecision, customerId).then(function(result) {
        expect(result.alert).toBeDefined();
        expect(result.notification).toBeDefined();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject when policy decision is invalid
    - Purpose: Validates error handling for invalid policy decision
    - Scenario: policyDecision is null or missing transactionId
    - Expected Result: Promise is rejected with error message
    */
    it('should reject when policy decision is invalid', function() {
      AlertService.createAlert(null, 'CUST-001').then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.error).toBe('Invalid policy decision');
      });
    });

    /*
    Test Documentation:
    - Test Name: should reject when transactionId is missing
    - Purpose: Validates error handling for missing transactionId
    - Scenario: policyDecision without transactionId
    - Expected Result: Promise is rejected with error message
    */
    it('should reject when transactionId is missing', function() {
      var policyDecision = { action: 'alert', riskScore: 75 };
      AlertService.createAlert(policyDecision, 'CUST-001').then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.error).toBe('Invalid policy decision');
      });
    });

    /*
    Test Documentation:
    - Test Name: should not create alert when action does not require alert
    - Purpose: Validates that alerts are not created for non-alert actions
    - Scenario: policyDecision with action='approve'
    - Expected Result: Returns alertCreated: false
    */
    it('should not create alert when action does not require alert', function() {
      var policyDecision = {
        transactionId: 'TXN-123',
        action: 'approve',
        riskScore: 25
      };
      AlertService.createAlert(policyDecision, 'CUST-001').then(function(result) {
        expect(result.alertCreated).toBe(false);
        expect(result.reason).toBe('Action does not require alert');
      });
    });

    /*
    Test Documentation:
    - Test Name: should create alert with step-up action
    - Purpose: Validates alert creation for step-up action
    - Scenario: policyDecision with action='step-up'
    - Expected Result: Alert is created successfully
    */
    it('should create alert with step-up action', function() {
      var policyDecision = {
        transactionId: 'TXN-124',
        action: 'step-up',
        riskScore: 60
      };
      var mockResponse = { alertId: 'ALT-124', status: 'pending' };
      var mockNotification = { notificationId: 'NOT-124' };

      spyOn(NotificationService, 'send').and.returnValue($q.when(mockNotification));
      $httpBackend.expectPOST('/api/alerts').respond(mockResponse);

      AlertService.createAlert(policyDecision, 'CUST-001').then(function(result) {
        expect(result.alert).toBeDefined();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should use default customer ID when not provided
    - Purpose: Validates default customer ID assignment
    - Scenario: createAlert called without customerId
    - Expected Result: Alert uses 'CUST-UNKNOWN' as customerId
    */
    it('should use default customer ID when not provided', function() {
      var policyDecision = {
        transactionId: 'TXN-125',
        action: 'alert',
        riskScore: 75
      };
      var mockResponse = { alertId: 'ALT-125', customerId: 'CUST-UNKNOWN' };
      var mockNotification = { notificationId: 'NOT-125' };

      spyOn(NotificationService, 'send').and.returnValue($q.when(mockNotification));
      $httpBackend.expectPOST('/api/alerts').respond(mockResponse);

      AlertService.createAlert(policyDecision).then(function(result) {
        expect(result.alert.customerId).toBe('CUST-UNKNOWN');
      });

      $httpBackend.flush();
    });
  });

  describe('sendNotification', function() {
    /*
    Test Documentation:
    - Test Name: should send notification with correct priority for decline action
    - Purpose: Validates notification priority based on action type
    - Scenario: Alert with action='decline'
    - Expected Result: Notification sent with 'high' priority
    */
    it('should send notification with correct priority for decline action', function() {
      var alert = {
        alertId: 'ALT-126',
        customerId: 'CUST-001',
        notificationChannels: ['push', 'email'],
        action: 'decline'
      };

      spyOn(NotificationService, 'send').and.returnValue($q.when({ notificationId: 'NOT-126' }));

      AlertService.sendNotification(alert).then(function(result) {
        expect(NotificationService.send).toHaveBeenCalled();
        var callArgs = NotificationService.send.calls.mostRecent().args[0];
        expect(callArgs.priority).toBe('high');
      });
    });

    /*
    Test Documentation:
    - Test Name: should send notification with medium priority for non-decline action
    - Purpose: Validates notification priority for non-critical actions
    - Scenario: Alert with action='alert'
    - Expected Result: Notification sent with 'medium' priority
    */
    it('should send notification with medium priority for non-decline action', function() {
      var alert = {
        alertId: 'ALT-127',
        customerId: 'CUST-001',
        notificationChannels: ['push', 'email'],
        action: 'alert'
      };

      spyOn(NotificationService, 'send').and.returnValue($q.when({ notificationId: 'NOT-127' }));

      AlertService.sendNotification(alert).then(function(result) {
        var callArgs = NotificationService.send.calls.mostRecent().args[0];
        expect(callArgs.priority).toBe('medium');
      });
    });
  });

  describe('getAlerts', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve alerts with filters
    - Purpose: Validates alert retrieval with filter parameters
    - Scenario: getAlerts called with filter object
    - Expected Result: Returns array of alerts matching filters
    */
    it('should retrieve alerts with filters', function() {
      var filters = { status: 'pending', customerId: 'CUST-001' };
      var mockAlerts = [{ alertId: 'ALT-1', status: 'pending' }];

      $httpBackend.expectGET('/api/alerts?status=pending&customerId=CUST-001').respond(mockAlerts);

      AlertService.getAlerts(filters).then(function(result) {
        expect(result).toEqual(mockAlerts);
      });

      $httpBackend.flush();
    });
  });

  describe('getAlertById', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve alert by ID
    - Purpose: Validates alert retrieval by specific ID
    - Scenario: getAlertById called with valid alertId
    - Expected Result: Returns alert object with matching ID
    */
    it('should retrieve alert by ID', function() {
      var alertId = 'ALT-128';
      var mockAlert = { alertId: alertId, status: 'pending' };

      $httpBackend.expectGET('/api/alerts/' + alertId).respond(mockAlert);

      AlertService.getAlertById(alertId).then(function(result) {
        expect(result.alertId).toBe(alertId);
      });

      $httpBackend.flush();
    });
  });

  describe('updateAlertStatus', function() {
    /*
    Test Documentation:
    - Test Name: should update alert status
    - Purpose: Validates alert status update functionality
    - Scenario: updateAlertStatus called with alertId and new status
    - Expected Result: Alert status is updated successfully
    */
    it('should update alert status', function() {
      var alertId = 'ALT-129';
      var newStatus = 'confirmed';
      var mockResponse = { alertId: alertId, status: newStatus };

      $httpBackend.expectPATCH('/api/alerts/' + alertId, { status: newStatus }).respond(mockResponse);

      AlertService.updateAlertStatus(alertId, newStatus).then(function(result) {
        expect(result.status).toBe(newStatus);
      });

      $httpBackend.flush();
    });
  });

  describe('confirmTransaction', function() {
    /*
    Test Documentation:
    - Test Name: should confirm transaction and update status
    - Purpose: Validates transaction confirmation workflow
    - Scenario: confirmTransaction called with alertId and customerId
    - Expected Result: Transaction confirmed and alert status updated to 'confirmed'
    */
    it('should confirm transaction and update status', function() {
      var alertId = 'ALT-130';
      var customerId = 'CUST-001';
      var mockConfirmResponse = { confirmed: true };
      var mockUpdateResponse = { alertId: alertId, status: 'confirmed' };

      $httpBackend.expectPOST('/api/alerts/' + alertId + '/confirm', { customerId: customerId }).respond(mockConfirmResponse);
      $httpBackend.expectPATCH('/api/alerts/' + alertId, { status: 'confirmed' }).respond(mockUpdateResponse);

      AlertService.confirmTransaction(alertId, customerId).then(function(result) {
        expect(result.confirmed).toBe(true);
      });

      $httpBackend.flush();
    });
  });

  describe('reportTransaction', function() {
    /*
    Test Documentation:
    - Test Name: should report transaction and trigger protection workflow
    - Purpose: Validates fraud report and protection workflow initiation
    - Scenario: reportTransaction called with alertId and customerId
    - Expected Result: Transaction reported, status updated, and protection workflow triggered
    */
    it('should report transaction and trigger protection workflow', function() {
      var alertId = 'ALT-131';
      var customerId = 'CUST-001';
      var mockReportResponse = { reported: true };
      var mockUpdateResponse = { alertId: alertId, status: 'reported' };
      var mockWorkflowResponse = { workflowId: 'WF-001' };

      $httpBackend.expectPOST('/api/alerts/' + alertId + '/report', { customerId: customerId }).respond(mockReportResponse);
      $httpBackend.expectPATCH('/api/alerts/' + alertId, { status: 'reported' }).respond(mockUpdateResponse);
      $httpBackend.expectPOST('/api/protection/initiate', { alertId: alertId, customerId: customerId }).respond(mockWorkflowResponse);

      AlertService.reportTransaction(alertId, customerId).then(function(result) {
        expect(result.workflowId).toBe('WF-001');
      });

      $httpBackend.flush();
    });
  });

  describe('triggerProtectionWorkflow', function() {
    /*
    Test Documentation:
    - Test Name: should trigger protection workflow
    - Purpose: Validates protection workflow initiation
    - Scenario: triggerProtectionWorkflow called with alertId and customerId
    - Expected Result: Protection workflow is initiated successfully
    */
    it('should trigger protection workflow', function() {
      var alertId = 'ALT-132';
      var customerId = 'CUST-001';
      var mockResponse = { workflowId: 'WF-002', status: 'initiated' };

      $httpBackend.expectPOST('/api/protection/initiate', { alertId: alertId, customerId: customerId }).respond(mockResponse);

      AlertService.triggerProtectionWorkflow(alertId, customerId).then(function(result) {
        expect(result.workflowId).toBe('WF-002');
      });

      $httpBackend.flush();
    });
  });
});

/*
Test Documentation:
- Test Name: AlertService comprehensive test suite
- Purpose: Validates all alert management operations including creation, notification, retrieval, status updates, and workflow triggers
- Scenario: Multiple scenarios covering normal operations, edge cases, and error handling
- Expected Result: All alert operations function correctly with proper error handling

Coverage Report:
- Functions tested: createAlert, sendNotification, getAlerts, getAlertById, updateAlertStatus, confirmTransaction, reportTransaction, triggerProtectionWorkflow
- Scenarios covered: valid alert creation, invalid policy decision, missing transactionId, non-alert actions, step-up action, default customer ID, notification priority, alert retrieval, status updates, transaction confirmation, fraud reporting, protection workflow
- Uncovered scenarios: HTTP error responses, network timeouts, concurrent requests
*/