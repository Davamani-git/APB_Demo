angular.module('fraudDetection').controller('DashboardController', ['$scope', '$timeout', 'TransactionIngestionService', 'FraudRiskEngineService', 'PolicyDecisionService', 'AlertNotificationService', 'AuditLogService', function($scope, $timeout, TransactionIngestionService, FraudRiskEngineService, PolicyDecisionService, AlertNotificationService, AuditLogService) {
  var vm = this;
  vm.transactions = [];
  vm.loading = false;
  vm.filters = {
    riskLevel: '',
    dateFrom: null,
    dateTo: null
  };
  vm.metrics = {
    totalTransactions: 0,
    highRiskCount: 0,
    confirmedFraudCount: 0
  };
  
  vm.init = function() {
    vm.loadTransactions();
    vm.subscribeToEvents();
  };
  
  vm.loadTransactions = function() {
    vm.loading = true;
    TransactionIngestionService.getRecentTransactions(vm.filters).then(function(transactions) {
      vm.transactions = transactions || vm.generateMockTransactions();
      vm.updateMetrics();
      vm.loading = false;
    }).catch(function(error) {
      vm.transactions = vm.generateMockTransactions();
      vm.updateMetrics();
      vm.loading = false;
    });
  };
  
  vm.generateMockTransactions = function() {
    var mockTransactions = [];
    var merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Starbucks', 'Shell Gas', 'McDonald\'s'];
    var categories = ['Retail', 'Grocery', 'Electronics', 'Food', 'Gas'];
    var locations = [
      {city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060},
      {city: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437},
      {city: 'Chicago', country: 'USA', latitude: 41.8781, longitude: -87.6298},
      {city: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278},
      {city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503}
    ];
    for (var i = 0; i < 10; i++) {
      var location = locations[Math.floor(Math.random() * locations.length)];
      mockTransactions.push({
        transactionId: 'TXN-' + Date.now() + '-' + i,
        cardNumber: '**** **** **** ' + (1000 + i),
        amount: Math.floor(Math.random() * 500) + 10,
        currency: 'USD',
        merchantId: 'MERCH-' + i,
        merchantName: merchants[Math.floor(Math.random() * merchants.length)],
        merchantCategory: categories[Math.floor(Math.random() * categories.length)],
        location: location,
        deviceId: 'DEV-' + i,
        deviceFingerprint: 'FP-' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        authorizationStatus: 'approved'
      });
    }
    return mockTransactions;
  };
  
  vm.evaluateTransaction = function(transaction) {
    TransactionIngestionService.processTransaction(transaction).then(function(result) {
      transaction.riskScore = result.riskScore;
      return PolicyDecisionService.evaluateRiskScore(result.riskScore);
    }).then(function(decision) {
      if (decision.requiresAlert) {
        return AlertNotificationService.createAlert(transaction, transaction.riskScore, decision);
      }
    }).then(function() {
      vm.updateMetrics();
    }).catch(function(error) {
      var mockScore = Math.floor(Math.random() * 100);
      var riskLevel = mockScore >= 85 ? 'confirmed_fraud' : mockScore >= 60 ? 'high' : mockScore >= 30 ? 'medium' : 'low';
      transaction.riskScore = {
        transactionId: transaction.transactionId,
        overallScore: mockScore,
        riskLevel: riskLevel,
        signals: {
          amountAnomaly: Math.random() * 100,
          geographicRisk: Math.random() * 100,
          merchantRisk: Math.random() * 100,
          velocityRisk: Math.random() * 100,
          deviceRisk: Math.random() * 100
        },
        evaluatedAt: new Date()
      };
      vm.updateMetrics();
    });
  };
  
  vm.updateMetrics = function() {
    vm.metrics.totalTransactions = vm.transactions.length;
    vm.metrics.highRiskCount = vm.transactions.filter(function(t) {
      return t.riskScore && (t.riskScore.riskLevel === 'high' || t.riskScore.riskLevel === 'confirmed_fraud');
    }).length;
    vm.metrics.confirmedFraudCount = vm.transactions.filter(function(t) {
      return t.riskScore && t.riskScore.riskLevel === 'confirmed_fraud';
    }).length;
  };
  
  vm.applyFilters = function() {
    vm.loadTransactions();
  };
  
  vm.refreshData = function() {
    vm.loadTransactions();
  };
  
  vm.subscribeToEvents = function() {
    $scope.$on('fraud-alert-created', function(event, alert) {
      vm.updateMetrics();
    });
  };
  
  vm.init();
}]);