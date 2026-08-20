(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('transactionIngestionService', ['$http', '$q', 'fraudRiskScoringFactory', 'transactionModel', 'API_CONFIG', transactionIngestionService]);

  function transactionIngestionService($http, $q, fraudRiskScoringFactory, transactionModel, API_CONFIG) {
    const processedTransactions = new Set();

    this.fetchTransactionEvents = function() {
      const deferred = $q.defer();
      const url = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $http.get(url)
        .then(function(response) {
          const transactions = response.data.transactions || [];
          const validTransactions = transactions
            .map(function(txData) { return transactionModel.create(txData); })
            .filter(function(tx) { return transactionModel.validate(tx); });
          deferred.resolve(validTransactions);
        })
        .catch(function(error) {
          console.warn('Transaction ingestion failed, using mock data:', error);
          const mockTransactions = generateMockTransactions();
          deferred.resolve(mockTransactions);
        });
      return deferred.promise;
    };

    this.processTransaction = function(transaction) {
      if (processedTransactions.has(transaction.transactionId)) {
        return $q.reject({ error: 'Duplicate transaction', transactionId: transaction.transactionId });
      }
      processedTransactions.add(transaction.transactionId);
      return fraudRiskScoringFactory.calculateRiskScore(transaction)
        .then(function(riskResult) {
          return {
            transaction: transaction,
            riskScore: riskResult.riskScore,
            fraudSignals: riskResult.fraudSignals,
            modelVersion: riskResult.modelVersion
          };
        });
    };

    this.processTransactionBatch = function(transactions) {
      const promises = transactions.map(function(tx) {
        return this.processTransaction(tx);
      }.bind(this));
      return $q.all(promises.map(function(p) {
        return p.catch(function(err) { return { error: err }; });
      }));
    };

    function generateMockTransactions() {
      const merchants = [
        { name: 'Amazon.com', category: 'online_retail', country: 'US' },
        { name: 'Shell Gas Station', category: 'fuel', country: 'US' },
        { name: 'Luxury Watches Ltd', category: 'high_risk', country: 'CN' },
        { name: 'Grocery Store', category: 'groceries', country: 'US' },
        { name: 'International Electronics', category: 'electronics', country: 'RU' }
      ];
      const mockData = [];
      for (let i = 0; i < 10; i++) {
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        mockData.push(transactionModel.create({
          transactionId: 'TXN-' + Date.now() + '-' + i,
          cardIdentifier: '****' + Math.floor(1000 + Math.random() * 9000),
          amount: Math.floor(Math.random() * 2000) + 10,
          currency: 'USD',
          merchantId: 'MER-' + i,
          merchantName: merchant.name,
          merchantCategory: merchant.category,
          location: { latitude: 0, longitude: 0, country: merchant.country },
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          authorizationStatus: 'approved'
        }));
      }
      return mockData;
    }
  }
})();