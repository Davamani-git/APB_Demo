angular.module('fraudAlert.dashboard')
  .controller('DashboardController', ['$scope', '$interval', 'TransactionIngestionService', 'PolicyDecisionService', 'AlertService', function($scope, $interval, TransactionIngestionService, PolicyDecisionService, AlertService) {
    var vm = this;
    vm.transactions = [];
    vm.alerts = [];
    vm.stats = {
      total: 0,
      low: 0,
      medium: 0,
      high: 0
    };
    vm.init = function() {
      vm.loadAlerts();
      $scope.$on('transaction:processed', function(event, data) {
        vm.addTransaction(data.transaction, data.decision);
      });
      $scope.$on('alert:created', function(event, alert) {
        vm.alerts.unshift(alert);
      });
    };
    vm.loadAlerts = function() {
      AlertService.getAlerts().then(function(alerts) {
        vm.alerts = alerts;
      });
    };
    vm.addTransaction = function(transaction, decision) {
      var transactionRecord = {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        merchantName: transaction.merchantName,
        cardNumber: transaction.cardNumber,
        timestamp: transaction.transactionTimestamp,
        riskScore: decision.riskScore,
        riskBand: decision.riskBand,
        decision: decision.decision,
        alertId: decision.alertId || null
      };
      vm.transactions.unshift(transactionRecord);
      vm.updateStats(decision.riskBand);
    };
    vm.updateStats = function(riskBand) {
      vm.stats.total++;
      if (riskBand === 'low') vm.stats.low++;
      else if (riskBand === 'medium') vm.stats.medium++;
      else if (riskBand === 'high') vm.stats.high++;
    };
    vm.simulateTransaction = function() {
      var mockTransaction = {
        transactionId: 'TXN-' + Date.now(),
        idempotencyKey: 'IDM-' + Date.now(),
        cardNumber: '****-****-****-1234',
        amount: Math.floor(Math.random() * 5000) + 100,
        currency: 'USD',
        merchantId: 'MERCH-' + Math.floor(Math.random() * 1000),
        merchantName: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store'][Math.floor(Math.random() * 5)],
        merchantCategory: 'Retail',
        transactionTimestamp: new Date().toISOString(),
        location: {
          country: 'USA',
          city: 'New York',
          latitude: 40.7128,
          longitude: -74.0060
        },
        deviceId: 'DEVICE-' + Math.floor(Math.random() * 100),
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
        channel: 'online'
      };
      TransactionIngestionService.simulateTransactionEvent(mockTransaction);
    };
    vm.getRiskClass = function(riskBand) {
      return 'risk-' + riskBand;
    };
    vm.init();
  }]);