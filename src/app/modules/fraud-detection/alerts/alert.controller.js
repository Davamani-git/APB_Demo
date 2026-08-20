(function() {
  'use strict';
  angular.module('fraudDetection.alerts')
    .controller('AlertController', ['$scope', '$location', 'AlertService', function($scope, $location, AlertService) {
      var vm = this;
      vm.alerts = [];
      vm.filter = 'active';
      vm.loading = true;
      vm.error = null;
      vm.loadAlerts = function() {
        vm.loading = true;
        vm.error = null;
        var params = {};
        if (vm.filter === 'active') {
          params.status = 'created,queued,delivered,viewed';
        } else if (vm.filter === 'resolved') {
          params.status = 'confirmed,reported,resolved';
        }
        AlertService.getAlerts(params)
          .then(function(alerts) {
            vm.alerts = alerts;
            vm.loading = false;
          })
          .catch(function(error) {
            vm.error = 'Failed to load alerts';
            vm.loading = false;
          });
      };
      vm.setFilter = function(filter) {
        vm.filter = filter;
        vm.loadAlerts();
      };
      vm.viewAlert = function(alertId) {
        $location.path('/alerts/' + alertId);
      };
      vm.loadAlerts();
    }]);
})();