(function() {
  'use strict';
  angular.module('app.accounts')
    .controller('AccountConnectionController', ['$scope', 'AccountService', 'AuthService', function($scope, AccountService, AuthService) {
      var vm = this;
      vm.accounts = [];
      vm.selectedInstitution = null;
      vm.loading = false;
      vm.error = null;
      vm.connectAccount = connectAccount;
      vm.disconnectAccount = disconnectAccount;
      vm.triggerSync = triggerSync;
      init();
      function init() {
        loadAccounts();
      }
      function loadAccounts() {
        vm.loading = true;
        AccountService.getAccounts()
          .then(function(accounts) {
            vm.accounts = accounts;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load accounts';
            vm.loading = false;
          });
      }
      function connectAccount(institutionId) {
        vm.loading = true;
        vm.error = null;
        AccountService.connectAccount(institutionId)
          .then(function(result) {
            vm.loading = false;
            loadAccounts();
          })
          .catch(function(error) {
            vm.error = 'Failed to connect account';
            vm.loading = false;
          });
      }
      function disconnectAccount(accountId) {
        if (!confirm('Are you sure you want to disconnect this account?')) {
          return;
        }
        AccountService.disconnectAccount(accountId)
          .then(function() {
            loadAccounts();
          })
          .catch(function(error) {
            vm.error = 'Failed to disconnect account';
          });
      }
      function triggerSync(accountId) {
        AccountService.triggerSync(accountId)
          .then(function() {
            loadAccounts();
          })
          .catch(function(error) {
            vm.error = 'Failed to trigger sync';
          });
      }
    }]);
})();