(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .controller('DataConnectionController', ['$scope', 'cloudProviderService', 'freshnessMonitorService', 'notificationService', 'auditService', 'authService', function($scope, cloudProviderService, freshnessMonitorService, notificationService, auditService, authService) {
      var vm = this;
      vm.connections = [];
      vm.newConnection = {
        provider: '',
        credentials: {}
      };
      vm.providerTypes = cloudProviderService.getProviderTypes();
      vm.loading = false;
      vm.init = function() {
        vm.loadConnections();
        auditService.logAction(authService.getCurrentUser().id, 'view_integrations', 'data-integration', {});
      };
      vm.loadConnections = function() {
        vm.loading = true;
        cloudProviderService.getConnections()
          .then(function(connections) {
            vm.connections = connections;
            connections.forEach(function(conn) {
              freshnessMonitorService.registerData(conn.companyId, {
                companyName: conn.companyName,
                lastUpdated: conn.lastSync,
                status: conn.status
              });
            });
            vm.loading = false;
          })
          .catch(function(error) {
            console.error('Failed to load connections', error);
            notificationService.error('Failed to load connections');
            vm.loading = false;
          });
      };
      vm.addConnection = function() {
        if (!vm.newConnection.provider || !vm.newConnection.credentials.apiKey) {
          notificationService.error('Please provide all required credentials');
          return;
        }
        vm.loading = true;
        cloudProviderService.validateAndConnect(vm.newConnection)
          .then(function(result) {
            notificationService.success('Connection established successfully');
            vm.loadConnections();
            vm.resetForm();
            freshnessMonitorService.startMonitoring();
            auditService.logAction(authService.getCurrentUser().id, 'add_connection', 'data-integration', {provider: vm.newConnection.provider});
          })
          .catch(function(error) {
            notificationService.error('Connection failed: ' + (error.data && error.data.message || 'Unknown error'));
            vm.loading = false;
          });
      };
      vm.testConnection = function(connectionId) {
        cloudProviderService.testConnection(connectionId)
          .then(function(result) {
            if (result.status === 'connected') {
              notificationService.success('Connection test successful');
            } else {
              notificationService.warning('Connection test failed');
            }
          })
          .catch(function(error) {
            notificationService.error('Connection test failed');
          });
      };
      vm.syncData = function(connectionId) {
        cloudProviderService.syncData(connectionId)
          .then(function(result) {
            notificationService.success('Data sync completed');
            vm.loadConnections();
          })
          .catch(function(error) {
            notificationService.error('Data sync failed');
          });
      };
      vm.deleteConnection = function(connectionId) {
        if (!confirm('Are you sure you want to delete this connection?')) return;
        cloudProviderService.deleteConnection(connectionId)
          .then(function() {
            notificationService.success('Connection deleted');
            vm.loadConnections();
            auditService.logAction(authService.getCurrentUser().id, 'delete_connection', 'data-integration', {connectionId: connectionId});
          })
          .catch(function(error) {
            notificationService.error('Failed to delete connection');
          });
      };
      vm.resetForm = function() {
        vm.newConnection = {
          provider: '',
          credentials: {}
        };
      };
      vm.getConnectionStatus = function(connection) {
        if (!connection.lastSync) return 'disconnected';
        var isFresh = freshnessMonitorService.isDataFresh(connection.companyId);
        return isFresh ? 'connected' : 'stale';
      };
      vm.init();
    }]);
})();