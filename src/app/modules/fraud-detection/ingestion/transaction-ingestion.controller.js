(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .controller('TransactionIngestionController', ['$scope', 'TransactionIngestionService', function($scope, TransactionIngestionService) {
      var vm = this;
      vm.transaction = {};
      vm.status = '';
      vm.submitTransaction = function() {
        vm.status = 'Processing...';
        TransactionIngestionService.validateTransaction(vm.transaction)
          .then(function(valid) {
            return TransactionIngestionService.normalizeTransaction(valid);
          })
          .then(function(normalized) {
            return TransactionIngestionService.ingestTransaction(normalized);
          })
          .then(function(result) {
            vm.status = 'Transaction ingested successfully';
            vm.transaction = {};
          })
          .catch(function(error) {
            vm.status = 'Error: ' + (error.data ? error.data.message : error);
          });
      };
    }]);
})();