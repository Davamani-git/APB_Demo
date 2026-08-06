(function() {
  'use strict';
  angular.module('shoppingPlatform').service('NotificationService', ['$http', 'API_CONFIG', 'NotificationFactory', function($http, API_CONFIG, NotificationFactory) {
    this.sendEmailNotification = function(data) {
      return $http.post(API_CONFIG.baseUrl + '/api/notifications/email', data);
    };
    this.sendSMSNotification = function(data) {
      return $http.post(API_CONFIG.baseUrl + '/api/notifications/sms', data);
    };
    this.sendOrderConfirmation = function(orderId) {
      return this.sendEmailNotification({
        type: 'order_confirmation',
        orderId: orderId
      });
    };
    this.sendLowStockAlert = function(productId, currentStock) {
      NotificationFactory.addNotification({
        type: 'warning',
        message: 'Low stock alert for product ' + productId + ': ' + currentStock + ' remaining'
      });
      return this.sendEmailNotification({
        type: 'low_stock_alert',
        productId: productId,
        currentStock: currentStock
      });
    };
    this.sendRefundConfirmation = function(orderId, amount) {
      return this.sendEmailNotification({
        type: 'refund_confirmation',
        orderId: orderId,
        amount: amount
      });
    };
  }]);
})();