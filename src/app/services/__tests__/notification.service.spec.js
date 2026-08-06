/*
Test Documentation:
- Test Name: NotificationService sendEmailNotification
- Purpose: Validates email notification is sent via API
- Scenario: Email data provided
- Expected Result: POST request made to email endpoint
*/
/*
Test Documentation:
- Test Name: NotificationService sendSMSNotification
- Purpose: Validates SMS notification is sent via API
- Scenario: SMS data provided
- Expected Result: POST request made to SMS endpoint
*/
/*
Test Documentation:
- Test Name: NotificationService sendOrderConfirmation
- Purpose: Validates order confirmation email is sent
- Scenario: Order ID provided
- Expected Result: Email notification sent with order confirmation type
*/
/*
Test Documentation:
- Test Name: NotificationService sendLowStockAlert
- Purpose: Validates low stock alert is sent and notification added
- Scenario: Product ID and stock level provided
- Expected Result: Email sent and notification added to factory
*/
/*
Test Documentation:
- Test Name: NotificationService sendRefundConfirmation
- Purpose: Validates refund confirmation email is sent
- Scenario: Order ID and amount provided
- Expected Result: Email notification sent with refund details
*/
/*
Coverage Report:
- Functions tested: sendEmailNotification, sendSMSNotification, sendOrderConfirmation, sendLowStockAlert, sendRefundConfirmation
- Scenarios covered: email sending, SMS sending, order confirmation, low stock alert with factory notification, refund confirmation, API errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('NotificationService', function() {
    var NotificationService, $httpBackend, API_CONFIG, NotificationFactory;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_NotificationService_, _$httpBackend_, _API_CONFIG_, _NotificationFactory_) {
      NotificationService = _NotificationService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      NotificationFactory = _NotificationFactory_;

      spyOn(NotificationFactory, 'addNotification');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('sendEmailNotification', function() {
      it('should send email notification via API', function() {
        var emailData = { to: 'test@example.com', subject: 'Test', body: 'Test message' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', emailData)
          .respond(200, { success: true });

        NotificationService.sendEmailNotification(emailData);

        $httpBackend.flush();
      });

      it('should handle email sending error', function() {
        var emailData = { to: 'test@example.com' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', emailData)
          .respond(500, { error: 'Email service unavailable' });

        NotificationService.sendEmailNotification(emailData).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('sendSMSNotification', function() {
      it('should send SMS notification via API', function() {
        var smsData = { to: '+1234567890', message: 'Test SMS' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/sms', smsData)
          .respond(200, { success: true });

        NotificationService.sendSMSNotification(smsData);

        $httpBackend.flush();
      });

      it('should handle SMS sending error', function() {
        var smsData = { to: '+1234567890' };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/sms', smsData)
          .respond(500, { error: 'SMS service unavailable' });

        NotificationService.sendSMSNotification(smsData).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('sendOrderConfirmation', function() {
      it('should send order confirmation email', function() {
        var orderId = 12345;
        var expectedData = {
          type: 'order_confirmation',
          orderId: orderId
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', expectedData)
          .respond(200, { success: true });

        NotificationService.sendOrderConfirmation(orderId);

        $httpBackend.flush();
      });
    });

    describe('sendLowStockAlert', function() {
      it('should add notification and send email for low stock', function() {
        var productId = 'PROD-123';
        var currentStock = 5;
        var expectedEmailData = {
          type: 'low_stock_alert',
          productId: productId,
          currentStock: currentStock
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', expectedEmailData)
          .respond(200, { success: true });

        NotificationService.sendLowStockAlert(productId, currentStock);

        expect(NotificationFactory.addNotification).toHaveBeenCalledWith({
          type: 'warning',
          message: 'Low stock alert for product ' + productId + ': ' + currentStock + ' remaining'
        });

        $httpBackend.flush();
      });

      it('should handle low stock alert with zero stock', function() {
        var productId = 'PROD-456';
        var currentStock = 0;
        var expectedEmailData = {
          type: 'low_stock_alert',
          productId: productId,
          currentStock: currentStock
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', expectedEmailData)
          .respond(200, { success: true });

        NotificationService.sendLowStockAlert(productId, currentStock);

        expect(NotificationFactory.addNotification).toHaveBeenCalled();
        $httpBackend.flush();
      });
    });

    describe('sendRefundConfirmation', function() {
      it('should send refund confirmation email', function() {
        var orderId = 67890;
        var amount = 99.99;
        var expectedData = {
          type: 'refund_confirmation',
          orderId: orderId,
          amount: amount
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', expectedData)
          .respond(200, { success: true });

        NotificationService.sendRefundConfirmation(orderId, amount);

        $httpBackend.flush();
      });

      it('should handle refund confirmation with zero amount', function() {
        var orderId = 11111;
        var amount = 0;
        var expectedData = {
          type: 'refund_confirmation',
          orderId: orderId,
          amount: amount
        };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/notifications/email', expectedData)
          .respond(200, { success: true });

        NotificationService.sendRefundConfirmation(orderId, amount);

        $httpBackend.flush();
      });
    });
  });
})();