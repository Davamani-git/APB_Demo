(function() {
  'use strict';
  angular.module('app.shopping')
    .directive('paymentForm', ['PaymentService', function(PaymentService) {
      return {
        restrict: 'E',
        scope: {
          paymentDetails: '='
        },
        template: '<div class="payment-form">' +
          '<div class="form-group">' +
          '<label for="paymentMethod">Payment Method</label>' +
          '<select id="paymentMethod" class="form-control" ng-model="paymentDetails.paymentMethod" aria-label="Payment method">' +
          '<option value="credit_card">Credit Card</option>' +
          '<option value="debit_card">Debit Card</option>' +
          '<option value="paypal">PayPal</option>' +
          '</select>' +
          '</div>' +
          '<div ng-if="paymentDetails.paymentMethod === \'credit_card\' || paymentDetails.paymentMethod === \'debit_card\'">' +
          '<div class="form-group">' +
          '<label for="cardHolderName">Cardholder Name</label>' +
          '<input type="text" id="cardHolderName" class="form-control" ng-model="paymentDetails.cardHolderName" required aria-label="Cardholder name">' +
          '</div>' +
          '<div class="form-group">' +
          '<label for="cardNumber">Card Number</label>' +
          '<input type="text" id="cardNumber" class="form-control" ng-model="paymentDetails.cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required aria-label="Card number">' +
          '</div>' +
          '<div class="row">' +
          '<div class="col-md-6">' +
          '<div class="form-group">' +
          '<label for="expiryDate">Expiry Date</label>' +
          '<input type="text" id="expiryDate" class="form-control" ng-model="paymentDetails.expiryDate" placeholder="MM/YY" maxlength="5" required aria-label="Expiry date">' +
          '</div>' +
          '</div>' +
          '<div class="col-md-6">' +
          '<div class="form-group">' +
          '<label for="cvv">CVV</label>' +
          '<input type="text" id="cvv" class="form-control" ng-model="paymentDetails.cvv" placeholder="123" maxlength="4" required aria-label="CVV">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div ng-if="paymentDetails.paymentMethod === \'paypal\'">' +
          '<p class="text-info">You will be redirected to PayPal to complete your payment.</p>' +
          '</div>' +
          '</div>',
        link: function(scope, element, attrs) {
          scope.$watch('paymentDetails.cardNumber', function(newVal) {
            if (newVal) {
              scope.paymentDetails.cardNumber = newVal.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            }
          });
        }
      };
    }]);
})();